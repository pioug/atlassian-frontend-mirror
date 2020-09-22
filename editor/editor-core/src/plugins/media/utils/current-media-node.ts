import { Node as PMNode } from 'prosemirror-model';
import { EditorState, NodeSelection } from 'prosemirror-state';

export const currentMediaNode = (
  editorState: EditorState,
): PMNode | undefined => {
  const { doc, selection, schema } = editorState;

  if (
    !doc ||
    !selection ||
    !(selection instanceof NodeSelection) ||
    selection.node.type !== schema.nodes.mediaSingle
  ) {
    return;
  }

  const node = doc.nodeAt(selection.$anchor.pos + 1);

  if (!node || node.type !== schema.nodes.media) {
    return;
  }

  return node;
};
