import { ResolvedPos } from 'prosemirror-model';
import { EditorState, NodeSelection } from 'prosemirror-state';
import { GapCursorSelection } from '../../plugins/selection/gap-cursor/selection';

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
