import { getArtifactUrl } from '../../artifacts';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';
import { type MediaFileArtifacts } from '@atlaskit/media-state';

jsdom.reconfigure({
	url: 'about:blank',
});

describe('getArtifactUrl', () => {
	beforeEach(() => {
		setBooleanFeatureFlagResolver(() => true);
		// @ts-expect-error - TS2790 - The operand of a 'delete' operator must be optional.
		delete global.MICROS_PERIMETER;
	});

	it('should return url without cdn suffix when platform_media_path_based_route is enabled', () => {
		global.MICROS_PERIMETER = 'commercial';
		const artifacts: MediaFileArtifacts = {
			'video_640.mp4': {
				url: 'someurl.com',
				processingStatus: 'succeeded',
			},
		};
		// CDN is disabled when platform_media_path_based_route feature flag is enabled
		expect(getArtifactUrl(artifacts, 'video_640.mp4')).toBe('someurl.com');
	});

	it('should return undefined in commercial environment when artifact is not available', () => {
		global.MICROS_PERIMETER = 'commercial';
		const artifacts: MediaFileArtifacts = {
			'video_640.mp4': {
				url: 'someurl.com',
				processingStatus: 'succeeded',
			},
		};
		expect(getArtifactUrl(artifacts, 'video_1280.mp4')).toBeUndefined();
	});

	it('should return non-cdn url in non commercial environment', () => {
		const artifacts: MediaFileArtifacts = {
			'video_640.mp4': {
				url: 'someurl.com',
				processingStatus: 'succeeded',
			},
		};
		jsdom.reconfigure({
			url: 'https://atlassian-us-gov-mod.com',
		});
		expect(getArtifactUrl(artifacts, 'video_640.mp4')).toBe('someurl.com');
	});
});
