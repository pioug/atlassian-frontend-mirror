import type { EditorState } from '@atlaskit/editor-prosemirror/state';

export function isInTable(state: EditorState): boolean {
	const { $head } = state.selection;
	for (let d = $head.depth; d > 0; d--) {
		if ($head.node(d).type.spec.tableRole === 'row') {
			return true;
		}
	}
	return false;
}
