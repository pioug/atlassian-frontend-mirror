import {
  EditorTableModel,
  EditorNodeContainerModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';
import { simpleTable } from './__fixtures__/base-adfs';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
  },

  adf: simpleTable,
});

test.describe('when selecting all table cells', () => {
  test('should correctly highlight entire table selection', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    const fromCell = await tableModel.cell(0);
    const toCell = await tableModel.cell(8);

    await fromCell.click();
    await toCell.click({ modifiers: ['Shift'] });

    expect(await tableModel.isSelected()).toBeTruthy();
  });

  test('should set the cell selection throught the entire table', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    const fromCell = await tableModel.cell(0);
    const toCell = await tableModel.cell(8);

    await fromCell.click();
    await toCell.click({ modifiers: ['Shift'] });

    await expect(editor).toHaveSelection({
      anchor: 2,
      head: 38,
      type: 'cell',
    });
  });
});

test.describe('when selecting the bottom-right cell to the first cell at second row', () => {
  test('should set correctly the cell selection', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    const fromCell = await tableModel.cell(8);
    const toCell = await tableModel.cell(3);

    await fromCell.click();
    await toCell.click({ modifiers: ['Shift'] });

    await expect(editor).toHaveSelection({
      anchor: 38,
      head: 16,
      type: 'cell',
    });
  });
});

test.describe('when selecting the bottom-right cell to the second column at the first row', () => {
  test('should set correctly the cell selection', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    const fromCell = await tableModel.cell(8);
    const toCell = await tableModel.cell(1);

    await fromCell.click();
    await toCell.click({ modifiers: ['Shift'] });

    await expect(editor).toHaveSelection({
      anchor: 38,
      head: 6,
      type: 'cell',
    });
  });
});
