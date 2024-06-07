import { type UIAttributes, type UIEventPayload } from '@atlaskit/media-common';

import {
	createPlaybackAttributes,
	type PlaybackState,
	type WithPlaybackAttributes,
} from '../../utils/playbackAttributes';
import { type CustomMediaPlayerType, type WithCustomMediaPlayerType } from '../../../types';

export type PlaybackSpeedChangeEventPayload = UIEventPayload<
	UIAttributes & WithPlaybackAttributes & WithCustomMediaPlayerType,
	'changed',
	'playbackSpeed'
>;

export function createPlaybackSpeedChangedEvent(
	type: CustomMediaPlayerType,
	playbackState: PlaybackState,
	fileId?: string,
): PlaybackSpeedChangeEventPayload {
	return {
		eventType: 'ui',
		action: 'changed',
		actionSubject: 'playbackSpeed',
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
