import { expect, editorTestCase as test } from '@af/editor-libra';
import { EditorTypeAheadModel } from '@af/editor-libra/page-models';

test.use({
	editorProps: {
		appearance: 'full-page',
		elementBrowser: {
			showModal: true,
			replacePlusMenu: true,
		},
	},
});

test.describe('Quick Insert', () => {
	test('should set selection to after the inserted node', async ({ editor }) => {
		const toolbar = editor.page.getByRole('toolbar', {
			name: 'Editor',
		});
		await toolbar.locator(`button[aria-label*="Insert elements"]`).click();
		await toolbar.locator(`button[data-testid*="view-more-elements-item"]`).click();

		const modal = editor.page.getByTestId('element-browser-modal-dialog');
		await modal.locator(`button[aria-describedby*="Mention"]`).click();
		await modal.locator(`button[data-testid*="ModalElementBrowser__insert-button"]`).click();

		const isFocused = await EditorTypeAheadModel.from(editor).waitForMentionSearchToStart();

		expect(isFocused).toBe(true);
	});

	test('should capture and report a11y violations', async ({ editor }) => {
		const toolbar = editor.page.getByRole('toolbar', {
			name: 'Editor',
		});
		await toolbar.locator(`button[aria-label*="Insert elements"]`).click();
		await toolbar.locator(`button[data-testid*="view-more-elements-item"]`).click();
		const modal = editor.page.getByTestId('element-browser-modal-dialog');
		await modal.locator(`button[aria-describedby*="Mention"]`).click();
		await modal.locator(`button[data-testid*="ModalElementBrowser__insert-button"]`).click();
		const isFocused = await EditorTypeAheadModel.from(editor).waitForMentionSearchToStart();
		expect(isFocused).toBe(true);

		await expect(editor.page).toBeAccessible({ violationCount: 2 });
	});
});
