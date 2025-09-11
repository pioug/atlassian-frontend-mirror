import { mapToMediaCdnUrl, isCDNEnabled } from '../../utils/mediaCdn';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { isIsolatedCloud } from '@atlaskit/atlassian-context';

jest.mock('@atlaskit/atlassian-context', () => ({
	...jest.requireActual('@atlaskit/atlassian-context'),
	isIsolatedCloud: jest.fn(),
}));

describe('mediaCdn', () => {
	beforeEach(() => {
		(isIsolatedCloud as jest.Mock).mockReturnValue(false);

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
