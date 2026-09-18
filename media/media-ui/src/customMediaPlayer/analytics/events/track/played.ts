import { type TrackAttributes, type TrackEventPayload } from '@atlaskit/media-common';

import { type CustomMediaPlayerType, type WithCustomMediaPlayerType } from '../../../types';
import {
	createPlaybackAttributes,
	type PlaybackState,
	type WithPlaybackAttributes,
} from '../../utils/playbackAttributes';

export type PlayedTrackEventPayload = TrackEventPayload<
	TrackAttributes & WithPlaybackAttributes & WithCustomMediaPlayerType,
	'played',
	'customMediaPlayer'
>;

export const createPlayedTrackEvent = (
	type: CustomMediaPlayerType,
	playbackState: PlaybackState,
	fileId?: string,
): PlayedTrackEventPayload => ({
	eventType: 'track',
	action: 'played',
	actionSubject: 'customMediaPlayer',
	actionSubjectId: fileId,
	attributes: {
		type,
		playbackAttributes: createPlaybackAttributes(playbackState),
		...(fileId && {
			fileAttributes: {
				fileId,
			},
		}),
	},
});
