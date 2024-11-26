import type { EditorPageInterface } from '@af/editor-libra';
import { expect, editorTestCase as test } from '@af/editor-libra';
import {
	EditorEmojiPickerModel,
	EditorFloatingToolbarModel,
	EditorMainToolbarModel,
	EditorMentionModel,
	EditorNodeContainerModel,
	EditorPopupModel,
	EditorTableModel,
} from '@af/editor-libra/page-models';

import { emptyAdf } from '../__fixtures__/base-adfs';

test.describe('z indexes', () => {
	test.use({
		adf: emptyAdf,
		editorProps: {
			appearance: 'full-page',
			allowFindReplace: true,
			allowTables: true,
		},
	});

	test('table trash icon is behiind plus menu dropdown', async ({ editor }) => {
		const { mainToolbarModel, floatingToolbarModel } = await addTable(editor);

		const insertMenuModel = await mainToolbarModel.openInsertMenu();
		await expect(insertMenuModel.insertMenu).toBeVisible();

		await expect(floatingToolbarModel.itemAt('Remove')).not.toBeInSight();
	});

	test('table trash icon is behiind emoji picker', async ({ editor }) => {
		const { mainToolbarModel, floatingToolbarModel } = await addTable(editor);

		await mainToolbarModel.clickAt('Emoji');

		const popup = EditorPopupModel.from(editor);
		const emojiPopup = EditorEmojiPickerModel.from(popup);
		await emojiPopup.toBeVisible();

		await expect(floatingToolbarModel.itemAt('Remove')).not.toBeInSight();
	});

	test('table trash icon is behiind mention picker', async ({ editor }) => {
		const { mainToolbarModel, floatingToolbarModel, tableModel } = await addTable(editor);

		const maiddleCell = await tableModel.cell(4);
		await maiddleCell.click();

		await mainToolbarModel.clickAt('Mention');

		const mentionModel = EditorMentionModel.from(editor);
		await expect(mentionModel.popup).toBeVisible();

		await expect(floatingToolbarModel.itemAt('Remove')).not.toBeInSight();
	});

	async function addTable(editor: EditorPageInterface) {
		const nodes = EditorNodeContainerModel.from(editor);
		const tableModel = EditorTableModel.from(nodes.table);
		const mainToolbarModel = EditorMainToolbarModel.from(editor);
		await mainToolbarModel.clickAt('Table');
		const floatingToolbarModel = EditorFloatingToolbarModel.from(editor, tableModel);
		await floatingToolbarModel.waitForStable();
		await expect(floatingToolbarModel.itemAt('Remove')).toBeVisible();

		return { floatingToolbarModel, tableModel, mainToolbarModel };
	}
});
