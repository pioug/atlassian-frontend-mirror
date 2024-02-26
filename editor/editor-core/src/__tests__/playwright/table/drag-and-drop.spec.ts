import {
  BROWSERS,
  EditorNodeContainerModel,
  EditorTableModel,
  expect,
  fixTest,
  editorTestCase as test,
} from '@af/editor-libra';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  strong,
  table,
  td,
  th,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import {
  expectedDocFourByFourTableForColumn,
  expectedDocFourByFourTableForColumnInExpand,
  expectedDocFourByFourTableForColumnInMacro,
  expectedDocFourByFourTableForRow,
  expectedDocFourByFourTableForRowInExpand,
  expectedDocFourByFourTableForRowInMacro,
  expectedDocSimpleTableForColumn,
  expectedDocSimpleTableForColumnInExpand,
  expectedDocSimpleTableForColumnInMacro,
  expectedDocSimpleTableForRow,
  expectedDocSimpleTableForRowInExpand,
  expectedDocSimpleTableForRowInMacro,
  expectedDocSimpleTableWithMergedCellForColumn,
  expectedDocSimpleTableWithMergedCellForColumnInExpand,
  expectedDocSimpleTableWithMergedCellForColumnInMacro,
  expectedDocSimpleTableWithMergedCellForRow,
  expectedDocSimpleTableWithMergedCellForRowInExpand,
  expectedDocSimpleTableWithMergedCellForRowInMacro,
  expectedDocTableWithVerticalScrollForColumn,
  expectedDocTableWithVerticalScrollForRow,
  fourByFourTable,
  fourByFourTableNestedInExpand,
  fourByFourTableNestedInMacro,
  simpleTable,
  simpleTableNestedInExpand,
  simpleTableNestedInMacro,
  simpleTableWithMergedCell,
  simpleTableWithMergedCellInExpand,
  simpleTableWithMergedCellInMacro,
  tableWithVerticalScroll,
} from './drag-and-drop.spec.ts-fixtures';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
      stickyHeaders: true,
    },
    featureFlags: {
      'table-drag-and-drop': true,
    },
    allowExpand: true,
    allowExtension: true,
  },
  adf: simpleTable,
  platformFeatureFlags: {
    'platform.editor.custom-table-width': true,
  },
});

const getFixturesForBasicScenarios: Record<
  string,
  {
    adf: string | Record<string, unknown> | Node;
    expected: { row: DocBuilder; column: DocBuilder };
  }
> = {
  'standalone table': {
    adf: simpleTable,
    expected: {
      row: expectedDocSimpleTableForRow,
      column: expectedDocSimpleTableForColumn,
    },
  },
  'table nested in expand': {
    adf: simpleTableNestedInExpand,
    expected: {
      row: expectedDocSimpleTableForRowInExpand,
      column: expectedDocSimpleTableForColumnInExpand,
    },
  },
  'table nested in macro': {
    adf: simpleTableNestedInMacro,
    expected: {
      row: expectedDocSimpleTableForRowInMacro,
      column: expectedDocSimpleTableForColumnInMacro,
    },
  },
};

const getFixturesForMergedCellScenarios: Record<
  string,
  {
    adf: string | Record<string, unknown> | Node;
    expected: { row: DocBuilder; column: DocBuilder };
  }
> = {
  'standalone table with merged cell': {
    adf: simpleTableWithMergedCell,
    expected: {
      row: expectedDocSimpleTableWithMergedCellForRow,
      column: expectedDocSimpleTableWithMergedCellForColumn,
    },
  },
  'table with merged cell nested in expand': {
    adf: simpleTableWithMergedCellInExpand,
    expected: {
      row: expectedDocSimpleTableWithMergedCellForRowInExpand,
      column: expectedDocSimpleTableWithMergedCellForColumnInExpand,
    },
  },
  'table with merged cell nested in macro': {
    adf: simpleTableWithMergedCellInMacro,
    expected: {
      row: expectedDocSimpleTableWithMergedCellForRowInMacro,
      column: expectedDocSimpleTableWithMergedCellForColumnInMacro,
    },
  },
};

const getFixturesForMultipleRowsScenarios: Record<
  string,
  {
    adf: string | Record<string, unknown> | Node;
    expected: { row: DocBuilder; column: DocBuilder };
  }
> = {
  'standalone table': {
    adf: fourByFourTable,
    expected: {
      row: expectedDocFourByFourTableForRow,
      column: expectedDocFourByFourTableForColumn,
    },
  },
  'table nested in expand': {
    adf: fourByFourTableNestedInExpand,
    expected: {
      row: expectedDocFourByFourTableForRowInExpand,
      column: expectedDocFourByFourTableForColumnInExpand,
    },
  },
  'table nested in macro': {
    adf: fourByFourTableNestedInMacro,
    expected: {
      row: expectedDocFourByFourTableForRowInMacro,
      column: expectedDocFourByFourTableForColumnInMacro,
    },
  },
};

