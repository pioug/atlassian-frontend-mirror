import {
  EditorPopupModel,
  EditorNodeContainerModel,
  EditorTableModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import sampleSchema from '@atlaskit/editor-test-helpers/schema';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  table,
  tr,
  td,
  th,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  tableWithRowSpan,
  tableInsideColumns,
  tableWithRowSpanAndColSpan,
  twoColFullWidthTableWithContent,
  tableWithMinWidthColumnsDocument,
  createSquareTable,
} from './__fixtures__/resize-documents';

const getTablesWithMultipleSizes = () => {
  return createSquareTable({
    lines: 3,
    columnWidths: [84, 118, 48, 111, 318],
    hasHeader: true,
  })(sampleSchema).toJSON();
};

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
  },
});

test.describe('when there is a rowspan', () => {
  test.use({
    adf: tableWithRowSpan,
  });

  test('Can resize normally with a rowspan in the non last column.', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    const cell = await tableModel.cell(2);
    await cell.click();

    const distance = 50;
    await cell.resize({
      mouse: editor.page.mouse,
      cellSide: 'right',
      moveDirection: 'right',
      moveDistance: distance,
    });

    await expect(editor).toMatchDocumentSnapshot();
  });
});

test.describe('when there is a colspan and rowspan', () => {
  test.use({
    adf: tableWithRowSpanAndColSpan,
  });

  test('Can resize normally', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);

    const tableModel = EditorTableModel.from(nodes.table);

    const cell = await tableModel.cell(3);
    await cell.click();

    const distance = 50;
    await cell.resize({
      mouse: editor.page.mouse,
      cellSide: 'right',
      moveDirection: 'right',
      moveDistance: distance,
    });
    await expect(editor).toMatchDocumentSnapshot();
  });
});

test.describe('when table is inside a full-width document', () => {
  test.use({
    adf: twoColFullWidthTableWithContent,
  });

  test('Can resize normally', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    const cell = await tableModel.cell(2);
    await cell.click();

    const distance = 100;
    await cell.resize({
      mouse: editor.page.mouse,
      cellSide: 'right',
      moveDirection: 'left',
      moveDistance: distance,
    });
    await expect(editor).toMatchDocumentSnapshot();
  });
});

test.describe('when creating a new column', () => {
  test.use({
    adf: tableWithMinWidthColumnsDocument,
  });

  test('should set the width to 140px', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    const cell = await tableModel.cell(4);
    await cell.click();

    const cellOptions = await cell.options(EditorPopupModel.from(editor));
    await cellOptions.insertColumn();
    await expect(editor).toMatchDocumentSnapshot();
  });
});

test.describe('when table is nested in layout', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowTables: {
        advanced: true,
      },
      allowLayouts: true,
    },
  });

  test.use({
    adf: tableInsideColumns,
  });

  test('Can resize normally', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    const cell = await tableModel.cell(4);
    await cell.click();

    const distance = 100;
    await cell.resize({
      mouse: editor.page.mouse,
      cellSide: 'right',
      moveDirection: 'left',
      moveDistance: distance,
    });
    await expect(editor).toMatchDocumentSnapshot();
  });
});

test.describe('when resizing a square table with multiple column widths', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowTables: {
        advanced: true,
      },
    },
  });
  test.use({
    adf: getTablesWithMultipleSizes(),
  });

  test.describe('and when widths of some of the columns equal minWidth', () => {
    test('Should stack columns to the left', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      const cell = await tableModel.cell(4);
      await cell.click();

      const distance = 400;
      await cell.resize({
        mouse: editor.page.mouse,
        cellSide: 'left',
        moveDirection: 'left',
        moveDistance: distance,
      });

      await expect(editor).toMatchDocument(
        createSquareTable({
          lines: 3,
          columnWidths: [48, 48, 48, 48, 487],
          hasHeader: true,
        }),
      );
    });
  });
});

test.describe('when resizing a square table with multiple column widths and custom table width feature flag is enabled', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowTables: {
        advanced: true,
      },
    },
    platformFeatureFlags: { 'platform.editor.custom-table-width': true },
    adf: createSquareTable({
      lines: 3,
      columnWidths: [247, 259, 253],
      hasHeader: true,
    })(sampleSchema).toJSON(),
  });

  test('should overflow and conceal the table inside the container properly', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    const cell = await tableModel.cell(1);
    await cell.click();

    await cell.resize({
      mouse: editor.page.mouse,
      cellSide: 'right',
      moveDirection: 'right',
      moveDistance: 600,
    });

    expect(await tableModel.hasOverflowed()).toBeTruthy();
    // expect table wrapper to be the same width as container
    // to conceal the table properly
    expect(await tableModel.containerWidth()).toBe(760);
    expect(await tableModel.wrapperWidth()).toBe(760);
  });
});

test.describe(`when table is in overflow state`, () => {
  test.use({
    adf: getTablesWithMultipleSizes(),
  });
  const distance = 1000;
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowTables: {
        advanced: true,
      },
    },
  });

  test('should stack columns to the right', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    const cell = await tableModel.cell(0);
    await cell.click();

    await cell.resize({
      mouse: editor.page.mouse,
      cellSide: 'right',
      moveDirection: 'right',
      moveDistance: distance,
    });

    await expect(editor).toMatchDocument(
      createSquareTable({
        lines: 3,
        columnWidths: [1084, 48, 48, 48, 48],
        hasHeader: true,
      }),
    );
  });

  test('should overflow the container', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    const cell = await tableModel.cell(0);
    await cell.click();

    await cell.resize({
      mouse: editor.page.mouse,
      cellSide: 'right',
      moveDirection: 'right',
      moveDistance: distance,
    });

    const hasOverflowed = await tableModel.hasOverflowed();

    expect(hasOverflowed).toBeTruthy();
  });
});

test.describe('when table has no custom column width defined', () => {
  test.describe('and when multiple columns are selected', () => {
    const tableForBulkResize = doc(
      table({ localId: 'localId' })(
        tr(th().any, th().any, th().any, th().any, th().any),
        tr(td().any, td().any, td().any, td().any, td().any),
        tr(td().any, td().any, td().any, td().any, td().any),
      ),
    );

    test.use({
      adf: tableForBulkResize(sampleSchema).toJSON(),
    });

    test.use({
      editorProps: {
        appearance: 'full-page',
        allowTables: {
          advanced: true,
        },
      },
    });

    test('should bulk resize selected columns', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      const cellModel = await tableModel.cell(1);
      await cellModel.click();

      const firstColumn = await tableModel.columnControls({ index: 0 });
      await firstColumn.select();

      const secondColumn = await tableModel.columnControls({ index: 1 });
      await secondColumn.select();

      await cellModel.resize({
        mouse: editor.page.mouse,
        cellSide: 'right',
        moveDirection: 'right',
        moveDistance: 50,
      });

      await expect(editor).toMatchDocument(
        createSquareTable({
          lines: 3,
          columnWidths: [206, 201, 51, 151, 151],
          hasHeader: true,
        }),
      );
    });
  });
});
