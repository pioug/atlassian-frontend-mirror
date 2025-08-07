import { mapToMediaCdnUrl } from '../../utils/mediaCdn';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';
import { isIsolatedCloud } from '@atlaskit/atlassian-context';

jest.mock('@atlaskit/atlassian-context', () => ({
	...jest.requireActual('@atlaskit/atlassian-context'),
	isIsolatedCloud: jest.fn(),
}));

describe('mediaCdn', () => {
	beforeEach(() => {
		setBooleanFeatureFlagResolver(() => true);
		(isIsolatedCloud as jest.Mock).mockReturnValue(false);

		jsdom.reconfigure({
			url: 'https://hello.atlassian.net',
		});
	});

	it('should not map to cdn url if isolated cloud', () => {
		(isIsolatedCloud as jest.Mock).mockReturnValue(true);

		const originalUrl = 'https://api.media.atlassian.com/path/to/resource';
		expect(mapToMediaCdnUrl(originalUrl, '')).toBe(originalUrl);
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
		expect(mapToMediaCdnUrl(originalUrl, '')).toBe(
			'https://api.media.atlassian.com/path/to/resource',
		);

		jsdom.reconfigure({
			url: 'https://atlassian-us-gov-mod.com',
		});
		expect(mapToMediaCdnUrl(originalUrl, '')).toBe(
			'https://api.media.atlassian.com/path/to/resource',
		);

		global.MICROS_PERIMETER = 'commercial';
		jsdom.reconfigure({
			url: 'https://hello.atlassian.net',
		});
		expect(mapToMediaCdnUrl(originalUrl, '')).toBe(
			'https://media-cdn.atlassian.com/path/to/resource',
		);
	});

	it('should not map to cdn url when platform_media_cdn_delivery is disabled', () => {
		setBooleanFeatureFlagResolver((flagName: string) => {
			switch (flagName) {
				case 'platform_media_cdn_delivery':
					return false;
				case 'platform_disable_isolated_cloud_media_cdn_delivery':
				case 'platform_media_cdn_single_host':
					return true;
				default:
					return true;
			}
		});

		const originalUrl = 'https://api.media.atlassian.com/path/to/resource';
		expect(mapToMediaCdnUrl(originalUrl, '')).toBe(originalUrl);
	});

	it('should not map to cdn url when platform_media_cdn_single_host is disabled', () => {
		setBooleanFeatureFlagResolver((flagName: string) => {
			switch (flagName) {
				case 'platform_media_cdn_single_host':
					return false;
				case 'platform_disable_isolated_cloud_media_cdn_delivery':
				case 'platform_media_cdn_delivery':
					return true;
				default:
					return true;
			}
		});

		const originalUrl = 'https://api.media.atlassian.com/path/to/resource';
		expect(mapToMediaCdnUrl(originalUrl, '')).toBe(originalUrl);
	});

	it('should map to cdn url when platform_disable_isolated_cloud_media_cdn_delivery is disabled but other flags are enabled', () => {
		setBooleanFeatureFlagResolver((flagName: string) => {
			switch (flagName) {
				case 'platform_disable_isolated_cloud_media_cdn_delivery':
					return false;
				case 'platform_media_cdn_delivery':
				case 'platform_media_cdn_single_host':
					return true;
				default:
					return true;
			}
		});

		const originalUrl = 'https://api.media.atlassian.com/path/to/resource';
		expect(mapToMediaCdnUrl(originalUrl, '')).toBe(
			'https://media-cdn.atlassian.com/path/to/resource',
		);
	});

	it('should not map to cdn url when isolated cloud and platform_disable_isolated_cloud_media_cdn_delivery is enabled', () => {
		(isIsolatedCloud as jest.Mock).mockReturnValue(true);
		setBooleanFeatureFlagResolver(() => true);

		const originalUrl = 'https://api.media.atlassian.com/path/to/resource';
		expect(mapToMediaCdnUrl(originalUrl, '')).toBe(originalUrl);
	});

	it('should map to cdn url when isolated cloud but platform_disable_isolated_cloud_media_cdn_delivery is disabled', () => {
		(isIsolatedCloud as jest.Mock).mockReturnValue(true);
		setBooleanFeatureFlagResolver((flagName: string) => {
			switch (flagName) {
				case 'platform_disable_isolated_cloud_media_cdn_delivery':
					return false;
				case 'platform_media_cdn_delivery':
				case 'platform_media_cdn_single_host':
					return true;
				default:
					return true;
			}
		});

		const originalUrl = 'https://api.media.atlassian.com/path/to/resource';
		expect(mapToMediaCdnUrl(originalUrl, '')).toBe(
			'https://media-cdn.atlassian.com/path/to/resource',
		);
	});

	it('should map to cdn url when not isolated cloud and platform_disable_isolated_cloud_media_cdn_delivery is enabled', () => {
		(isIsolatedCloud as jest.Mock).mockReturnValue(false);
		setBooleanFeatureFlagResolver(() => true);

		const originalUrl = 'https://api.media.atlassian.com/path/to/resource';
		expect(mapToMediaCdnUrl(originalUrl, '')).toBe(
			'https://media-cdn.atlassian.com/path/to/resource',
		);
	});
});
