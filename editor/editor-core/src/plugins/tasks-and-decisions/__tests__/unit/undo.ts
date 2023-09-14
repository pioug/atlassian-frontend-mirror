// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc } from '@atlaskit/editor-test-helpers/doc-builder';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import { uuid } from '@atlaskit/adf-schema';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { taskItem, taskList } from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
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
