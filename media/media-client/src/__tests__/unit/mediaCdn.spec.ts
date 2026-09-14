import { ffTest } from '@atlassian/feature-flags-test-utils/test-runner';

import { isGoogleCloudPlatform } from '@atlaskit/atlassian-context/cloud-provider';
import { isIsolatedCloud } from '@atlaskit/atlassian-context/is-isolated-cloud';
import { isGCPtenant as isGCPtenantInStaging } from '@atlaskit/media-common/mediaEnvUtils';

import { isCDNEnabled } from '../../utils/isCDNEnabled';
import { mapToMediaCdnUrl } from '../../utils/mapToMediaCdnUrl';
import { mapToSeedBasedCdnUrl } from '../../utils/mapToSeedBasedCdnUrl';

jest.mock('@atlaskit/atlassian-context/is-isolated-cloud', () => ({
	...jest.requireActual('@atlaskit/atlassian-context/is-isolated-cloud'),
	isIsolatedCloud: jest.fn(),
}));

jest.mock('@atlaskit/atlassian-context/cloud-provider', () => ({
	...jest.requireActual('@atlaskit/atlassian-context/cloud-provider'),
	isGoogleCloudPlatform: jest.fn(),
}));

jest.mock('@atlaskit/media-common/mediaEnvUtils', () => ({
	...jest.requireActual('@atlaskit/media-common/mediaEnvUtils'),
	isGCPtenant: jest.fn(),
}));

