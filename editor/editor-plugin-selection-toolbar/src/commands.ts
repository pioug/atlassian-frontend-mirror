import type { EditorCommand } from '@atlaskit/editor-common/types';

import { selectionToolbarPluginKey } from './plugin-key';

export const toggleToolbar =
	({ hide }: { hide: boolean }): EditorCommand =>
	({ tr }) => {
		tr.setMeta(selectionToolbarPluginKey, { hide });
		return tr;
	};
