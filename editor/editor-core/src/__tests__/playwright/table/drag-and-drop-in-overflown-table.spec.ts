import {
  EditorNodeContainerModel,
  EditorTableModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';
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
  overflownTable,
  overflownTableWithScroll,
} from './drag-and-drop-in-overflown-table.spec.ts-fixtures';

test.describe('drag and drop', () => {
  test.describe('overflown table without sticky header', () => {
    test.use({
      editorProps: {
        appearance: 'full-page',
        allowTables: {
          advanced: true,
        },
        featureFlags: {
          'table-drag-and-drop': true,
        },
      },
      adf: overflownTable,
      platformFeatureFlags: {
        'platform.editor.custom-table-width': true,
      },
    });

    test('should be able to drag first column, scroll and drop onto last column', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const firstColumn = await tableModel.columnDragControls(0);
      const cell = await tableModel.cell(0);

      await cell.hover();

      await firstColumn.dragTo(4, editor, true);
      await expect(editor).toMatchDocument(
        doc(
          table({
            isNumberColumnEnabled: false,
            layout: 'default',
            localId: 'abc-123',
            width: 633,
          })(
            tr(
              th({ colwidth: [180] })(p(strong('ab'))),
              th({ colwidth: [180] })(p(strong('ac'))),
              th({ colwidth: [180] })(p(strong('ad'))),
              th({ colwidth: [180] })(p(strong('ae'))),
              th({ colwidth: [180] })(p(strong('aa'))),
            ),
            tr(
              td({ colwidth: [180] })(p('bb')),
              td({ colwidth: [180] })(p('bc')),
              td({ colwidth: [180] })(p('bd')),
              td({ colwidth: [180] })(p('be')),
              td({ colwidth: [180] })(p('ba')),
            ),
            tr(
              td({ colwidth: [180] })(p('cb')),
              td({ colwidth: [180] })(p('cc')),
              td({ colwidth: [180] })(p('cd')),
              td({ colwidth: [180] })(p('ce')),
              td({ colwidth: [180] })(p('ca')),
            ),
          ),
          p(),
        ),
      );
    });
  });

  test.describe('overflown table with sticky header', () => {
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
      },
      adf: overflownTableWithScroll,
      platformFeatureFlags: {
        'platform.editor.custom-table-width': true,
      },
    });

    test('should be able to drag first column, scroll and drop onto last column when there is sticky header', async ({
      editor,
    }) => {
      await editor.page.setViewportSize({ width: 1000, height: 560 });

      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const firstColumn = await tableModel.columnDragControls(0);
      const lastColumn = await tableModel.columnDragControls(4);
      const cell = await tableModel.cell(0);

      await tableModel.selectTable();
      await editor.page.mouse.wheel(0, 100);
      await editor.waitForEditorStable();

      await cell.click();
      await cell.hover();

      await firstColumn.clickClickableZone();
      await editor.waitForEditorStable();

      await test.step('sticky header should be visible', async () => {
        const stickyModel = await tableModel.stickyHeader();
        await expect(stickyModel.stickyRow).toBeVisible();
      });

      await firstColumn.drag(-1, editor, true); // -1 is the last column index

      await test.step('drop targets should be visible', async () => {
        expect(await lastColumn.isDropTargetVisible()).toBeTruthy();
      });
      const dropTargetBoundingBox = await lastColumn.dropTargetBoundingBox();

      await editor.page.mouse.move(
        dropTargetBoundingBox!.x + dropTargetBoundingBox!.width / 1.25,
        dropTargetBoundingBox!.y,
        { steps: 10 },
      );

      await firstColumn.drop(editor);

      await expect(editor).toMatchDocument(
        doc(
          table({
            isNumberColumnEnabled: false,
            layout: 'default',
            localId: 'abc-123',
            width: 633,
          })(
            tr(
              th({ colwidth: [180] })(p(strong('ab'))),
              th({ colwidth: [180] })(p(strong('ac'))),
              th({ colwidth: [180] })(p(strong('ad'))),
              th({ colwidth: [180] })(p(strong('ae'))),
              th({ colwidth: [180] })(p(strong('aa'))),
            ),
            tr(
              td({ colwidth: [180] })(p('bb')),
              td({ colwidth: [180] })(p('bc')),
              td({ colwidth: [180] })(p('bd')),
              td({ colwidth: [180] })(p('be')),
              td({ colwidth: [180] })(p('ba')),
            ),
            tr(
              td({ colwidth: [180] })(p('cb')),
              td({ colwidth: [180] })(p('cc')),
              td({ colwidth: [180] })(p('cd')),
              td({ colwidth: [180] })(p('ce')),
              td({ colwidth: [180] })(p('ca')),
            ),
            tr(
              td({ colwidth: [180] })(p('db')),
              td({ colwidth: [180] })(p('dc')),
              td({ colwidth: [180] })(p('dd')),
              td({ colwidth: [180] })(p('de')),
              td({ colwidth: [180] })(p('da')),
            ),
            tr(
              td({ colwidth: [180] })(p('eb')),
              td({ colwidth: [180] })(p('ec')),
              td({ colwidth: [180] })(p('ed')),
              td({ colwidth: [180] })(p('ee')),
              td({ colwidth: [180] })(p('ea')),
            ),
          ),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
        ),
      );
    });
  });
});
