import { test as base, expect as baseExpect } from '@af/integration-testing';
import type { DocNode } from '@atlaskit/adf-schema';

import type { EditorExperimentOverrides } from '@atlaskit/tmp-editor-statsig/setup';
import type { Expect, Page, Locator } from '@af/integration-testing';
import type { RendererProps } from '@atlaskit/renderer';
import type { GasPurePayload } from '@atlaskit/analytics-gas-types';

class AnnotationModel {
	private constructor(private page: Page) {}

	public async simulateAnnotationAtSelection(annotationId: string): Promise<
		| false
		| {
				doc: any;
				step: any;
		  }
		| undefined
	> {
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

					const result = actions.annotate(selection.getRangeAt(0), annotationId, annotationType);

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

class CodeBlockModel {
	public lightWeightCodeBlock: Locator;
	public block: Locator;

	private constructor(page: Page) {
		this.lightWeightCodeBlock = page.locator('.light-weight-code-block');
		this.block = page.locator('[data-ds--code--code-block]');
	}

	static from(page: Page) {
		return new CodeBlockModel(page);
	}
}

export interface RendererPageInterface {
	annotation: AnnotationModel;
	codeBlock: CodeBlockModel;
	getAnalyticsEvents: () => Promise<GasPurePayload[]>;
	page: Page;
	waitForRendererStable: () => Promise<void>;
}

type RendererPropsOptional = Omit<
	{
		[T in keyof RendererProps]?: RendererProps[T];
	},
	'document' | 'dataProviders'
>;
type MountRendererOptions = {
	enableClickToEdit?: boolean;
	exampleType?: string;
	mockInlineComments?: boolean;
	showSidebar?: boolean;
	withRendererActions?: boolean;
};

// Based on https://github.com/microsoft/playwright/issues/6347
async function mockDate(page: Page, date: { day: number; month: number; year: number }) {
	// Calculate the date (account for offset)
	const fakeNow = new Date(Date.UTC(date.year, date.month - 1, date.day)).valueOf();

	// Update the Date accordingly in your test pages
	await page.addInitScript(`{
      // Extend Date constructor to default to fakeNow
      Date = class extends Date {
        constructor(...args) {
          if (args.length === 0) {
            super(${fakeNow});
          } else {
            super(...args);
          }
        }
      }
      // Override Date.now() to start from fakeNow
      const __DateNowOffset = ${fakeNow} - Date.now();
      const __DateNow = Date.now;
      Date.now = () => __DateNow() + __DateNowOffset;
    }`);
}

class RendererPageModel implements RendererPageInterface {
	public annotation: AnnotationModel;
	public codeBlock: CodeBlockModel;
	private rendererContainer: Locator;

	private constructor(public page: Page) {
		this.rendererContainer = page.locator('#renderer-container');
		this.annotation = AnnotationModel.from(page);
		this.codeBlock = CodeBlockModel.from(page);
	}

	public async waitForRendererStable() {
		const element = await this.rendererContainer.elementHandle();
		if (!element) {
			throw new Error('No Renderer element found while setting up Editor Page Model');
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

			const idle = (window as any).requestIdleCallback || window.requestAnimationFrame;

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
		platformFeatureFlags,
		editorExperiments,
	}: {
		adf: DocNode | string | Record<string, unknown> | undefined;
		editorExperiments?: EditorExperimentOverrides;
		platformFeatureFlags?: Record<string, boolean>;
		rendererMountOptions: MountRendererOptions;
		rendererProps: RendererPropsOptional;
	}) {
		await this.rendererContainer.waitFor({ state: 'attached' });

		await this.page.waitForFunction(() => {
			return Boolean(window && (window as any).__mountRenderer);
		});

		type RendererMountEvaluateProps = {
			_adf: DocNode | string | Record<string, unknown> | undefined;
			_mountOptions: MountRendererOptions;
			_props: unknown;
			editorExperiments?: EditorExperimentOverrides;
			platformFeatureFlags?: Record<string, boolean>;
		};
		type DoEvaluate = (arg: RendererMountEvaluateProps) => void;

		const doEvaluate: DoEvaluate = ({
			_props,
			_mountOptions,
			_adf,
			platformFeatureFlags,
			editorExperiments,
		}: RendererMountEvaluateProps) => {
			(window as any).__mountRenderer(
				{
					...(_props as any),
					..._mountOptions,
				},
				_adf,
				platformFeatureFlags,
				editorExperiments,
			);
		};

		// Passing exampleType will render a custom example for the test instead of the default 'testing' example
		if (!rendererMountOptions.exampleType) {
			const x: RendererMountEvaluateProps = {
				_props: rendererProps,
				_mountOptions: rendererMountOptions,
				_adf: adf,
				platformFeatureFlags: platformFeatureFlags,
				editorExperiments: editorExperiments,
			};
			await (
				this.page.evaluate as (arg1: DoEvaluate, arg2: RendererMountEvaluateProps) => Promise<void>
			)(doEvaluate, x);
		}

		await this.rendererContainer.waitFor({ state: 'visible' });
		// Disable transition side effects in integration tests
		await this.page.addStyleTag({
			content: `* {
        transition: none !important;
        animation: none !important
      }`,
		});
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
	adf: DocNode | string | Record<string, unknown> | undefined;
	/**
	 * Note: This is not available when used with the `exampleType` option.
	 * This is because custom examples will have their application loaded
	 * prior to the experiment overrides being applied.
	 */
	editorExperiments?: EditorExperimentOverrides;
	platformFeatureFlags?: Record<string, boolean>;
	renderer: RendererPageInterface;
	rendererMountOptions: MountRendererOptions;
	rendererProps: RendererPropsOptional;
}>({
	rendererProps: {},
	rendererMountOptions: {},
	adf: undefined,
	platformFeatureFlags: {},
	editorExperiments: {},

	renderer: async (
		{ page, adf, rendererProps, rendererMountOptions, platformFeatureFlags, editorExperiments },
		use,
	) => {
		if (
			editorExperiments &&
			Object.keys(editorExperiments).length &&
			rendererMountOptions.exampleType
		) {
			throw new Error(
				`Cannot use 'editorExperiments' with 'exampleType', received exampleType: ${rendererMountOptions.exampleType}, editorExperiments: ${JSON.stringify(editorExperiments)} `,
			);
		}
		// Mock the date for testing purposes
		await mockDate(page, { year: 2017, month: 8, day: 16 });

		await page.visitExample('editor', 'renderer', rendererMountOptions.exampleType ?? 'testing');

		const rendererInstance = RendererPageModel.from(page);

		await rendererInstance.mount({
			adf,
			rendererProps,
			rendererMountOptions,
			platformFeatureFlags,
			editorExperiments,
		});

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
