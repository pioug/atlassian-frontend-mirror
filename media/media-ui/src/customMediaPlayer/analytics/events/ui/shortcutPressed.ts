import { type UIAttributes, type UIEventPayload } from '@atlaskit/media-common';

import {
	createPlaybackAttributes,
	type PlaybackState,
	type WithPlaybackAttributes,
} from '../../utils/playbackAttributes';
import { type CustomMediaPlayerType, type WithCustomMediaPlayerType } from '../../../types';

export type ShortcutPressEventPayload = UIEventPayload<
	UIAttributes & WithPlaybackAttributes & WithCustomMediaPlayerType,
	'pressed',
	'shortcut'
>;

export function createMediaShortcutPressedEvent(
	type: CustomMediaPlayerType,
	playbackState: PlaybackState,
	shortcutType?: string,
	fileId?: string,
): ShortcutPressEventPayload {
	return {
		eventType: 'ui',
		action: 'pressed',
		actionSubject: 'shortcut',
		actionSubjectId: shortcutType,
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
