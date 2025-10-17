import { expect, editorTestCase as test } from '@af/editor-libra';
import { EditorMainToolbarModel } from '@af/editor-libra/page-models';

test.describe('Sticky Toolbar', () => {
	test.use({
		editorProps: {
			appearance: 'comment',
		},
	});
	test('Typeahead popup should be above the sticky toolbar', async ({ editor }) => {
		const toolbar = EditorMainToolbarModel.from(editor);
		await editor.page.setViewportSize({
			width: 1000,
			height: 100,
		});
		await editor.typeAhead.search('');
		const boldButton = await toolbar.menuItemByLabel('Bold');
		await expect(boldButton).not.toBeInSight();
	});

	test('should capture and report a11y violations', async ({ editor }) => {
		const toolbar = EditorMainToolbarModel.from(editor);
		await editor.page.setViewportSize({
			width: 1000,
			height: 100,
		});
		await editor.typeAhead.search('');
		const boldButton = await toolbar.menuItemByLabel('Bold');
		await expect(boldButton).toBeVisible();

		await expect(editor.page).toBeAccessible({ violationCount: 1 });
	});
});
