import { EditorView } from 'prosemirror-view';

import { doc, p, panel } from '@atlaskit/editor-test-helpers/doc-builder';

import {
  setNodeSelection,
  setTextSelection,
} from '../../../../../../utils/selection';
import { editor, sendArrowLeftKey } from '../../_utils';

describe('selection keymap plugin: arrow left from text selection', () => {
  let editorView: EditorView;
  let refs: { [name: string]: number };

  it("doesn't set selection when user hits left arrow and not at start of selectable node", () => {
    const originalDoc = doc(
      panel()(p('hey there'), p('{<>}i have two paragraphs')),
    );
    ({ editorView } = editor(originalDoc));
    sendArrowLeftKey(editorView);
    expect(editorView.state).toEqualDocumentAndSelection(originalDoc);
  });

  describe('achieved by clicking inside a selectable node', () => {
    describe('after previously selecting node by clicking and then using left arrow to get outside it', () => {
      it('sets node selection', () => {
        ({ editorView, refs } = editor(
          doc(
            '{panel}',
            panel()(p('{insidePanel}i am a selectable panel{<>}')),
          ),
        ));
        setNodeSelection(editorView, refs.panel);
        sendArrowLeftKey(editorView, { numTimes: 2 }); // selection will be left gap cursor for panel

        setTextSelection(editorView, refs.insidePanel);
        sendArrowLeftKey(editorView);

        expect(editorView.state).toEqualDocumentAndSelection(
          doc('{<node>}', panel()(p('i am a selectable panel'))),
        );
      });
    });
  });
});
