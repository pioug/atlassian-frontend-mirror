import type { EditorCommand } from '@atlaskit/editor-common/types';

import type { ToolbarDocking } from '../types';

import { selectionToolbarPluginKey } from './plugin-key';

export const toggleToolbar =
	({ hide }: { hide: boolean }): EditorCommand =>
	({ tr }) => {
		tr.setMeta(selectionToolbarPluginKey, { hide });
		return tr;
	};

export const setToolbarDocking =
	({ toolbarDocking }: { toolbarDocking: ToolbarDocking }): EditorCommand =>
	({ tr }) => {
		tr.setMeta(selectionToolbarPluginKey, { toolbarDocking });
		return tr;
	};
