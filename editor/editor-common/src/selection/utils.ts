import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';

import { GapCursorSelection } from './gap-cursor/selection';

export const isSelectionAtStartOfNode = (
	$pos: ResolvedPos,
	parentNode?: ContentNodeWithPos,
): boolean => {
	if (!parentNode) {
		return false;
	}

	for (let i = $pos.depth + 1; i > 0; i--) {
		const node = $pos.node(i);
		if (node && node.eq(parentNode.node)) {
			break;
		}

		if (i > 1 && $pos.before(i) !== $pos.before(i - 1) + 1) {
			return false;
		}
	}

	return true;
};

export const isSelectionAtEndOfNode = (
	$pos: ResolvedPos,
	parentNode?: ContentNodeWithPos,
): boolean => {
	if (!parentNode) {
		return false;
	}

	for (let i = $pos.depth + 1; i > 0; i--) {
		const node = $pos.node(i);
		if (node && node.eq(parentNode.node)) {
			break;
		}

		if (i > 1 && $pos.after(i) !== $pos.after(i - 1) - 1) {
			return false;
		}
	}

	return true;
};

export function atTheEndOfDoc(state: EditorState): boolean {
	const { selection, doc } = state;
	return doc.nodeSize - selection.$to.pos - 2 === selection.$to.depth;
}

export function atTheBeginningOfDoc(state: EditorState): boolean {
	const { selection } = state;
	return selection.$from.pos === selection.$from.depth;
}

export function atTheEndOfBlock(state: EditorState): boolean {
	const { selection } = state;
	const { $to } = selection;
	if (selection instanceof GapCursorSelection) {
		return false;
	}
	if (selection instanceof NodeSelection && selection.node.isBlock) {
		return true;
	}
	return endPositionOfParent($to) === $to.pos + 1;
}

export function atTheBeginningOfBlock(state: EditorState): boolean {
	const { selection } = state;
	const { $from } = selection;
	if (selection instanceof GapCursorSelection) {
		return false;
	}
	if (selection instanceof NodeSelection && selection.node.isBlock) {
		return true;
	}
	return startPositionOfParent($from) === $from.pos;
}

export function startPositionOfParent(resolvedPos: ResolvedPos): number {
	return resolvedPos.start(resolvedPos.depth);
}

export function endPositionOfParent(resolvedPos: ResolvedPos): number {
	return resolvedPos.end(resolvedPos.depth) + 1;
}

export const expandSelectionBounds = (
	$anchor: ResolvedPos,
	$head: ResolvedPos,
): { $anchor: ResolvedPos; $head: ResolvedPos } => {
	const $from = $anchor.min($head);
	const $to = $anchor.max($head);
	const fromDepth = $from.depth;
	const toDepth = $to.depth;
	let selectionStart = fromDepth ? $from.before() : $from.pos;
	let selectionEnd = toDepth ? $to.after() : $to.pos;
	const selectionHasGrandparent = toDepth > 1 && fromDepth > 1;
	const selectionIsAcrossDiffParents =
		selectionHasGrandparent && !$to.parent.isTextblock && !$to.sameParent($from);
	const selectionIsAcrossTextBlocksWithDiffParents =
		selectionHasGrandparent &&
		$to.parent.isTextblock &&
		$to.before(toDepth - 1) !== $from.before(fromDepth - 1);

	if (toDepth > fromDepth) {
		// expand end of selection to after the last node
		selectionEnd = fromDepth ? $to.after(fromDepth) : $to.after(1);
	} else if (toDepth < fromDepth) {
		// expand start of selection to before the current node
		selectionStart = toDepth ? $from.before(toDepth) : $from.before(1);
	} else if (selectionIsAcrossDiffParents || selectionIsAcrossTextBlocksWithDiffParents) {
		// when selection from/to share same depth with different parents, hoist up the selection to the parent of the highest depth in the selection
		selectionStart = $from.before(fromDepth - 1);
		selectionEnd = $to.after(toDepth - 1);
	} else if (!$from.node().inlineContent) {
		// when selection might be a Node selection, return what was passed in
		return { $anchor, $head };
	}

	const $expandedFrom = $anchor.doc.resolve(selectionStart);
	const $expandedTo = $anchor.doc.resolve(selectionEnd);

	return {
		$anchor: $anchor === $from ? $expandedFrom : $expandedTo,
		$head: $head === $to ? $expandedTo : $expandedFrom,
	};
};
