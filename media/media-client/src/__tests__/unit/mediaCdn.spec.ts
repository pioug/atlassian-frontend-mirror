import { mapToMediaCdnUrl } from '../../utils/mediaCdn';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';

Object.defineProperty(window, 'location', {
	value: {
		hostname: '',
	},
});

describe('mediaCdn', () => {
	beforeEach(() => {
		setBooleanFeatureFlagResolver(() => true);
		// @ts-expect-error - TS2790 - The operand of a 'delete' operator must be optional.
		delete global.MICROS_PERIMETER;
		window.location.hostname = 'hello.atlassian.net';
	});

	it('should map to cdn url if mapping found', () => {
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

		window.location.hostname = 'atlassian-us-gov-mod.com';
		expect(mapToMediaCdnUrl(originalUrl, '')).toBe(
			'https://api.media.atlassian.com/path/to/resource',
		);

		global.MICROS_PERIMETER = 'commercial';
		window.location.hostname = 'hello.atlassian.net';
		expect(mapToMediaCdnUrl(originalUrl, '')).toBe(
			'https://media-cdn.atlassian.com/path/to/resource',
		);
	});
});
