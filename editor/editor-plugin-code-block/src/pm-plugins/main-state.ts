import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';

import { pluginKey } from './plugin-key';

export type CodeBlockState = {
	contentCopied: boolean;
	decorations: DecorationSet;
	isNodeSelected: boolean;
	pos: number | null;
	shouldIgnoreFollowingMutations: boolean;
};

export const getPluginState = (state: EditorState): CodeBlockState => pluginKey.getState(state);
