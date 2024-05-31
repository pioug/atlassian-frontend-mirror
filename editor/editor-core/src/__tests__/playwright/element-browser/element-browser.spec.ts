import {
	EditorMainToolbarModel,
	EditorModalElementBrowserModel,
	expect,
	editorTestCase as test,
} from '@af/editor-libra';

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
});
