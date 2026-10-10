import { editorTestCase as test } from '@af/editor-libra/editor-test-case';
import { expect } from '@af/editor-libra/matchers';
import { EditorEmojiPickerModel } from '@af/editor-libra/page-models/editor-emoji-model';
import { EditorFloatingToolbarModel } from '@af/editor-libra/page-models/editor-floating-toolbar-model';
import { EditorMainToolbarModel } from '@af/editor-libra/page-models/editor-main-toolbar-model';
import { EditorMentionModel } from '@af/editor-libra/page-models/editor-mention-model';
import { EditorNodeContainerModel } from '@af/editor-libra/page-models/editor-node-container-model';
import { EditorPopupModel } from '@af/editor-libra/page-models/editor-popup-model';
import { EditorTableModel } from '@af/editor-libra/page-models/editor-table-model';
import type { EditorPageInterface } from '@af/editor-libra/types';

import { emptyAdf } from '../__fixtures__/base-adfs';

test.describe('z indexes', () => {
	test.use({
		exampleName: 'testing' as keyof typeof import('../../../examples/99-testing.tsx'),
		adf: emptyAdf,
		editorProps: {
			appearance: 'full-page',
			allowFindReplace: true,
			allowTables: true,
		},
	});

	test('table trash icon is behind plus menu dropdown', async ({ editor }) => {
		const { mainToolbarModel, floatingToolbarModel } = await addTable(editor);

		const insertMenuModel = await mainToolbarModel.openInsertMenu();
		await expect(insertMenuModel.insertMenu).toBeVisible();

		await expect(floatingToolbarModel.itemAt('Remove')).not.toBeInSight();
	});

	test('table trash icon is behind emoji picker', async ({ editor }) => {
		const { mainToolbarModel, floatingToolbarModel } = await addTable(editor);

		const emojiButton = await mainToolbarModel.menuItemByLabel('Emoji');
		await expect(emojiButton).toBeVisible();
		await expect(emojiButton).toBeEnabled();
		await emojiButton.dispatchEvent('click');
		await editor.waitForEditorStable();

		const popup = EditorPopupModel.from(editor);
		const emojiPopup = EditorEmojiPickerModel.from(popup);
		await emojiPopup.toBeVisible();

		await expect(floatingToolbarModel.itemAt('Remove')).not.toBeInSight();
	});

	test('table trash icon is behind mention picker', async ({ editor }) => {
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

	test('should capture and report a11y violations', async ({ editor }) => {
		const { mainToolbarModel } = await addTable(editor);
		const insertMenuModel = await mainToolbarModel.openInsertMenu();
		await expect(insertMenuModel.insertMenu).toBeVisible();

		await expect(editor.page).toBeAccessible({ violationCount: 1 });
	});
});
