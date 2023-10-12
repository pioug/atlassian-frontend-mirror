// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p, status } from '@atlaskit/editor-test-helpers/doc-builder';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';

describe('status - keymaps', () => {
  const createEditor = createEditorFactory();

  const editorFactory = (doc: DocBuilder) =>
    createEditor({
      editorProps: {
        allowStatus: true,
      },
      doc,
    });

  describe('Consume Enter/Tab keys in status node', () => {
    ['Tab', 'Enter'].forEach((key) => {
      it(`When status node is selected and ${key} key is pressed then the node should not move`, () => {
        const adf = doc(
          p('boo something'),
          p(
            'Status: ',
            '{<node>}',
            status({
              text: 'Hello',
              color: 'blue',
              localId: '040fe0df-dd11-45ab-bc0c-8220c814f716',
            }),
            'WW',
          ),
        );
        const { editorView } = editorFactory(adf);

        sendKeyToPm(editorView, key);
        expect(editorView.state).toEqualDocumentAndSelection(adf);
      });
    });
  });
});
