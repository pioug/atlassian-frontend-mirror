import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import { doc, p } from '@atlaskit/editor-test-helpers/schema-builder';
import { isValidPosition } from '../../selection';
import { pluginKey } from '../../../plugins/table/pm-plugins/plugin-factory';

describe('#isValidPosition', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: any) =>
    createEditor({
      doc,
      pluginKey,
    });

  it('should return true for valid positions', () => {
    const { editorView } = editor(doc(p('')));
    expect(isValidPosition(0, editorView.state)).toBe(true);
  });

  it('should return false for positions greater than document size', () => {
    const { editorView } = editor(doc(p('')));
    expect(isValidPosition(3, editorView.state)).toBe(false);
  });

  it('should return false for positions lower than 0', () => {
    const { editorView } = editor(doc(p('')));
    expect(isValidPosition(-1, editorView.state)).toBe(false);
  });
});
