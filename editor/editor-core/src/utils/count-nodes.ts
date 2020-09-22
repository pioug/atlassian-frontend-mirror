import { EditorState } from 'prosemirror-state';

type NodeCount = Record<string, number>;

export function countNodes(state: EditorState): NodeCount {
  const nodes: NodeCount = {};

  state.doc.descendants(node => {
    if (node.type.name in nodes) {
      nodes[node.type.name]++;
    } else {
      nodes[node.type.name] = 1;
    }
    return true;
  });

  return nodes;
}
