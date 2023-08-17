import {
  EditorMainToolbarModel,
  EditorNodeContainerModel,
  EditorTableModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';

/*
 * This is a regression test.
 *
 * The goal of this test is to make sure
 * we can resize the table after a CellSelectio, and here is the why:
 *
 *
 * Given this cell A1
 *
 * ```
 *    ▁▁▁▁▁▁▁▁▁▁▁▁▁
 *   |           ▒▒|
 *   |     A1    ▒▒|
 *   |           ▒▒|
 *    ▔▔▔▔▔▔▔▔▔▔▔▔▔
 * ```
 *
 * This element is a div, and every time the user hovers it, we should display a resize line.
 * However, keeping a div for each cell in a table increases the HTML a lot,
 * resulting in performance degradation to any DOM diff action.
 * To avoid that, we decided to add the div on demand.
 * Then, when the user comes close to that gap, we added a DIV.
 * Next, we needed to check if the handle was already there using the resizeHandleColumnIndex from the PluginState.
 * However, if that state was not clean properly, we could end up not adding the DIV element,
 * then the user could not resize the column until they hover another one.
 *
 * We solved this problem search for the decorations too: if the DIV is not there, we will add it.
 */
test.describe('when cell borders are hovered', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowTables: {
        advanced: true,
      },
    },
  });

  test.describe('and when multiple cells were selected by shift click', () => {
    test('should display the resizer handler', async ({ editor }) => {
      const toolbar = EditorMainToolbarModel.from(editor);

      await toolbar.clickAt('Table');

      const { table } = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(table);

      const firstCell = await tableModel.cell(3);
      await firstCell.click();

      const lastCell = await tableModel.cell(5);
      await lastCell.click({ modifiers: ['Shift'] });

      await test.step('Hover last cell left border and check resizer handler', async () => {
        await lastCell.hoverBorder({ cellSide: 'left' });

        expect(await lastCell.isResizeHandlerVisible()).toBeTruthy();
      });

      await test.step('Hover first cell right border and check resizer handler', async () => {
        await firstCell.hoverBorder({ cellSide: 'right' });

        expect(await firstCell.isResizeHandlerVisible()).toBeTruthy();
      });
    });
  });

  test.describe('and when multiple cells were selected by drag and drop', () => {
    test('should display the resizer handler', async ({ editor }) => {
      const toolbar = EditorMainToolbarModel.from(editor);

      await toolbar.clickAt('Table');

      const { table } = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(table);

      const firstCell = await tableModel.cell(3);
      const lastCell = await tableModel.cell(5);

      await firstCell.dragTo({ target: lastCell });

      await test.step('Hover last cell left border and check resizer handler', async () => {
        await lastCell.hoverBorder({ cellSide: 'left' });

        expect(await lastCell.isResizeHandlerVisible()).toBeTruthy();
      });

      await test.step('Hover first cell right border and check resizer handler', async () => {
        await firstCell.hoverBorder({ cellSide: 'right' });

        expect(await firstCell.isResizeHandlerVisible()).toBeTruthy();
      });
    });
  });
});

// TODO: convert to regular test above after FF is cleaned up
test.describe('when last cell border is hovered with platform.editor.custom-table-width enabled', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowTables: {
        advanced: true,
      },
    },
    platformFeatureFlags: { 'platform.editor.custom-table-width': true },
  });

  test('should not cause table to overflow', async ({ editor }) => {
    const toolbar = EditorMainToolbarModel.from(editor);

    await toolbar.clickAt('Table');

    const { table } = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(table);

    const lastCell = await tableModel.cell(2);

    await lastCell.hoverBorder({ cellSide: 'right' });

    expect(await tableModel.hasOverflowed()).toBeFalsy();
  });
});
