import { expect, editorTestCase as test } from '@af/editor-libra';
import { EditorTypeAheadModel } from '@af/editor-libra/page-models';
import { skipAutoA11y } from '@atlassian/a11y-playwright-testing';
test.use({
	exampleName: 'testing' as keyof typeof import('../../../../examples/99-testing.tsx') ,
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
		// This test exposes one or more accessibility violations. Testing is currently skipped but violations need to
		// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
		// the next line and associated import. For more information, see go/afm-a11y-tooling:playwright
		skipAutoA11y();
		const toolbar = editor.page.getByRole('toolbar', {
			name: 'Editor',
		});
		await toolbar.locator(`button[aria-label*="Insert elements"]`).click();
		await toolbar.locator(`button[data-testid*="view-more-elements-item"]`).click();

		const modal = editor.page.getByTestId('element-browser-modal-dialog');
		await modal.locator(`button[aria-label*="Mention"]`).click();
		await modal.locator(`button[data-testid*="ModalElementBrowser__insert-button"]`).click();

		const isFocused = await EditorTypeAheadModel.from(editor).waitForMentionSearchToStart();

		expect(isFocused).toBe(true);
	});

	test('should capture and report a11y violations', async ({ editor }) => {
		// This test exposes one or more accessibility violations. Testing is currently skipped but violations need to
		// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
		// the next line and associated import. For more information, see go/afm-a11y-tooling:playwright
		skipAutoA11y();
		const toolbar = editor.page.getByRole('toolbar', {
			name: 'Editor',
		});
		await toolbar.locator(`button[aria-label*="Insert elements"]`).click();
		await toolbar.locator(`button[data-testid*="view-more-elements-item"]`).click();
		const modal = editor.page.getByTestId('element-browser-modal-dialog');
		await modal.locator(`button[aria-label*="Mention"]`).click();
		await modal.locator(`button[data-testid*="ModalElementBrowser__insert-button"]`).click();
		const isFocused = await EditorTypeAheadModel.from(editor).waitForMentionSearchToStart();
		expect(isFocused).toBe(true);

		await expect(editor.page).toBeAccessible({ violationCount: 2 });
	});
});
