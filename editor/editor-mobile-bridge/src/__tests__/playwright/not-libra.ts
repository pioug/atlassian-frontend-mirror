// eslint-disable-next-line import/no-extraneous-dependencies
import { defaultSchema as sampleSchema } from '@atlaskit/editor-test-helpers/schema';
import {
  test as base,
  expect as baseExpect,
  fixTest,
} from '@af/integration-testing';
import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import isEqual from 'lodash/isEqual';
import diffDefault from 'jest-diff';

import type { Expect, Page, Locator } from '@af/integration-testing';
import type { DocBuilder } from '@atlaskit/editor-common/types';

function getPlatformModifierKey(additionalKey?: string) {
  // Dummy
  return [
    process.platform === 'darwin' ? 'Meta' : 'Control',
    additionalKey ? `+${additionalKey}` : '',
  ].join('');
}

interface EditorBrigdeModelInterface {
  editorLocator: Locator;
  page: Page;
  doCall: (props: DoCallProps) => Promise<void>;
  trackEvents: () => Promise<Array<unknown>>;
  configure: (config: Record<string, unknown>) => Promise<void>;
  getProsemirrorDocument: () => Promise<PMNode>;
  output: (props: {
    bridgeName: string;
    eventName: string;
  }) => Promise<unknown>;

  waitForStable: () => Promise<void>;
  paste: () => Promise<void>;
}

type DoCallProps = {
  funcName: string;
  args: Array<unknown>;
};
class EditorBrigdeModel implements EditorBrigdeModelInterface {
  public editorLocator: Locator;

  private constructor(public page: Page) {
    this.editorLocator = page.locator('.ProseMirror');
  }

  async getProsemirrorDocument(): Promise<PMNode> {
    const jsonDocument = await this.page.evaluate(() => {
      const pmElement = document.querySelector('.ProseMirror');
      if (!pmElement) {
        return {};
      }

      const pmDocJSON = (pmElement as any).pmViewDesc.node.toJSON();
      return pmDocJSON;
    });
    const pmDocument = PMNode.fromJSON(sampleSchema, jsonDocument);

    return pmDocument;
  }

  async mount() {
    await this.page.waitForFunction(() => {
      return Boolean(window.bridge);
    });

    await this.editorLocator.click();
    await this.waitForStable();
  }

  async output({
    bridgeName,
    eventName,
  }: {
    bridgeName: string;
    eventName: string;
  }) {
    const logs = await this.page.evaluate(
      ({ _bridgeName, _eventName }) => {
        let logs = window.logBridge;

        if (logs[`${_bridgeName}:${_eventName}`]) {
          return logs[`${_bridgeName}:${_eventName}`];
        }

        return [];
      },
      { _bridgeName: bridgeName, _eventName: eventName },
    );

    return logs;
  }

  async trackEvents() {
    const logs = await this.page.evaluate(() => {
      let logs = window.logBridge;

      if (logs['analyticsBridge:trackEvent']) {
        return logs['analyticsBridge:trackEvent'].map((value: any) => {
          return JSON.parse(value.event);
        });
      }

      return [];
    });
    return logs;
  }

  async configure(config: Record<string, unknown>) {
    await this.page.evaluate((_config) => {
      window.bridge?.configure(JSON.stringify(_config));
    }, config);
    await this.editorLocator.focus();
    await this.waitForStable();
  }

  async doCall({ funcName, args }: DoCallProps) {
    await this.page.evaluate(
      ({ _funcName, _args }) => {
        const func = (window as any).bridge[_funcName];
        if (typeof func !== 'function') {
          return;
        }

        func.apply((window as any).bridge, _args);
      },
      { _funcName: funcName, _args: args },
    );

    await this.waitForStable();
  }

  public async waitForStable() {
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

  async paste() {
    fixTest({
      jiraIssueId: 'UTEST-706',
      reason:
        'Clipboard memory is shared on OS level so parallel tests can affect each other.',
    });
    await this.page.keyboard.press(getPlatformModifierKey('KeyV'));
  }

  static from(page: Page) {
    return new EditorBrigdeModel(page);
  }
}

export const mobileBridgeEditorTestCase = base.extend<{
  bridge: EditorBrigdeModelInterface;
  params: Record<string, string | boolean>;
}>({
  params: undefined,
  bridge: async ({ page, params }, use) => {
    await page.visitExample('editor', 'editor-mobile-bridge', 'editor', params);

    const bridgeInstance = EditorBrigdeModel.from(page);

    await bridgeInstance.mount();

    await use(bridgeInstance);
  },
});

export const mobileBridgeEditorClipboardTestCase =
  mobileBridgeEditorTestCase.extend({
    bridge: async ({ page, params }, use) => {
      await page.visitExample(
        'editor',
        'editor-mobile-bridge',
        'editor-with-copy-paste',
        params,
      );

      const bridgeInstance = EditorBrigdeModel.from(page);

      await bridgeInstance.mount();

      await use(bridgeInstance);
    },
  });

const toEqualProsemirrorDocument =
  (utils: ReturnType<Expect['getState']>['utils']) =>
  (received: PMNode, oldExpected: PMNode | DocBuilder) => {
    // Because schema is created dynamically, expected value is received function (schema) => PMNode;
    // That's why this magic is necessary. It simplifies writing assertions, so
    // instead of expect(doc).toEqualDocument(doc(p())(schema)) we can just do:
    // expect(doc).toEqualDocument(doc(p())).
    //
    // Also it fixes issues that happens sometimes when received schema and expected schema
    // are different objects, making this case impossible by always using received schema to create expected node.
    const expected =
      typeof oldExpected === 'function' && received.type && received.type.schema
        ? oldExpected(received.type.schema)
        : oldExpected;

    if (!(expected instanceof PMNode) || !(received instanceof PMNode)) {
      return {
        pass: false,
        message: () =>
          'Expected both values to be instance of prosemirror-model Node.',
      };
    }

    const pass = isEqual(received.toJSON(), expected.toJSON());

    if (pass) {
      return {
        pass,
        message: () => '',
      };
    }

    const diffString = diffDefault(expected, received, {
      expand: true,
    });
    return {
      pass,
      message: () => {
        return (
          `${utils.matcherHint('.toEqualDocument', undefined, undefined)}\n\n` +
          `Expected JSON value of document to equal:\n${utils.printExpected(
            expected,
          )}\n` +
          `Actual JSON:\n  ${utils.printReceived(received)}` +
          `${diffString ? `\n\nDifference:\n\n${diffString}` : ''}`
        );
      },
    };
  };
const customMatchers = {
  async toMatchDocumentSnapshot(
    this: ReturnType<Expect['getState']>,
    bridge: EditorBrigdeModelInterface,
  ) {
    const docJSON = await bridge.getProsemirrorDocument();
    baseExpect(JSON.stringify(docJSON, null, 2)).toMatchSnapshot();

    return {
      pass: true,
      // Playwright upgrade: `message` required in type MatcherReturnType
      message: () => 'Matches document snapshot',
    };
  },

  async toHaveDocument(
    this: ReturnType<Expect['getState']>,
    bridge: EditorBrigdeModelInterface,
    expectedDocument: DocBuilder,
  ) {
    const pmDocument = await bridge.getProsemirrorDocument();

    return toEqualProsemirrorDocument(this.utils)(pmDocument, expectedDocument);
  },
};

export const expect = baseExpect.extend(customMatchers);
