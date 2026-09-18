import { type UIAttributes, type UIEventPayload } from '@atlaskit/media-common';

import { type CustomMediaPlayerType, type WithCustomMediaPlayerType } from '../../../types';
import {
	createPlaybackAttributes,
	type PlaybackState,
	type WithPlaybackAttributes,
} from '../../utils/playbackAttributes';

export type MediaButtonClickEventPayload = UIEventPayload<
	UIAttributes & WithPlaybackAttributes & WithCustomMediaPlayerType,
	'clicked',
	'button'
>;

export function createMediaButtonClickedEvent(
	type: CustomMediaPlayerType,
	playbackState: PlaybackState,
	buttonType?: string,
	fileId?: string,
): MediaButtonClickEventPayload {
	return {
		eventType: 'ui',
		action: 'clicked',
		actionSubject: 'button',
		actionSubjectId: buttonType,
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
