import { type UIAttributes, type UIEventPayload } from '@atlaskit/media-common';

import {
	createPlaybackAttributes,
	type PlaybackState,
	type WithPlaybackAttributes,
} from '../../utils/playbackAttributes';
import { type CustomMediaPlayerType, type WithCustomMediaPlayerType } from '../../../types';

export type TimeRangeNavigateEventPayload = UIEventPayload<
	UIAttributes & WithPlaybackAttributes & WithCustomMediaPlayerType,
	'navigated',
	'timeRange'
>;

export function createTimeRangeNavigatedEvent(
	type: CustomMediaPlayerType,
	playbackState: PlaybackState,
	actionSubjectId?: string,
	fileId?: string,
): TimeRangeNavigateEventPayload {
	return {
		eventType: 'ui',
		action: 'navigated',
		actionSubject: 'timeRange',
		actionSubjectId,
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
