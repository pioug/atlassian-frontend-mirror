import {
  editorTestCase as test,
  expect,
  EditorFloatingToolbarModel,
  EditorTableModel,
  EditorNodeContainerModel,
} from '@af/editor-libra';
import { simpleTable } from '../table/__fixtures__/base-adfs';
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
      tableCellOptionsInFloatingToolbar: true,
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
