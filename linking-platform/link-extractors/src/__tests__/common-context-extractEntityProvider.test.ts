import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

import { extractEntityProvider } from '../extract-entity-provider';

// Minimal valid SmartLinkResponse helper
const makeResponse = (
	generatorName: string,
	generatorId = 'some-provider-id',
	iconUrl = 'https://example.com/icon.png',
	imageUrl?: string,
): SmartLinkResponse =>
	({
		meta: {
			generator: {
				name: generatorName,
				id: generatorId,
				icon: { url: iconUrl },
				...(imageUrl ? { image: imageUrl } : {}),
			},
		},
		data: {},
	}) as unknown as SmartLinkResponse;

describe('extractors.context.extractEntityProvider', () => {
	afterEach(() => jest.clearAllMocks());

	it('returns undefined when response is undefined', () => {
		expect(extractEntityProvider(undefined)).toBeUndefined();
	});

	it('returns undefined when meta.generator is missing', () => {
		expect(extractEntityProvider({ meta: {}, data: {} } as SmartLinkResponse)).toBeUndefined();
	});

	it('returns provider with icon url', () => {
		const iconUrl = 'https://example.com/provider-icon.png';
		const result = extractEntityProvider(makeResponse('Dropbox', 'dropbox-id', iconUrl));
		expect(result?.icon).toBe(iconUrl);
	});

	it('uses icon.url as image when no image is provided', () => {
		const iconUrl = 'https://example.com/provider-icon.png';
		const result = extractEntityProvider(makeResponse('Dropbox', 'dropbox-id', iconUrl));
		expect(result?.image).toBe(iconUrl);
	});

	it('uses explicit image over icon.url when provided', () => {
		const iconUrl = 'https://example.com/provider-icon.png';
		const imageUrl = 'https://example.com/provider-image.png';
		const result = extractEntityProvider(makeResponse('Dropbox', 'dropbox-id', iconUrl, imageUrl));
		expect(result?.image).toBe(imageUrl);
	});

	describe('provider rebranding', () => {
		it('renames "Google" provider text to "Google Drive"', () => {
			const result = extractEntityProvider(makeResponse('Google'));
			expect(result?.text).toBe('Google Drive');
			expect(result?.iconLabel).toBe('Google Drive');
		});

		it('does not rename non-Google providers', () => {
			const result = extractEntityProvider(makeResponse('Dropbox'));
			expect(result?.text).toBe('Dropbox');
		});

		it('preserves icon and image when rebranding Google', () => {
			const iconUrl = 'https://example.com/google-icon.png';
			const imageUrl = 'https://example.com/google-image.png';
			const result = extractEntityProvider(makeResponse('Google', 'google-id', iconUrl, imageUrl));
			expect(result?.text).toBe('Google Drive');
			expect(result?.icon).toBe(iconUrl);
			expect(result?.image).toBe(imageUrl);
		});
	});
});
