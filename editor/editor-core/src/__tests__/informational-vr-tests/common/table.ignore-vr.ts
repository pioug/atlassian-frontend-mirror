// eslint-disable-next-line import/no-extraneous-dependencies
import type { Locator, Page } from '@playwright/test';

import { EditorNodeContainerModel } from '@af/editor-libra/page-models/editor-node-container-model';
import { EditorPageModel } from '@af/editor-libra/page-models/editor-page-model';
import { EditorTableModel } from '@af/editor-libra/page-models/editor-table-model';
import { snapshotInformational } from '@af/visual-regression';

import { CONTENT_AREA_TEST_ID } from '../../../ui/Appearance/FullPage/FullPageContentArea';
import { EditorWithNestedTable, EditorWithTable } from './table.fixtures';

snapshotInformational(EditorWithTable, {
	description: 'Table selected on Shift + ArrowUp from top row',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
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
