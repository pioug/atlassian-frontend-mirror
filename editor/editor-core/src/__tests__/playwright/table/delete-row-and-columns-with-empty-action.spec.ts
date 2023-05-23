import {
  EditorNodeContainerModel,
  EditorTableModel,
  editorTestCase as test,
  expect,
} from '@atlaskit/editor-test-helpers/playwright';
import { tableWithActionItemInTheLastRow } from './__fixtures__/base-adfs';
import {
  doc,
  table,
  tr,
  thEmpty,
  tdEmpty,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: { advanced: true },
  },

  adf: tableWithActionItemInTheLastRow,
});

test.describe('when there is an empty action in the last row', () => {
  test('should delete the last row', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    await tableModel.cell(6);

    const rowControls = await tableModel.rowControls({ index: 2 });

    await rowControls.delete();

    await expect(editor).toHaveDocument(
      doc(
        table({ localId: 'localId' })(
          tr(thEmpty, thEmpty, thEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
        ),
      ),
    );
  });
});

test.describe('when there is an empty action in the last column', () => {
  test('should delete the last column', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    await tableModel.cell(2);

    const columnControls = await tableModel.columnControls({ index: 2 });

    await columnControls.delete();

    await expect(editor).toHaveDocument(
      doc(
        table({ localId: 'localId' })(
          tr(thEmpty, thEmpty),
          tr(tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty),
        ),
      ),
    );
  });
});
