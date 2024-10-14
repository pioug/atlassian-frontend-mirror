import { getArtifactUrl } from '../../artifacts';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';
import { type MediaFileArtifacts } from '@atlaskit/media-state';

Object.defineProperty(window, 'location', {
	value: {
		hostname: '',
	},
});

describe('getArtifactUrl', () => {
	beforeEach(() => {
		setBooleanFeatureFlagResolver(() => true);
		// @ts-expect-error - TS2790 - The operand of a 'delete' operator must be optional.
		delete global.MICROS_PERIMETER;
	});

	it('should return cdn url in commercial environment when artifact is available', () => {
		global.MICROS_PERIMETER = 'commercial';
		const artifacts: MediaFileArtifacts = {
			'video_640.mp4': {
				url: 'someurl.com',
				processingStatus: 'succeeded',
			},
		};
		expect(getArtifactUrl(artifacts, 'video_640.mp4')).toBe('someurl.com/cdn');
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
		window.location.hostname = 'atlassian-us-gov-mod.com';
		expect(getArtifactUrl(artifacts, 'video_640.mp4')).toBe('someurl.com');
	});
});
