import type { Locator, Page } from '@playwright/test';

import { EditorMainToolbarModel, EditorPageModel } from '@af/editor-libra/page-models';
import { snapshotInformational } from '@af/visual-regression';

import { EditorWithElementBrowser } from './element-browser.fixtures';

snapshotInformational(EditorWithElementBrowser, {
	description: 'Insert Menu with elementBrowser enabled',
	selector: {
		byTestId: 'element-browser',
	},
	prepare: async (page: Page, component: Locator) => {
		const editor = await EditorPageModel.from({ page });
		const toolbar = EditorMainToolbarModel.from(editor);
		const insertMenu = await toolbar.openInsertMenu();
		// there is subtle difference in how unicode symbol ⏎ (inside search input in search component) shows up on pipeline and locally
		// snapshot generated from pipeline was included with this test
		await expect(insertMenu.searchInput).toBeFocused();
	},
});
