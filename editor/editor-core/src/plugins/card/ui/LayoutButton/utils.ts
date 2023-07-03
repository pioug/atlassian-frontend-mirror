import { EditorView } from 'prosemirror-view';
import { findSelectedNodeOfType } from 'prosemirror-utils';

export const getDatasource = (editorView: EditorView) => {
  const { selection, schema } = editorView.state;
  const { blockCard } = schema.nodes;
  return (
    findSelectedNodeOfType([blockCard])(selection) ?? {
      node: undefined,
      pos: undefined,
    }
  );
};
