import { expect, editorTestCase as test } from '@af/editor-libra';
import { EditorNodeContainerModel } from '@af/editor-libra/page-models';

import { adfWithParagraph } from './node-anchor.spec-fixtures';

test.describe('native node anchor', () => {
	test.use({
		editorProps: {
			appearance: 'full-page',
		},
		adf: adfWithParagraph,
	});

	test('should render node anchor correct', async ({ editor, page }) => {
		const editorModel = EditorNodeContainerModel.from(editor);

		// Check if the date node has the correct attributes data-node-anchor
		await expect(editorModel.paragraph.first()).toHaveAttribute(
			'data-node-anchor',
			'--anchor-paragraph-0',
		);
		await expect(editorModel.paragraph.last()).toHaveAttribute(
			'data-node-anchor',
			'--anchor-paragraph-41',
		);
		await expect(page).toBeAccessible();
	});

	test('should render node anchor correctly when collision', async ({ editor, page }) => {
		const editorModel = EditorNodeContainerModel.from(editor);

		await editor.selection.set({ anchor: 40, head: 40 });
		await editor.keyboard.press('Enter');

		// Check if the date node has the correct attributes data-node-anchor
		await expect(editorModel.paragraph.first()).toHaveAttribute(
			'data-node-anchor',
			'--anchor-paragraph-0',
		);

		const allParagraph = await editorModel.paragraph.all();
		const newParagraph = allParagraph.at(1);
		await expect(newParagraph!).toHaveAttribute('data-node-anchor', '--anchor-paragraph-41-0');
		await expect(editorModel.paragraph.last()).toHaveAttribute(
			'data-node-anchor',
			'--anchor-paragraph-41',
		);
		await expect(page).toBeAccessible();
	});
});
