import { EditorView } from 'prosemirror-view';

import {
  doc,
  p,
  panel,
  date,
  decisionItem,
  decisionList,
  layoutSection,
  layoutColumn,
} from '@atlaskit/editor-test-helpers/doc-builder';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';

import { setNodeSelection } from '../../../../../../utils/selection';
import { editor, sendArrowRightKey } from '../../_utils';

describe('selection keymap plugin: arrow right from node selection', () => {
  let editorView: EditorView;
  let refs: { [name: string]: number };

  describe('for selectable node', () => {
    describe('selected by clicking node', () => {
      it('sets right gap cursor selection when user hits right arrow', () => {
        ({ editorView, refs } = editor(
          doc('{panelStart}', panel()(p('i am a selectable panel'))),
        ));
        setNodeSelection(editorView, refs.panelStart);
        sendArrowRightKey(editorView);
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(panel()(p('i am a selectable panel')), '{<|gap>}'),
        );
      });

      describe('after using arrow keys to select inside node', () => {
        it('sets right gap cursor selection when user hits right arrow', () => {
          ({ editorView, refs } = editor(
            doc(
              '{panelStart}',
              '{<gap|>}',
              panel()(p('i am a selectable panel')),
            ),
          ));
          sendArrowRightKey(editorView, { numTimes: 2 }); // selection will be at start of paragraph inside panel

          setNodeSelection(editorView, refs.panelStart);
          sendArrowRightKey(editorView);
          expect(editorView.state).toEqualDocumentAndSelection(
            doc(panel()(p('i am a selectable panel')), '{<|gap>}'),
          );
        });
      });

      describe('after after using arrow keys to select another node', () => {
        it('sets right gap cursor selection when user hits right arrow', () => {
          ({ editorView, refs } = editor(
            doc(
              '{panelStart}',
              panel()(p('i am a selectable panel')),
              '{<gap|>}',
              panel()(p('i am a selectable panel')),
            ),
          ));
          sendArrowRightKey(editorView); // selection will be node selection for second panel

          setNodeSelection(editorView, refs.panelStart);
          sendArrowRightKey(editorView);
          expect(editorView.state).toEqualDocumentAndSelection(
            doc(
              panel()(p('i am a selectable panel')),
              '{<|gap>}',
              panel()(p('i am a selectable panel')),
            ),
          );
        });
      });

      describe('after previously selecting node with arrow keys and then using right arrow to get outside it', () => {
        it('sets right gap cursor selection when user hits right arrow', () => {
          ({ editorView, refs } = editor(
            doc('{panelStart}', panel()(p('i am a selectable panel{<>}'))),
          ));
          sendArrowRightKey(editorView, { numTimes: 2 }); // selection will be right gap cursor for panel

          setNodeSelection(editorView, refs.panelStart);
          sendArrowRightKey(editorView);
          expect(editorView.state).toEqualDocumentAndSelection(
            doc(panel()(p('i am a selectable panel')), '{<|gap>}'),
          );
        });
      });

      describe('after previously selecting node by clicking and then using left arrow to get outside it', () => {
        it('sets right gap cursor selection when user hits right arrow', () => {
          ({ editorView, refs } = editor(
            doc('{panelStart}', panel()(p('i am a selectable panel'))),
          ));
          setNodeSelection(editorView, refs.panelStart);
          sendKeyToPm(editorView, 'ArrowLeft');
          sendKeyToPm(editorView, 'ArrowLeft'); // selection will be left gap cursor for panel

          setNodeSelection(editorView, refs.panelStart);
          sendArrowRightKey(editorView);
          expect(editorView.state).toEqualDocumentAndSelection(
            doc(panel()(p('i am a selectable panel')), '{<|gap>}'),
          );
        });
      });
    });
  });

  describe('for selectable node that contains a selectable block node', () => {
    describe('selected by clicking node', () => {
      it('sets right gap cursor selection when user hits right arrow', () => {
        ({ editorView, refs } = editor(
          doc(
            '{layoutSection}',
            layoutSection(
              layoutColumn({ width: 50 })(
                panel()(
                  p('i am a selectable panel inside a selectable layout'),
                ),
              ),
              layoutColumn({ width: 50 })(p('')),
            ),
          ),
        ));
        setNodeSelection(editorView, refs.layoutSection);

        sendArrowRightKey(editorView);
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(
            layoutSection(
              layoutColumn({ width: 50 })(
                panel()(
                  p('i am a selectable panel inside a selectable layout'),
                ),
              ),
              layoutColumn({ width: 50 })(p('')),
            ),
            '{<|gap>}',
          ),
        );
      });
    });
  });

  describe('for inline selectable node inside another selectable node', () => {
    beforeEach(() => {
      ({ editorView } = editor(
        doc(panel()(p('{<node>}', date({ timestamp: 1594086965712 })))),
      ));
    });

    it('sets text selection after inline node when user hits right arrow', () => {
      sendArrowRightKey(editorView);
      expect(editorView.state).toEqualDocumentAndSelection(
        doc(panel()(p(date({ timestamp: 1594086965712 }), '{<>}'))),
      );
    });

    it('sets node selection for parent node when user hits right arrow twice', () => {
      sendArrowRightKey(editorView, { numTimes: 2 });
      expect(editorView.state).toEqualDocumentAndSelection(
        doc('{<node>}', panel()(p(date({ timestamp: 1594086965712 })))),
      );
    });

    it('sets right gap cursor selection for parent node when user hits right arrow thrice', () => {
      sendArrowRightKey(editorView, { numTimes: 3 });
      expect(editorView.state).toEqualDocumentAndSelection(
        doc(panel()(p(date({ timestamp: 1594086965712 }))), '{<|gap>}'),
      );
    });
  });

  describe("for first of two selectable block nodes that don't support gap cursor inside an unselectable node", () => {
    describe('selected by clicking node', () => {
      it('sets node selection for second node', () => {
        ({ editorView, refs } = editor(
          doc(
            // decisionList is not selectable but decisionItem is
            // decisionItem does not support gap cursor but decisionList does
            decisionList({ localId: 'decision-list' })(
              '{decisionItem}',
              decisionItem({ localId: 'decision-item' })('i decided this'),
              decisionItem({ localId: 'decision-item' })('i decided this'),
            ),
          ),
        ));
        setNodeSelection(editorView, refs.decisionItem);

        sendArrowRightKey(editorView);
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(
            decisionList({ localId: 'decision-list' })(
              decisionItem({ localId: 'decision-item' })('i decided this'),
              '{<node>}',
              decisionItem({ localId: 'decision-item' })('i decided this'),
            ),
          ),
        );
      });
    });

    describe('selected via arrow keys', () => {
      it('sets node selection for second node', () => {
        ({ editorView, refs } = editor(
          doc(
            // decisionList is not selectable but decisionItem is
            // decisionItem does not support gap cursor but decisionList does
            decisionList({ localId: 'decision-list' })(
              decisionItem({ localId: 'decision-item' })('i decided this{<>}'),
              decisionItem({ localId: 'decision-item' })('i decided this'),
            ),
          ),
        ));
        sendArrowRightKey(editorView);

        sendArrowRightKey(editorView);
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(
            decisionList({ localId: 'decision-list' })(
              decisionItem({ localId: 'decision-item' })('i decided this'),
              '{<node>}',
              decisionItem({ localId: 'decision-item' })('i decided this'),
            ),
          ),
        );
      });
    });
  });
});
