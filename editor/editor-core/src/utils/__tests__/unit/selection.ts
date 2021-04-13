import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { isValidPosition } from '../../selection';

describe('#isValidPosition', () => {
  it('should return true for valid positions', () => {
    const editorState = createEditorState(doc(p('')));
    expect(isValidPosition(0, editorState)).toBe(true);
  });

  it('should return false for positions greater than document size', () => {
    const editorState = createEditorState(doc(p('')));
    expect(isValidPosition(3, editorState)).toBe(false);
  });

  it('should return false for positions lower than 0', () => {
    const editorState = createEditorState(doc(p('')));
    expect(isValidPosition(-1, editorState)).toBe(false);
  });
});
