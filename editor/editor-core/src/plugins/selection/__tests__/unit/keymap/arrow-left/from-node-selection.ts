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
import { editor, sendArrowLeftKey } from '../../_utils';

describe('selection keymap plugin: arrow left from node selection', () => {
  let editorView: EditorView;
  let refs: { [name: string]: number };

  describe('for selectable node', () => {
    describe('achieved by clicking node', () => {
      beforeEach(() => {
        ({ editorView, refs } = editor(
          doc('{panelStart}', panel()(p('i am a selectable panel'))),
        ));
        setNodeSelection(editorView, refs.panelStart);
      });

      it('sets selection inside at start of node when user hits left arrow', () => {
        sendArrowLeftKey(editorView);
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(panel()(p('{<>}i am a selectable panel'))),
        );
      });

      it('sets left gap cursor selection when user hits left arrow twice', () => {
        sendArrowLeftKey(editorView, { numTimes: 2 });
        expect(editorView.state).toEqualDocumentAndSelection(
          doc('{<gap|>}', panel()(p('i am a selectable panel'))),
        );
      });

      describe('after using arrow keys to select inside node', () => {
        it('sets selection inside at start of node when user hits left arrow', () => {
          ({ editorView, refs } = editor(
            doc(
              '{panelStart}',
              panel()(p('i am a selectable panel')),
              '{<|gap>}',
            ),
          ));
          sendArrowLeftKey(editorView, { numTimes: 2 }); // selection will be at end of paragraph inside panel

          setNodeSelection(editorView, refs.panelStart);
          sendArrowLeftKey(editorView);
          expect(editorView.state).toEqualDocumentAndSelection(
            doc(panel()(p('{<>}i am a selectable panel'))),
          );
        });
      });

      describe('after using arrow keys to select another node', () => {
        it('sets selection inside at start of node when user hits left arrow', () => {
          ({ editorView, refs } = editor(
            doc(
              '{panelStart}',
              panel()(p('i am a selectable panel')),
              panel()(p('i am a selectable panel')),
              '{<|gap>}',
            ),
          ));
          sendArrowLeftKey(editorView); // selection will be node selection for second panel

          setNodeSelection(editorView, refs.panelStart);
          sendArrowLeftKey(editorView);
          expect(editorView.state).toEqualDocumentAndSelection(
            doc(
              panel()(p('{<>}i am a selectable panel')),
              panel()(p('i am a selectable panel')),
            ),
          );
        });
      });

      describe('after previously selecting node by clicking and then using left arrow to get outside it', () => {
        beforeEach(() => {
          sendArrowLeftKey(editorView, { numTimes: 2 }); // selection will be left gap cursor for panel
          setNodeSelection(editorView, refs.panelStart);
        });

        it('sets selection inside at start of node when user hits left arrow', () => {
          sendArrowLeftKey(editorView);
          expect(editorView.state).toEqualDocumentAndSelection(
            doc(panel()(p('{<>}i am a selectable panel'))),
          );
        });

        it('sets left gap cursor selection when user hits left arrow twice', () => {
          sendArrowLeftKey(editorView, { numTimes: 2 });
          expect(editorView.state).toEqualDocumentAndSelection(
            doc('{<gap|>}', panel()(p('i am a selectable panel'))),
          );
        });
      });

      describe('after previously selecting node with arrow keys and then using right arrow to get outside it', () => {
        beforeEach(() => {
          ({ editorView, refs } = editor(
            doc('{panelStart}', panel()(p('i am a selectable panel{<>}'))),
          ));
          sendKeyToPm(editorView, 'ArrowRight');
          sendKeyToPm(editorView, 'ArrowRight'); // selection will be right gap cursor for panel
          setNodeSelection(editorView, refs.panelStart);
        });

        it('sets selection inside at start of node when user hits left arrow', () => {
          sendArrowLeftKey(editorView);
          expect(editorView.state).toEqualDocumentAndSelection(
            doc(panel()(p('{<>}i am a selectable panel'))),
          );
        });

        it('sets left gap cursor selection when user hits left arrow twice', () => {
          sendArrowLeftKey(editorView, { numTimes: 2 });
          expect(editorView.state).toEqualDocumentAndSelection(
            doc('{<gap|>}', panel()(p('i am a selectable panel'))),
          );
        });
      });
    });
  });

  describe('for selectable node following selectable node that can contain inline content', () => {
    describe('selected by clicking node', () => {
      beforeEach(() => {
        ({ editorView, refs } = editor(
          doc(
            decisionList({ localId: 'decision-list' })(
              decisionItem({ localId: 'decision-item' })(
                'selectable decision item',
              ),
            ),
            '{panel}',
            panel()(p('selectable panel')),
          ),
        ));
        setNodeSelection(editorView, refs.panel);
      });

      it('sets selection inside at start of node when user hits left arrow', () => {
        sendArrowLeftKey(editorView);
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(
            decisionList({ localId: 'decision-list' })(
              decisionItem({ localId: 'decision-item' })(
                'selectable decision item',
              ),
            ),
            panel()(p('{<>}selectable panel')),
          ),
        );
      });

      it('sets left gap cursor selection when user hits left arrow twice', () => {
        sendArrowLeftKey(editorView, { numTimes: 2 });
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(
            decisionList({ localId: 'decision-list' })(
              decisionItem({ localId: 'decision-item' })(
                'selectable decision item',
              ),
            ),
            '{<gap|>}',
            panel()(p('selectable panel')),
          ),
        );
      });
    });
  });

  describe('for selectable node that contains a selectable block node', () => {
    describe('selected by clicking node', () => {
      beforeEach(() => {
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
      });

      it('sets left gap cursor selection for nested node when user hits left arrow', () => {
        sendArrowLeftKey(editorView);
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(
            layoutSection(
              layoutColumn({ width: 50 })(
                '{<gap|>}',
                panel()(
                  p('i am a selectable panel inside a selectable layout'),
                ),
              ),
              layoutColumn({ width: 50 })(p('')),
            ),
          ),
        );
      });

      it('sets left gap cursor selection for parent node when user hits left arrow twice', () => {
        sendArrowLeftKey(editorView, { numTimes: 2 });
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(
            '{<gap|>}',
            layoutSection(
              layoutColumn({ width: 50 })(
                panel()(
                  p('i am a selectable panel inside a selectable layout'),
                ),
              ),
              layoutColumn({ width: 50 })(p('')),
            ),
          ),
        );
      });
    });
  });

  describe('for inline selectable node inside another selectable node', () => {
    beforeEach(() => {
      ({ editorView, refs } = editor(
        doc(panel()(p('{<node>}', date({ timestamp: 1594086965712 })))),
      ));
    });

    it('sets text selection before inline node when user hits left arrow', () => {
      sendArrowLeftKey(editorView);
      expect(editorView.state).toEqualDocumentAndSelection(
        doc(panel()(p('{<>}', date({ timestamp: 1594086965712 })))),
      );
    });

    it('sets node selection for parent node when user hits left arrow twice', () => {
      sendArrowLeftKey(editorView, { numTimes: 2 });
      expect(editorView.state).toEqualDocumentAndSelection(
        doc('{<node>}', panel()(p(date({ timestamp: 1594086965712 })))),
      );
    });

    it('sets left gap cursor selection for parent node when user hits left arrow thrice', () => {
      sendArrowLeftKey(editorView, { numTimes: 3 });
      expect(editorView.state).toEqualDocumentAndSelection(
        doc('{<gap|>}', panel()(p(date({ timestamp: 1594086965712 })))),
      );
    });
  });

  describe("for second selectable block node that doesn't support gap cursor inside an unselectable node", () => {
    describe('selected by clicking node', () => {
      beforeEach(() => {
        ({ editorView, refs } = editor(
          doc(
            // decisionList is not selectable but decisionItem is
            // decisionItem does not support gap cursor but decisionList does
            decisionList({ localId: 'decision-list' })(
              decisionItem({ localId: 'decision-item' })('i decided this'),
              '{decisionItem}',
              decisionItem({ localId: 'decision-item' })('i decided this'),
            ),
          ),
        ));
        setNodeSelection(editorView, refs.decisionItem);
      });

      it('sets selection inside at start of node when user hits left arrow', () => {
        sendArrowLeftKey(editorView);
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(
            decisionList({ localId: 'decision-list' })(
              decisionItem({ localId: 'decision-item' })('i decided this'),
              decisionItem({ localId: 'decision-item' })('{<>}i decided this'),
            ),
          ),
        );
      });

      it('sets node selection for previous node when user hits left arrow twice', () => {
        sendArrowLeftKey(editorView);
        sendArrowLeftKey(editorView);
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(
            decisionList({ localId: 'decision-list' })(
              '{<node>}',
              decisionItem({ localId: 'decision-item' })('i decided this'),
              decisionItem({ localId: 'decision-item' })('i decided this'),
            ),
          ),
        );
      });
    });

    describe('selected via arrow keys', () => {
      beforeEach(() => {
        ({ editorView } = editor(
          doc(
            // decisionList is not selectable but decisionItem is
            // decisionItem does not support gap cursor but decisionList does
            decisionList({ localId: 'decision-list' })(
              decisionItem({ localId: 'decision-item' })('i decided this'),
              decisionItem({ localId: 'decision-item' })('{<>}i decided this'),
            ),
          ),
        ));
        sendArrowLeftKey(editorView); // selection will be node selection for second decision item
      });

      it('sets node selection for previous node when user hits left arrow', () => {
        sendArrowLeftKey(editorView);
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(
            decisionList({ localId: 'decision-list' })(
              '{<node>}',
              decisionItem({ localId: 'decision-item' })('i decided this'),
              decisionItem({ localId: 'decision-item' })('i decided this'),
            ),
          ),
        );
      });
    });
  });
});
