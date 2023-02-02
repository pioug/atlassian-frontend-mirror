import { NodeSelection, TextSelection } from 'prosemirror-state';
import type { ResolvedPos, Node as PMNode } from 'prosemirror-model';
import type { EditorView } from 'prosemirror-view';

function findEmptySelectableParentNodePosition(
  $pos: ResolvedPos,
  isValidPosition: ($pos: ResolvedPos) => boolean,
): ResolvedPos | null {
  const { doc } = $pos;

  if ($pos.pos + 1 > doc.content.size) {
    return null;
  }

  if ($pos.depth === 0) {
    if (isValidPosition($pos)) {
      return $pos;
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

  const isParentEmpty =
    maybeNode.content.size === 0 || maybeNode.textContent === '';
  return isParentEmpty && NodeSelection.isSelectable(maybeNode);
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
