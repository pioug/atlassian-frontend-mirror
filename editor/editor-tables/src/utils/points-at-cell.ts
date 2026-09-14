import type { Node, ResolvedPos } from '@atlaskit/editor-prosemirror/model';

export function pointsAtCell($pos: ResolvedPos): false | Node | null {
	return $pos.parent.type.spec.tableRole === 'row' && $pos.nodeAfter;
}
