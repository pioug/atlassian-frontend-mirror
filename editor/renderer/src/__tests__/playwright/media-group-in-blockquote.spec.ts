import { mediaGroupDownloadableInBlockquoteADF } from '../__fixtures__/media-inside-blockquote.adf';
import { rendererTestCase as test, expect } from './not-libra';

test.describe('media group in blockquote', () => {
	test.use({
		adf: mediaGroupDownloadableInBlockquoteADF(),
		rendererProps: {
			media: {
				enableDownloadButton: true,
			},
		},
	});

	test('should render Download button for mediaGroup if enableDownloadButton is true', async ({
		renderer,
	}) => {
		const downloadButton = renderer.page.getByTestId('media-card-primary-action');
		await renderer.page.getByTestId('media-file-card-view').hover();
		await expect(downloadButton).toBeVisible();
	});

	test('should capture and report a11y violations', async ({ renderer }) => {
		const downloadButton = renderer.page.getByTestId('media-card-primary-action');
		await renderer.page.getByTestId('media-file-card-view').hover();
		await expect(downloadButton).toBeVisible();

		await expect(renderer.page).toBeAccessible();
	});
});
