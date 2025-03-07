import type { ResolvedPos, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';

import { GapCursorSelection } from './gap-cursor/selection';

export const isSelectionAtStartOfNode = ($pos: ResolvedPos, parentNode?: PMNode): boolean => {
	if (!parentNode) {
		return false;
	}

	for (let i = $pos.depth + 1; i > 0; i--) {
		const node = $pos.node(i);
		if (node && node.eq(parentNode)) {
			break;
		}

		if (i > 1 && $pos.before(i) !== $pos.before(i - 1) + 1) {
			return false;
		}
	}

	return true;
};

export const isSelectionAtEndOfNode = ($pos: ResolvedPos, parentNode?: PMNode): boolean => {
	if (!parentNode) {
		return false;
	}

	for (let i = $pos.depth + 1; i > 0; i--) {
		const node = $pos.node(i);
		if (node && node.eq(parentNode)) {
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

/**
 *
 * @param $anchor Resolved selection anchor position
 * @param $head Resolved selection head position
 * @returns An expanded selection encompassing surrounding nodes. Hoists up to the shared depth anchor/head depths differ.
 */
export const expandSelectionBounds = (
	$anchor: ResolvedPos,
	$head: ResolvedPos,
): { $anchor: ResolvedPos; $head: ResolvedPos } => {
	const sharedDepth = $anchor.sharedDepth($head.pos) + 1;
	const $from = $anchor.min($head);
	const $to = $anchor.max($head);
	const fromDepth = $from.depth;
	const toDepth = $to.depth;

	let selectionStart: number;
	let selectionEnd: number;

	const selectionHasGrandparent = toDepth > 1 && fromDepth > 1;
	const selectionIsAcrossDiffParents =
		selectionHasGrandparent && !$to.parent.isTextblock && !$to.sameParent($from);
	const selectionIsAcrossTextBlocksWithDiffParents =
		selectionHasGrandparent &&
		$to.parent.isTextblock &&
		$to.before(toDepth - 1) !== $from.before(fromDepth - 1);

	if (toDepth > fromDepth) {
		if (fg('platform_editor_elements_dnd_multi_select_patch_1')) {
			selectionStart = $from.before(sharedDepth);
			selectionEnd = $to.after(sharedDepth);
		} else {
			selectionStart = fromDepth ? $from.before() : $from.pos;
			selectionEnd = fromDepth ? $to.after(fromDepth) : $to.after(1);
		}
	} else if (toDepth < fromDepth) {
		if (fg('platform_editor_elements_dnd_multi_select_patch_1')) {
			selectionStart = $from.before(sharedDepth);
			selectionEnd = $to.after(sharedDepth);
		} else {
			selectionStart = toDepth ? $from.before(toDepth) : $from.before(1);
			selectionEnd = toDepth ? $to.after() : $to.pos;
		}
	} else if (selectionIsAcrossDiffParents || selectionIsAcrossTextBlocksWithDiffParents) {
		// when selection from/to share same depth with different parents, hoist up the selection to the parent of the highest depth in the selection
		if (fg('platform_editor_elements_dnd_multi_select_patch_1')) {
			selectionStart = $from.before(sharedDepth);
			selectionEnd = $to.after(sharedDepth);
		} else {
			selectionStart = $from.before(fromDepth - 1);
			selectionEnd = $to.after(toDepth - 1);
		}
	} else if (!$from.node().inlineContent) {
		// when selection might be a Node selection, return what was passed in
		return { $anchor, $head };
	} else {
		selectionStart = fromDepth ? $from.before() : $from.pos;
		selectionEnd = toDepth ? $to.after() : $to.pos;
	}

	const $expandedFrom = $anchor.doc.resolve(selectionStart);
	const $expandedTo = $anchor.doc.resolve(selectionEnd);

	return {
		$anchor: $anchor === $from ? $expandedFrom : $expandedTo,
		$head: $head === $to ? $expandedTo : $expandedFrom,
	};
};
