import type { EditorState } from '@atlaskit/editor-prosemirror/state';

export {
  setNodeSelection,
  setTextSelection,
  setAllSelection,
  setCellSelection,
} from '@atlaskit/editor-common/utils';

// checks if the given position is within the ProseMirror document
export const isValidPosition = (pos: number, state: EditorState): boolean => {
  if (pos >= 0 && pos <= state.doc.resolve(0).end()) {
    return true;
  }

  return false;
};