describe('mediaCdn', () => {
	beforeEach(() => {
		(isIsolatedCloud as jest.Mock).mockReturnValue(false);
		(isGoogleCloudPlatform as jest.Mock).mockReturnValue(false);
		(isGCPtenantInStaging as jest.Mock).mockReturnValue(false);

		// Set up commercial environment for isCommercial() to return true
		global.MICROS_PERIMETER = 'commercial';
		jsdom.reconfigure({
			url: 'https://hello.atlassian.net',
		});
	});

	// When path-based route is enabled, CDN should always be disabled
	ffTest.on(
		'platform_media_path_based_route',
		'when platform_media_path_based_route is enabled',
		() => {
			ffTest.on('platform_media_cdn_delivery', 'when CDN delivery is also enabled', () => {
				it('should disable CDN when path-based route is enabled', () => {
					expect(isCDNEnabled()).toBe(false);
				});

				it('should not map to cdn url when path-based route is enabled', () => {
					const originalUrl = 'https://api.media.atlassian.com/path/to/resource';
					expect(mapToMediaCdnUrl(originalUrl, '')).toBe(originalUrl);
				});

				it('should not map to cdn url when path-based route is enabled even with valid mapping', () => {
					const originalUrl = 'https://media.staging.atl-paas.net/path/to/resource';
					expect(mapToMediaCdnUrl(originalUrl, '')).toBe(originalUrl);
				});

				it('should not map to cdn url when path-based route is enabled regardless of token length', () => {
					const originalUrl = 'https://api.media.atlassian.com/path/to/resource';
					const shortToken = 'short';
					expect(mapToMediaCdnUrl(originalUrl, shortToken)).toBe(originalUrl);
				});
			});
		},
	);

	// When path-based route is disabled, test CDN functionality
	ffTest.off(
		'platform_media_path_based_route',
		'when platform_media_path_based_route is disabled',
		() => {
			ffTest.on('platform_media_cdn_delivery', 'when CDN delivery is enabled', () => {
				ffTest.on('platform_media_cdn_single_host', 'when single host is enabled', () => {
					it('should map to cdn url if not isolated cloud', () => {
						(isIsolatedCloud as jest.Mock).mockReturnValue(false);

						const originalUrl = 'https://api.media.atlassian.com/path/to/resource';
						expect(mapToMediaCdnUrl(originalUrl, '')).toBe(
							'https://media-cdn.atlassian.com/path/to/resource',
						);
					});

					it('should map to cdn url if mapping found and not isolated cloud', () => {
						const originalUrl = 'https://api.media.atlassian.com/path/to/resource';
						expect(mapToMediaCdnUrl(originalUrl, '')).toBe(
							'https://media-cdn.atlassian.com/path/to/resource',
						);
					});

					it('should not map to cdn url if mapping not found', () => {
						const originalUrl = 'https://api.dev.atlassian.com/path/to/resource';
						expect(mapToMediaCdnUrl(originalUrl, '')).toBe(originalUrl);
					});

					it('should not map to cdn url if token is exceeding limit', () => {
						const originalUrl = 'https://api.media.atlassian.com/path/to/resource';
						const fixedLengthString = 'A'.repeat(7001);
						expect(mapToMediaCdnUrl(originalUrl, fixedLengthString)).toBe(originalUrl);
					});

					it('should map to cdn url if token is equal limit', () => {
						const originalUrl = 'https://api.media.atlassian.com/path/to/resource';
						const fixedLengthString = 'A'.repeat(7000);
						expect(mapToMediaCdnUrl(originalUrl, fixedLengthString)).toBe(
							'https://media-cdn.atlassian.com/path/to/resource',
						);
					});

					it('should map to cdn url if token is below limit', () => {
						const originalUrl = 'https://api.media.atlassian.com/path/to/resource';
						const fixedLengthString = 'A'.repeat(6999);
						expect(mapToMediaCdnUrl(originalUrl, fixedLengthString)).toBe(
							'https://media-cdn.atlassian.com/path/to/resource',
						);
					});

					it('should map to cdn url only in commercial environment', () => {
						global.MICROS_PERIMETER = 'fedramp-moderate';
						const originalUrl = 'https://api.media.atlassian.com/path/to/resource';
						expect(mapToMediaCdnUrl(originalUrl, '')).toBe(originalUrl);

						jsdom.reconfigure({
							url: 'https://atlassian-us-gov-mod.com',
						});
						expect(mapToMediaCdnUrl(originalUrl, '')).toBe(originalUrl);

						global.MICROS_PERIMETER = 'commercial';
						jsdom.reconfigure({
							url: 'https://hello.atlassian.net',
						});
						expect(mapToMediaCdnUrl(originalUrl, '')).toBe(
							'https://media-cdn.atlassian.com/path/to/resource',
						);
					});

					it('should not map to cdn url when isolated cloud', () => {
						(isIsolatedCloud as jest.Mock).mockReturnValue(true);

						const originalUrl = 'https://api.media.atlassian.com/path/to/resource';
						expect(mapToMediaCdnUrl(originalUrl, '')).toBe(originalUrl);
					});

					it('should return false for isCDNEnabled when isolated cloud', () => {
						(isIsolatedCloud as jest.Mock).mockReturnValue(true);
						expect(isCDNEnabled()).toBe(false);
					});

					it('should return true for isCDNEnabled when not isolated cloud', () => {
						(isIsolatedCloud as jest.Mock).mockReturnValue(false);
						expect(isCDNEnabled()).toBe(true);
					});

					it('should return false for isCDNEnabled when GCP tenant', () => {
						(isGoogleCloudPlatform as jest.Mock).mockReturnValue(true);
						expect(isCDNEnabled()).toBe(false);
					});

					it('should not map to cdn url when GCP tenant', () => {
						(isGoogleCloudPlatform as jest.Mock).mockReturnValue(true);

						const originalUrl = 'https://api.media.atlassian.com/path/to/resource';
						expect(mapToMediaCdnUrl(originalUrl, '')).toBe(originalUrl);
					});

					// Additional test cases explicitly covering GCP cookie/SSR scenarios
					// Note: SSR (globalThis.ssrContext?.isInGCP) and raw cookie parsing behavior
					// are unit-tested directly in the helper's own test suite at
					// @atlaskit/atlassian-context/cloud-provider. This spec verifies that
					// mediaCdn.ts correctly consumes the helper's boolean result.

					it('should disable CDN when GCP cookie scenario (isGoogleCloudPlatform returns true)', () => {
						(isGoogleCloudPlatform as jest.Mock).mockReturnValue(true);
						expect(isCDNEnabled()).toBe(false);
					});

					it('should enable CDN when AWS cookie / non-GCP scenario (isGoogleCloudPlatform returns false)', () => {
						(isGoogleCloudPlatform as jest.Mock).mockReturnValue(false);
						// When isGoogleCloudPlatform is false (AWS or unknown), CDN should be enabled
						// (assuming other conditions like isCommercial, isIsolatedCloud, and feature flags are met)
						expect(isCDNEnabled()).toBe(true);
					});

					// Staging GCP tenants do not have a reliable value for the
					// Bifrost-Atl-Ctx-Cloud-Service-Provider cookie, so isGoogleCloudPlatform()
					// returns false. We fall back to the staging hostname pattern via
					// isGCPtenantInStaging() and combine the two checks with `||`.
					it('should return false for isCDNEnabled when GCP staging tenant (cookie missing but hostname matches)', () => {
						(isGoogleCloudPlatform as jest.Mock).mockReturnValue(false);
						(isGCPtenantInStaging as jest.Mock).mockReturnValue(true);
						expect(isCDNEnabled()).toBe(false);
					});

					it('should not map to cdn url when GCP staging tenant (cookie missing but hostname matches)', () => {
						(isGoogleCloudPlatform as jest.Mock).mockReturnValue(false);
						(isGCPtenantInStaging as jest.Mock).mockReturnValue(true);

						const originalUrl = 'https://api.media.atlassian.com/path/to/resource';
						expect(mapToMediaCdnUrl(originalUrl, '')).toBe(originalUrl);
					});
				});

				ffTest.off('platform_media_cdn_single_host', 'when single host is disabled', () => {
					it('should not map to cdn url when single host is disabled', () => {
						const originalUrl = 'https://api.media.atlassian.com/path/to/resource';
						expect(mapToMediaCdnUrl(originalUrl, '')).toBe(originalUrl);
					});
				});
			});

			ffTest.off('platform_media_cdn_delivery', 'when CDN delivery is disabled', () => {
				it('should not map to cdn url when CDN delivery is disabled', () => {
					const originalUrl = 'https://api.media.atlassian.com/path/to/resource';
					expect(mapToMediaCdnUrl(originalUrl, '')).toBe(originalUrl);
				});
			});
		},
	);
});

