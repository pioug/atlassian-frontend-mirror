import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { browser } from '@atlaskit/editor-common/utils';

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

  const placeholderHtmlRegex = new RegExp(
    `<p><span data-testid=\"placeholder-test-id\" class=\"placeholder-decoration ProseMirror-widget\">potato</span><br class=\"ProseMirror-trailingBreak\"></p>`,
  );

  const placeholderHtmlOnAndroidChromeRegex = new RegExp(
    `<p><span data-testid=\"placeholder-test-id\" class=\"placeholder-decoration ProseMirror-widget\">potato<span contenteditable=\"true\"> </span></span><br class=\"ProseMirror-trailingBreak\"></p>`,
  );

  beforeEach(() => jest.useFakeTimers());

  it('renders a placeholder on a blank document', () => {
    const editorView = editor(doc(p()));
    expect(editorView.dom.innerHTML).toMatch(placeholderHtmlRegex);
  });

  it('renders a placeholder on a blank document on Android Chrome', () => {
    const androidOldValue = browser.android;
    const chromeOldValue = browser.chrome;

    browser.android = true;
    browser.chrome = true;

    const editorView = editor(doc(p()));
    expect(editorView.dom.innerHTML).toMatch(
      placeholderHtmlOnAndroidChromeRegex,
    );

    browser.android = androidOldValue;
    browser.chrome = chromeOldValue;
  });

  it('disappears when content is added to document', () => {
    const editorView = editor(doc(p()));

    insertText(editorView, 'a', 0);
    expect(editorView.dom.innerHTML).toEqual(
      '<p>a</p><p><br class="ProseMirror-trailingBreak"></p>',
    );
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

  it('reappears after text is backspaced on Android Chrome', () => {
    const androidOldValue = browser.android;
    const chromeOldValue = browser.chrome;

    browser.android = true;
    browser.chrome = true;

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

    expect(editorView.dom.innerHTML).toMatch(
      placeholderHtmlOnAndroidChromeRegex,
    );
    expect(editorView.state.doc).toEqualDocument(doc(p()));

    browser.android = androidOldValue;
    browser.chrome = chromeOldValue;
  });
});
