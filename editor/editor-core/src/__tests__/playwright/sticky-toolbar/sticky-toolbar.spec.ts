import { editorTestCase as test } from '@af/editor-libra/editor-test-case';
import { expect } from '@af/editor-libra/matchers';
import { EditorMainToolbarModel } from '@af/editor-libra/page-models/editor-main-toolbar-model';

test.describe('Sticky Toolbar', () => {
	test.use({
		exampleName: 'testing' as keyof typeof import('../../../../examples/99-testing.tsx'),
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
});
