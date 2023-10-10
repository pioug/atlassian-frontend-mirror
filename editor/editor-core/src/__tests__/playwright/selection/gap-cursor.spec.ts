import {
  EditorNodeContainerModel,
  EditorTableModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';

import numberedTableAdf from './__fixtures__/numbered-table.adf.json';
test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
  },
  adf: numberedTableAdf,
});
test.describe('gap cursor', () => {
  test('gap cursor should be placed before a numbered table in breakout mode', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);
    let cell = await tableModel.cell(0);
    await cell.click();
    const layoutModel = await tableModel.layout(editor);
    await layoutModel.toWide();
    await cell.click();
    await editor.keyboard.press('ArrowLeft');
    await editor.keyboard.press('ArrowLeft');
    const gapCursorContainer = editor.page.locator(
      '.ProseMirror-gapcursor span',
    );
    const cursorSpanWidth = (await gapCursorContainer?.boundingBox())?.width;
    expect(cursorSpanWidth).toEqual(await tableModel.containerWidth());
  });
});
