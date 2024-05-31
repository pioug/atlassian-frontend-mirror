import { EditorAppearanceModel, expect, editorTestCase as test } from '@af/editor-libra';

import { mediumSizeDoc } from './changing-mode.spec.ts-fixtures';

test.describe('Full-Width', () => {
	test.use({
		editorProps: {
			appearance: 'full-page',
			allowTables: {
				advanced: true,
			},
			allowLayouts: {
				allowBreakout: true,
				UNSAFE_addSidebarLayouts: true,
			},
		},
		editorMountOptions: {
			i18n: {
				locale: 'en',
			},
			withTitleFocusHandler: true,
		},
		adf: mediumSizeDoc,
	});

	test('Should transition successfully, without error, when a selection over react nodes exists', async ({
		editor,
	}) => {
		const appearanceModel = EditorAppearanceModel.from(editor);
		await editor.selection.set({ anchor: 314, head: 308 });
		await appearanceModel.toggleAppearanceButton.click();
		await expect(appearanceModel.editorFullWidthContainer).toBeVisible();
	});
});
