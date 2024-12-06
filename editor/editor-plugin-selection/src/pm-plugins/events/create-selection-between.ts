import type { Node as PMNode, ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

const DOC_START_POS = 0;

function isNodeContentEmpty(maybeNode?: PMNode): boolean {
	return maybeNode?.content.size === 0 || maybeNode?.textContent === '';
}

function findEmptySelectableParentNodePosition($pos: ResolvedPos): ResolvedPos | null {
	const { doc } = $pos;

	if ($pos.pos > doc.content.size) {
		return null;
	}

	if (isCurrentNodeAtomOrEmptySelectable($pos)) {
		return $pos;
	}

	if ($pos.nodeBefore !== null) {
		return null;
	}

	if ($pos.depth === 0 && $pos.pos === 0) {
		return $pos;
	}

	const positionLevelUp = $pos.before();
	const resolvedPositionLevelUp = doc.resolve(positionLevelUp);

	return findEmptySelectableParentNodePosition(resolvedPositionLevelUp);
}

const isCurrentNodeAtomOrEmptySelectable = ($pos: ResolvedPos): boolean => {
	//ED-20209: Using $resolvedJustBeforeNodePos so that $resolvedJustBeforeNodePos.nodeAfter return the node at $pos.pos even if that is an atomic node
	if ($pos.pos === DOC_START_POS) {
		return false;
	}

	const justBeforeNodePos = $pos.pos - 1;

	const $resolvedjustBeforePos = $pos.doc.resolve(justBeforeNodePos);
	const maybeNode = $resolvedjustBeforePos.nodeAfter;

	if (!maybeNode || !maybeNode.isBlock) {
		return false;
	}

	if (maybeNode.isAtom) {
		return true;
	}

	return isNodeContentEmpty(maybeNode) && NodeSelection.isSelectable(maybeNode);
};

function findNextSelectionPosition({
	$targetHead,
	$anchor,
	doc,
}: {
	$targetHead: ResolvedPos;
	$anchor: ResolvedPos;
	doc: PMNode;
}): ResolvedPos | null {
	const direction = $anchor.pos < $targetHead.pos ? 'down' : 'up';

	//ED-20209: If the targetHead position is just before some node, Then return $targetHead and not select any node.
	let maybeNode = null;

	if (fg('platform_editor_fix_drag_and_drop_lists')) {
		// prosemirror calls 'createSelectionBetween' for native 'drop' events, it passes $anchor
		// and $head which are based on a transformed document, but only provides the original
		// doc. Need to remap the $head pos to last element in doc to avoid RangeErrors.
		if ($targetHead.pos >= doc.nodeSize) {
			maybeNode = doc.resolve(doc.nodeSize - 2).nodeBefore;
		} else if ($targetHead.pos !== DOC_START_POS) {
			const justBeforeHeadPos = $targetHead.pos - 1;
			const $resolvedJustBeforeHeadPos = doc.resolve(justBeforeHeadPos);
			maybeNode = $resolvedJustBeforeHeadPos.nodeAfter;
		}
	} else {
		if ($targetHead.pos !== DOC_START_POS) {
			const justBeforeHeadPos = $targetHead.pos - 1;
			const $resolvedJustBeforeHeadPos = doc.resolve(justBeforeHeadPos);
			maybeNode = $resolvedJustBeforeHeadPos.nodeAfter;
		}
	}

	if (maybeNode === null) {
		maybeNode = $targetHead.nodeAfter;
		if (maybeNode !== null) {
			$targetHead = doc.resolve($targetHead.pos + 1);
		} else {
			return null;
		}
	}

	const maybeNextPosition = findEmptySelectableParentNodePosition($targetHead);

	if (maybeNextPosition) {
		const justBeforeMaybeNextPos = maybeNextPosition.pos - 1;
		if (direction === 'up') {
			return doc.resolve(Math.max(justBeforeMaybeNextPos, 0));
		} else {
			const maybeNextNode = doc.resolve(justBeforeMaybeNextPos).nodeAfter;
			if (maybeNextNode) {
				return doc.resolve(
					Math.min(justBeforeMaybeNextPos + maybeNextNode.nodeSize, doc.content.size),
				);
			}
		}
	}

	return null;
}

export const onCreateSelectionBetween = (
	view: EditorView,
	$anchor: ResolvedPos,
	$head: ResolvedPos,
): TextSelection | null => {
	if ($anchor.pos === $head.pos) {
		return null;
	}

	if ($anchor.depth === $head.depth && $anchor.sameParent($head)) {
		return null;
	}

	// If the head is targeting a paragraph on root, then let ProseMirror handle the text selection
	if ($head.depth === 1 && $head.parent?.type.name === 'paragraph') {
		return null;
	}

	// If head is at the beginning of a non-empty textblock, let ProseMirror handle the text selection
	if ($head.parent?.isTextblock && !isNodeContentEmpty($head.parent) && $head.parentOffset === 0) {
		return null;
	}

	const $nextHeadPosition = findNextSelectionPosition({
		$targetHead: $head,
		$anchor,
		doc: view.state.doc,
	});

	if (!$nextHeadPosition) {
		return null;
	}

	const forcedTextSelection = TextSelection.create(
		view.state.doc,
		$anchor.pos,
		$nextHeadPosition.pos,
	);

	return forcedTextSelection;
};
