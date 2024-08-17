import { codeBlockInBlockquoteADF } from '../__fixtures__/code-block-inside-blockquote.adf';
import { rendererTestCase as test, expect } from './not-libra';

test.describe('codeblock in blockquote', () => {
	test.use({
		adf: codeBlockInBlockquoteADF(),
	});

	test.describe('if allowCopyToClipboard and allowWrapCodeBlock are not set', () => {
		test('should not render copy and wrap button on hover', async ({ renderer }) => {
			const copyLocator = renderer.page.locator('button.copy-to-clipboard');
			const wrapLocator = renderer.page.locator('button.wrap-code');

			await renderer.page.getByTestId('renderer-code-block').hover();
			await expect(copyLocator).toBeHidden();
			await expect(wrapLocator).toBeHidden();
		});
	});

	test.describe('if allowCopyToClipboard is set to true', () => {
		test.use({
			rendererProps: {
				allowCopyToClipboard: true,
			},
		});
		test('should only render copy button on hover', async ({ renderer }) => {
			const copyLocator = renderer.page.locator('button.copy-to-clipboard');
			const wrapLocator = renderer.page.locator('button.wrap-code');

			await renderer.page.getByTestId('renderer-code-block').hover();
			await expect(copyLocator).toBeVisible();
			await expect(wrapLocator).toBeHidden();
		});
	});

	test.describe('if allowWrapCodeBlock is set to true', () => {
		test.use({
			rendererProps: {
				allowWrapCodeBlock: true,
			},
		});
		test('should only render wrap button on hover', async ({ renderer }) => {
			const copyLocator = renderer.page.locator('button.copy-to-clipboard');
			const wrapLocator = renderer.page.locator('button.wrap-code');

			await renderer.page.getByTestId('renderer-code-block').hover();
			await expect(copyLocator).toBeHidden();
			await expect(wrapLocator).toBeVisible();
		});
	});

	test.describe('if allowCopyToClipboard and allowWrapCodeBlock are set to true', () => {
		test.use({
			rendererProps: {
				allowCopyToClipboard: true,
				allowWrapCodeBlock: true,
			},
		});
		test('should render copy and wrap button on hover', async ({ renderer }) => {
			const copyLocator = renderer.page.locator('button.copy-to-clipboard');
			const wrapLocator = renderer.page.locator('button.wrap-code');

			await renderer.page.getByTestId('renderer-code-block').hover();
			await expect(copyLocator).toBeVisible();
			await expect(wrapLocator).toBeVisible();
		});
	});
});
