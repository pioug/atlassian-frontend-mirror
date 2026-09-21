import type { CodeBlockDefinition } from '@atlaskit/adf-schema/code-block';
import type { DocNode } from '@atlaskit/adf-schema/doc';

import { rendererTestCase as test, expect } from './not-libra';

test.use({ exampleName: 'testing' as keyof typeof import('../../../examples/99-testing.tsx') });

const paragraph = {
	type: 'paragraph' as const,
	content: [{ type: 'text' as const, text: 'Following content' }],
};
const code = (text: string): CodeBlockDefinition => ({
	type: 'codeBlock',
	attrs: {},
	content: [{ type: 'text', text }],
});
const adf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		code('root-first'),
		paragraph,
		code('root-after-content'),
		...['default', 'wide', 'full-width'].flatMap((mode) => [
			{ ...code(`breakout-${mode}`), marks: [{ type: 'breakout' as const, attrs: { mode } }] },
			paragraph,
		]),
		{ type: 'blockquote', content: [code('blockquote-first'), paragraph] },
		{
			type: 'bulletList',
			content: [{ type: 'listItem', content: [code('list-first'), paragraph] }],
		},
		{
			type: 'layoutSection',
			content: [
				{ type: 'layoutColumn', attrs: { width: 50 }, content: [code('layout-first'), paragraph] },
				{
					type: 'layoutColumn',
					attrs: { width: 50 },
					content: [paragraph, code('layout-after-content')],
				},
			],
		},
		{
			type: 'table',
			attrs: { layout: 'default' },
			content: [
				{
					type: 'tableRow',
					content: [{ type: 'tableCell', attrs: {}, content: [code('table-first'), paragraph] }],
				},
			],
		},
	],
};

// Exercise the renderer's actual CSS while reproducing Emotion's SSR sibling relocation.
function measureStreamingSiblings(element: HTMLElement) {
	const parent = element.parentElement;
	if (!parent) {
		throw new Error('Expected a parent for the rendered block');
	}
	const measure = () => ({
		marginTop: getComputedStyle(element).marginTop,
		top: element.getBoundingClientRect().top,
		height: element.getBoundingClientRect().height,
		parentHeight: parent.getBoundingClientRect().height,
		followingTop: element.nextElementSibling?.getBoundingClientRect().top,
	});
	const client = measure();
	const style = document.createElement('style');
	parent.insertBefore(style, element);
	const singleStyle = measure();
	const script = document.createElement('script');
	script.type = 'application/json';
	const secondStyle = document.createElement('style');
	parent.insertBefore(script, element);
	parent.insertBefore(secondStyle, element);
	const streamed = measure();
	for (const sibling of [style, script, secondStyle]) {
		document.head.appendChild(sibling);
	}
	const hydrated = measure();
	const precedingContent = document.createElement('div');
	parent.insertBefore(precedingContent, element);
	const afterContent = measure();
	precedingContent.remove();
	for (const sibling of [style, script, secondStyle]) {
		sibling.remove();
	}
	return { client, singleStyle, streamed, hydrated, afterContent };
}

