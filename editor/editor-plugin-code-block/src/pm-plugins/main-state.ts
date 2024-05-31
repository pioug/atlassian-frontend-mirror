import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import { pluginKey } from '../plugin-key';

export type CodeBlockState = {
	pos: number | null;
	contentCopied: boolean;
	isNodeSelected: boolean;
	shouldIgnoreFollowingMutations: boolean;
};

export const getPluginState = (state: EditorState): CodeBlockState => pluginKey.getState(state);
