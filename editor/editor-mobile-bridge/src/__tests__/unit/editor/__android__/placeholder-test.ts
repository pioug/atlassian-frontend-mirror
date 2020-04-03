import {
  doc,
  insertText,
  createEditorFactory,
  p,
} from '@atlaskit/editor-test-helpers';

import {
  androidComposeStart,
  androidComposeContinue,
  androidComposeEnd,
} from '../../_utils';

import { EditorViewWithComposition } from '../../../../types';

describe('placeholder on mobile', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: any): EditorViewWithComposition => {
    const { editorView } = createEditor({
      doc,
      editorProps: {
        placeholder: 'potato',
        analyticsHandler: () => {},
      },
    });

    return editorView as EditorViewWithComposition;
  };

  // FIXME: ED-7102: PM adds a ZWSP next to our placeholder after content has been renderer and removed. Need to figure out what's causing this...
  const optionalZWSP = `(<span>.<\/span>)?`;
  const placeholderHtmlRegex = new RegExp(
    `<p><span class="placeholder-decoration ProseMirror-widget"><span>potato<\/span><\/span>${optionalZWSP}?<br><\/p>`,
  );

  beforeEach(() => jest.useFakeTimers());

  it('renders a placeholder on a blank document', () => {
    const editorView = editor(doc(p()));
    expect(editorView.dom.innerHTML).toMatch(placeholderHtmlRegex);
  });

  it('disappears when content is added to document', () => {
    const editorView = editor(doc(p()));
    expect(editorView.dom.innerHTML).toMatch(placeholderHtmlRegex);

    insertText(editorView, 'a', 0);
    expect(editorView.dom.innerHTML).toEqual('<p>a</p><p><br></p>');
  });

  // Ensure the placeholder value is removed as soon as input (via composition) begins
  it('disappears when a compositionstart event occurs', () => {
    const editorView = editor(doc(p()));
    expect(editorView.dom.innerHTML).toMatch(placeholderHtmlRegex);

    // start composition
    androidComposeStart(editorView, 'hello');
    expect(editorView.composing).toBeTruthy();

    expect(editorView.dom.innerHTML).toEqual('<p><br></p>');
  });

  it('stays hidden and keeps content after a full composition completes', () => {
    const editorView = editor(doc(p()));
    expect(editorView.dom.innerHTML).toMatch(placeholderHtmlRegex);

    // start composition
    androidComposeStart(editorView, 'a');
    expect(editorView.composing).toBeTruthy();

    expect(editorView.dom.innerHTML).toEqual('<p><br></p>');

    jest.runOnlyPendingTimers();

    // mutate DOM to final state
    editorView.dom.children[0].innerHTML = 'ab';

    // continue composition
    androidComposeContinue(editorView, 'ab');
    expect(editorView.composing).toBeTruthy();

    jest.runOnlyPendingTimers();

    expect(editorView.state.doc).toEqualDocument(doc(p('ab')));
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
