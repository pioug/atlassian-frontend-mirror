import { type ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { type EditorState } from '@atlaskit/editor-prosemirror/state';

export function isInTable(state: EditorState): boolean {
	const { $head } = state.selection;
	for (let d = $head.depth; d > 0; d--) {
		if ($head.node(d).type.spec.tableRole === 'row') {
			return true;
		}
	}
	return false;
}

export function inSameTable($a: ResolvedPos, $b: ResolvedPos): boolean {
	return $a.depth === $b.depth && $a.pos >= $b.start(-1) && $a.pos <= $b.end(-1);
}
