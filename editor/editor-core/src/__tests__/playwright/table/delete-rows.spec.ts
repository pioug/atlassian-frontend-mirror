import {
  EditorPopupModel,
  EditorNodeContainerModel,
  EditorTableModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';
import {
  nestedInExtension,
  documentWithMergedCells,
  simpleTable,
} from './__fixtures__/base-adfs';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  table,
  tr,
  td,
  tdEmpty,
  thEmpty,
  bodiedExtension,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('when table has merged cells', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowTables: {
        advanced: true,
      },
    },
  });

  test.use({
    adf: documentWithMergedCells,
  });

  test('Should delete merged rows from contextual menu and append missing cells to the table', async ({
    editor,
  }) => {
    const { table: container } = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(container);

    const cell = await tableModel.cell(6);
    await cell.click();

    const cellOptions = await cell.options(EditorPopupModel.from(editor));
    await cellOptions.deleteRow();

    await expect(editor).toMatchDocument(
      // prettier-ignore
      doc(
        table()(
          tr.any,
          tr.any,
        )
      ),
    );
  });

  test('Should delete merged rows from contextual menu and decrement rowspan of the spanning cell', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    const cell = await tableModel.cell(10);
    await cell.click();

    const cellOptions = await cell.options(EditorPopupModel.from(editor));
    await cellOptions.deleteRow();

    await expect(editor).toMatchDocument(
      // prettier-ignore
      doc(
        table()(
          tr.any,
          tr(
            td({ colspan: 1, rowspan: 1, colwidth: [151], background: "#e6fcff" }).any,
            td({ colspan: 3, rowspan: 2, colwidth: [98, 275, 83], background: "#fffae6" }).any,
            td({ colspan: 1, rowspan: 1, colwidth: [152], background: "#e6fcff" }).any,
          ),
          tr.any,
          tr.any,
        )
      ),
    );
  });
});

test.describe('when table is nested inside bodied extension', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowTables: {
        advanced: true,
      },
      allowExtension: true,
    },
  });

  test.use({
    adf: nestedInExtension,
  });

  test('Should delete a row ', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    // focus table to ensure row controls are visible
    await tableModel.selectTable();

    const row = await tableModel.rowControls({ index: 1 });
    await row.delete();

    await expect(editor).toMatchDocument(
      // prettier-ignore
      doc(
        bodiedExtension({
          extensionType: "com.atlassian.confluence.macro.core",
          extensionKey: "bodied-eh",
          parameters: {
            "macroParams": {},
            "macroMetadata": {
              "placeholder": [
                {
                  "data": {
                    "url": ""
                  },
                  "type": "icon"
                }
              ]
            }
          },
          layout: "default",
        })(
          table()(
            tr.any,
            tr.any,
          )
        ),
      ),
    );
  });
});

test.describe('when editor is full-width', () => {
  test.use({
    editorProps: {
      appearance: 'full-width',
      allowTables: {
        advanced: true,
      },
    },
    adf: simpleTable,
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
