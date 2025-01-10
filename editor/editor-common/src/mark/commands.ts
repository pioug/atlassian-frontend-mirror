import type { Mark, MarkType, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
// eslint-disable-next-line no-duplicate-imports
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { fg } from '@atlaskit/platform-feature-flags';

import type { EditorCommand } from '../types';

const SMART_TO_ASCII: { [char: string]: string } = {
	'…': '...',
	'→': '->',
	'←': '<-',
	'–': '--',
	'“': '"',
	'”': '"',
	'‘': "'",
	'’': "'",
};

// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const FIND_SMART_CHAR = new RegExp(`[${Object.keys(SMART_TO_ASCII).join('')}]`, 'g');

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/max-params
export function filterChildrenBetween(
	doc: PMNode,
	from: number,
	to: number,
	predicate: (node: PMNode, pos: number, parent: PMNode | null) => boolean | undefined,
) {
	const results = [] as { node: PMNode; pos: number }[];
	doc.nodesBetween(from, to, (node, pos, parent) => {
		if (predicate(node, pos, parent)) {
			results.push({ node, pos });
		}
	});
	return results;
}

export function transformNonTextNodesToText(from: number, to: number, tr: Transaction) {
	const { doc } = tr;
	const { schema } = doc.type;
	const {
		mention: mentionNodeType,
		text: textNodeType,
		emoji: emojiNodeType,
		inlineCard: inlineCardNodeType,
	} = schema.nodes;

	const nodesToChange: { node: PMNode; pos: number }[] = [];
	doc.nodesBetween(from, to, (node, pos, parent) => {
		if ([mentionNodeType, textNodeType, emojiNodeType, inlineCardNodeType].includes(node.type)) {
			nodesToChange.push({ node, pos });
		}
	});

	nodesToChange.forEach(({ node, pos }) => {
		if (node.type !== textNodeType) {
			const newText =
				node.attrs.url || // url for inlineCard
				node.attrs.text ||
				`${node.type.name} text missing`; // fallback for missing text

			const currentPos = tr.mapping.map(pos);

			tr.replaceWith(currentPos, currentPos + node.nodeSize, schema.text(newText, node.marks));
		} else if (node.text) {
			// Find a valid start and end position because the text may be partially selected.
			const startPositionInSelection = Math.max(pos, from);
			const endPositionInSelection = Math.min(pos + node.nodeSize, to);

			const textForReplacing = doc.textBetween(startPositionInSelection, endPositionInSelection);

			const newText = textForReplacing.replace(
				FIND_SMART_CHAR,
				(match) => SMART_TO_ASCII[match] ?? match,
			);

			const currentStartPos = tr.mapping.map(startPositionInSelection);
			const currentEndPos = tr.mapping.map(endPositionInSelection);

			tr.replaceWith(currentStartPos, currentEndPos, schema.text(newText, node.marks));
		}
	});
}

export const applyMarkOnRange = (
	from: number,
	to: number,
	removeMark: boolean,
	mark: Mark,
	tr: Transaction,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
) => {
	const { schema } = tr.doc.type;
	const { code } = schema.marks;
	if (mark.type === code) {
		transformNonTextNodesToText(from, to, tr);
	}

	tr.doc.nodesBetween(tr.mapping.map(from), tr.mapping.map(to), (node, pos) => {
		if (fg('editor_inline_comments_on_inline_nodes')) {
			if (!node.isText) {
				const isAllowedInlineNode = ['emoji', 'status', 'date', 'mention', 'inlineCard'].includes(
					node.type.name,
				);
				if (!isAllowedInlineNode) {
					return true;
				}
			}
		} else {
			if (!node.isText) {
				return true;
			}
		}

		// This is an issue when the user selects some text.
		// We need to check if the current node position is less than the range selection from.
		// If it’s true, that means we should apply the mark using the range selection,
		// not the current node position.
		const nodeBetweenFrom = Math.max(pos, tr.mapping.map(from));
		const nodeBetweenTo = Math.min(pos + node.nodeSize, tr.mapping.map(to));

		if (removeMark) {
			tr.removeMark(nodeBetweenFrom, nodeBetweenTo, mark);
		} else {
			tr.addMark(nodeBetweenFrom, nodeBetweenTo, mark);
		}

		return true;
	});

	return tr;
};

export const entireSelectionContainsMark = (
	mark: Mark | MarkType,
	doc: PMNode,
	fromPos: number,
	toPos: number,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
) => {
	let onlyContainsMark = true;

	doc.nodesBetween(fromPos, toPos, (node) => {
		// Skip recursion once we've found text which doesn't include the mark
		if (!onlyContainsMark) {
			return false;
		}
		if (node.isText) {
			onlyContainsMark && (onlyContainsMark = !!mark?.isInSet(node.marks));
		}
	});
	return onlyContainsMark;
};

const toggleMarkInRange =
	(mark: Mark): EditorCommand =>
	({ tr }) => {
		if (tr.selection instanceof CellSelection) {
			let removeMark = true;
			const cells: { node: PMNode; pos: number }[] = [];
			tr.selection.forEachCell((cell, cellPos) => {
				cells.push({ node: cell, pos: cellPos });
				const from = cellPos;
				const to = cellPos + cell.nodeSize;

				removeMark && (removeMark = entireSelectionContainsMark(mark, tr.doc, from, to));
			});

			for (let i = cells.length - 1; i >= 0; i--) {
				const cell = cells[i];
				const from = cell.pos;
				const to = from + cell.node.nodeSize;

				applyMarkOnRange(from, to, removeMark, mark, tr);
			}
		} else {
			const { $from, $to } = tr.selection;
			// We decide to remove the mark only if the entire selection contains the mark
			// Examples with *bold* text
			// Scenario 1: Selection contains both bold and non-bold text -> bold entire selection
			// Scenario 2: Selection contains only bold text -> un-bold entire selection
			// Scenario 3: Selection contains no bold text -> bold entire selection
			const removeMark = entireSelectionContainsMark(mark, tr.doc, $from.pos, $to.pos);

			applyMarkOnRange($from.pos, $to.pos, removeMark, mark, tr);
		}

		if (tr.docChanged) {
			return tr;
		}

		return null;
	};

/**
 * A custom version of the ProseMirror toggleMark, where we only toggle marks
 * on text nodes in the selection rather than all inline nodes.
 * @param markType
 * @param attrs
 */
export const toggleMark =
	(
		markType: MarkType,
		attrs?: // Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		{ [key: string]: any },
	): EditorCommand =>
	({ tr }) => {
		const mark = markType.create(attrs);

		// For cursor selections we can use the default behaviour.
		if (tr.selection instanceof TextSelection && tr.selection.$cursor) {
			if (mark.isInSet(tr.storedMarks || tr.selection.$cursor.marks())) {
				tr.removeStoredMark(mark);
			} else {
				tr.addStoredMark(mark);
			}

			return tr;
		}

		return toggleMarkInRange(mark)({ tr });
	};

/**
 * A wrapper around ProseMirror removeMark and removeStoredMark, which handles mark removal in text, CellSelections and cursor stored marks.
 */
export const removeMark =
	(mark: MarkType | Mark): EditorCommand =>
	({ tr }) => {
		const { selection } = tr;

		if (selection instanceof CellSelection) {
			selection.forEachCell((cell, cellPos) => {
				const from = cellPos;
				const to = cellPos + cell.nodeSize;
				tr.removeMark(from, to, mark);
			});
		} else if (selection instanceof TextSelection && selection.$cursor) {
			tr.removeStoredMark(mark);
		} else {
			const { from, to } = selection;
			tr.removeMark(from, to, mark);
		}

		return tr;
	};
