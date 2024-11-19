import { type ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { type Transaction } from '@atlaskit/editor-prosemirror/state';

export const isDragLayoutColumnToTopLevel = ($from: ResolvedPos, $to: ResolvedPos) => {
	return (
		$from.nodeAfter?.type.name === 'layoutColumn' &&
		$from.parent.type.name === 'layoutSection' &&
		$to.depth === 0
	);
};

export const deleteSourceNode = (tr: Transaction, $from: ResolvedPos, $to: ResolvedPos) => {
	if ($from.nodeAfter) {
		const fromNode = $from.nodeAfter;
		if (isDragLayoutColumnToTopLevel($from, $to)) {
			// need update after we support single column layout.
			if ($from.parent.childCount <= 2) {
				tr.deleteRange($from.pos + 1, $from.pos + fromNode.nodeSize - 1);
				return tr;
			}
		}
		tr.deleteRange($from.pos, $from.pos + fromNode.nodeSize);
	}

	return tr;
};
