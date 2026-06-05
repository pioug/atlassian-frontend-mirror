import type { EditorState } from '@atlaskit/editor-prosemirror/state';

export function atTheBeginningOfDoc(state: EditorState): boolean {
	const { selection } = state;
	return selection.$from.pos === selection.$from.depth;
}
