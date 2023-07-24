import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { isComposing } from '../../composition';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/utils';

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

  it('Zero width space is not added on compositionstart', () => {
    const createEditor = createEditorFactory();
    const { editorView } = createEditor({
      doc: doc(p()),
    });

    editorView.dom.dispatchEvent(new CompositionEvent('compositionstart'));
    expect(editorView.state.doc).toEqualDocument(doc(p()));
    editorView.dom.dispatchEvent(new CompositionEvent('compositionend'));
  });

  it('(Linux only) zero width space is added on compositionstart, removed on compositionend', () => {
    // impersonate linux
    Object.defineProperty(navigator, 'userAgent', {
      value: `${navigator.userAgent} Linux`,
      configurable: true,
    });

    const createEditor = createEditorFactory();
    const { editorView } = createEditor({
      doc: doc(p('{<>}')),
    });

    const container = document.createTextNode('');
    // @ts-ignore
    jest.spyOn(editorView.root, 'getSelection').mockImplementation(() => ({
      focusNode: container,
      focusOffset: 1,
    }));

    editorView.dom.dispatchEvent(new CompositionEvent('compositionstart'));
    expect(editorView.state.doc).toEqualDocument(doc(p(ZERO_WIDTH_SPACE)));

    insertText(editorView, 'あ');

    editorView.dom.dispatchEvent(new CompositionEvent('compositionend'));
    expect(editorView.state.doc).toEqualDocument(doc(p('あ')));
  });
});
