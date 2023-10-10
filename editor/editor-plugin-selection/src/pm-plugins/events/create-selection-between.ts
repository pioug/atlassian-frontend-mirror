import type {
  Node as PMNode,
  ResolvedPos,
} from '@atlaskit/editor-prosemirror/model';
import {
  NodeSelection,
  TextSelection,
} from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

function isNodeContentEmpty(maybeNode?: PMNode): boolean {
  return maybeNode?.content.size === 0 || maybeNode?.textContent === '';
}

function findEmptySelectableParentNodePosition(
  $pos: ResolvedPos,
  isValidPosition: ($pos: ResolvedPos) => boolean,
): ResolvedPos | null {
  const { doc } = $pos;

  if ($pos.pos + 1 > doc.content.size) {
    return null;
  }

  if ($pos.nodeBefore !== null) {
    if (isValidPosition($pos)) {
      return $pos;
    }

    // We can not use `$pos.before()` because ProseMirror throws an error when depth is zero.
    const currentPosIndex = $pos.index();
    if (currentPosIndex === 0) {
      return null;
    }
    const previousIndex = currentPosIndex - 1;
    const $previousPos = $pos.doc.resolve($pos.posAtIndex(previousIndex));
    if (isValidPosition($previousPos)) {
      return $previousPos;
    }

    return null;
  }

  if (isValidPosition($pos)) {
    return $pos;
  }

  const positionLevelUp = $pos.before();
  const resolvedPositionLevelUp = doc.resolve(positionLevelUp);

  return findEmptySelectableParentNodePosition(
    resolvedPositionLevelUp,
    isValidPosition,
  );
}

const checkPositionNode = ($pos: ResolvedPos): boolean => {
  const maybeNode = $pos.nodeAfter;
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

  const maybeNextPosition = findEmptySelectableParentNodePosition(
    $targetHead,
    checkPositionNode,
  );

  if (maybeNextPosition && maybeNextPosition.nodeAfter) {
    const nodeAfter = maybeNextPosition.nodeAfter;
    const pos = maybeNextPosition.pos;

    const nextPositionToSelect =
      direction === 'down'
        ? Math.min(nodeAfter.nodeSize + pos, doc.content.size)
        : Math.max(pos, 0);

    return doc.resolve(nextPositionToSelect);
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
  if (
    $head.parent?.isTextblock &&
    !isNodeContentEmpty($head.parent) &&
    $head.parentOffset === 0
  ) {
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
