import {
  EditorNodeContainerModel,
  EditorPopupModel,
  EditorTableModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';

import { basicTable } from './cell-context-menu.spec.ts-fixtures';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
  },

  adf: basicTable,
});

test('when a cell has a default background color, checkbox will be selected correctly by default', async ({
  editor,
}) => {
  const nodes = EditorNodeContainerModel.from(editor);
  const tableModel = EditorTableModel.from(nodes.table);
  const fromCell = await tableModel.cell(0);
  const cellOptions = await fromCell.options(EditorPopupModel.from(editor));

  await cellOptions.hoverCellBackgroundMenuItem();

  const seletectedColor = await cellOptions.defaultColor();
  expect(seletectedColor).toBeTruthy();
});

test('when we change the table cell color, checkbox will be selected correctly', async ({
  editor,
}) => {
  const nodes = EditorNodeContainerModel.from(editor);
  const tableModel = EditorTableModel.from(nodes.table);
  const fromCell = await tableModel.cell(0);
  const cellOptions = await fromCell.options(EditorPopupModel.from(editor));

  await cellOptions.hoverCellBackgroundMenuItem();
  await cellOptions.selectedColor('Purple');
  await fromCell.options(EditorPopupModel.from(editor));
  await cellOptions.hoverCellBackgroundMenuItem();

  const seletectedColor = await cellOptions.displaySelectedColor('Purple');
  expect(seletectedColor).toBeTruthy();
});
