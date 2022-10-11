import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { isComposing } from '../../composition';

describe('compositionPlugin', () => {
  it('should be aware of composition input', () => {
    const createEditor = createEditorFactory();
    const { editorView } = createEditor({
      doc: doc(p()),
    });

    expect(isComposing(editorView.state)).toBe(false);
    editorView.dom.dispatchEvent(new CompositionEvent('compositionstart'));
    expect(isComposing(editorView.state)).toBe(true);
    editorView.dom.dispatchEvent(
      new CompositionEvent('compositionupdate', {
        data: 'あ',
      }),
    );
    editorView.dom.dispatchEvent(new CompositionEvent('compositionend'));
    expect(isComposing(editorView.state)).toBe(false);
  });
});
