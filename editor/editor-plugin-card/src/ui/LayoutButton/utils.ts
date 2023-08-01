import { findSelectedNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { EditorView } from '@atlaskit/editor-prosemirror/view';

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
