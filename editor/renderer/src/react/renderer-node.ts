import type { Node, Schema } from '@atlaskit/editor-prosemirror/model';

export const isLayoutNode = (node: Node) => node.type.name === 'layoutSection';

export const hasBreakOutMark = (node: Node) =>
  node.marks.some((m) => m.type.name === 'breakout');

export const insideBreakoutLayout = (path: Node[]) =>
  path.some((item) => isLayoutNode(item) && hasBreakOutMark(item));

export const insideBlockNode = (path: Node[], schema: Schema) => {
  const {
    nodes: { expand, nestedExpand, layoutColumn },
  } = schema;
  const blockNodeNames = [expand, nestedExpand, layoutColumn]
    .filter((node) => Boolean(node))
    .map((node) => node.name);

  return (
    path && path.some((n) => n.type && blockNodeNames.indexOf(n.type.name) > -1)
  );
};

export const insideMultiBodiedExtension = (path: Node[], schema: Schema) => {
  const {
    nodes: { multiBodiedExtension },
  } = schema;
  return path.some((n) => n.type === multiBodiedExtension);
};
