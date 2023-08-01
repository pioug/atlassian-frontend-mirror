import {
  EditorTableModel,
  EditorNodeContainerModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';
import { simpleTableWithHeaderColumn } from './__fixtures__/base-adfs';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
  },

  adf: simpleTableWithHeaderColumn,
});

test.describe('when selecting the header column', () => {
  test('right border of second header column cell should be tableBorderSelectedColor', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    // select the first column, which is the header column
    const columnControls = await tableModel.columnControls({ index: 0 });
    await columnControls.select();

    // select the second header column cell
    const cells = nodes.table.locator(':is(td, th)');
    const secondHeaderColumnCellLocator = cells.nth(3);

    await expect(secondHeaderColumnCellLocator).toHaveCSS(
      'border',
      '1px solid rgb(0, 101, 255)',
    );
  });
});

test.describe('when hovering delete button of the header column', () => {
  test('right border of second header column cell should be tableBorderDeleteColor', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    // select the first column, which is the header column
    const columnControls = await tableModel.columnControls({ index: 0 });
    await columnControls.select();

    // hover delete button
    await columnControls.hoverDelete();

    // select the second header column cell
    const cells = nodes.table.locator(':is(td, th)');
    const secondHeaderColumnCellLocator = cells.nth(3);

    await expect(secondHeaderColumnCellLocator).toHaveCSS(
      'border',
      '1px solid rgb(222, 53, 11)',
    );
  });
});
