import { doc, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import { uuid } from '@atlaskit/adf-schema';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { taskItem, taskList } from '@atlaskit/editor-test-helpers/doc-builder';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';

describe('Tasks and decisions', () => {
  describe('when the users tabs the second action item', () => {
    describe('when the user wants to undo their tab', () => {
      beforeEach(() => {
        uuid.setStatic('local-uuid');
      });

      afterEach(() => {
        uuid.setStatic(false);
      });

      it('undoes the indentation', () => {
        const editorFactory = createEditorFactory();
        const createEditor = (doc: DocBuilder) =>
          editorFactory({
            doc,
            editorProps: {
              allowNestedTasks: true,
              allowTasksAndDecisions: true,
            },
          });
        const { editorView } = createEditor(
          doc(
            taskList({ localId: 'local-uuid' })(
              taskItem({ localId: 'local-uuid' })('Hello World'),
              taskItem({ localId: 'local-uuid' })(
                'Say yall{<>} wanna live with the dream',
              ),
            ),
          ),
        );
        const undo = () => sendKeyToPm(editorView, 'Ctrl-z');
        const tab = () => sendKeyToPm(editorView, 'Tab');

        tab();

        expect(editorView.state.doc).toEqualDocument(
          doc(
            taskList({ localId: 'local-uuid' })(
              taskItem({ localId: 'local-uuid' })('Hello World'),
              taskList({ localId: 'local-uuid' })(
                taskItem({ localId: 'local-uuid' })(
                  'Say yall{<>} wanna live with the dream',
                ),
              ),
            ),
          ),
        );

        undo();

        expect(editorView.state.doc).toEqualDocument(
          doc(
            taskList({ localId: 'local-uuid' })(
              taskItem({ localId: 'local-uuid' })('Hello World'),
              taskItem({ localId: 'local-uuid' })(
                'Say yall{<>} wanna live with the dream',
              ),
            ),
          ),
        );
      });
    });
  });
});
