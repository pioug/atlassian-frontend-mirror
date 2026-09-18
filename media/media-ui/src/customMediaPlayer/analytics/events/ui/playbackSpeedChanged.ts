import { type UIAttributes, type UIEventPayload } from '@atlaskit/media-common';

import { type CustomMediaPlayerType, type WithCustomMediaPlayerType } from '../../../types';
import {
	createPlaybackAttributes,
	type PlaybackState,
	type WithPlaybackAttributes,
} from '../../utils/playbackAttributes';

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