for (const staticCssEnabled of [false, true]) {
	for (const gateEnabled of [false, true]) {
		for (const headingExperimentEnabled of [false, true]) {
			test.describe(`SSR block margins: gate=${gateEnabled}, heading experiment=${headingExperimentEnabled}, static CSS=${staticCssEnabled}`, () => {
				test.use({
					adf,
					platformFeatureFlags: { platform_renderer_ssr_block_margin_fix: gateEnabled },
					editorExperiments: {
						platform_editor_copy_link_a11y_inconsistency_fix: headingExperimentEnabled,
					},
				});

				test.beforeEach(async ({ page }) => {
					// The examples website reads Platform experiment overrides before mounting.
					await page.addInitScript((enabled) => {
						const url = new URL(window.location.href);
						url.searchParams.set(
							'platformExperimentOverrides',
							JSON.stringify({
								platform_editor_renderer_static_css: { isEnabled: enabled },
							}),
						);
						window.history.replaceState(null, '', url);
					}, staticCssEnabled);
				});

				test('keeps code block spacing stable across renderer contexts', async ({ renderer }) => {
					await renderer.waitForRendererStable();
					const blocks = renderer.page.locator('.ak-renderer-document .code-block');
					await expect(blocks).toHaveCount(10);
					for (const block of await blocks.all()) {
						const text = await block.locator('code').textContent();
						const followsContent = text?.includes('after-content');
						const measurements = await block.evaluate(measureStreamingSiblings);
						expect(measurements.client.marginTop, text ?? '').toBe(followsContent ? '12px' : '0px');
						// Table cells already ignore style tags, but not the streamed script.
						expect(measurements.singleStyle.marginTop, text ?? '').toBe(
							!followsContent && (gateEnabled || text === 'table-first') ? '0px' : '12px',
						);
						expect(measurements.streamed.marginTop, text ?? '').toBe(
							gateEnabled && !followsContent ? '0px' : '12px',
						);
						expect(measurements.hydrated).toEqual(measurements.client);
						expect(measurements.afterContent.marginTop).toBe('12px');
					}
				});

				test('measures breakout geometry before and after SSR sibling relocation', async ({
					renderer,
				}) => {
					await renderer.waitForRendererStable();
					const blocks = renderer.page.locator(
						'.ak-renderer-sticky-safe-breakout-inner > .code-block',
					);
					await expect(blocks).toHaveCount(3);
					for (const block of await blocks.all()) {
						const measurements = await block.evaluate(measureStreamingSiblings);
						for (const before of [measurements.singleStyle, measurements.streamed]) {
							expect(before.top - measurements.hydrated.top).toBe(gateEnabled ? 0 : 12);
							expect(before.parentHeight - measurements.hydrated.parentHeight).toBe(
								gateEnabled ? 0 : 12,
							);
							expect(before.height).toBe(measurements.hydrated.height);
						}
					}
				});

				test('preserves the shared media group and lightweight code block margin contracts', async ({
					renderer,
				}) => {
					await renderer.waitForRendererStable();
					// These small DOM fixtures isolate the shared spacing rules from media loading
					// and viewport-triggered replacement of lightweight code blocks.
					const fixtures = await renderer.page.locator('.ak-renderer-document').evaluate((doc) => {
						const hosts: HTMLElement[] = [];
						for (const layout of [false, true]) {
							const host = document.createElement('div');
							if (layout) host.setAttribute('data-layout-section', 'true');
							const group = document.createElement('div');
							group.className = 'MediaGroup';
							group.textContent = 'Media group content';
							host.appendChild(group);
							doc.appendChild(host);
							hosts.push(host);
						}
						const lightweight = document.createElement('div');
						lightweight.className = 'light-weight-code-block';
						const block = document.createElement('div');
						block.className = 'code-block';
						block.textContent = 'Lightweight code block';
						lightweight.appendChild(block);
						doc.appendChild(lightweight);
						hosts.push(lightweight);
						hosts.forEach((host, index) =>
							host.setAttribute('data-ssr-margin-fixture', String(index)),
						);
						return hosts.length;
					});
					for (let index = 0; index < fixtures; index++) {
						const block = renderer.page.locator(`[data-ssr-margin-fixture="${index}"] > div`);
						const measurements = await block.evaluate(measureStreamingSiblings);
						const lightweight = index === 2;
						expect(measurements.client.marginTop).toBe(lightweight ? '12px' : '0px');
						for (const before of [measurements.singleStyle, measurements.streamed]) {
							expect(before.marginTop).toBe(gateEnabled && !lightweight ? '0px' : '12px');
						}
						expect(measurements.hydrated).toEqual(measurements.client);
						expect(measurements.afterContent.marginTop).toBe('12px');
					}
					await renderer.page
						.locator('[data-ssr-margin-fixture]')
						.evaluateAll((hosts) => hosts.forEach((host) => host.remove()));
				});
			});
		}
	}
}
