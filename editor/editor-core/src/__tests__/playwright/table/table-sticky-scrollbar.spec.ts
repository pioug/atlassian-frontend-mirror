import {
  EditorNodeContainerModel,
  EditorTableModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';
import {
  tableWith3rows5Cols,
  tableWith30rows5Cols,
  tableWithParagraphsBeforeIt,
} from './__fixtures__/overflown-tables-adfs';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
  },
  adf: tableWith30rows5Cols,
  platformFeatureFlags: {
    'platform.editor.table-sticky-scrollbar': true,
  },
});

test.describe('Table sticky scrollbar', () => {
  test.describe('should be visible', () => {
    test('when bottom part of the table is below the viewport', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const stickyScrollbar = await tableModel.stickyScrollbar();

      expect(await stickyScrollbar.isVisible()).toBeTruthy();
    });

    test('when top and bottom parts of the table are outside of the viewport', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const cell = await tableModel.cell(79);
      await cell.click();
      const stickyScrollbar = await tableModel.stickyScrollbar();

      expect(await stickyScrollbar.isVisible()).toBeTruthy();
    });
  });

  test.describe('should be hidden', () => {
    test.describe('when both', () => {
      test.use({
        adf: tableWith3rows5Cols,
      });

      test('top and bottom parts of the table are in the viewport', async ({
        editor,
      }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        const stickyScrollbar = await tableModel.stickyScrollbar();

        expect(await stickyScrollbar.isHidden()).toBeTruthy();
      });
    });

    test.describe('when only top part of the table is in the viewport', () => {
      test.use({
        adf: tableWithParagraphsBeforeIt,
      });

      test('and less than three rows of the table are in the viewport', async ({
        editor,
      }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        const stickyScrollbar = await tableModel.stickyScrollbar();

        expect(await stickyScrollbar.isHidden()).toBeTruthy();
      });
    });
  });
});
