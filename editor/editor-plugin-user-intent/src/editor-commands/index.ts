import { EditorCommand } from '@atlaskit/editor-common/types';

import { userIntentPluginKey } from '../pm-plugins/main';
import type { UserIntent } from '../pm-plugins/types';

export const setCurrentUserIntent =
	(currentUserIntent: UserIntent): EditorCommand =>
	({ tr }) => {
		tr.setMeta(userIntentPluginKey, {
			type: 'setCurrentUserIntent',
			data: {
				currentUserIntent,
			},
		});

		return tr;
	};
