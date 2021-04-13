import { EditorView } from 'prosemirror-view';

import { doc, p, panel } from '@atlaskit/editor-test-helpers/doc-builder';

import { editor, sendArrowRightKey } from '../../_utils';

describe('selection keymap plugin: arrow right from text selection', () => {
  let editorView: EditorView;

  describe('from text selection', () => {
    it("doesn't set selection when user hits right arrow and not at end of selectable node", () => {
      const originalDoc = doc(
        panel()(p('hey there{<>}'), p('i have two paragraphs')),
      );
      ({ editorView } = editor(originalDoc));
      sendArrowRightKey(editorView);
      expect(editorView.state).toEqualDocumentAndSelection(originalDoc);
    });
  });
});
