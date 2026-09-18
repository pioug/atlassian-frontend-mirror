import { type UIAttributes, type UIEventPayload } from '@atlaskit/media-common';

import { type CustomMediaPlayerType, type WithCustomMediaPlayerType } from '../../../types';
import {
	createPlaybackAttributes,
	type PlaybackState,
	type WithPlaybackAttributes,
} from '../../utils/playbackAttributes';

export type PlayPauseBlanketClickEventPayload = UIEventPayload<
	UIAttributes & WithPlaybackAttributes & WithCustomMediaPlayerType,
	'clicked',
	'playPauseBlanket'
>;

export function createPlayPauseBlanketClickedEvent(
	type: CustomMediaPlayerType,
	playbackState: PlaybackState,
	fileId?: string,
): PlayPauseBlanketClickEventPayload {
	return {
		eventType: 'ui',
		action: 'clicked',
		actionSubject: 'playPauseBlanket',
		attributes: {
			type,
			playbackAttributes: createPlaybackAttributes(playbackState),
			...(fileId && {
				fileAttributes: {
					fileId,
				},
			}),
		},
	};
}
