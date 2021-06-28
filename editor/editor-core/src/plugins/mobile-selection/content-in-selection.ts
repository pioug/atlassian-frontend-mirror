import { EditorState } from 'prosemirror-state';

// Gets a plain text representation of the nodes in the current selection
export const contentInSelection = ({
  selection,
  doc,
}: EditorState): {
  nodeTypes: string[];
  markTypes: string[];
} => {
  const nodes = new Set<string>();
  const marks = new Set<string>();

  doc.nodesBetween(selection.from, selection.to, (node) => {
    nodes.add(node.type.name);
    node.marks.forEach((mark) => marks.add(mark.type.name));
    return true;
  });

  return {
    nodeTypes: Array.from(nodes),
    markTypes: Array.from(marks),
  };
};
