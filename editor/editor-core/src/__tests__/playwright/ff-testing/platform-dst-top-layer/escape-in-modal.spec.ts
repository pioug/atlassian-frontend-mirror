import { expect, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer';

test.describe('Editor inside a modal on the top layer', () => {
	test.beforeEach(async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../examples/999-editor-comment-in-modal.tsx')
		>('editor', 'editor-core', 'editor-comment-in-modal', { featureFlag });
	});

	test('Escape in the editor closes the modal', async ({ page }) => {
		await page.getByRole('button', { name: 'Open modal' }).click();
		const modal = page.getByRole('dialog', { name: 'Editor inside Modal' });
		const editor = modal.locator('.ProseMirror[contenteditable="true"]');
		await editor.click();
		await expect(editor).toBeFocused();

		await page.keyboard.press('Escape');

		await expect(modal).toBeHidden();
	});

	test('Escape closes the type-ahead menu first, then the modal', async ({ page }) => {
		await page.getByRole('button', { name: 'Open modal' }).click();
		const modal = page.getByRole('dialog', { name: 'Editor inside Modal' });
		const editor = modal.locator('.ProseMirror[contenteditable="true"]');
		await editor.click();
		await page.keyboard.type('/');
		const menu = page.getByRole('listbox');
		await expect(menu).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(menu).toBeHidden();
		await expect(modal).toBeVisible();
		await expect(editor).toBeFocused();

		await page.keyboard.press('Escape');

		await expect(modal).toBeHidden();
	});
});
