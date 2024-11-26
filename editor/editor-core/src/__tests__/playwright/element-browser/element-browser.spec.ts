import { expect, editorTestCase as test } from '@af/editor-libra';
import {
	EditorInsertMenuModel,
	EditorMainToolbarModel,
	EditorModalElementBrowserModel,
} from '@af/editor-libra/page-models';

test.use({
	editorProps: {
		appearance: 'full-width',
		elementBrowser: {
			showModal: true,
			replacePlusMenu: true,
		},
	},
});

test.describe('ElementBrowser', () => {
	test('should have element items visible in the container', async ({ editor }) => {
		const toolbar = EditorMainToolbarModel.from(editor);
		const elementBrowserModel = EditorModalElementBrowserModel.from(editor);
		const insertMenu = await toolbar.openInsertMenu();

		await insertMenu.viewMoreElementsButton.click();

		await expect(elementBrowserModel.modal).toBeVisible();
		await expect(elementBrowserModel.listItemsContainer).toBeVisible();
		await expect(elementBrowserModel.listItems.first()).toBeVisible();
	});

	test('should close on ESC and navigate inside', async ({ editor }) => {
		const toolbar = EditorMainToolbarModel.from(editor);
		const insertMenuModel = EditorInsertMenuModel.from(editor);
		const elementBrowserModel = EditorModalElementBrowserModel.from(editor);

		await insertMenuModel.insertMenu.press('Enter');
		await expect(toolbar.droplistContentMenuPopup).toBeVisible();
		await expect(elementBrowserModel.searchInput).toBeFocused();
		await elementBrowserModel.searchInput.press('Escape');
		await expect(toolbar.droplistContentMenuPopup).toBeHidden();
	});
});
