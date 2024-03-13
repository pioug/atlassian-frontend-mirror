import { test as base, expect as baseExpect } from '@af/integration-testing';

import type { Expect, Page, Locator } from '@af/integration-testing';
import type { RendererProps } from '@atlaskit/renderer';
import type { GasPurePayload } from '@atlaskit/analytics-gas-types';

class AnnotationModel {
  private constructor(private page: Page) {}

  public async simulateAnnotationAtSelection(annotationId: string) {
    const result = await this.page.evaluate(
      ({ annotationId }: { annotationId: string }) => {
        const annotationType: string = 'inlineComment';
        // @ts-ignore
        const actions = window.__rendererActions;
        if (actions) {
          const selection = window.getSelection();
          if (!selection || selection.isCollapsed) {
            return;
          }

          const result = actions.annotate(
            selection.getRangeAt(0),
            annotationId,
            annotationType,
          );

          if (!result) {
            return false;
          }

          return {
            doc: result.doc,
            step: result.step.toJSON(),
          };
        }
      },
      {
        annotationId,
      },
    );

    return result;
  }

  public async validateRange() {
    await this.page.waitForFunction(() => {
      return Boolean(window && (window as any).__rendererActions);
    });

    const result = await this.page.evaluate(() => {
      // @ts-ignore
      const actions = window.__rendererActions;
      if (actions) {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
          return;
        }

        return actions.isValidAnnotationRange(selection.getRangeAt(0));
      }
    });

    return Boolean(result);
  }

  static from(page: Page) {
    return new AnnotationModel(page);
  }
}

interface RendererPageInterface {
  page: Page;
  annotation: AnnotationModel;
  waitForRendererStable: () => Promise<void>;
  getAnalyticsEvents: () => Promise<GasPurePayload[]>;
}

type RendererPropsOptional = Omit<
  {
    [T in keyof RendererProps]?: RendererProps[T];
  },
  'document' | 'dataProviders'
>;
type MountRendererOptions = {
  showSidebar?: boolean;
  withRendererActions?: boolean;
  mockInlineComments?: boolean;
  exampleType?: string;
};

class RendererPageModel implements RendererPageInterface {
  public annotation: AnnotationModel;
  private rendererContainer: Locator;

  private constructor(public page: Page) {
    this.rendererContainer = page.locator('#renderer-container');
    this.annotation = AnnotationModel.from(page);
  }

  public async waitForRendererStable() {
    const element = await this.rendererContainer.elementHandle();
    if (!element) {
      throw new Error(
        'No Renderer element found while setting up Editor Page Model',
      );
    }
    await element.waitForElementState('stable');

    await this.waitUntilIdleTime();
  }
  private async waitUntilIdleTime() {
    // The stable check on Playwright is not evough for Editor needs
    // There are some cases (like selection) where we need to wait a litle bit more.
    await this.page.evaluate(async () => {
      let resolveIdlePromise = () => {};
      const idleTimeoutPromise = new Promise<void>((_resolve) => {
        resolveIdlePromise = _resolve;
      });

      const idle =
        (window as any).requestIdleCallback || window.requestAnimationFrame;

      idle(() => {
        resolveIdlePromise();
      });

      await idleTimeoutPromise;
    });
  }

  async mount({
    rendererProps,
    rendererMountOptions,
    adf,
  }: {
    rendererProps: RendererPropsOptional;
    rendererMountOptions: MountRendererOptions;
    adf: string | Record<string, unknown> | undefined;
  }) {
    await this.rendererContainer.waitFor({ state: 'attached' });

    await this.page.waitForFunction(() => {
      return Boolean(window && (window as any).__mountRenderer);
    });

    type RendererMountEvaluateProps = {
      _props: unknown;
      _mountOptions: MountRendererOptions;
      _adf: string | Record<string, unknown> | undefined;
    };
    type DoEvaluate = (arg: RendererMountEvaluateProps) => void;

    const doEvaluate: DoEvaluate = ({
      _props,
      _mountOptions,
      _adf,
    }: RendererMountEvaluateProps) => {
      (window as any).__mountRenderer(
        {
          ...(_props as any),
          ..._mountOptions,
        },
        _adf,
      );
    };

    // Passing exampleType will render a custom example for the test instead of the default 'testing' example
    if (!rendererMountOptions.exampleType) {
      const x: RendererMountEvaluateProps = {
        _props: rendererProps,
        _mountOptions: rendererMountOptions,
        _adf: adf,
      };
      await (
        this.page.evaluate as (
          arg1: DoEvaluate,
          arg2: RendererMountEvaluateProps,
        ) => Promise<void>
      )(doEvaluate, x);
    }

    await this.rendererContainer.waitFor({ state: 'visible' });
    await this.waitUntilIdleTime();
  }

  async getAnalyticsEvents(): Promise<GasPurePayload[]> {
    const result: GasPurePayload[] = await this.page.evaluate(() => {
      return (window as any).__analytics.events;
    });

    return result;
  }

  static from(page: Page) {
    return new RendererPageModel(page);
  }
}

export const rendererTestCase = base.extend<{
  renderer: RendererPageInterface;
  rendererProps: RendererPropsOptional;
  rendererMountOptions: MountRendererOptions;
  adf: string | Record<string, unknown> | undefined;
}>({
  rendererProps: {},
  rendererMountOptions: {},
  adf: undefined,

  renderer: async ({ page, adf, rendererProps, rendererMountOptions }, use) => {
    await page.visitExample(
      'editor',
      'renderer',
      rendererMountOptions.exampleType ?? 'testing',
    );

    const rendererInstance = RendererPageModel.from(page);

    await rendererInstance.mount({ adf, rendererProps, rendererMountOptions });

    await use(rendererInstance);
  },
});

const customMatchers = {
  async toMatchDocumentSnapshot(
    this: ReturnType<Expect['getState']>,
    doc: Record<string, unknown>,
  ) {
    baseExpect(JSON.stringify(doc, null, 2)).toMatchSnapshot();

    return {
      pass: true,
      // Playwright upgrade: `message` required in type MatcherReturnType
      message: () => 'Matches document snapshot',
    };
  },
};

export const expect = baseExpect.extend(customMatchers);
