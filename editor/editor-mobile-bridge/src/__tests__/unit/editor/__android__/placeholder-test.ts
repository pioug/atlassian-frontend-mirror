import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';

import { androidComposeContinue, androidComposeEnd } from '../../_utils';

import { EditorViewWithComposition } from '../../../../types';

describe('placeholder on mobile', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: DocBuilder): EditorViewWithComposition => {
    const { editorView } = createEditor({
      doc,
      editorProps: {
        placeholder: 'potato',
      },
    });

    return editorView as EditorViewWithComposition;
  };

  // https://github.com/ProseMirror/prosemirror-view/commit/00c3dc9c3e7f5edcd71f24f4a8a8cf3fda4b2ac7
  const cursorWrapper = `(<img mark-placeholder="true">)?`;
  const placeholderHtmlRegex = new RegExp(
    `<p><span class="placeholder-decoration ProseMirror-widget"><span>potato<\/span><\/span>${cursorWrapper}<br><\/p>`,
  );

  beforeEach(() => jest.useFakeTimers());

  it('renders a placeholder on a blank document', () => {
    const editorView = editor(doc(p()));
    expect(editorView.dom.innerHTML).toMatch(placeholderHtmlRegex);
  });

  it('disappears when content is added to document', () => {
    const editorView = editor(doc(p()));

    insertText(editorView, 'a', 0);
    expect(editorView.dom.innerHTML).toEqual('<p>a</p><p><br></p>');
  });

  it('reappears after text is backspaced', () => {
    const editorView = editor(doc(p('ab')));
    expect(editorView.dom.innerHTML).toEqual('<p>ab</p>');

    // mutate DOM to final state
    editorView.dom.innerHTML = '';

    // continue composition
    androidComposeContinue(editorView, '');
    expect(editorView.composing).toBeTruthy();

    jest.runOnlyPendingTimers();

    // end composition
    androidComposeEnd(editorView, '');

    expect(editorView.dom.innerHTML).toMatch(placeholderHtmlRegex);
    expect(editorView.state.doc).toEqualDocument(doc(p()));
  });
});
