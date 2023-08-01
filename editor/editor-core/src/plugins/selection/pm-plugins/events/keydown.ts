import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type {
  ResolvedPos,
  Node as PMNode,
} from '@atlaskit/editor-prosemirror/model';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';

const isCollpasedExpand = (node: PMNode | null | undefined): boolean => {
  return Boolean(
    node &&
      ['expand', 'nestedExpand'].includes(node.type.name) &&
      !node.attrs.__expanded,
  );
};

const findFixedProblematicNodePosition = (
  $pos: ResolvedPos,
  direction: 'down' | 'up',
): ResolvedPos | null => {
  if ($pos.pos === 0 || $pos.depth === 0) {
    return null;
  }
  const pos = direction === 'up' ? $pos.before() : $pos.after();
  const $posResolved = $pos.doc.resolve(pos);
  const maybeExpandNode =
    direction === 'up' ? $posResolved.nodeBefore : $posResolved.nodeAfter;

  if (maybeExpandNode && isCollpasedExpand(maybeExpandNode)) {
    const nodeSize = maybeExpandNode.nodeSize;
    const expandPosition = direction === 'up' ? pos - nodeSize : pos + nodeSize;
    const startPosNode = Math.max(expandPosition, 0);
    const $startPosNode = $pos.doc.resolve(
      Math.min(startPosNode, $pos.doc.content.size),
    );
    return $startPosNode;
  }

  return null;
};

export const onKeydown = (view: EditorView, event: Event): boolean => {
  /*
   * This workaround is needed for some specific situation with collapsed expand.
   *
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
  if (!(event instanceof KeyboardEvent)) {
    return false;
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
    $head,
    direction,
  );

  if ($fixedProblematicNodePosition) {
    const forcedTextSelection = TextSelection.create(
      view.state.doc,
      $anchor.pos,
      $fixedProblematicNodePosition.pos,
    );

    const tr = view.state.tr;

    tr.setSelection(forcedTextSelection);

    view.dispatch(tr);

    event.preventDefault();

    return true;
  }

  return false;
};
