import {
	createMediaButtonClickedEvent,
	type PlaybackState,
} from '../../../../../customMediaPlayer/analytics';

describe('createMediaButtonClickedEvent', () => {
	const playbackState: PlaybackState = {
		status: 'playing',
		currentTime: 60,
		volume: 1,
		duration: 120,
		isMuted: false,
		buffered: 0,
		isLoading: false,
		isAutoPlay: true,
		isFullScreenEnabled: false,
		playerSize: 'large',
		playbackSpeed: 1,
	};
	it('with video type, button type and fileId', () => {
		expect(
			createMediaButtonClickedEvent('video', playbackState, 'some-button', 'some-file-Id'),
		).toEqual({
			eventType: 'ui',
			action: 'clicked',
			actionSubject: 'button',
			actionSubjectId: 'some-button',
			attributes: {
				type: 'video',
				playbackAttributes: {
					status: 'playing',
					durationInSec: 120,
					absoluteTimeInSec: 60,
					relativeTime: 0.5,
					volume: 1,
					isMuted: false,
					isAutoPlay: true,
					isFullScreenEnabled: false,
					playerSize: 'large',
					playbackSpeed: 1,
				},
				fileAttributes: {
					fileId: 'some-file-Id',
				},
			},
		});
	});
});
