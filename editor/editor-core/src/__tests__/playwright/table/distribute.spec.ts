import {
  EditorPopupModel,
  EditorNodeContainerModel,
  EditorTableModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
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
  fixedWidthTableWith50Columns,
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
          // TODO: the table.attrs.width type in adf-schema is 'number | undefined', but the default value is null, ignoring until adf-schema is updated
          // @ts-ignore
          table({ localId: 'abc-123', width: null })(
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
          // TODO: the table.attrs.width type in adf-schema is 'number | undefined', but the default value is null, ignoring until adf-schema is updated
          // @ts-ignore
          table({ localId: 'abc-123', width: null })(
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

  test.describe('on a resized table with 50 columns', () => {
    test.use({
      adf: fixedWidthTableWith50Columns,
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

      const tableWidth = await tableModel.bodyWidth();

      await expect(editor).toMatchDocument(
        doc(
          // TODO: the table.attrs.width type in adf-schema is 'number | undefined', but the default value is null, ignoring until adf-schema is updated
          // @ts-ignore
          table({ localId: 'abc-123', width: null })(
            tr(...new Array(50).fill(null).map(() => th().any)),
            tr.any,
            tr.any,
          ),
        ),
      );

      // It's currently possible for cells to be smaller then min-width
      expect(tableWidth).toBeLessThanOrEqual(760);
    });

    test.describe('when toggling custom-table-width', () => {
      test.use({
        platformFeatureFlags: { 'platform.editor.custom-table-width': true },
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

        const cellBox = await firstCell.getBoundingBox();
        const tableWidth = await tableModel.bodyWidth();

        // NOTE: It's important to understand that the prosemirror model will contain null colwidth values. This is because the
        // distribute columns method actually clears them and relies on css auto formatting. However when this flag is enabled
        // we will be setting the colgroup min width css values. This means the model will still show null colwidth but the rendered
        // output will enforce the min-width value set in the colgroup.
        await expect(editor).toMatchDocument(
          doc(
            // TODO: the table.attrs.width type in adf-schema is 'number | undefined', but the default value is null, ignoring until adf-schema is updated
            // @ts-ignore
            table({ localId: 'abc-123', width: null })(
              tr(...new Array(50).fill(null).map(() => th().any)),
              tr.any,
              tr.any,
            ),
          ),
        );

        // All cells in the table should be at min-width (48px)
        // 48px cols * 50 columns
        expect(tableWidth).toBe(2400);
        expect(cellBox?.width).toBe(48);
      });
    });
  });
});
