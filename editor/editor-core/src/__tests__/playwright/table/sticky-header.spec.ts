import {
  EditorTableModel,
  EditorNodeContainerModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';
import { tableWithScoll } from './__fixtures__/base-adfs';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
      stickyHeaders: true,
    },
    allowStatus: true,
  },
  adf: tableWithScoll,
});

test.describe('sticky header', () => {
  test.describe('fixed floating contextual button', async () => {
    test('should hide / show when scrolled outside / inside the bounds of the table', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      const scrollAnchor = await nodes.table.locator('[localid="scroll-here"]');
      await scrollAnchor.scrollIntoViewIfNeeded();

      await test.step('set selection in header row first cell and expect fixed contextual button to show', async () => {
        await editor.selection.set({ anchor: 4, head: 4 });
        const stickyHeader = await tableModel.stickyHeader();
        expect(await stickyHeader.isFixedContextButtonVisible()).toBeTruthy();
      });

      await test.step('scroll table and expect fixed contextual button to hide', async () => {
        await tableModel.scrollTable(editor, 300);
        const stickyHeader = await tableModel.stickyHeader();
        expect(await stickyHeader.isFixedContextButtonHidden()).toBeTruthy();
      });

      await test.step('set selection in header row last cell, scroll to the table end and expect fixed contextual button to show', async () => {
        await editor.selection.set({ anchor: 16, head: 16 });
        await tableModel.scrollTable(editor, 2000);
        const stickyHeader = await tableModel.stickyHeader();
        expect(await stickyHeader.isFixedContextButtonVisible()).toBeTruthy();
      });

      await test.step('scroll to the table start and expect fixed contextual button to hide', async () => {
        await tableModel.scrollTable(editor, -2000);
        const stickyHeader = await tableModel.stickyHeader();
        expect(await stickyHeader.isFixedContextButtonHidden()).toBeTruthy();
      });
    });
  });
});
