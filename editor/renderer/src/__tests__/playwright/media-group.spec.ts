import type { DocNode } from '@atlaskit/adf-schema';
import { rendererTestCase as test, expect } from './not-libra';

const adf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'mediaGroup',
			content: [
				{
					type: 'media',
					attrs: {
						type: 'file',
						id: 'a559980d-cd47-43e2-8377-27359fcb905f',
						collection: 'MediaServicesSample',
					},
				},
			],
		},
	],
};

test.describe('media group', () => {
	test.use({
		adf: adf,
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
});
