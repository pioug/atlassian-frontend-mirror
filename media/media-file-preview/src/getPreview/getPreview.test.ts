import { type MediaClient, type MediaStoreGetFileImageParams } from '@atlaskit/media-client';

import { extractCdnSigningParams, getSSRPreview } from './getPreview';

describe('extractCdnSigningParams', () => {
	const baseUrl = 'https://media-cdn.atlassian.com/file/abc123/preview';

	it('extracts the full set of CDN signing params from a pre-signed CDN URL', () => {
		const cdnUrl = `${baseUrl}?token=signed-token&Policy=POLICY&Key-Pair-Id=KEY&Signature=SIG&Expires=12345`;

		expect(extractCdnSigningParams(cdnUrl)).toEqual({
			token: 'signed-token',
			Policy: 'POLICY',
			'Key-Pair-Id': 'KEY',
			Signature: 'SIG',
			Expires: '12345',
		});
	});

	it('only includes signing params present on the URL (missing keys are absent from the result)', () => {
		const cdnUrl = `${baseUrl}?token=t&Signature=s`;

		expect(extractCdnSigningParams(cdnUrl)).toEqual({
			token: 't',
			Signature: 's',
		});
	});

	it('ignores non-signing params (width / height / mode / collection / source / etc.)', () => {
		const cdnUrl = `${baseUrl}?token=t&width=100&height=100&mode=crop&collection=foo&source=bar`;

		expect(extractCdnSigningParams(cdnUrl)).toEqual({ token: 't' });
	});

	it('returns {} on a malformed URL', () => {
		expect(extractCdnSigningParams('not-a-url')).toEqual({});
	});

	it('returns {} when no signing params are present', () => {
		expect(extractCdnSigningParams(`${baseUrl}?width=100`)).toEqual({});
	});
});

describe('getSSRPreview — cdnSigningParams overlay', () => {
	const id = 'file-id';
	const params: MediaStoreGetFileImageParams = {
		width: 100,
		height: 100,
		mode: 'crop',
		collection: 'collection-id',
	};
	// `getImageUrlSync` already returns a media-cdn URL when CDN delivery is enabled
	// upstream; for the unit test we mock it to return a URL with a regular auth
	// token, then verify the signing params are overlaid on top.
	const baseUrl =
		'https://media-cdn.atlassian.com/file/file-id/image?width=100&height=100&token=auth-token';

	const buildClient = () =>
		({
			getImageUrlSync: jest.fn(() => baseUrl),
			getClientIdSync: jest.fn(() => undefined),
		}) as unknown as MediaClient;

	it('overlays the cdn signing params onto the URL produced by getImageUrlSync', () => {
		const mediaClient = buildClient();
		const cdnSigningParams = {
			token: 'cdn-signed-token',
			Policy: 'P',
			'Key-Pair-Id': 'KEY',
			Signature: 'SIG',
		};

		const preview = getSSRPreview('server', mediaClient, id, params, undefined, cdnSigningParams);

		const url = new URL(preview.dataURI);
		// Signing params overwrite the auth token (set-on-collision).
		expect(url.searchParams.get('token')).toBe('cdn-signed-token');
		expect(url.searchParams.get('Policy')).toBe('P');
		expect(url.searchParams.get('Key-Pair-Id')).toBe('KEY');
		expect(url.searchParams.get('Signature')).toBe('SIG');
		// Image params built by getImageUrlSync are preserved.
		expect(url.searchParams.get('width')).toBe('100');
		expect(url.searchParams.get('height')).toBe('100');
	});

	it('overlays cdn signing params onto BOTH the 1x and 2x srcSet entries', () => {
		const mediaClient = buildClient();
		(mediaClient.getImageUrlSync as jest.Mock).mockImplementation(
			(_id, p: MediaStoreGetFileImageParams) =>
				`https://media-cdn.atlassian.com/file/file-id/image?width=${p.width}&height=${p.height}&token=auth-token`,
		);

		const preview = getSSRPreview('server', mediaClient, id, params, undefined, {
			token: 'cdn-signed-token',
		});

		expect(preview.srcSet).toBeDefined();
		const [oneX, twoX] = (preview.srcSet as string).split(', ');
		expect(oneX).toContain('width=100');
		expect(oneX).toContain('token=cdn-signed-token');
		expect(oneX).toContain('1x');
		expect(twoX).toContain('width=200');
		expect(twoX).toContain('height=200');
		expect(twoX).toContain('token=cdn-signed-token');
		expect(twoX).toContain('2x');
	});

	it('is a no-op when cdnSigningParams is undefined (existing getSSRPreview behaviour preserved)', () => {
		const mediaClient = buildClient();

		const preview = getSSRPreview('server', mediaClient, id, params);

		const url = new URL(preview.dataURI);
		// auth token from the mocked getImageUrlSync stays untouched.
		expect(url.searchParams.get('token')).toBe('auth-token');
	});

	it('is a no-op when cdnSigningParams is an empty object', () => {
		const mediaClient = buildClient();

		const preview = getSSRPreview('server', mediaClient, id, params, undefined, {});

		const url = new URL(preview.dataURI);
		expect(url.searchParams.get('token')).toBe('auth-token');
	});

	it("tags source 'ssr-client' when ssr === 'client', else 'ssr-server' (unchanged)", () => {
		const mediaClient = buildClient();

		expect(getSSRPreview('client', mediaClient, id, params, undefined, { token: 't' }).source).toBe(
			'ssr-client',
		);
		expect(getSSRPreview('server', mediaClient, id, params, undefined, { token: 't' }).source).toBe(
			'ssr-server',
		);
	});
});
