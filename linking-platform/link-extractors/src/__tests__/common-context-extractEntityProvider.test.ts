import type { SmartLinkResponse } from '@atlaskit/linking-types';
import { passGate, failGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { extractEntityProvider } from '../index';

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

	describe('with platform_sl_google_rebrand gate OFF', () => {
		beforeEach(() => {
			failGate('platform_sl_google_rebrand');
			failGate('platform_lp_use_entity_icon_url_for_icon');
		});

		it('returns provider with original name for "Google"', () => {
			const result = extractEntityProvider(makeResponse('Google'));
			expect(result?.text).toBe('Google');
		});

		it('returns provider with original name for a non-Google provider', () => {
			const result = extractEntityProvider(makeResponse('Dropbox'));
			expect(result?.text).toBe('Dropbox');
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
			const result = extractEntityProvider(
				makeResponse('Dropbox', 'dropbox-id', iconUrl, imageUrl),
			);
			expect(result?.image).toBe(imageUrl);
		});
	});

	describe('with platform_sl_google_rebrand gate ON', () => {
		beforeEach(() => {
			passGate('platform_sl_google_rebrand');
			failGate('platform_lp_use_entity_icon_url_for_icon');
		});

		it('renames "Google" provider text to "Google Drive"', () => {
			const result = extractEntityProvider(makeResponse('Google'));
			expect(result?.text).toBe('Google Drive');
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

	describe('with platform_lp_use_entity_icon_url_for_icon gate ON and platform_sl_google_rebrand gate OFF', () => {
		beforeEach(() => {
			passGate('platform_lp_use_entity_icon_url_for_icon');
			failGate('platform_sl_google_rebrand');
		});

		it('returns provider with entity icon url and original name for non-Google', () => {
			const result = extractEntityProvider(makeResponse('Dropbox'));
			expect(result?.text).toBe('Dropbox');
		});
	});

	describe('with both platform_lp_use_entity_icon_url_for_icon and platform_sl_google_rebrand gates ON', () => {
		beforeEach(() => {
			passGate('platform_lp_use_entity_icon_url_for_icon');
			passGate('platform_sl_google_rebrand');
		});

		it('renames "Google" to "Google Drive" and sets iconLabel', () => {
			const result = extractEntityProvider(makeResponse('Google'));
			expect(result?.text).toBe('Google Drive');
			expect(result?.iconLabel).toBe('Google Drive');
		});

		it('does not rename non-Google providers', () => {
			const result = extractEntityProvider(makeResponse('Dropbox'));
			expect(result?.text).toBe('Dropbox');
		});
	});
});
