import {
  EditorPopupModel,
  EditorNodeContainerModel,
  EditorTableModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';
import {
  doc,
  table,
  td,
  th,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import {
  defaultTableResizedWithOverflow,
  defaultTableResizedWithoutOverflow,
  mergedColumnsResized,
} from './__fixtures__/distribute-documents';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: { advanced: true, allowDistributeColumns: true },
  },
});

test.describe('columns should distribute correctly', () => {
  test.describe('on a resized table with overflow', () => {
    test.use({
      adf: defaultTableResizedWithOverflow,
    });

    test('when cells from two columns are selected', async ({ editor }) => {
      const keyboard = editor.keyboard;
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      const fromCell = await tableModel.cell(3);
      await fromCell.click();

      const toCell = await tableModel.cell(7);
      await keyboard.down('Shift');
      await toCell.click();
      await keyboard.up('Shift');

      const cellOptions = await toCell.options(EditorPopupModel.from(editor));
      await cellOptions.disributeColumns();

      await expect(editor).toMatchDocument(
        doc(
          table()(
            tr(
              th({ colwidth: [282] }).any,
              th({ colwidth: [282] }).any,
              th({ colwidth: [283] }).any,
            ),
            tr(
              td({ colwidth: [282] }).any,
              td({ colwidth: [282] }).any,
              td({ colwidth: [283] }).any,
            ),
            tr(
              td({ colwidth: [282] }).any,
              td({ colwidth: [282] }).any,
              td({ colwidth: [283] }).any,
            ),
          ),
        ),
      );
    });

    test('when whole table is selected', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      await tableModel.selectTable();

      const firstCell = await tableModel.cell(0);
      const cellOptions = await firstCell.options(
        EditorPopupModel.from(editor),
      );
      await cellOptions.disributeColumns();

      await expect(editor).toMatchDocument(
        doc(
          table()(
            tr(th().any, th().any, th().any),
            tr(td().any, td().any, td().any),
            tr(td().any, td().any, td().any),
          ),
        ),
      );
    });
  });

  test.describe('on a resized table without overflow', () => {
    test.use({
      adf: defaultTableResizedWithoutOverflow,
    });

    test('when whole table is selected', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      await tableModel.selectTable();

      const firstCell = await tableModel.cell(0);
      const cellOptions = await firstCell.options(
        EditorPopupModel.from(editor),
      );
      await cellOptions.disributeColumns();

      await expect(editor).toMatchDocument(
        doc(
          table()(
            tr(th().any, th().any, th().any),
            tr(td().any, td().any, td().any),
            tr(td().any, td().any, td().any),
          ),
        ),
      );
    });
  });
  test.describe('on a resized table with merged cells', () => {
    test.use({
      adf: mergedColumnsResized,
    });

    test('when cells from two columns are selected ', async ({ editor }) => {
      const keyboard = editor.keyboard;
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      const fromCell = await tableModel.cell(14);
      await fromCell.click();

      const toCell = await tableModel.cell(15);
      await keyboard.down('Shift');
      await toCell.click();
      await keyboard.up('Shift');

      const cellOptions = await toCell.options(EditorPopupModel.from(editor));
      await cellOptions.disributeColumns();

      await expect(editor).toMatchDocumentSnapshot();
    });
  });
});
