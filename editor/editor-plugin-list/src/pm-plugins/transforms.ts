import { isListNode } from '@atlaskit/editor-common/utils';
import type { Node, Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment, NodeRange, Slice } from '@atlaskit/editor-prosemirror/model';
import type { Selection, Transaction } from '@atlaskit/editor-prosemirror/state';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { liftTarget, ReplaceAroundStep, ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import { findParentNodeOfTypeClosestToPos } from '@atlaskit/editor-prosemirror/utils';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

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

export function liftNodeSelectionList(selection: Selection, tr: Transaction): Transaction {
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

/**
 * Finds the top-level list nodes (bulletList/orderedList) that contain the positions
 * affected by the given transactions. Returns a map of list node position → list node,
 * so callers can scan only the affected subtrees rather than the entire document.
 */
function getAffectedListsFromTransactions(
	transactions: readonly Transaction[],
	doc: Node,
	schema: Schema,
): Map<number, Node> {
	const { bulletList, orderedList } = schema.nodes;
	const listTypes = [bulletList, orderedList].filter(Boolean);
	if (listTypes.length === 0) {
		return new Map();
	}

	const result = new Map<number, Node>();

	for (const tr of transactions) {
		for (const step of tr.steps) {
			// ReplaceStep and ReplaceAroundStep both have from/to — other step types are skipped.
			if (!(step instanceof ReplaceStep) && !(step instanceof ReplaceAroundStep)) {
				continue;
			}
			// Check both the start and end of each changed range, mapped to post-paste positions.
			for (const rawPos of [step.from, step.to]) {
				const mappedPos = Math.min(tr.mapping.map(rawPos), doc.content.size - 1);
				const $pos = doc.resolve(mappedPos);
				const ancestor = findParentNodeOfTypeClosestToPos($pos, listTypes);
				if (ancestor) {
					result.set(ancestor.pos, ancestor.node);
				}
			}
		}
	}

	return result;
}

interface ApplyListNormalisationFixesOptions {
	doc: Node;
	schema: Schema;
	tr: Transaction;
	transactions: readonly Transaction[];
}

/**
 * Applies list normalisation fixes to the given transaction for all affected list subtrees.
 * Processes nodes in reverse document order so that position offsets from insertions/joins
 * do not affect earlier positions.
 *
 * When platform_editor_flexible_list_indentation is off: inserts an empty paragraph before any listItem whose
 * first child is a list node, and merges adjacent same-type list nodes within a listItem.
 * When platform_editor_flexible_list_indentation is on: only merges adjacent same-type list nodes.
 */
export function applyListNormalisationFixes({
	tr,
	transactions,
	doc,
	schema,
}: ApplyListNormalisationFixesOptions): Transaction {
	const affectedLists = getAffectedListsFromTransactions(transactions, doc, schema);
	if (affectedLists.size === 0) {
		return tr;
	}

	const { listItem, paragraph } = schema.nodes;
	if (!listItem) {
		return tr;
	}

	// Process lists in reverse position order so fixes at higher positions
	// don't shift the positions of fixes at lower positions.
	const sortedEntries = [...affectedLists.entries()].sort(([posA], [posB]) => posB - posA);

	for (const [listPos, listNode] of sortedEntries) {
		// Collect listItem positions in document order, then process in reverse so that
		// fixes at higher positions don't shift positions of fixes at lower positions.
		const listItemPositions: number[] = [];
		listNode.descendants((node, offsetPos) => {
			if (node.type === listItem) {
				listItemPositions.push(listPos + 1 + offsetPos);
				return false; // Don't descend — inner listItems are handled via their own ancestor list
			}
			return true;
		});

		for (let i = listItemPositions.length - 1; i >= 0; i--) {
			const mappedPos = tr.mapping.map(listItemPositions[i]);
			const node = tr.doc.nodeAt(mappedPos);
			if (!node || node.type !== listItem) {
				continue;
			}

			// Merge adjacent same-type list nodes (highest boundary first within the listItem).
			for (let j = node.childCount - 1; j > 0; j--) {
				const child = node.child(j);
				const prevChild = node.child(j - 1);
				if (isListNode(child) && child.type === prevChild.type) {
					let offset = 1; // +1 for listItem opening token
					for (let k = 0; k < j; k++) {
						offset += node.child(k).nodeSize;
					}
					try {
						tr.join(mappedPos + offset);
					} catch (e) {
						// join may fail if position is invalid after earlier transforms — skip
						// eslint-disable-next-line no-console
						console.warn(
							'[editor-plugin-list] applyListNormalisationFixes: unexpected join failure',
							e,
						);
					}
				}
			}

			// Insert empty paragraph before list-first listItems when _indentation is off.
			if (
				paragraph &&
				!expValEquals('platform_editor_flexible_list_indentation', 'isEnabled', true)
			) {
				const currentNode = tr.doc.nodeAt(mappedPos);
				if (currentNode && currentNode.firstChild && currentNode.firstChild.type !== paragraph) {
					const emptyParagraph = paragraph.createAndFill();
					if (emptyParagraph) {
						tr.insert(mappedPos + 1, emptyParagraph);
					}
				}
			}
		}
	}

	return tr;
}
