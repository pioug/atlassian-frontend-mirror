import { Node } from 'prosemirror-model';

export const isLayoutNode = (node: Node) => node.type.name === 'layoutSection';

export const hasBreakOutMark = (node: Node) =>
  node.marks.some((m) => m.type.name === 'breakout');

export const insideBreakoutLayout = (path: Node[]) =>
  path.some((item) => isLayoutNode(item) && hasBreakOutMark(item));
