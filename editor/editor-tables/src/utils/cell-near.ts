import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';

export function cellNear($pos: ResolvedPos): ResolvedPos | null {
	for (let after = $pos.nodeAfter, { pos } = $pos; after; after = after.firstChild, pos++) {
		const role = after.type.spec.tableRole;
		if (role === 'cell' || role === 'header_cell') {
			return $pos.doc.resolve(pos);
		}
	}
	for (let before = $pos.nodeBefore, { pos } = $pos; before; before = before.lastChild, pos--) {
		const role = before.type.spec.tableRole;
		if (role === 'cell' || role === 'header_cell') {
			return $pos.doc.resolve(pos - before.nodeSize);
		}
	}

	return null;
}
