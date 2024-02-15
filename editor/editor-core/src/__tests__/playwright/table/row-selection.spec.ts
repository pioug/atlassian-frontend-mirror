import {
  EditorNodeContainerModel,
  EditorTableModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';

import { tableExpandBackward } from './__fixtures__/base-adfs';
import { tableAfterOtherNodes } from './row-selection.spec.ts-fixtures';

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

test.describe('should select multiple rows when click shift on table control and there are other nodes before table', () => {
  test.use({
    platformFeatureFlags: {
      'platform.editor.table-shift-click-selection-backward': true,
    },
    adf: tableAfterOtherNodes,
  });
  test('should select two rows from top to bottom', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    const startCell = await tableModel.cell(0);
    await startCell.click();

    const firstClickControl = await tableModel.rowControls({ index: 1 });
    const secondClickControl = await tableModel.rowControls({ index: 2 });

    await firstClickControl.click();
    await secondClickControl.select();

    await expect(editor).toHaveSelection({
      anchor: 60,
      head: 38,
      type: 'cell',
    });
  });

  test('should select two rows from bottom to top', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    const bottomStartCell = await tableModel.cell(9);
    await bottomStartCell.click();

    const firstRowControl = await tableModel.rowControls({ index: 2 });
    const secondRowControl = await tableModel.rowControls({ index: 1 });

    await firstRowControl.click();
    await secondRowControl.select();

    await expect(editor).toHaveSelection({
      anchor: 60,
      head: 38,
      type: 'cell',
    });
  });

  test('should select two columns from left to right', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    const startCell = await tableModel.cell(0);
    await startCell.click();

    const firstClickControl = await tableModel.columnControls({ index: 1 });
    const secondClickControl = await tableModel.columnControls({ index: 2 });

    await firstClickControl.click();
    await secondClickControl.select();

    await expect(editor).toHaveSelection({
      anchor: 74,
      head: 28,
      type: 'cell',
    });
  });

  test('should select two columns from right to left', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    const startCell = await tableModel.cell(2);
    await startCell.click();

    const firstClickControl = await tableModel.columnControls({ index: 2 });
    const secondClickControl = await tableModel.columnControls({ index: 1 });

    await firstClickControl.click();
    await secondClickControl.select();

    await expect(editor).toHaveSelection({
      anchor: 74,
      head: 28,
      type: 'cell',
    });
  });
});
