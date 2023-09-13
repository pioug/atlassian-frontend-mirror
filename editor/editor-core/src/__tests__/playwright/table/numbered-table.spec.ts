import {
  editorTestCase as test,
  expect,
  EditorFloatingToolbarModel,
  EditorTableModel,
  EditorNodeContainerModel,
} from '@af/editor-libra';
import {
  simpleTable,
  simpleTableAndNumberedTable,
} from '../table/__fixtures__/base-adfs';
import {
  resizedColumnWithDefaultWidth,
  resizedTableWithDefaultColumn,
  resizedBothTableAndColumn,
  largeOverflowedTable,
  smallOverflowedTable,
  nestedTable,
} from '../table/__fixtures__/numbered-table-adfs';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
    allowExpand: true,
    featureFlags: {
      floatingToolbarCopyButton: true,
    },
  },
  platformFeatureFlags: { 'platform.editor.custom-table-width': true },
});

const testCases = [
  {
    title: 'default table',
    adf: simpleTable,
    expectation: { on: false, off: false },
  },
  {
    title: 'resized column with default table width',
    adf: resizedColumnWithDefaultWidth,
    expectation: { on: true, off: false },
  },
  {
    title: 'resized table with default column width',
    adf: resizedTableWithDefaultColumn,
    expectation: { on: false, off: false },
  },
  {
    title: 'resized both table and column width',
    adf: resizedBothTableAndColumn,
    expectation: { on: true, off: false },
  },
  {
    title: 'large overflowed table',
    adf: largeOverflowedTable,
    expectation: { on: true, off: true },
  },
  {
    title: 'small overflowed table',
    adf: smallOverflowedTable,
    expectation: { on: true, off: true },
  },
  {
    title: 'nested in expand',
    adf: nestedTable,
    expectation: { on: false, off: false },
  },
];

testCases.forEach(({ title, adf, expectation }) => {
  const expectationText = (expectation: boolean) =>
    expectation ? 'should overflow' : 'should not overflow';
  test.describe(title, () => {
    test.use({
      adf: adf,
    });
    test('toggle numbered column', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const floatingToolbarModel = EditorFloatingToolbarModel.from(
        editor,
        tableModel,
      );
      await test.step(`when on - ${expectationText(
        expectation.on,
      )}`, async () => {
        await floatingToolbarModel.toggleTableOptions();
        await floatingToolbarModel.toggleNumberedColumnTable();
        const hasOverflowed = await tableModel.hasOverflowed();
        expect(hasOverflowed).toBe(expectation.on);
      });
      await test.step(`when off - ${expectationText(
        expectation.off,
      )}`, async () => {
        await floatingToolbarModel.toggleTableOptions();
        await floatingToolbarModel.toggleNumberedColumnTable();
        const hasOverflowed = await tableModel.hasOverflowed();
        expect(hasOverflowed).toBe(expectation.off);
      });
    });
  });
});

test.describe('table alignment', () => {
  test.use({
    adf: simpleTableAndNumberedTable,
  });
  test('should align to the x position of non-numbered table and match the same width', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);
    const numberedTable = await tableModel.tableElement.nth(0).boundingBox();
    const standardTable = await tableModel.tableElement.nth(1).boundingBox();

    const numberedColumnBox = await tableModel.numberedColumnBox();
    expect(numberedColumnBox?.x).toBe(standardTable?.x);

    // using control width + table width instead of the tableModel.containerWidth() or resizerModel.containerWidth()
    // as the border is on the control and table which is visually to user while containers width already match so can't detect the reported issue in ED-19759
    const numberedTableWidth =
      numberedTable!.width + numberedColumnBox!.width - 1;

    //assert the rendered numbered table width in browser is the same as the table without numbered column enabled
    expect(numberedTableWidth).toBe(standardTable?.width);
    //assert the rendered width in browser is the same as stored on the ADF node
    expect(numberedTableWidth).toBe(
      simpleTableAndNumberedTable?.content[0]?.attrs?.width,
    );
  });
});
