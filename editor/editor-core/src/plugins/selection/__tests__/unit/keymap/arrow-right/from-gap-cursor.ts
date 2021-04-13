import { EditorView } from 'prosemirror-view';

import {
  doc,
  p,
  panel,
  layoutSection,
  layoutColumn,
  date,
  decisionItem,
  decisionList,
  taskItem,
  taskList,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { editor, sendArrowRightKey } from '../../_utils';

describe('selection keymap plugin: arrow right from gap cursor', () => {
  let editorView: EditorView;

  describe('from left side gap cursor', () => {
    describe('for selectable node', () => {
      beforeEach(() => {
        ({ editorView } = editor(
          doc('{<gap|>}', panel()(p('i am a selectable panel'))),
        ));
      });

      it('sets node selection when user hits right arrow', () => {
        sendArrowRightKey(editorView);
        expect(editorView.state).toEqualDocumentAndSelection(
          doc('{<node>}', panel()(p('i am a selectable panel'))),
        );
      });

      it('sets text selection inside node when user hits right arrow twice', () => {
        sendArrowRightKey(editorView, { numTimes: 2 });
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(panel()(p('{<>}i am a selectable panel'))),
        );
      });
    });

    describe('for empty selectable node', () => {
      beforeEach(() => {
        ({ editorView } = editor(doc('{<gap|>}', panel()(p()))));
      });

      it('sets node selection when user hits right arrow', () => {
        sendArrowRightKey(editorView);
        expect(editorView.state).toEqualDocumentAndSelection(
          doc('{<node>}', panel()(p())),
        );
      });

      it('sets text selection inside node when user hits right arrow twice', () => {
        sendArrowRightKey(editorView, { numTimes: 2 });
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(panel()(p('{<>}'))),
        );
      });

      it('sets node selection when user hits right arrow thrice', () => {
        sendArrowRightKey(editorView, { numTimes: 3 });
        expect(editorView.state).toEqualDocumentAndSelection(
          doc('{<node>}', panel()(p())),
        );
      });

      it('sets right gap cursor selection when user hits right arrow four times', () => {
        sendArrowRightKey(editorView, { numTimes: 4 });
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(panel()(p()), '{<|gap>}'),
        );
      });
    });

    describe('for selectable node that contains a selectable inline node', () => {
      beforeEach(() => {
        ({ editorView } = editor(
          doc('{<gap|>}', panel()(p(date({ timestamp: 1594086965712 })))),
        ));
      });

      it('sets node selection when user hits right arrow', () => {
        sendArrowRightKey(editorView);
        expect(editorView.state).toEqualDocumentAndSelection(
          doc('{<node>}', panel()(p(date({ timestamp: 1594086965712 })))),
        );
      });

      it('sets text selection before inline node when user hits right arrow twice', () => {
        sendArrowRightKey(editorView, { numTimes: 2 });
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(panel()(p('{<>}', date({ timestamp: 1594086965712 })))),
        );
      });
    });

    describe('for selectable node that contains a selectable block node', () => {
      beforeEach(() => {
        ({ editorView } = editor(
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
        ));
      });

      it('sets node selection when user hits right arrow', () => {
        sendArrowRightKey(editorView);
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(
            '{<node>}',
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

      it('sets left gap cursor selection for nested node when user hits right arrow twice', () => {
        sendArrowRightKey(editorView, { numTimes: 2 });
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

      it('sets node selection for nested node when user hits right arrow thrice', () => {
        sendArrowRightKey(editorView, { numTimes: 3 });
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(
            layoutSection(
              layoutColumn({ width: 50 })(
                '{<node>}',
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

    describe('for selectable node that contains an unselectable node that supports gap cursor', () => {
      beforeEach(() => {
        ({ editorView } = editor(
          doc(
            '{<gap|>}',
            layoutSection(
              layoutColumn({ width: 50 })(
                // neither task list nor task item are selecable
                // however, task list supports gap cursor
                taskList({ localId: 'task-list' })(
                  taskItem({ localId: 'task-item' })(),
                ),
              ),
              layoutColumn({ width: 50 })(p('')),
            ),
          ),
        ));
      });

      it('sets node selection when user hits right arrow', () => {
        sendArrowRightKey(editorView);
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(
            '{<node>}',
            layoutSection(
              layoutColumn({ width: 50 })(
                taskList({ localId: 'task-list' })(
                  taskItem({ localId: 'task-item' })(),
                ),
              ),
              layoutColumn({ width: 50 })(p('')),
            ),
          ),
        );
      });

      it('sets left gap cursor selection for nested node when user hits right arrow twice', () => {
        sendArrowRightKey(editorView, { numTimes: 2 });
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(
            layoutSection(
              layoutColumn({ width: 50 })(
                '{<gap|>}',
                taskList({ localId: 'task-list' })(
                  taskItem({ localId: 'task-item' })(),
                ),
              ),
              layoutColumn({ width: 50 })(p('')),
            ),
          ),
        );
      });
    });

    describe('for unselectable node that contains a selectable block node', () => {
      beforeEach(() => {
        ({ editorView } = editor(
          doc(
            // decisionList is not selectable but decisionItem is
            '{<gap|>}',
            decisionList({ localId: 'decision-list' })(
              decisionItem({ localId: 'decision-item' })(
                'selectable decision item',
              ),
            ),
          ),
        ));
      });

      it('sets node selection for selectable node when user hits right arrow', () => {
        sendArrowRightKey(editorView);
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(
            decisionList({ localId: 'decision-list' })(
              '{<node>}',
              decisionItem({ localId: 'decision-item' })(
                'selectable decision item',
              ),
            ),
          ),
        );
      });

      it('sets selection inside node when user hits right arrow twice', () => {
        sendArrowRightKey(editorView, { numTimes: 2 });
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(
            decisionList({ localId: 'decision-list' })(
              decisionItem({ localId: 'decision-item' })(
                '{<>}selectable decision item',
              ),
            ),
          ),
        );
      });
    });

    describe('for unselectable node that contains an empty selectable node', () => {
      beforeEach(() => {
        ({ editorView } = editor(
          doc(
            // decisionList is not selectable but decisionItem is
            '{<gap|>}',
            decisionList({ localId: 'decision-list' })(
              decisionItem({ localId: 'decision-item' })(),
            ),
          ),
        ));
      });

      it('sets node selection when user hits right arrow', () => {
        sendArrowRightKey(editorView);
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(
            decisionList({ localId: 'decision-list' })(
              '{<node>}',
              decisionItem({ localId: 'decision-item' })(),
            ),
          ),
        );
      });

      it('sets selection inside node when user hits right arrow twice', () => {
        sendArrowRightKey(editorView, { numTimes: 2 });
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(
            decisionList({ localId: 'decision-list' })(
              decisionItem({ localId: 'decision-item' })('{<>}'),
            ),
          ),
        );
      });
    });

    describe('for empty selectable node inside another selectable node', () => {
      beforeEach(() => {
        ({ editorView } = editor(
          doc(
            layoutSection(
              layoutColumn({ width: 50 })('{<gap|>}', panel()(p())),
              layoutColumn({ width: 50 })(p('')),
            ),
          ),
        ));
      });

      it('sets node selection for nested node when user hits right arrow', () => {
        sendArrowRightKey(editorView);
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(
            layoutSection(
              layoutColumn({ width: 50 })('{<node>}', panel()(p())),
              layoutColumn({ width: 50 })(p('')),
            ),
          ),
        );
      });

      it('sets text selection inside nested node when user hits right arrow twice', () => {
        sendArrowRightKey(editorView, { numTimes: 2 });
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(
            layoutSection(
              layoutColumn({ width: 50 })(panel()(p('{<>}'))),
              layoutColumn({ width: 50 })(p('')),
            ),
          ),
        );
      });

      it('sets node selection for nested node when user hits right arrow thrice', () => {
        sendArrowRightKey(editorView, { numTimes: 3 });
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(
            layoutSection(
              layoutColumn({ width: 50 })('{<node>}', panel()(p())),
              layoutColumn({ width: 50 })(p('')),
            ),
          ),
        );
      });
    });
  });

  describe('from right side gap cursor', () => {
    describe('for selectable node inside another selectable node', () => {
      beforeEach(() => {
        ({ editorView } = editor(
          doc(
            layoutSection(
              layoutColumn({ width: 50 })(p('')),
              layoutColumn({ width: 50 })(
                panel()(
                  p('i am a selectable panel inside a selectable layout'),
                ),
                '{<|gap>}',
              ),
            ),
          ),
        ));
      });

      it('sets node selection when user hits right arrow', () => {
        sendArrowRightKey(editorView);
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(
            '{<node>}',
            layoutSection(
              layoutColumn({ width: 50 })(p('')),
              layoutColumn({ width: 50 })(
                panel()(
                  p('i am a selectable panel inside a selectable layout'),
                ),
              ),
            ),
          ),
        );
      });

      it('sets right gap cursor selection when user hits right arrow twice', () => {
        sendArrowRightKey(editorView, { numTimes: 2 });
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(
            layoutSection(
              layoutColumn({ width: 50 })(p('')),
              layoutColumn({ width: 50 })(
                panel()(
                  p('i am a selectable panel inside a selectable layout'),
                ),
              ),
            ),
            '{<|gap>}',
          ),
        );
      });
    });
  });
});
