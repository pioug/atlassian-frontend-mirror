import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';

import { pluginKey } from '../plugin-key';

export type CodeBlockState = {
	pos: number | null;
	contentCopied: boolean;
	isNodeSelected: boolean;
	shouldIgnoreFollowingMutations: boolean;
	decorations: DecorationSet;
};

export const getPluginState = (state: EditorState): CodeBlockState => pluginKey.getState(state);
