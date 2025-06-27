import { rendererTestCase as test, expect } from './not-libra';
import * as adfCodeBlockOutsideViewport from '../__fixtures__/code-block-outside-viewport.adf.json';

test.describe('code block', () => {
	test.use({
		adf: adfCodeBlockOutsideViewport,
		rendererProps: {
			allowCopyToClipboard: true,
			featureFlags: { 'allow-windowed-code-block': true },
		},
	});
	test.describe('when not scrolled into viewport yet', () => {
		test('should initially render only a LightWeightCodeBlock offscreen', async ({ renderer }) => {
			await expect(renderer.codeBlock.lightWeightCodeBlock).not.toBeInViewport();
			await expect(renderer.codeBlock.lightWeightCodeBlock).toBeVisible();
		});
	});

	test.describe('when not scrolled into viewport', () => {
		test('should eventually render a normal AkCodeBlock (with syntax highlighting)', async ({
			renderer,
		}) => {
			await renderer.codeBlock.lightWeightCodeBlock.scrollIntoViewIfNeeded();
			await expect(renderer.codeBlock.block).toBeVisible();
			await expect(renderer.codeBlock.block).toBeInViewport();
		});

		test('should capture and report a11y violations', async ({ renderer }) => {
			await renderer.codeBlock.lightWeightCodeBlock.scrollIntoViewIfNeeded();
			await expect(renderer.codeBlock.block).toBeVisible();

			await expect(renderer.page).toBeAccessible();
		});
	});
});
