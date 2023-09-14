import {
  EditorNodeContainerModel,
  EditorTableModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';
import {
  tableWithActionItemInFirstCellOfLastRow,
  tableWithActionItemInTopCellOfLastColumn,
} from './__fixtures__/base-adfs';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  table,
  tr,
  thEmpty,
  tdEmpty,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('when there is an empty action in the last row', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowTables: { advanced: true },
    },

    adf: tableWithActionItemInFirstCellOfLastRow,
  });

  test('should delete the last row', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

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
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowTables: { advanced: true },
    },

    adf: tableWithActionItemInTopCellOfLastColumn,
  });

  test('should delete the last column', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

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
