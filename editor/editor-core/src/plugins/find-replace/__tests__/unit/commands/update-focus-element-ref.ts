import React from 'react';
import { EditorView } from 'prosemirror-view';
import { doc, p } from '@atlaskit/editor-test-helpers/schema-builder';
import { updateFocusElementRef } from '../../../commands';
import { editor } from '../_utils';
import { getPluginState } from '../../../plugin';

describe('find/replace commands: updateFocusElementRef', () => {
  let editorView: EditorView;

  const initEditor = (doc: any) => {
    ({ editorView } = editor(doc));
  };

  beforeEach(() => {
    initEditor(doc(p('{<>}this is a document')));
  });

  it('sets focusElementRef', () => {
    updateFocusElementRef(React.createRef())(
      editorView.state,
      editorView.dispatch,
    );
    expect(getPluginState(editorView.state)).toMatchObject({
      shouldFocus: false,
    });
  });
});
