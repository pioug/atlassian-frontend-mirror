import {
  EditorTableModel,
  EditorNodeContainerModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';
import { tableExpandBackward } from './__fixtures__/base-adfs';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
  },

  adf: tableExpandBackward,
});

test.describe('should select multiple rows when click shift on table control', () => {
  test.use({
    platformFeatureFlags: {
      'platform.editor.table-shift-click-selection-backward': true,
    },
  });
  test('should select from top to bottom', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    const startCell = await tableModel.cell(0);
    await startCell.click();

    const firstClickControl = await tableModel.rowControls({ index: 1 });
    const secondClickControl = await tableModel.rowControls({ index: 2 });

    await firstClickControl.select();
    await secondClickControl.select();

    await expect(editor).toHaveSelection({
      anchor: 53,
      head: 2,
      type: 'cell',
    });
  });

  test('should select from bottom to top', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    const bottomStartCell = await tableModel.cell(12);
    await bottomStartCell.click();

    const firstRowControl = await tableModel.rowControls({ index: 2 });
    const secondRowControl = await tableModel.rowControls({ index: 1 });

    await firstRowControl.select();
    await secondRowControl.select();

    await expect(editor).toHaveSelection({
      anchor: 72,
      head: 23,
      type: 'cell',
    });
  });

  test('should select from left to right', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    const startCell = await tableModel.cell(0);
    await startCell.click();

    const firstClickControl = await tableModel.columnControls({ index: 1 });
    const secondClickControl = await tableModel.columnControls({ index: 2 });

    await firstClickControl.select();
    await secondClickControl.select();

    await expect(editor).toHaveSelection({
      anchor: 68,
      head: 2,
      type: 'cell',
    });
  });
  test('should select from right to left', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    const startCell = await tableModel.cell(3);
    await startCell.click();

    const firstClickControl = await tableModel.columnControls({ index: 2 });
    const secondClickControl = await tableModel.columnControls({ index: 1 });

    await firstClickControl.select();
    await secondClickControl.select();

    await expect(editor).toHaveSelection({
      anchor: 72,
      head: 7,
      type: 'cell',
    });
  });
});
