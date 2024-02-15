import type { EditorState } from '@atlaskit/editor-prosemirror/state';

// Gets a plain text representation of the nodes in the current selection
export const contentInSelection = ({
  selection,
  doc,
}: EditorState): {
  nodeTypes: string[];
  markTypes: string[];
} => {
  const nodes = new Array<string>();
  const marks = new Array<string>();

  doc.nodesBetween(selection.from, selection.to, (node) => {
    nodes.push(node.type.name);
    node.marks.forEach((mark) => marks.push(mark.type.name));
    return true;
  });

  return {
    nodeTypes: Array.from(nodes),
    markTypes: Array.from(marks),
  };
};
