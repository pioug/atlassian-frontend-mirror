import { type MediaClient, type MediaStoreGetFileImageParams } from '@atlaskit/media-client';

import { getSSRPreview } from './getSSRPreview';

describe('getSSRPreview — seededCdnUrl', () => {
	const id = 'file-id';
	const params: MediaStoreGetFileImageParams = {
		width: 100,
		height: 100,
		mode: 'crop',
		collection: 'collection-id',
	};
	const seededCdnUrl =
		'https://media-cdn.atlassian.com/region/v2/cdn/client/client-id/file/file-id/image?token=cdn-token&wm-ari=ari%3Acloud%3Aconfluence%3Asite%3Aspace%2F1&wm-v=version&Policy=policy&Key-Pair-Id=key&Signature=signature';

	const buildClient = () =>
		({
			getImageUrlSync: jest.fn(
				(_id: string, imageParams: MediaStoreGetFileImageParams, seed?: string) =>
					`${seed ?? 'https://media.example/image'}&width=${imageParams.width}&height=${imageParams.height}`,
			),
			getClientIdSync: jest.fn(() => undefined),
		}) as unknown as MediaClient;

	it('forwards the complete seeded CDN URL to getImageUrlSync', () => {
		const mediaClient = buildClient();

		getSSRPreview('server', mediaClient, id, params, undefined, seededCdnUrl);

		expect(mediaClient.getImageUrlSync).toHaveBeenCalledWith(id, params, seededCdnUrl);
	});

	it('uses the same seed with doubled dimensions for the 2x srcSet entry', () => {
		const mediaClient = buildClient();

		const preview = getSSRPreview('server', mediaClient, id, params, undefined, seededCdnUrl);

		expect(mediaClient.getImageUrlSync).toHaveBeenNthCalledWith(1, id, params, seededCdnUrl);
		expect(mediaClient.getImageUrlSync).toHaveBeenNthCalledWith(
			2,
			id,
			{ ...params, width: 200, height: 200 },
			seededCdnUrl,
		);
		expect(preview.srcSet).toContain('1x');
		expect(preview.srcSet).toContain('2x');
	});

	it('passes undefined when no seeded CDN URL is provided', () => {
		const mediaClient = buildClient();

		getSSRPreview('server', mediaClient, id, params);

		expect(mediaClient.getImageUrlSync).toHaveBeenCalledWith(id, params, undefined);
	});

	it("tags source 'ssr-client' when ssr is client and 'ssr-server' otherwise", () => {
		const mediaClient = buildClient();

		expect(getSSRPreview('client', mediaClient, id, params, undefined, seededCdnUrl).source).toBe(
			'ssr-client',
		);
		expect(getSSRPreview('server', mediaClient, id, params, undefined, seededCdnUrl).source).toBe(
			'ssr-server',
		);
	});
});
