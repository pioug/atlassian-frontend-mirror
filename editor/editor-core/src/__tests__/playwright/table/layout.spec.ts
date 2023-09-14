// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import sampleSchema from '@atlaskit/editor-test-helpers/schema';
import {
  EditorNodeContainerModel,
  EditorTableModel,
  EditorExtensionModel,
  EditorBreakoutModel,
  editorTestCase as test,
  EditorPopupModel,
  expect,
  fixTest,
} from '@af/editor-libra';
import { createSquareTable } from './__fixtures__/resize-documents';
import { nestedInExtension, nestedInLayout } from './__fixtures__/base-adfs';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  table,
  tr,
  td,
  layoutSection,
  layoutColumn,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
  },
});
test.describe('when a table is overflowed', () => {
  const squareTable = createSquareTable({
    lines: 3,
    // The default line length is 720.
    // So, if the sum of column width is bigger than that then the table will overflow
    columnWidths: [700, 48, 48],
    hasHeader: true,
  });

  test.use({
    adf: squareTable(sampleSchema).toJSON(),
  });

  test.describe('and when the table layout changes', () => {
    test('should not overflow the table anymore', async ({ editor }) => {
      fixTest({
        jiraIssueId: 'DTR-1547',
        reason:
          'Regression found when we were migrating the original test case',
      });
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      await test.step('make sure the table is overflowed already', async () => {
        expect(await tableModel.hasOverflowed()).toBeTruthy();
      });

      const tableLayoutModel = await tableModel.layout(editor);

      await test.step('change table layout to wide and do not overflow', async () => {
        await tableLayoutModel.toWide();
        expect(await tableModel.hasOverflowed()).toBeFalsy();
      });

      await test.step('change table layout to full width and do not overflow', async () => {
        await tableLayoutModel.toFullWidth();
        expect(await tableModel.hasOverflowed()).toBeFalsy();
      });

      await test.step('change table layout back to center and do not overflow', async () => {
        await tableLayoutModel.toCenter();
        expect(await tableModel.hasOverflowed()).toBeFalsy();
      });
    });
  });
});

test.describe('when a table is not overflowed', () => {
  const squareTable = createSquareTable({
    lines: 3,
    columnWidths: [200, 200, 200],
    hasHeader: true,
  });

  test.use({
    adf: squareTable(sampleSchema).toJSON(),
  });

  test.describe('and when the table layout changes', () => {
    test('should not overflow table', async ({ editor }) => {
      fixTest({
        jiraIssueId: 'DTR-1547',
        reason:
          'Regression found when we were migrating the original test case',
      });
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      await test.step('make sure the table is not overflowed', async () => {
        expect(await tableModel.hasOverflowed()).toBeFalsy();
      });

      const tableLayoutModel = await tableModel.layout(editor);

      await test.step('change table layout to wide and do not overflow', async () => {
        await tableLayoutModel.toWide();
        expect(await tableModel.hasOverflowed()).toBeFalsy();
      });

      await test.step('change table layout to full width and do not overflow', async () => {
        await tableLayoutModel.toFullWidth();
        expect(await tableModel.hasOverflowed()).toBeFalsy();
      });

      await test.step('change table layout back to center and do not overflow', async () => {
        await tableLayoutModel.toCenter();
        expect(await tableModel.hasOverflowed()).toBeFalsy();
      });
    });
  });
});

test.describe('when a table is nested inside an extension', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowTables: {
        advanced: true,
      },

      allowExtension: {
        allowBreakout: true,
      },
      allowBreakout: true,
    },
  });

  test.use({
    adf: nestedInExtension,
  });

  test.describe('and when bodied extension parent layout changes', () => {
    test('Scales down column sizes', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      await test.step('resize column until overflow table', async () => {
        const cell = await tableModel.cell(1);
        await cell.click();

        await cell.resize({
          mouse: editor.page.mouse,
          cellSide: 'right',
          moveDirection: 'right',
          moveDistance: 800,
        });

        expect(await tableModel.hasOverflowed()).toBeTruthy();
      });

      const extensionModel = EditorExtensionModel.from(nodes.bodiedExtension);

      const extensionLayoutModel = await extensionModel.layout(editor);

      await test.step('change layout to wide and do not overflow', async () => {
        // There is a bug forcing the selection to go inside the extension when we change the layout
        // Select extension
        await editor.selection.set({ anchor: 1, head: 1 });

        await extensionLayoutModel.toWide();
        expect(await tableModel.hasOverflowed()).toBeFalsy();
      });

      await test.step('change layout to full width and do not overflow', async () => {
        // Select extension
        await editor.selection.set({ anchor: 1, head: 1 });

        await extensionLayoutModel.toFullWidth();
        expect(await tableModel.hasOverflowed()).toBeFalsy();
      });

      await test.step('change layout back to center and do not overflow', async () => {
        // Select extension
        await editor.selection.set({ anchor: 1, head: 1 });

        await extensionLayoutModel.toCenter();
        expect(await tableModel.hasOverflowed()).toBeFalsy();
      });
    });
  });
});

test.describe('when a table with custom width is nested inside an layout', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowTables: {
        advanced: true,
      },

      allowLayouts: {
        allowBreakout: true,
      },

      allowBreakout: true,
    },
  });

  test.use({
    adf: nestedInLayout,
  });

  test.describe('and when layout node changes the breakout format', () => {
    test('Scales down column sizes', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      await test.step('resize column until overflow table', async () => {
        const cell = await tableModel.cell(1);
        await cell.click();

        await cell.resize({
          mouse: editor.page.mouse,
          cellSide: 'right',
          moveDirection: 'right',
          moveDistance: 800,
        });

        expect(await tableModel.hasOverflowed()).toBeTruthy();
      });

      // Select the empty layout section
      await editor.selection.set({ anchor: 49, head: 49 });

      const breakoutModel = EditorBreakoutModel.from(editor);

      await test.step('change layout to wide and do not overflow', async () => {
        await breakoutModel.toWide();
        expect(await tableModel.hasOverflowed()).toBeFalsy();
      });

      await test.step('change layout to full width and do not overflow', async () => {
        await breakoutModel.toFullWidth();
        expect(await tableModel.hasOverflowed()).toBeFalsy();
      });

      await test.step('change layout back to center and do not overflow', async () => {
        await breakoutModel.toCenter();
        expect(await tableModel.hasOverflowed()).toBeFalsy();
      });
    });
  });
});

test.describe('when a table without column widths is nested inside an layout', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowTables: {
        advanced: true,
      },

      allowLayouts: {
        allowBreakout: true,
      },

      allowBreakout: true,
    },
  });

  const simpleTableNestedInLayout = doc(
    // prettier-ignore
    layoutSection(
      layoutColumn({ width: 50 })(
        table()(
          tr(
            td().any,
            td().any,
            td().any,
          ),
          tr(
            td().any,
            td().any,
            td().any,
          ),
        ),
      ),
      layoutColumn({ width: 50 })(p('')),
    ),
  );

  test.use({
    adf: simpleTableNestedInLayout(sampleSchema).toJSON(),
  });

  test.describe('and when a new column is inserted', () => {
    test('should not overflow the table', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      await test.step('insert new column', async () => {
        const cell = await tableModel.cell(1);
        await cell.click();

        const cellOptions = await cell.options(EditorPopupModel.from(editor));
        await cellOptions.insertColumn();
      });

      expect(await tableModel.hasOverflowed()).toBeFalsy();
    });
  });
});
