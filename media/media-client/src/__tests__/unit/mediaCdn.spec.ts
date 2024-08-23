import { mapToMediaCdnUrl } from '../../utils/mediaCdn';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';

describe('mediaCdn', () => {
	beforeEach(() => {
		setBooleanFeatureFlagResolver(() => true);
	});

	it('should map to cdn url if mapping found', () => {
		const originalUrl = 'https://api.media.atlassian.com/path/to/resource';
		expect(mapToMediaCdnUrl(originalUrl)).toBe('https://media-cdn.atlassian.com/path/to/resource');
	});

	it('should not map to cdn url if mapping not found', () => {
		const originalUrl = 'https://api.dev.atlassian.com/path/to/resource';
		expect(mapToMediaCdnUrl(originalUrl)).toBe('https://api.dev.atlassian.com/path/to/resource');
	});
});
