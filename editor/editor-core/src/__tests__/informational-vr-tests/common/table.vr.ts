import { snapshotInformational } from '@af/visual-regression';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Page, Locator } from '@playwright/test';
import {
  EditorNodeContainerModel,
  EditorTableModel,
  EditorPageModel,
} from '@af/editor-libra/page-models';

import { CONTENT_AREA_TEST_ID } from '../../../ui/Appearance/FullPage/FullPageContentArea';

import { EditorWithTable, EditorWithNestedTable } from './table.fixtures';

snapshotInformational(EditorWithTable, {
  description: 'Table selected on Shift + ArrowUp from top row',
  selector: {
    byTestId: CONTENT_AREA_TEST_ID,
  },
  featureFlags: {
    'platform.editor.custom-table-width': true,
    'platform.editor.table.shift-arrowup-fix': true,
  },
  prepare: async (page: Page, component: Locator) => {
    const editor = await EditorPageModel.from({ page });
    const nodes = EditorNodeContainerModel.from(editor);
    const table = EditorTableModel.from(nodes.table);
    // Place cursor in the cell in the top row
    const cell = await table.cell(2);
    await cell.click();
    await editor.keyboard.press('Shift+ArrowUp');
  },
});

snapshotInformational(EditorWithNestedTable, {
  description: 'Nested table selected on Shift + ArrowUp from top row',
  selector: {
    byTestId: CONTENT_AREA_TEST_ID,
  },
  featureFlags: {
    'platform.editor.table.shift-arrowup-fix': true,
  },
  prepare: async (page: Page, component: Locator) => {
    const editor = await EditorPageModel.from({ page });
    const nodes = EditorNodeContainerModel.from(editor);
    const table = EditorTableModel.from(nodes.table);
    // Place cursor in the cell in the top row
    const cell = await table.cell(2);
    await cell.click();
    await editor.keyboard.press('Shift+ArrowUp');
  },
});
