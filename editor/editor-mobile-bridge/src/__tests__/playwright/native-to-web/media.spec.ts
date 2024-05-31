import { mobileBridgeEditorTestCase as test, expect } from '../not-libra';

const uploadPreviewUpdatePayload = (dimensions?: { width: number; height: number }) =>
	JSON.stringify({
		file: {
			dimensions,
			id: `fake-aaaa-bbbb-cccc-dddddddddd`,
			name: 'test-file.jpeg',
			alt: 'test-file.jpeg',
			type: 'image/jpeg',
		},
		preview: {
			dimensions,
		},
	});

test(`media.ts: Collection + Dimensions => uploading`, async ({ bridge }) => {
	await bridge.doCall({
		funcName: 'onMediaPicked',
		args: [
			'upload-preview-update',
			uploadPreviewUpdatePayload({
				width: 2265,
				height: 1500,
			}),
		],
	});

	await expect(bridge).toMatchDocumentSnapshot();
});

test(`media.ts: Empty collection + Dimensions => uploading`, async ({ bridge }) => {
	await bridge.doCall({
		funcName: 'onMediaPicked',
		args: [
			'upload-preview-update',
			uploadPreviewUpdatePayload({
				width: 2265,
				height: 1500,
			}),
		],
	});

	await expect(bridge).toMatchDocumentSnapshot();
});
