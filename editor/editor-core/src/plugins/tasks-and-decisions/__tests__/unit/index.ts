import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  taskList,
  taskItem,
  decisionList,
  decisionItem,
  ol,
  ul,
  li,
} from '@atlaskit/editor-test-helpers/schema-builder';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { uuid } from '@atlaskit/adf-schema';
import { EditorView } from 'prosemirror-view';

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

  const editor = (doc: any) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
    return createEditor({
      doc,
      editorProps: { allowAnalyticsGASV3: true, allowTasksAndDecisions: true },
      createAnalyticsEvent,
    });
  };

  beforeEach(() => {
    uuid.setStatic('local-uuid');
  });

  afterEach(() => {
    uuid.setStatic(false);
  });

  scenarios.forEach(scenario => {
    describe('quick insert', () => {
      let editorView: EditorView;
      let sel: number;

      beforeEach(() => {
        ({ editorView, sel } = editor(doc(p('{<>}'))));
        insertText(editorView, `/${scenario.menuItem}`, sel);
        sendKeyToPm(editorView, 'Enter');
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

      listTypes.forEach(listType => {
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
    });
  });
});
