import { EditorMainToolbarModel, expect, editorTestCase as test } from '@af/editor-libra';

import { adf } from './box-shadow.spec.ts-fixtures';

test.describe('Box shadow with short browsers', () => {
	test.use({
		viewport: { width: 1280, height: 200 },
		adf,
		editorProps: {
			appearance: 'full-page',
		},
	});

	test('should be none when scroll position is top of page', async ({ editor }) => {
		const toolbar = EditorMainToolbarModel.from(editor);
		await expect(toolbar.wrapper).toHaveCSS('box-shadow', 'none');
	});

	test('should not be none when scroll position is not top of the page', async ({ editor }) => {
		await editor.page.getByText('Last Paragraph').scrollIntoViewIfNeeded();

		const toolbar = EditorMainToolbarModel.from(editor);
		await expect(toolbar.wrapper).not.toHaveCSS('box-shadow', 'none');
	});
});
