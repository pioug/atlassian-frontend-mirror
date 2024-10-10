import type { EditorCommand } from '@atlaskit/editor-common/types';

import { engagementPlatformPmPluginKey } from '../engagementPlatformPmPluginKey';
import type { EngagementPlatformPmPluginTrMeta } from '../types';

/** Set the state of a message in the Engagement Platform plugin */
export const setMessageState =
	(messageIs: string, state: boolean): EditorCommand =>
	({ tr }) => {
		const meta: EngagementPlatformPmPluginTrMeta = {
			newMessageStates: {
				...tr.getMeta(engagementPlatformPmPluginKey)?.messageStates,
				[messageIs]: state,
			},
		};

		return tr.setMeta(engagementPlatformPmPluginKey, meta);
	};
