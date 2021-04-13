import { EditorView } from 'prosemirror-view';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import { activate, blur } from '../../../commands';
import { editor } from '../_utils';
import { getPluginState } from '../../../plugin';

describe('find/replace commands: blur', () => {
  let editorView: EditorView;

  const initEditor = (doc: DocBuilder) => {
    ({ editorView } = editor(doc));
  };

  beforeEach(() => {
    initEditor(doc(p('{<>}this is a document'), p('this is a document')));

    activate()(editorView.state, editorView.dispatch);
    blur()(editorView.state, editorView.dispatch);
  });

  it('unfocuses find/replace', () => {
    expect(getPluginState(editorView.state)).toMatchObject({
      shouldFocus: false,
    });
  });
});
