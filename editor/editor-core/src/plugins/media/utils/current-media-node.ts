import { Node as PMNode } from 'prosemirror-model';
import { EditorState, NodeSelection } from 'prosemirror-state';
import { BorderMarkAttributes } from '@atlaskit/adf-schema';

export const currentMediaNodeWithPos = (
  editorState: EditorState,
):
  | {
      node: PMNode;
      pos: number;
    }
  | undefined => {
  const { doc, selection, schema } = editorState;

  if (
    !doc ||
    !selection ||
    !(selection instanceof NodeSelection) ||
    selection.node.type !== schema.nodes.mediaSingle
  ) {
    return;
  }

  const pos = selection.$anchor.pos + 1;

  const node = doc.nodeAt(pos);

  if (!node || node.type !== schema.nodes.media) {
    return;
  }

  return {
    node,
    pos,
  };
};

export const currentMediaNode = (
  editorState: EditorState,
): PMNode | undefined => {
  return currentMediaNodeWithPos(editorState)?.node;
};

export const currentMediaNodeBorderMark = (
  editorState: EditorState,
): BorderMarkAttributes | undefined => {
  const node = currentMediaNode(editorState);

  if (!node) {
    return;
  }

  const borderMark = node.marks.find((m) => m.type.name === 'border');

  if (!borderMark) {
    return;
  }

  return borderMark.attrs as BorderMarkAttributes;
};
