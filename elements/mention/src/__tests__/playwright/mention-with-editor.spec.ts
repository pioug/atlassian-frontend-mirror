import { expect } from '@af/integration-testing';
import { test } from './mention';

const EXAMPLE = 'mention-with-editor-extending-abstract-mention-resource';

test.describe('Mention with Editor Extending Abstract Mention Resource', () => {
	test('should render editor with mention functionality', async ({ mention }) => {
		await mention.init(EXAMPLE);

		// Verify the editor is present and focusable
		const editorTextArea = mention.editClickWrapper;
		await expect(editorTextArea).toBeVisible();
	});

	test('should trigger mention picker when typing @ in editor', async ({ mention }) => {
		await mention.init(EXAMPLE);

		// Focus on the editor
		const editorTextArea = mention.editClickWrapper;
		await expect(editorTextArea).toBeVisible();
		await editorTextArea.click();

		// Type @ to trigger mention picker
		await editorTextArea.pressSequentially('@');

		// Verify mention list to appear
		await expect(mention.akTypeaheadItems.first()).toBeVisible();
	});

	test('should highlight first mention item', async ({ mention }) => {
		await mention.init(EXAMPLE);

		const editorTextArea = mention.editClickWrapper;
		await expect(editorTextArea).toBeVisible();
		await editorTextArea.click();

		// Type @ to trigger mention picker
		await editorTextArea.pressSequentially('@');

		// Wait for option to be visible
		await expect(mention.akTypeaheadItems.first()).toBeVisible();

		// Should highlight the first mention item by default
		await expect(mention.akTypeaheadItems.first()).toHaveAttribute('aria-selected', 'true');
	});

	test('should handle keyboard navigation in mention list', async ({ mention }) => {
		await mention.init(EXAMPLE);

		const editorTextArea = mention.editClickWrapper;
		await expect(editorTextArea).toBeVisible();
		await editorTextArea.click();

		// Trigger mention picker
		await editorTextArea.pressSequentially('@');

		// Wait for mention list
		await expect(mention.akTypeaheadItems.nth(1)).toBeVisible();

		// First item should be selected initially
		await expect(mention.akTypeaheadItems.first()).toHaveAttribute('aria-selected', 'true');
		await expect(mention.akTypeaheadItems.nth(1)).toHaveAttribute('aria-selected', 'false');

		// Test keyboard navigation to select second item
		await mention.page.keyboard.press('ArrowDown');

		await expect(mention.akTypeaheadItems.nth(1)).toHaveAttribute('aria-selected', 'true');
	});

	test('should select mention item with mouse click', async ({ mention }) => {
		await mention.init(EXAMPLE);

		const editorTextArea = mention.editClickWrapper;
		await expect(editorTextArea).toBeVisible();
		await editorTextArea.click();

		// Trigger mention picker
		await editorTextArea.pressSequentially('@');

		// Wait for mention list
		await expect(mention.akTypeaheadItems.nth(1)).toBeVisible();

		const secondItemText = await mention.akTypeaheadItems.nth(1).textContent();

		// Click on the first mention item
		await mention.akTypeaheadItems.nth(1).click();

		// Mention list should disappear
		await expect(mention.akTypeaheadItems.first()).toBeHidden();

		// Editor should contain the selected mention
		const mentionInEditor = mention.editClickWrapper;
		await expect(mentionInEditor).toBeVisible();

		await expect(mentionInEditor).toContainText(`@${secondItemText}`);
	});

	test('should close mention picker with Escape key', async ({ mention }) => {
		await mention.init(EXAMPLE);

		const editorTextArea = mention.editClickWrapper;
		await expect(editorTextArea).toBeVisible();
		await editorTextArea.click();

		// Trigger mention picker
		await editorTextArea.pressSequentially('@');

		// Wait for mention list to appear
		await expect(mention.akTypeaheadItems.first()).toBeVisible();

		// Press Escape to close the mention picker
		await mention.page.keyboard.press('Escape');

		// Mention list should disappear
		await expect(mention.akTypeaheadItems.first()).toBeHidden();
	});

	test('should support typing text before and after mentions', async ({ mention }) => {
		await mention.init(EXAMPLE);

		const editorTextArea = mention.editClickWrapper;
		await expect(editorTextArea).toBeVisible();
		await editorTextArea.click();

		// Type some initial text
		await editorTextArea.pressSequentially('Hello @');

		// Wait for mention list to appear
		await expect(mention.akTypeaheadItems.first()).toBeVisible();
	});
});
