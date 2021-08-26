import { EditorView } from 'prosemirror-view';

import { uuid } from '@atlaskit/adf-schema';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  decisionItem,
  decisionList,
  doc,
  li,
  ol,
  p,
  taskItem,
  taskList,
  ul,
  table,
  tr,
  td,
  th,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';

describe('tasks and decisions', () => {
  const createEditor = createEditorFactory();

  const scenarios = [
    { name: 'action', menuItem: 'task', list: taskList, item: taskItem },
    {
      name: 'decision',
      menuItem: 'decision',
      list: decisionList,
      item: decisionItem,
    },
  ];

  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
    return createEditor({
      doc,
      editorProps: {
        allowAnalyticsGASV3: true,
        allowTasksAndDecisions: true,
        quickInsert: true,
        allowTables: true,
      },
      createAnalyticsEvent,
    });
  };

  beforeEach(() => {
    uuid.setStatic('local-uuid');
  });

  afterEach(() => {
    uuid.setStatic(false);
  });

  scenarios.forEach((scenario) => {
    describe('quick insert', () => {
      let editorView: EditorView;

      beforeEach(async () => {
        const { editorView: _editorView, typeAheadTool } = editor(
          doc(p('{<>}')),
        );

        await typeAheadTool
          .searchQuickInsert(scenario.menuItem)
          ?.insert({ index: 0 });
        editorView = _editorView;
      });

      it('should insert item', () => {
        expect(editorView.state.doc).toEqualDocument(
          doc(
            scenario.list({ localId: 'local-uuid' })(
              scenario.item({ localId: 'local-uuid' })(),
            ),
          ),
        );
      });

      it(`should fire v3 analytics event when ${scenario.name} inserted`, () => {
        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: 'inserted',
          actionSubject: 'document',
          actionSubjectId: scenario.name,
          attributes: expect.objectContaining({ inputMethod: 'quickInsert' }),
          eventType: 'track',
        });
      });
    });

    // Forward delete === Fn+Delete on macOS === "Delete" key on Windows
    // "On keyboards without a dedicated Del key, the Mac generates the "Delete" value when Fn is
    // pressed in tandem with Delete (which is Backspace on other platforms)."
    // See https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
    describe(`forward delete at end of ${scenario.name}`, () => {
      const listTypes = [
        { name: 'ul', list: ul },
        { name: 'ol', list: ol },
      ];

      listTypes.forEach((listType) => {
        const list = listType.list;
        describe(`${listType.name} with single list item`, () => {
          let editorView: EditorView;
          beforeEach(() => {
            const originalDoc = doc(
              scenario.list({ localId: 'local-uuid' })(
                scenario.item({ localId: 'local-uuid' })(`1{<>}`),
              ),
              ul(li(p('2'))),
            );
            ({ editorView } = editor(originalDoc));
          });

          it('should outdent following list to paragraph, then join it', () => {
            // Forward delete
            sendKeyToPm(editorView, 'Delete');

            expect(editorView.state.doc).toEqualDocument(
              doc(
                scenario.list({ localId: 'local-uuid' })(
                  scenario.item({ localId: 'local-uuid' })(`1`),
                ),
                p('2'),
              ),
            );

            // Forward delete
            sendKeyToPm(editorView, 'Delete');

            expect(editorView.state.doc).toEqualDocument(
              doc(
                scenario.list({ localId: 'local-uuid' })(
                  scenario.item({ localId: 'local-uuid' })(`12`),
                ),
              ),
            );
          });
        });

        describe(`unordered list one level of nesting`, () => {
          let editorView: EditorView;
          beforeEach(() => {
            const originalDoc = doc(
              scenario.list({ localId: 'local-uuid' })(
                scenario.item({ localId: 'local-uuid' })(`1{<>}`),
              ),
              list(li(p('2'), list(li(p('3')))), li(p('4'))),
            );
            ({ editorView } = editor(originalDoc));
          });

          it('should outdent following list to paragraph, then join it', () => {
            // Forward delete
            sendKeyToPm(editorView, 'Delete');

            expect(editorView.state.doc).toEqualDocument(
              doc(
                scenario.list({ localId: 'local-uuid' })(
                  scenario.item({ localId: 'local-uuid' })(`1`),
                ),
                p('2'),
                list(li(p('3')), li(p('4'))),
              ),
            );

            // Forward delete
            sendKeyToPm(editorView, 'Delete');

            expect(editorView.state.doc).toEqualDocument(
              doc(
                scenario.list({ localId: 'local-uuid' })(
                  scenario.item({ localId: 'local-uuid' })(`12`),
                ),
                list(li(p('3')), li(p('4'))),
              ),
            );
          });
        });
      });

      describe('before a paragraph', () => {
        let editorView: EditorView;
        const originalDoc = doc(
          scenario.list({ localId: 'local-uuid' })(
            scenario.item({ localId: 'local-uuid' })('1{<>}'),
          ),
          p('2'),
        );
        ({ editorView } = editor(originalDoc));

        it('should join the text', () => {
          // Forward delete
          sendKeyToPm(editorView, 'Delete');

          expect(editorView.state.doc).toEqualDocument(
            doc(
              scenario.list({ localId: 'local-uuid' })(
                scenario.item({ localId: 'local-uuid' })('12'),
              ),
            ),
          );
        });
      });

      describe(`two times before another ${scenario.name}`, () => {
        let editorView: EditorView;
        const originalDoc = doc(
          scenario.list({ localId: 'local-uuid' })(
            scenario.item({ localId: 'local-uuid' })('1{<>}'),
            scenario.item({ localId: 'local-uuid' })('2'),
          ),
        );
        ({ editorView } = editor(originalDoc));

        it('should join the text', () => {
          // Forward delete two times
          sendKeyToPm(editorView, 'Delete');
          sendKeyToPm(editorView, 'Delete');

          // should not have changed the document
          expect(editorView.state.doc).toEqualDocument(
            doc(
              scenario.list({ localId: 'local-uuid' })(
                scenario.item({ localId: 'local-uuid' })('12'),
              ),
            ),
          );
        });
      });

      describe('when inside table', () => {
        let editorView: EditorView;
        const shouldNotJoinContent = (
          view: EditorView,
          targetDoc: DocBuilder,
        ) => {
          it('should not join nodes outside of current cell', () => {
            // Forward delete
            sendKeyToPm(view, 'Delete');

            // should not have changed the document
            expect(view.state.doc).toEqualDocument(targetDoc);
          });
        };

        describe('header', () => {
          const originalDoc = doc(
            table({ localId: 'local-uuid' })(
              tr(
                th()(p('1')),
                th()(
                  scenario.list({ localId: 'local-uuid' })(
                    scenario.item({ localId: 'local-uuid' })('2{<>}'),
                  ),
                ),
                th()(p('3')),
              ),
            ),
          );
          ({ editorView } = editor(originalDoc));

          shouldNotJoinContent(editorView, originalDoc);
        });

        describe('cell', () => {
          const originalDoc = doc(
            table({ localId: 'local-uuid' })(
              tr(
                td()(p('1')),
                td()(
                  scenario.list({ localId: 'local-uuid' })(
                    scenario.item({ localId: 'local-uuid' })('2{<>}'),
                  ),
                ),
                td()(p('3')),
              ),
            ),
          );
          ({ editorView } = editor(originalDoc));

          shouldNotJoinContent(editorView, originalDoc);
        });

        describe('last cell on the row', () => {
          const originalDoc = doc(
            table({ localId: 'local-uuid' })(
              tr(th()(p()), th()(p()), th()(p())),
              tr(
                td()(p()),
                td()(p()),
                td()(
                  scenario.list({ localId: 'local-uuid' })(
                    scenario.item({ localId: 'local-uuid' })('1{<>}'),
                  ),
                ),
              ),
              tr(td()(p()), td()(p()), td()(p())),
            ),
            p('2'),
          );
          ({ editorView } = editor(originalDoc));

          shouldNotJoinContent(editorView, originalDoc);
        });

        describe('last cell with no following node', () => {
          const originalDoc = doc(
            table({ localId: 'local-uuid' })(
              tr(th()(p()), th()(p()), th()(p())),
              tr(td()(p()), td()(p()), td()(p())),
              tr(
                td()(p()),
                td()(p()),
                td()(
                  scenario.list({ localId: 'local-uuid' })(
                    scenario.item({ localId: 'local-uuid' })('1{<>}'),
                  ),
                ),
              ),
            ),
          );
          ({ editorView } = editor(originalDoc));

          shouldNotJoinContent(editorView, originalDoc);
        });
        describe('last cell with following node', () => {
          const originalDoc = doc(
            table({ localId: 'local-uuid' })(
              tr(th()(p()), th()(p()), th()(p())),
              tr(td()(p()), td()(p()), td()(p())),
              tr(
                td()(p()),
                td()(p()),
                td()(
                  scenario.list({ localId: 'local-uuid' })(
                    scenario.item({ localId: 'local-uuid' })('1{<>}'),
                  ),
                ),
              ),
            ),
            p('2'),
          );
          ({ editorView } = editor(originalDoc));

          shouldNotJoinContent(editorView, originalDoc);
        });
      });
    });
  });
});
