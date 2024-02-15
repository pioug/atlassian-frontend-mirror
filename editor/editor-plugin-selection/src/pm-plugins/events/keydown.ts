import type {
  Node as PMNode,
  ResolvedPos,
} from '@atlaskit/editor-prosemirror/model';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

/*
 * The way expand was built, no browser reconize selection on it.
 * For instance, when a selection going to a "collapsed" expand
 * the browser will try to send the cursor to inside the expand content (wrong),
 * this behavior is caused because the expand content is never true hidden
 * we just set the height to 1px.
 *
 * So, we need to capture a possible selection event
 * when a collapsed exxpand is the next node in the common depth.
 * If that is true, we create a new TextSelection and stop the event bubble
 */
const isCollpasedExpand = (node: PMNode | null | undefined): boolean => {
  return Boolean(
    node &&
      ['expand', 'nestedExpand'].includes(node.type.name) &&
      !node.attrs.__expanded,
  );
};

/**
 * ED-18072 - Cannot shift + arrow past bodied extension if it is not empty
 */
const isBodiedExtension = (node: PMNode | null | undefined): boolean => {
  return Boolean(node && ['bodiedExtension'].includes(node.type.name));
};

/**
 * ED-19861 - [Regression] keyboard selections within action items are unpredicatable
 * Table was added to the list of problematic nodes because the desired behaviour when Shift+Up from outside the
 * table is to select the table node itself, rather than the table cell content. Previously this behaviour was handled
 * in `packages/editor/editor-core/src/plugins/selection/pm-plugins/events/create-selection-between.ts` but there was
 * a bug in `create-selection-between` which after fixing the bug that code was no longer handling table selection
 * correctly, so to fix that table was added here.
 */
const isTable = (node: PMNode | null | undefined): boolean => {
  return Boolean(node && ['table'].includes(node.type.name));
};

const isProblematicNode = (node: PMNode | null | undefined): boolean => {
  return isCollpasedExpand(node) || isBodiedExtension(node) || isTable(node);
};

const findFixedProblematicNodePosition = (
  doc: PMNode,
  $head: ResolvedPos,
  direction: 'down' | 'up',
): ResolvedPos | null => {
  if ($head.pos === 0 || $head.depth === 0) {
    return null;
  }

  if (direction === 'up') {
    const pos = $head.before();
    const $posResolved = $head.doc.resolve(pos);
    const maybeProblematicNode = $posResolved.nodeBefore;

    if (maybeProblematicNode && isProblematicNode(maybeProblematicNode)) {
      const nodeSize = maybeProblematicNode.nodeSize;
      const nodeStartPosition = pos - nodeSize;

      // ($head.pos - 1) will correspond to (nodeStartPosition + nodeSize) when we are at the start of the text node
      const isAtEndOfProblematicNode =
        $head.pos - 1 === nodeStartPosition + nodeSize;
      if (isAtEndOfProblematicNode) {
        const startPosNode = Math.max(nodeStartPosition, 0);
        const $startPosNode = $head.doc.resolve(
          Math.min(startPosNode, $head.doc.content.size),
        );
        return $startPosNode;
      }
    }
  }

  if (direction === 'down') {
    const pos = $head.after();
    const maybeProblematicNode = doc.nodeAt(pos);

    if (
      maybeProblematicNode &&
      isProblematicNode(maybeProblematicNode) &&
      $head.pos + 1 === pos
    ) {
      const nodeSize = maybeProblematicNode.nodeSize;
      const nodePosition = pos + nodeSize;
      const startPosNode = Math.max(nodePosition, 0);
      const $startPosNode = $head.doc.resolve(
        Math.min(startPosNode, $head.doc.content.size),
      );
      return $startPosNode;
    }
  }

  return null;
};

const isSelectionLineShortcutWhenCursorIsInsideInlineNode = (
  view: EditorView,
  event: KeyboardEvent,
): boolean => {
  if (!event.shiftKey || !event.metaKey) {
    return false;
  }

  const selection = view.state.selection;
  if (!(selection instanceof TextSelection)) {
    return false;
  }

  if (!selection.$cursor) {
    return false;
  }

  const isSelectingInlineNodeForward =
    event.key === 'ArrowRight' &&
    Boolean(selection.$cursor.nodeAfter?.isInline);
  const isSelectingInlineNodeBackward =
    event.key === 'ArrowLeft' &&
    Boolean(selection.$cursor.nodeBefore?.isInline);

  return isSelectingInlineNodeForward || isSelectingInlineNodeBackward;
};

const isNavigatingVerticallyWhenCursorIsInsideInlineNode = (
  view: EditorView,
  event: KeyboardEvent,
): boolean => {
  if (event.shiftKey || event.metaKey) {
    return false;
  }
  const selection = view.state?.selection;
  if (!(selection instanceof TextSelection)) {
    return false;
  }

  if (!selection.$cursor) {
    return false;
  }

  const isNavigatingInlineNodeDownward =
    event.key === 'ArrowDown' &&
    Boolean(selection.$cursor.nodeBefore?.isInline) &&
    Boolean(selection.$cursor.nodeAfter?.isInline);

  return isNavigatingInlineNodeDownward;
};

export const onKeydown = (view: EditorView, event: Event): boolean => {
  /*
   * This workaround is needed for some specific situations.
   * - expand collapse
   * - bodied extension
   */
  if (!(event instanceof KeyboardEvent)) {
    return false;
  }

  if (isSelectionLineShortcutWhenCursorIsInsideInlineNode(view, event)) {
    return true;
  }

  if (isNavigatingVerticallyWhenCursorIsInsideInlineNode(view, event)) {
    return true;
  }

  if (!event.shiftKey || event.ctrlKey || event.metaKey) {
    return false;
  }

  if (
    ![
      'ArrowUp',
      'ArrowDown',
      'ArrowRight',
      'ArrowLeft',
      'Home',
      'End',
    ].includes(event.key)
  ) {
    return false;
  }

  const {
    doc,
    selection: { $head, $anchor },
  } = view.state;

  if (
    (event.key === 'ArrowRight' && $head.nodeAfter) ||
    (event.key === 'ArrowLeft' && $head.nodeBefore)
  ) {
    return false;
  }

  const direction = ['ArrowLeft', 'ArrowUp', 'Home'].includes(event.key)
    ? 'up'
    : 'down';
  const $fixedProblematicNodePosition = findFixedProblematicNodePosition(
    doc,
    $head,
    direction,
  );

  if ($fixedProblematicNodePosition) {
    // an offset is used here so that left arrow selects the first character before the node (consistent with arrow right)
    const headOffset = event.key === 'ArrowLeft' ? -1 : 0;
    const head = $fixedProblematicNodePosition.pos + headOffset;

    const forcedTextSelection = TextSelection.create(
      view.state.doc,
      $anchor.pos,
      head,
    );

    const tr = view.state.tr;

    tr.setSelection(forcedTextSelection);

    view.dispatch(tr);

    event.preventDefault();

    return true;
  }

  return false;
};
