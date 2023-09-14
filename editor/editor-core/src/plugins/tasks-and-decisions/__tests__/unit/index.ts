import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { uuid } from '@atlaskit/adf-schema';
import type {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
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
} from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { act } from '@testing-library/react';

let createAnalyticsEvent: CreateUIAnalyticsEvent;

function createEditor() {
  const createEditor = createEditorFactory();

  return (doc: DocBuilder) => {
    createAnalyticsEvent = getAnalyticsEvent();
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
}

function getAnalyticsEvent() {
  return jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
}

describe('tasks and decisions', () => {
  const scenarios = [
    { name: 'action', menuItem: 'task', list: taskList, item: taskItem },
    {
      name: 'decision',
      menuItem: 'decision',
      list: decisionList,
      item: decisionItem,
    },
  ];

  beforeEach(() => {
    uuid.setStatic('local-uuid');
  });

  afterEach(() => {
    uuid.setStatic(false);
  });

  scenarios.forEach((scenario) => {
    describe('quick insert', () => {
      let editorView: EditorView;
      let _queueMicrotask: any;

      beforeEach(async () => {
        _queueMicrotask = window.queueMicrotask;
        window.queueMicrotask = () => {};
      });

      afterAll(() => {
        window.queueMicrotask = _queueMicrotask;
      });

      it('should insert item', async () => {
        const editor = createEditor();
        const { editorView: _editorView, typeAheadTool } = editor(
          doc(p('{<>}')),
        );
        await act(async () => {
          typeAheadTool
            .searchQuickInsert(scenario.menuItem)
            ?.insert({ index: 0 });

          editorView = _editorView;
        });

        expect(editorView.state.doc).toEqualDocument(
          doc(
            scenario.list({ localId: 'local-uuid' })(
              scenario.item({ localId: 'local-uuid' })(),
            ),
          ),
        );
      });

      it(`should fire v3 analytics event when ${scenario.name} inserted`, async () => {
        const editor = createEditor();
        const { editorView: _editorView, typeAheadTool } = editor(
          doc(p('{<>}')),
        );
        await typeAheadTool
          .searchQuickInsert(scenario.menuItem)
          ?.insert({ index: 0 });

        editorView = _editorView;

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

          it('should outdent following list to paragraph, then join it', () => {
            const originalDoc = doc(
              scenario.list({ localId: 'local-uuid' })(
                scenario.item({ localId: 'local-uuid' })(`1{<>}`),
              ),
              ul(li(p('2'))),
            );

            const editor = createEditor();
            ({ editorView } = editor(originalDoc));
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

          it('should outdent following list to paragraph, then join it', () => {
            const originalDoc = doc(
              scenario.list({ localId: 'local-uuid' })(
                scenario.item({ localId: 'local-uuid' })(`1{<>}`),
              ),
              list === ol
                ? ol()(li(p('2'), ol()(li(p('3')))), li(p('4')))
                : ul(li(p('2'), ul(li(p('3')))), li(p('4'))),
            );
            const editor = createEditor();
            ({ editorView } = editor(originalDoc));
            // Forward delete
            sendKeyToPm(editorView, 'Delete');

            expect(editorView.state.doc).toEqualDocument(
              doc(
                scenario.list({ localId: 'local-uuid' })(
                  scenario.item({ localId: 'local-uuid' })(`1`),
                ),
                p('2'),
                list === ol
                  ? ol()(li(p('3')), li(p('4')))
                  : ul(li(p('3')), li(p('4'))),
              ),
            );

            // Forward delete
            sendKeyToPm(editorView, 'Delete');

            expect(editorView.state.doc).toEqualDocument(
              doc(
                scenario.list({ localId: 'local-uuid' })(
                  scenario.item({ localId: 'local-uuid' })(`12`),
                ),
                list === ol
                  ? ol()(li(p('3')), li(p('4')))
                  : ul(li(p('3')), li(p('4'))),
              ),
            );
          });
        });
      });

      describe('before a paragraph', () => {
        it('should join the text', () => {
          let editorView: EditorView;
          const originalDoc = doc(
            scenario.list({ localId: 'local-uuid' })(
              scenario.item({ localId: 'local-uuid' })('1{<>}'),
            ),
            p('2'),
          );
          const editor = createEditor();
          ({ editorView } = editor(originalDoc));

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
        it('should join the text', () => {
          let editorView: EditorView;
          const originalDoc = doc(
            scenario.list({ localId: 'local-uuid' })(
              scenario.item({ localId: 'local-uuid' })('1{<>}'),
              scenario.item({ localId: 'local-uuid' })('2'),
            ),
          );

          const editor = createEditor();
          ({ editorView } = editor(originalDoc));
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
        const shouldNotJoinContent = (targetDoc: DocBuilder) => {
          it('should not join nodes outside of current cell', () => {
            const editor = createEditor();
            ({ editorView } = editor(targetDoc));
            // Forward delete
            sendKeyToPm(editorView, 'Delete');

            // should not have changed the document
            expect(editorView.state.doc).toEqualDocument(targetDoc);
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
          shouldNotJoinContent(originalDoc);
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
          shouldNotJoinContent(originalDoc);
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
          shouldNotJoinContent(originalDoc);
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
          shouldNotJoinContent(originalDoc);
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
          shouldNotJoinContent(originalDoc);
        });
      });
    });
  });
});
