import type { Node } from '@atlaskit/editor-prosemirror/model';
import { Fragment, NodeRange, Slice } from '@atlaskit/editor-prosemirror/model';
import type { Selection, Transaction } from '@atlaskit/editor-prosemirror/state';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { liftTarget, ReplaceAroundStep } from '@atlaskit/editor-prosemirror/transform';

import { getListLiftTarget } from './utils/indentation';

function liftListItem(selection: Selection, tr: Transaction): Transaction {
	const { $from, $to } = selection;
	const nodeType = tr.doc.type.schema.nodes.listItem;
	let range = $from.blockRange(
		$to,
		(node) => !!node.childCount && !!node.firstChild && node.firstChild.type === nodeType,
	);
	if (!range || range.depth < 2 || $from.node(range.depth - 1).type !== nodeType) {
		return tr;
	}
	const end = range.end;
	const endOfList = $to.end(range.depth);
	if (end < endOfList) {
		tr.step(
			new ReplaceAroundStep(
				end - 1,
				endOfList,
				end,
				endOfList,
				new Slice(Fragment.from(nodeType.create(undefined, range.parent.copy())), 1, 0),
				1,
				true,
			),
		);

		range = new NodeRange(tr.doc.resolve($from.pos), tr.doc.resolve(endOfList), range.depth);
	}
	return tr.lift(range, liftTarget(range) as number).scrollIntoView();
}

// Function will lift list item following selection to level-1.
export function liftFollowingList(
	from: number,
	to: number,
	rootListDepth: number,
	tr: Transaction,
): Transaction {
	const { listItem } = tr.doc.type.schema.nodes;
	let lifted = false;
	tr.doc.nodesBetween(from, to, (node, pos) => {
		if (!lifted && node.type === listItem && pos > from) {
			lifted = true;
			let listDepth = rootListDepth + 3;
			while (listDepth > rootListDepth + 2) {
				const start = tr.doc.resolve(tr.mapping.map(pos));
				listDepth = start.depth;
				const end = tr.doc.resolve(tr.mapping.map(pos + node.textContent.length));
				const sel = new TextSelection(start, end);
				tr = liftListItem(sel, tr);
			}
		}
	});
	return tr;
}

export function liftNodeSelectionList(selection: Selection, tr: Transaction) {
	const { from } = selection;
	const { listItem } = tr.doc.type.schema.nodes;
	const mappedPosition = tr.mapping.map(from);
	const nodeAtPos = tr.doc.nodeAt(mappedPosition);

	const start = tr.doc.resolve(mappedPosition);

	if (start?.parent.type !== listItem) {
		return tr;
	}

	const end = tr.doc.resolve(mappedPosition + (nodeAtPos?.nodeSize || 1));
	const range = start.blockRange(end);
	if (range) {
		const liftTarget = getListLiftTarget(start);
		tr.lift(range, liftTarget);
	}
	return tr;
}

interface ListCol {
	node: Node;
	pos: number;
}

// The function will list paragraphs in selection out to level 1 below root list.
export function liftTextSelectionList(selection: Selection, tr: Transaction): Transaction {
	const { from, to } = selection;
	const { paragraph } = tr.doc.type.schema.nodes;
	const listCol: ListCol[] = [];
	tr.doc.nodesBetween(from, to, (node, pos) => {
		if (node.type === paragraph) {
			listCol.push({ node, pos });
		}
	});
	for (let i = listCol.length - 1; i >= 0; i--) {
		const paragraph = listCol[i];
		const start = tr.doc.resolve(tr.mapping.map(paragraph.pos));
		if (start.depth > 0) {
			let end;
			if (paragraph.node.textContent && paragraph.node.textContent.length > 0) {
				end = tr.doc.resolve(tr.mapping.map(paragraph.pos + paragraph.node.textContent.length));
			} else {
				end = tr.doc.resolve(tr.mapping.map(paragraph.pos + 1));
			}
			const range = start.blockRange(end);
			if (range) {
				tr.lift(range, getListLiftTarget(start));
			}
		}
	}
	return tr;
}
