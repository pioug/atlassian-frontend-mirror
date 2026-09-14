import type { Node as PMNode, ResolvedPos } from '@atlaskit/editor-prosemirror/model';

export function cellWrapping($pos: ResolvedPos): PMNode | null {
	for (let d = $pos.depth; d > 0; d--) {
		// Sometimes the cell can be in the same depth.
		const role = $pos.node(d).type.spec.tableRole;
		if (role === 'cell' || role === 'header_cell') {
			return $pos.node(d);
		}
	}
	return null;
}
