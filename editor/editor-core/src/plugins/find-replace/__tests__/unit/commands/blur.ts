import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
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
