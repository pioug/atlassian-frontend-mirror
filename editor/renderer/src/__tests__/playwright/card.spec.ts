import { rendererTestCase as test, expect } from './not-libra';
import { adf } from './card.spec.ts-fixtures';

test.describe('smart card', () => {
	test.use({
		adf,
	});

	test('open preview from block card', async ({ renderer }) => {
		const previewButton = renderer.page.getByRole('button', {
			name: 'Open Preview',
		});
		await expect(previewButton).toBeVisible();
		await previewButton.click();
		const embedContent = renderer.page
			.frameLocator('[data-testid="smart-embed-preview-modal-embed"]')
			.getByText('I am an Embed Content!');
		await expect(embedContent).toBeVisible();
		const closePreviewButton = renderer.page.getByTestId('smart-embed-preview-modal--close-button');
		closePreviewButton.click();
		await expect(embedContent).toBeHidden();
	});

	test('should capture and report a11y violations', async ({ renderer }) => {
		const previewButton = renderer.page.getByRole('button', {
			name: 'Open Preview',
		});
		await expect(previewButton).toBeVisible();

		await expect(renderer.page).toBeAccessible();
	});
});
