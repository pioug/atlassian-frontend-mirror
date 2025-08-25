import type { Mark, MarkType, Node, NodeType, Slice } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Selection, Transaction } from '@atlaskit/editor-prosemirror/state';
import { AllSelection, NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { Step } from '@atlaskit/editor-prosemirror/transform';
import { ReplaceAroundStep, ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import { hasParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';

import { closest } from './dom';

/**
 * Checks if node is an empty paragraph.
 */
export function isEmptyParagraph(node?: Node | null): boolean {
	return !!node && node.type.name === 'paragraph' && !node.childCount;
}

export const stepHasSlice = (
	step: Step,
): step is Step & { from: number; slice: Slice; to: number } =>
	step && step.hasOwnProperty('slice');

/**
 * Checks whether a given step is adding nodes of given nodeTypes
 *
 * @param step Step to check
 * @param nodeTypes NodeTypes being added
 */
export function stepAddsOneOf(step: Step, nodeTypes: Set<NodeType>): boolean {
	let adds = false;

	if (!stepHasSlice(step)) {
		return adds;
	}

	step.slice.content.descendants((node) => {
		if (nodeTypes.has(node.type)) {
			adds = true;
		}
		return !adds;
	});

	return adds;
}

export const extractSliceFromStep = (step: Step): Slice | null => {
	if (!(step instanceof ReplaceStep) && !(step instanceof ReplaceAroundStep)) {
		return null;
	}

	// @ts-ignore This is by design. Slice is a private property, but accesible, from ReplaceStep.
	// However, we need to read it to found if the step was adding a newline
	const slice = step.slice;

	return slice as Slice;
};

export const isTextSelection = (selection: Selection): selection is TextSelection =>
	selection instanceof TextSelection;

export const isElementInTableCell = (element: HTMLElement | null): HTMLElement | null => {
	return closest(element, 'td, th');
};

export const isLastItemMediaGroup = (node: Node): boolean => {
	const { content } = node;
	return !!content.lastChild && content.lastChild.type.name === 'mediaGroup';
};

export const setNodeSelection = (view: EditorView, pos: number) => {
	const { state, dispatch } = view;

	if (!isFinite(pos)) {
		return;
	}

	const tr = state.tr.setSelection(NodeSelection.create(state.doc, pos));
	dispatch(tr);
};

export function setTextSelection(view: EditorView, anchor: number, head?: number) {
	const { state, dispatch } = view;
	const tr = state.tr.setSelection(TextSelection.create(state.doc, anchor, head));
	dispatch(tr);
}

export function setAllSelection(view: EditorView) {
	const { state, dispatch } = view;
	const tr = state.tr.setSelection(new AllSelection(view.state.doc));
	dispatch(tr);
}

export function setCellSelection(view: EditorView, anchor: number, head?: number) {
	const { state, dispatch } = view;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	dispatch(state.tr.setSelection(CellSelection.create(state.doc, anchor, head) as any));
}

export function nonNullable<T>(value: T): value is NonNullable<T> {
	return value !== null && value !== undefined;
}

// checks if the given position is within the ProseMirror document
export const isValidPosition = (pos: number | undefined, state: EditorState): boolean => {
	if (typeof pos !== 'number') {
		return false;
	}

	if (pos >= 0 && pos <= state.doc.resolve(0).end()) {
		return true;
	}

	return false;
};

export const isInLayoutColumn = (state: EditorState): boolean => {
	return hasParentNodeOfType(state.schema.nodes.layoutSection)(state.selection);
};

export function filterChildrenBetween(
	doc: Node,
	from: number,
	to: number,
	predicate: (node: Node, pos: number, parent: Node | null) => boolean | undefined,
) {
	const results = [] as { node: Node; pos: number }[];
	doc.nodesBetween(from, to, (node, pos, parent) => {
		if (predicate(node, pos, parent)) {
			results.push({ node, pos });
		}
	});
	return results;
}

export const removeBlockMarks = (
	state: EditorState,
	marks: Array<MarkType | undefined>,
): Transaction | undefined => {
	const { selection, schema } = state;
	let { tr } = state;

	// Marks might not exist in Schema
	const marksToRemove = marks.filter(Boolean);
	if (marksToRemove.length === 0) {
		return undefined;
	}

	/** Saves an extra dispatch */
	let blockMarksExists = false;

	const hasMark = (mark: Mark) => marksToRemove.indexOf(mark.type) > -1;
	/**
	 * When you need to toggle the selection
	 * when another type which does not allow alignment is applied
	 */
	state.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
		if (node.type === schema.nodes.paragraph && node.marks.some(hasMark)) {
			blockMarksExists = true;
			const resolvedPos = state.doc.resolve(pos);
			const withoutBlockMarks = node.marks.filter(not(hasMark));
			tr = tr.setNodeMarkup(resolvedPos.pos, undefined, node.attrs, withoutBlockMarks);
		}
	});
	return blockMarksExists ? tr : undefined;
};

const not =
	<T>(fn: (args: T) => boolean) =>
	(arg: T) =>
		!fn(arg);
