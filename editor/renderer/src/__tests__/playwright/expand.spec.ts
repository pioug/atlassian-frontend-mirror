import { skipAutoA11yFile } from '@atlassian/a11y-playwright-testing';

import { expandADF } from '../__fixtures__/expand-adf';
import { rendererTestCase as test, expect } from './not-libra';

test.use({ exampleName: 'testing' as keyof typeof import('../../../examples/99-testing.tsx') });
// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:playwright
skipAutoA11yFile();

test.describe('expand', () => {
	test.describe('default mode', () => {
		test.use({
			adf: expandADF('default'),
		});

		test('should expand a collapsed nested expand on toggle', async ({ renderer }) => {
			const expander = renderer.page.locator('[data-node-type="expand"] > button');

			await expander.waitFor({ state: 'visible' });
			await expander.click();

			await expect(
				renderer.page.locator('[data-testid="expand-container-nestedExpand-expand-title-2"] > div'),
			).toBeHidden();

			const nestedExpander = renderer.page.locator('[data-node-type="nestedExpand"] > button');
			await nestedExpander.waitFor({ state: 'visible' });
			await nestedExpander.click();

			await expect(
				renderer.page.locator('[data-testid="expand-container-nestedExpand-expand-title-2"] > div'),
			).toBeVisible();
		});

		test('should capture and report a11y violations', async ({ renderer }) => {
			const expander = renderer.page.locator('[data-node-type="expand"] > button');
			await expander.waitFor({ state: 'visible' });
			await expander.click();
			await expect(
				renderer.page.locator('[data-testid="expand-container-nestedExpand-expand-title-2"] > div'),
			).toBeHidden();

			await expect(renderer.page).toBeAccessible({ violationCount: 2 });
		});
	});
	test.describe('wide mode', () => {
		test.use({
			adf: expandADF('wide'),
		});

		test('should expand a collapsed nested expand on toggle', async ({ renderer }) => {
			const expander = renderer.page.locator('[data-node-type="expand"] > button');

			await expander.waitFor({ state: 'visible' });
			await expander.click();

			await expect(
				renderer.page.locator('[data-testid="expand-container-nestedExpand-expand-title-2"] > div'),
			).toBeHidden();

			const nestedExpander = renderer.page.locator('[data-node-type="nestedExpand"] > button');
			await nestedExpander.waitFor({ state: 'visible' });
			await nestedExpander.click();

			await expect(
				renderer.page.locator('[data-testid="expand-container-nestedExpand-expand-title-2"] > div'),
			).toBeVisible();
		});
	});
	test.describe('full-width mode', () => {
		test.use({
			adf: expandADF('full-width'),
		});

		test('should expand a collapsed nested expand on toggle', async ({ renderer }) => {
			const expander = renderer.page.locator('[data-node-type="expand"] > button');

			await expander.waitFor({ state: 'visible' });
			await expander.click();

			await expect(
				renderer.page.locator('[data-testid="expand-container-nestedExpand-expand-title-2"] > div'),
			).toBeHidden();

			const nestedExpander = renderer.page.locator('[data-node-type="nestedExpand"] > button');
			await nestedExpander.waitFor({ state: 'visible' });
			await nestedExpander.click();

			await expect(
				renderer.page.locator('[data-testid="expand-container-nestedExpand-expand-title-2"] > div'),
			).toBeVisible();
		});
	});
});

for (const { gateEnabled, expectedMargin } of [
	{ gateEnabled: false, expectedMargin: 4 },
	{ gateEnabled: true, expectedMargin: 0 },
]) {
	for (const headingExperimentEnabled of [false, true]) {
		test.describe(`SSR Expand margin: gate=${gateEnabled}, heading experiment=${headingExperimentEnabled}`, () => {
			test.use({
				platformFeatureFlags: {
					platform_renderer_expand_ssr_margin_fix: gateEnabled,
				},
				editorExperiments: {
					platform_editor_copy_link_a11y_inconsistency_fix: headingExperimentEnabled,
				},
			});

			for (const mode of ['default', 'wide', 'full-width']) {
				test.describe(`${mode} mode`, () => {
					test.use({ adf: expandADF(mode) });

					test('keeps breakout spacing stable when SSR siblings move to the head', async ({
						renderer,
					}) => {
						await renderer.waitForRendererStable();
						const expand = renderer.page.locator('[data-node-type="expand"]');
						await expect(expand).toHaveCSS('margin-top', '0px');

						const measurements = await expand.evaluate((element) => {
							const parent = element.parentElement;
							if (!parent?.classList.contains('ak-renderer-sticky-safe-breakout-inner')) {
								throw new Error('Expected Expand inside its breakout wrapper');
							}
							const measure = () => ({
								marginTop: getComputedStyle(element).marginTop,
								top: element.getBoundingClientRect().top,
								wrapperHeight: parent.getBoundingClientRect().height,
							});
							const client = measure();
							// Recreate streaming siblings without replacing the renderer's real CSS.
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
						});

						for (const before of [measurements.singleStyle, measurements.streamed]) {
							expect(before.marginTop).toBe(`${expectedMargin}px`);
							expect(before.top - measurements.hydrated.top).toBe(expectedMargin);
							expect(before.wrapperHeight - measurements.hydrated.wrapperHeight).toBe(
								expectedMargin,
							);
						}
						expect(measurements.hydrated).toEqual(measurements.client);
						expect(measurements.afterContent.marginTop).toBe('4px');
					});
				});
			}
		});
	}
}
