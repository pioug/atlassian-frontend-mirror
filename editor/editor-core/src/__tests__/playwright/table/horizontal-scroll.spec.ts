import {
  EditorBreakoutModel,
  EditorFloatingToolbarModel,
  EditorLayoutModel,
  EditorNodeContainerModel,
  EditorPopupModel,
  EditorTableModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';

import {
  basicTableAdf,
  nestedInExpandAdf,
  nestedInExtensionAdf,
  tableInsideFullWidthLayout,
  tableInsideLayoutAdf,
} from './horizontal-scroll.spec.ts-fixtures';

test.describe('table: horizontal scroll', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowTables: {
        advanced: true,
        allowDistributeColumns: true,
      },
      allowLayouts: true,
      allowBreakout: true,
    },
    adf: basicTableAdf,
    viewport: { width: 1000, height: 1440 },
  });

  test('Table: Does not scroll when column is resized and a new column is inserted', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    const cell = await tableModel.cell(1);
    await cell.click();

    const distance = 100;
    await cell.resize({
      mouse: editor.page.mouse,
      cellSide: 'right',
      moveDirection: 'left',
      moveDistance: distance,
    });

    const cellOptions = await cell.options(EditorPopupModel.from(editor));
    await cellOptions.insertColumn();

    expect(await tableModel.hasOverflowed()).toBeFalsy();
  });

  test('Table: Does not scroll when column is resized and breakout button is clicked 3x', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    const cell = await tableModel.cell(1);
    await cell.click();

    const distance = 100;
    await cell.resize({
      mouse: editor.page.mouse,
      cellSide: 'right',
      moveDirection: 'left',
      moveDistance: distance,
    });
    const cellOptions = await cell.options(EditorPopupModel.from(editor));
    await cellOptions.insertColumn();

    const breakoutModel = EditorBreakoutModel.from(editor);

    await test.step('change layout to wide', async () => {
      await breakoutModel.toWide();
    });

    await test.step('change layout to full width', async () => {
      await breakoutModel.toFullWidth();
    });

    await test.step('change table layout back to center and do not overflow', async () => {
      await breakoutModel.toCenter();
      expect(await tableModel.hasOverflowed()).toBeFalsy();
    });
  });

  test('Table: Last column can be resized to remove scroll', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);
    const cell = await tableModel.cell(2);

    await test.step('resize wider', async () => {
      await cell.click();
      await cell.resize({
        mouse: editor.page.mouse,
        cellSide: 'left',
        moveDirection: 'right',
        moveDistance: 1000,
      });

      expect(await tableModel.hasOverflowed()).toBeTruthy();
    });

    await test.step('resize narrower', async () => {
      await cell.click();

      await cell.resize({
        mouse: editor.page.mouse,
        cellSide: 'right',
        moveDirection: 'left',
        moveDistance: 1000,
      });

      expect(await tableModel.hasOverflowed()).toBeFalsy();
    });
  });

  test('Table: Scrolls when there are more columns added than can fit the current width', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    const cell = await tableModel.cell(1);
    await cell.click();

    const shortcuts = await tableModel.shortcuts(editor.keyboard);

    await shortcuts.insertColumnAtRight();
    await shortcuts.insertColumnAtRight();
    await shortcuts.insertColumnAtRight();
    await shortcuts.insertColumnAtRight();
    await shortcuts.insertColumnAtRight();
    await shortcuts.insertColumnAtRight();
    await shortcuts.insertColumnAtRight();
    await shortcuts.insertColumnAtRight();
    await shortcuts.insertColumnAtRight();
    await shortcuts.insertColumnAtRight();
    await shortcuts.insertColumnAtRight();
    await shortcuts.insertColumnAtRight();
    await shortcuts.insertColumnAtRight();
    await shortcuts.insertColumnAtRight();

    expect(await tableModel.hasOverflowed()).toBeTruthy();
  });

  test.describe('Table nested in expand', () => {
    test.use({
      editorProps: {
        appearance: 'full-page',
        allowTables: {
          advanced: true,
          allowDistributeColumns: true,
        },
        allowExpand: true,
        allowLayouts: true,
        allowBreakout: true,
      },
      adf: nestedInExpandAdf,
      viewport: { width: 1920, height: 1440 },
    });

    test('Table: Does not scroll when nested in expand, column is resized and breakout button is clicked', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      const cell = await tableModel.cell(1);
      await cell.click();

      const distance = 100;
      await cell.resize({
        mouse: editor.page.mouse,
        cellSide: 'right',
        moveDirection: 'left',
        moveDistance: distance,
      });

      const breakoutModel = EditorBreakoutModel.from(editor);
      await breakoutModel.toWide();
      expect(await tableModel.hasOverflowed()).toBeFalsy();
    });

    test('Table: When nested in expand, last column can be resized to remove scroll', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const cell = await tableModel.cell(2);

      await test.step('resize wider', async () => {
        await cell.click();
        await cell.resize({
          mouse: editor.page.mouse,
          cellSide: 'left',
          moveDirection: 'right',
          moveDistance: 1000,
        });

        expect(await tableModel.hasOverflowed()).toBeTruthy();
      });

      await test.step('resize narrower', async () => {
        await cell.click();
        await cell.resize({
          mouse: editor.page.mouse,
          cellSide: 'right',
          moveDirection: 'left',
          moveDistance: 1000,
        });

        expect(await tableModel.hasOverflowed()).toBeFalsy();
      });
    });
  });

  test.describe('Table nested in layout', () => {
    test.use({
      editorProps: {
        appearance: 'full-page',
        allowTables: {
          advanced: true,
          allowDistributeColumns: true,
        },
        allowExpand: true,
        allowLayouts: true,
        allowBreakout: true,
      },
      adf: tableInsideLayoutAdf,
      viewport: { width: 1920, height: 1440 },
    });

    test('Table: When nested in layout, last column can be resized to remove scroll', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const cell = await tableModel.cell(2);

      await test.step('resize wider', async () => {
        await cell.click();
        await cell.resize({
          mouse: editor.page.mouse,
          cellSide: 'left',
          moveDirection: 'right',
          moveDistance: 1000,
        });

        expect(await tableModel.hasOverflowed()).toBeTruthy();
      });

      await test.step('resize narrower', async () => {
        await cell.click();
        await cell.resize({
          mouse: editor.page.mouse,
          cellSide: 'right',
          moveDirection: 'left',
          moveDistance: 1000,
        });

        expect(await tableModel.hasOverflowed()).toBeFalsy();
      });
    });

    test('Table: Does not scroll when nested in layout, column is resized and breakout button is clicked', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      const cell = await tableModel.cell(1);
      await cell.click();

      const distance = 100;
      await cell.resize({
        mouse: editor.page.mouse,
        cellSide: 'right',
        moveDirection: 'left',
        moveDistance: distance,
      });

      const breakoutModel = EditorBreakoutModel.from(editor);
      await breakoutModel.toWide();
      expect(await tableModel.hasOverflowed()).toBeFalsy();
    });

    test.describe('Table nested in single column layout', () => {
      test.use({
        editorProps: {
          appearance: 'full-page',
          allowTables: {
            advanced: true,
            allowDistributeColumns: true,
          },
          allowLayouts: {
            allowBreakout: true,
            UNSAFE_allowSingleColumnLayout: true,
          },
          allowBreakout: true,
        },
        adf: tableInsideLayoutAdf,
        viewport: { width: 1920, height: 1440 },
      });

      test('Table: Does not scroll when nested in single column layout, table column is resized and breakout button is clicked', async ({
        editor,
      }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);

        const cell = await tableModel.cell(1);
        await cell.click();

        const distance = 100;
        await cell.resize({
          mouse: editor.page.mouse,
          cellSide: 'right',
          moveDirection: 'left',
          moveDistance: distance,
        });

        const layoutModel = EditorLayoutModel.from(nodes.layout);
        const layoutToolbar = EditorFloatingToolbarModel.from(
          editor,
          layoutModel,
        );

        await layoutModel.click(editor);
        await layoutToolbar.singleColumn();

        const breakoutModel = EditorBreakoutModel.from(editor);
        await breakoutModel.toWide();
        expect(await tableModel.hasOverflowed()).toBeFalsy();
      });
    });
    test('Table: Does not scroll when nested in three columns layout, table column is resized and breakout button is clicked', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      const cell = await tableModel.cell(1);
      await cell.click();

      const distance = 100;
      await cell.resize({
        mouse: editor.page.mouse,
        cellSide: 'right',
        moveDirection: 'left',
        moveDistance: distance,
      });

      const layoutModel = EditorLayoutModel.from(nodes.layout);
      const layoutToolbar = EditorFloatingToolbarModel.from(
        editor,
        layoutModel,
      );

      await layoutModel.click(editor);
      await layoutToolbar.threeColumns();

      const breakoutModel = EditorBreakoutModel.from(editor);
      await breakoutModel.toWide();
      expect(await tableModel.hasOverflowed()).toBeFalsy();
    });
  });

  test.describe('Table nested in extension', () => {
    test.use({
      editorProps: {
        appearance: 'full-page',
        allowTables: {
          advanced: true,
          allowDistributeColumns: true,
        },
        allowExpand: true,
        allowLayouts: true,
        allowBreakout: true,
        allowExtension: true,
      },
      adf: nestedInExtensionAdf,
      viewport: { width: 1920, height: 1440 },
    });

    test('Table: When nested in bodied macro, last column can be resized to remove scroll', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const cell = await tableModel.cell(2);

      await test.step('resize wider', async () => {
        await cell.click();
        await cell.resize({
          mouse: editor.page.mouse,
          cellSide: 'left',
          moveDirection: 'right',
          moveDistance: 1000,
        });

        expect(await tableModel.hasOverflowed()).toBeTruthy();
      });

      await test.step('resize narrower', async () => {
        await cell.click();
        await cell.resize({
          mouse: editor.page.mouse,
          cellSide: 'right',
          moveDirection: 'left',
          moveDistance: 1000,
        });

        expect(await tableModel.hasOverflowed()).toBeFalsy();
      });
    });

    test('Table: Does not scroll when nested in Bodied Macro, column is resized and breakout button is clicked', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      const cell = await tableModel.cell(1);
      await cell.click();

      const distance = 100;
      await cell.resize({
        mouse: editor.page.mouse,
        cellSide: 'right',
        moveDirection: 'left',
        moveDistance: distance,
      });

      const cellOptions = await cell.options(EditorPopupModel.from(editor));
      await cellOptions.insertColumn();

      expect(await tableModel.hasOverflowed()).toBeFalsy();
    });
  });

  test.describe('Table nested in layout', () => {
    test.use({
      editorProps: {
        appearance: 'full-page',
        allowTables: {
          advanced: true,
          allowDistributeColumns: true,
        },
        allowExpand: true,
        allowLayouts: true,
        allowBreakout: true,
      },
      viewport: { width: 1920, height: 1440 },
      adf: tableInsideFullWidthLayout,
    });

    test('Table: Does not scroll when nested in full-width layout, columns is resized and new column is inserted', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      const cell = await tableModel.cell(1);
      await cell.click();

      expect(await tableModel.hasOverflowed()).toBeFalsy();

      const distance = 100;
      await cell.resize({
        mouse: editor.page.mouse,
        cellSide: 'right',
        moveDirection: 'left',
        moveDistance: distance,
      });

      expect(await tableModel.hasOverflowed()).toBeFalsy();
    });
  });
});
