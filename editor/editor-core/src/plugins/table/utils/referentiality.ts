import { EditorState } from 'prosemirror-state';

export const isReferencedSource = (state: EditorState, localId: string) => {
  let found = false;

  state.doc.descendants((node) => {
    if (found) {
      return false;
    }

    const dataConsumer = node.marks.find(
      (mark) => mark.type === state.schema.marks.dataConsumer,
    );

    if (!dataConsumer) {
      return true;
    }

    found = (dataConsumer.attrs.sources || []).includes(localId);
    return !found;
  });

  return found;
};