describe('mapToSeedBasedCdnUrl', () => {
	const watermarkedSeededUrl =
		'https://media-cdn.atlassian.com/region/v2/cdn/client/client-id/file/file-id/image?token=cdn-token&wm-ari=ari%3Acloud%3Aconfluence%3Asite%3Aspace%2F1&wm-v=version&Policy=policy%2Bvalue&Key-Pair-Id=key&Signature=signature%2Bvalue';

	it('inserts supported image params before the watermark anchor', () => {
		expect(
			mapToSeedBasedCdnUrl(watermarkedSeededUrl, {
				width: 100,
				height: 200,
				mode: 'crop',
				collection: 'ignored-collection',
				source: 'ignored-source',
				ssr: 'server',
			}),
		).toBe(
			'https://media-cdn.atlassian.com/region/v2/cdn/client/client-id/file/file-id/image?token=cdn-token&width=100&height=200&mode=crop&wm-ari=ari%3Acloud%3Aconfluence%3Asite%3Aspace%2F1&wm-v=version&Policy=policy%2Bvalue&Key-Pair-Id=key&Signature=signature%2Bvalue',
		);
	});

	it('preserves the signed watermark suffix byte-for-byte', () => {
		const result = mapToSeedBasedCdnUrl(watermarkedSeededUrl, { height: 200 });

		expect(result.slice(result.indexOf('&wm-ari='))).toBe(
			watermarkedSeededUrl.slice(watermarkedSeededUrl.indexOf('&wm-ari=')),
		);
	});

	it('inserts supported image params before a watermark that is the first query parameter', () => {
		const firstParameterWatermarkedUrl =
			'https://media-cdn.atlassian.com/region/v2/cdn/client/client-id/file/file-id/image?wm-ari=ari%3Acloud%3Aconfluence%3Asite%3Aspace%2F1&wm-v=version&Policy=policy%2Bvalue&Key-Pair-Id=key&Signature=signature%2Bvalue';

		expect(mapToSeedBasedCdnUrl(firstParameterWatermarkedUrl, { width: 100 })).toBe(
			'https://media-cdn.atlassian.com/region/v2/cdn/client/client-id/file/file-id/image?width=100&wm-ari=ari%3Acloud%3Aconfluence%3Asite%3Aspace%2F1&wm-v=version&Policy=policy%2Bvalue&Key-Pair-Id=key&Signature=signature%2Bvalue',
		);
	});

	it('appends image params to a non-watermarked signed URL', () => {
		const seededUrl =
			'https://media-cdn.atlassian.com/region/v2/cdn/client/client-id/file/file-id/image?token=cdn-token&Policy=policy%2Bvalue&Key-Pair-Id=key&Signature=signature%2Bvalue';

		expect(mapToSeedBasedCdnUrl(seededUrl, { width: 100, upscale: false })).toBe(
			`${seededUrl}&width=100&upscale=false`,
		);
	});

	it('returns the seeded URL unchanged when there are no supported image params', () => {
		expect(
			mapToSeedBasedCdnUrl(watermarkedSeededUrl, {
				collection: 'collection',
				source: 'ssr-server',
				ssr: 'server',
			}),
		).toBe(watermarkedSeededUrl);
	});
});
