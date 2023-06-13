import { expect } from '@af/integration-testing';
import {
  EditorMainToolbarModel,
  EditorNodeContainerModel,
  EditorTableModel,
  editorTestCase as test,
} from '@af/editor-libra';

const inlineCardLongNameSlowResolveUrl =
  'https://inlineCardTestUrl/longNameSlowResolve';
test.use({
  editorProps: {
    appearance: 'full-page',
    smartLinks: {
      allowEmbeds: true,
    },
    allowTables: {
      advanced: true,
    },
  },
  editorMountOptions: {
    providers: {
      cards: true,
    },
  },
});
test('table row controls should be same height as table body after a long title smart link finishes async rendering', async ({
  editor,
  editorResizeWatcher,
}) => {
  const toolbar = EditorMainToolbarModel.from(editor);
  const { table, inlineCard } = EditorNodeContainerModel.from(editor);
  const tableModel = EditorTableModel.from(table);

  await toolbar.clickAt('Table');

  const cell = await tableModel.cell(1);

  await cell.click();

  await editorResizeWatcher.watchElementResize({
    selector: '.pm-table-row-controls',
    componentName: 'tableRowControls',
  });
  await editorResizeWatcher.watchElementResize({
    selector: 'table tbody',
    componentName: 'tableBody',
  });

  await editor.simulatePasteEvent({
    pasteAs: 'text/plain',
    text: inlineCardLongNameSlowResolveUrl,
  });

  await inlineCard.isVisible();

  const currentTableBodyHeight =
    editorResizeWatcher.getLastComponentResize('tableBody')?.height;
  const currentTableRowControls =
    editorResizeWatcher.getLastComponentResize('tableRowControls')?.height;

  expect(currentTableBodyHeight).toBeTruthy();
  expect(currentTableRowControls).toBeTruthy();
  expect(currentTableBodyHeight).toEqual(currentTableRowControls);
});