test.describe('drag and drop', () => {
  test.describe('row', () => {
    for (const [key, value] of Object.entries(getFixturesForBasicScenarios)) {
      test.describe('basic functionality', () => {
        test.use({
          adf: value.adf,
        });

        test(`should be able to drag first row and drop on first row in ${key}`, async ({
          editor,
        }) => {
          fixTest({
            jiraIssueId: 'ED-22272',
            reason:
              'Locator.hover() flaky in webkit, also flaky to find editor.page, setting up tests in before hooks, etc.',
            browsers: [BROWSERS.webkit],
          });
          const nodes = EditorNodeContainerModel.from(editor);
          const tableModel = EditorTableModel.from(nodes.table);
          await editor.selection.set({ anchor: 5, head: 5 }); // make sure focus is within table

          const firstRow = await tableModel.rowDragControls(0);
          const cell = await tableModel.cell(0);

          await cell.hover();
          await firstRow.dragTo(1, editor);

          await expect(editor).toMatchDocument(value.expected.row);
        });
      });
    }

    for (const [key, value] of Object.entries(
      getFixturesForMergedCellScenarios,
    )) {
      test.describe('table with merged cells', () => {
        test.use({
          adf: value.adf,
        });

        test(`should not be able to drag first row when there are merged cells in ${key}`, async ({
          editor,
        }) => {
          fixTest({
            jiraIssueId: 'ED-22272',
            reason:
              'Locator.hover() flaky in webkit, also flaky to find editor.page, setting up tests in before hooks, etc.',
            browsers: [BROWSERS.webkit],
          });
          const nodes = EditorNodeContainerModel.from(editor);
          const tableModel = EditorTableModel.from(nodes.table);
          await editor.selection.set({ anchor: 5, head: 5 }); // make sure focus is within table
          const firstRow = await tableModel.rowDragControls(0);
          const cell = await tableModel.cell(0);

          await cell.hover();
          await firstRow.dragTo(1, editor);

          await expect(editor).toMatchDocument(value.expected.row);
        });
      });
    }

    for (const [key, value] of Object.entries(
      getFixturesForMultipleRowsScenarios,
    )) {
      test.describe('multiple rows', () => {
        test.use({
          adf: value.adf,
        });

        test(`should be able to drag 3nd and 4rd rows and drop above 1st row in ${key}`, async ({
          editor,
        }) => {
          fixTest({
            jiraIssueId: 'ED-22291',
            reason:
              'Flaky as need to use serveral hover(),and cannot set selection before each hover, as that will lose selecting of first row',
            browsers: [BROWSERS.webkit, BROWSERS.firefox, BROWSERS.chromium],
          });
          const nodes = EditorNodeContainerModel.from(editor);
          const tableModel = EditorTableModel.from(nodes.table);
          await editor.selection.set({ anchor: 57, head: 57 }); // set selection to first cell in third row to make sure focus is within table

          //select the 3rd and 4th rows
          const firstCellInThirdRow = await tableModel.cell(8);
          const firstCellInFourthRow = await tableModel.cell(12);
          const thirdRow = await tableModel.rowDragControls(2);
          const fourthRow = await tableModel.rowDragControls(3);

          await editor.selection.set({ anchor: 57, head: 57 }); // set selection to first cell in third row to make sure focus is within table
          await firstCellInThirdRow.hover();
          await thirdRow.click();
          await thirdRow.click(); // second click to close drag menu so it is not on the way when selecting the next row

          await firstCellInFourthRow.hover();
          await fourthRow.click({ modifiers: ['Shift'] });

          //drag and drop 2 rows to after the first row
          const twoRows = await tableModel.rowDragControls(2);
          await firstCellInThirdRow.hover();
          await twoRows.dragTo(0, editor);

          await expect(editor).toMatchDocument(value.expected.row);
        });
      });
    }

    test.describe('sticky header enabled', () => {
      test.use({
        adf: tableWithVerticalScroll,
      });

      test(`should not be able to drag sticky header row`, async ({
        editor,
      }) => {
        fixTest({
          jiraIssueId: 'ED-22272',
          reason:
            'Locator.hover() flaky in webkit, also flaky to find editor.page, setting up tests in before hooks, etc.',
          browsers: [BROWSERS.webkit],
        });
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);

        const bottom = editor.page.getByText('Bottom');
        await bottom.scrollIntoViewIfNeeded();

        await editor.selection.set({ anchor: 5, head: 5 }); // make sure focus is within table

        const firstRow = await tableModel.rowDragControls(0);
        const cell = await tableModel.cell(0);

        await cell.hover();
        await firstRow.dragTo(23, editor);

        await expect(editor).toMatchDocument(
          expectedDocTableWithVerticalScrollForRow,
        );
      });
    });
  });

  test.describe('column', () => {
    for (const [key, value] of Object.entries(getFixturesForBasicScenarios)) {
      test.describe('basic functionality', () => {
        test.use({
          adf: value.adf,
        });

        test(`should be able to drag first column and drop on second column in ${key}`, async ({
          editor,
        }) => {
          fixTest({
            jiraIssueId: 'ED-22272',
            reason:
              'Locator.hover() flaky in webkit, also flaky to find editor.page, setting up tests in before hooks, etc.',
            browsers: [BROWSERS.webkit],
          });
          const nodes = EditorNodeContainerModel.from(editor);
          const tableModel = EditorTableModel.from(nodes.table);
          await editor.selection.set({ anchor: 5, head: 5 }); // make sure focus is within table

          const firstColumn = await tableModel.columnDragControls(0);
          const cell = await tableModel.cell(0);

          await cell.hover();
          await firstColumn.dragTo(1, editor);

          await expect(editor).toMatchDocument(value.expected.column);
        });
      });
    }

    for (const [key, value] of Object.entries(
      getFixturesForMergedCellScenarios,
    )) {
      test.describe('table with merged cells', () => {
        test.use({
          adf: value.adf,
        });
        test(`should not be able to drag first column when there are merged cells in ${key}`, async ({
          editor,
        }) => {
          fixTest({
            jiraIssueId: 'ED-22272',
            reason:
              'Locator.hover() flaky in webkit, also flaky to find editor.page, setting up tests in before hooks, etc.',
            browsers: [BROWSERS.webkit],
          });
          const nodes = EditorNodeContainerModel.from(editor);
          const tableModel = EditorTableModel.from(nodes.table);
          await editor.selection.set({ anchor: 5, head: 5 }); // make sure focus is within table

          const firstColumn = await tableModel.columnDragControls(0);
          const cell = await tableModel.cell(0);

          await cell.hover();
          await firstColumn.dragTo(1, editor);

          await expect(editor).toMatchDocument(value.expected.column);
        });
      });
    }

    for (const [key, value] of Object.entries(
      getFixturesForMultipleRowsScenarios,
    )) {
      test.describe('multiple columns', () => {
        test.use({
          adf: value.adf,
        });

        test(`should be able to drag 3rd and 4th columns and drop left to second column in ${key}`, async ({
          editor,
        }) => {
          fixTest({
            jiraIssueId: 'ED-22291',
            reason:
              'Flaky as need to use serveral hover(),and cannot set selection before each hover, as that will lose selecting of first column',
            browsers: [BROWSERS.webkit, BROWSERS.firefox, BROWSERS.chromium],
          });
          const nodes = EditorNodeContainerModel.from(editor);
          const tableModel = EditorTableModel.from(nodes.table);
          await editor.selection.set({ anchor: 16, head: 16 }); // set selection to the 3rd cell in first row, make sure focus is within table

          //select the 3rd and 4th columns
          const firstCellInThirdColumn = await tableModel.cell(2);
          const firstCellInFourthColumn = await tableModel.cell(3);
          const thirdColumn = await tableModel.columnDragControls(2);
          const fourthColumn = await tableModel.columnDragControls(3);

          await editor.selection.set({ anchor: 16, head: 16 }); // set selection to the 3rd cell in first row, make sure focus is within table
          await firstCellInThirdColumn.hover();
          await thirdColumn.click();
          await thirdColumn.click(); // second click to close drag menu so it is not on the way when selecting the next column

          await firstCellInFourthColumn.hover();
          await fourthColumn.click({ modifiers: ['Shift'] });

          //drag and drop 2 columns to the left of the second column
          const twoColumns = await tableModel.columnDragControls(2);
          await firstCellInThirdColumn.hover();
          await twoColumns.dragTo(0, editor);

          await expect(editor).toMatchDocument(value.expected.column);
        });
      });
    }

    test.describe('sticky header enabled', () => {
      test.use({
        adf: tableWithVerticalScroll,
      });

      test(`should be able to drag 1st column and drop after the 2nd column`, async ({
        editor,
      }) => {
        fixTest({
          jiraIssueId: 'ED-22272',
          reason:
            'Locator.hover() flaky in webkit, also flaky to find editor.page, setting up tests in before hooks, etc.',
          browsers: [BROWSERS.webkit],
        });
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);

        const bottom = editor.page.getByText('Bottom');
        await bottom.scrollIntoViewIfNeeded();

        await editor.selection.set({ anchor: 5, head: 5 }); // make sure focus is within table

        const firstColumn = await tableModel.columnDragControls(0);
        const cell = await tableModel.cell(0);

        await cell.hover();
        await firstColumn.dragTo(1, editor);

        await expect(editor).toMatchDocument(
          expectedDocTableWithVerticalScrollForColumn,
        );
      });
    });
  });

  test.describe('extended drop zones', () => {
    test.use({
      adf: simpleTable,
    });
    test('should be able to drag first row and drop on second row outside the table border', async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-22272',
        reason:
          'Locator.hover() flaky in webkit, also flaky to find editor.page, setting up tests in before hooks, etc.',
        browsers: [BROWSERS.webkit],
      });
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const firstRow = await tableModel.rowDragControls(0);
      const secondRow = await tableModel.rowDragControls(1);
      const cell = await tableModel.cell(0);

      await cell.hover();

      const cellBoundingBox = await cell.getBoundingBox();

      // need to drag to trigger render of drop zones
      await firstRow.drag(
        { x: cellBoundingBox!.x + 10, y: cellBoundingBox!.y },
        editor,
      );

      await test.step('drop targets should be visible', async () => {
        expect(await secondRow.isDropTargetVisible()).toBeTruthy();
      });

      const dropTargetBoundingBox = await secondRow.dropTargetBoundingBox();

      // move mouse to correct position - use this instead of hover to ensure cursor is outside table
      // the extended drop target is 150px wide, 80 here will ensure we're over the middle of it
      await editor.page.mouse.move(
        dropTargetBoundingBox!.x + 80,
        dropTargetBoundingBox!.y + dropTargetBoundingBox!.height / 1.25,
      );

      await firstRow.drop(editor);

      await expect(editor).toMatchDocument(
        doc(
          table({ isNumberColumnEnabled: false, layout: 'default' })(
            tr(
              th({ background: '#ffffff' })(p('ba')),
              th({ background: '#ffffff' })(p('bb')),
              th({ background: '#ffffff' })(p('bc')),
            ),
            tr(
              td({ background: '#ffffff' })(p(strong('aa'))),
              td({ background: '#ffffff' })(p(strong('ab'))),
              td({ background: '#ffffff' })(p(strong('ac'))),
            ),
            tr(
              td({ background: '#ffffff' })(p('ca')),
              td({ background: '#ffffff' })(p('cb')),
              td({ background: '#ffffff' })(p('cc')),
            ),
          ),
          p(),
        ),
      );
    });
    test('should be able to drag first column and drop on second column outside the table border', async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-22272',
        reason:
          'Locator.hover() flaky in webkit, also flaky to find editor.page, setting up tests in before hooks, etc.',
        browsers: [BROWSERS.webkit],
      });
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const firstColumn = await tableModel.columnDragControls(0);
      const secondColumn = await tableModel.columnDragControls(1);
      const cell = await tableModel.cell(0);

      await cell.hover();

      const cellBoundingBox = await cell.getBoundingBox();

      // need to drag to trigger render of drop zones
      await firstColumn.drag(
        { x: cellBoundingBox!.x + 10, y: cellBoundingBox!.y },
        editor,
      );

      await test.step('drop targets should be visible', async () => {
        expect(await secondColumn.isExtendedDropTargetVisible()).toBeTruthy();
      });

      const dropTargetBoundingBox =
        await secondColumn.extendedDropTargetBoundingBox();

      // // move mouse to correct position - use this instead of hover to ensure cursor is outside table
      await editor.page.mouse.move(
        dropTargetBoundingBox!.x + dropTargetBoundingBox!.width / 2 + 5,
        dropTargetBoundingBox!.y + dropTargetBoundingBox!.height / 1.25,
      );

      await firstColumn.drop(editor);

      await expect(editor).toMatchDocument(
        doc(
          table({ isNumberColumnEnabled: false, layout: 'default' })(
            tr(
              th({ background: '#ffffff' })(p(strong('ab'))),
              th({ background: '#ffffff' })(p(strong('aa'))),
              th({ background: '#ffffff' })(p(strong('ac'))),
            ),
            tr(
              td({ background: '#ffffff' })(p('bb')),
              td({ background: '#ffffff' })(p('ba')),
              td({ background: '#ffffff' })(p('bc')),
            ),
            tr(
              td({ background: '#ffffff' })(p('cb')),
              td({ background: '#ffffff' })(p('ca')),
              td({ background: '#ffffff' })(p('cc')),
            ),
          ),
          p(),
        ),
      );
    });
  });
});
