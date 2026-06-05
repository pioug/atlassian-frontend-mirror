import type { EditorState } from '@atlaskit/editor-prosemirror/state';

export function atTheEndOfDoc(state: EditorState): boolean {
	const { selection, doc } = state;
	return doc.nodeSize - selection.$to.pos - 2 === selection.$to.depth;
}
