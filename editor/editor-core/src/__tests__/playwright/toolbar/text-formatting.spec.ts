import { EditorMainToolbarModel, expect, editorTestCase as test } from '@af/editor-libra';
import type { EditorAppearance } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, em, h1, p, strong, underline } from '@atlaskit/editor-test-helpers/doc-builder';

import { blockQuoteAdf } from './text-formatting.spec.ts-fixtures';

const appearances: Array<EditorAppearance> = ['full-page', 'comment'];

const shortcutSelectAll = process.platform === 'darwin' ? 'Meta+a' : 'Control+a';

test.describe('text formatting toolbar: styles', () => {
	for (let appearance of appearances) {
		test.use({
			editorProps: {
				appearance: appearance,
			},
		});

		test(`should be able to select normal text, bold, italics, underline style for ${appearance} editor`, async ({
			editor,
		}) => {
			const toolbar = EditorMainToolbarModel.from(editor);

			await editor.keyboard.type('Hello world');
			await editor.keyboard.press(shortcutSelectAll);

			await expect(editor).toHaveSelection({
				type: 'all',
			});

			await test.step('changing to italic', async () => {
				await toolbar.clickAt('Italic');
				await expect(editor).toHaveDocument(doc(p(em('Hello world'))));
				// reset to normal text
				await toolbar.clickAt('Italic');
			});

			await test.step('changing from italic to bold', async () => {
				await toolbar.clickAt('Bold');
				await expect(editor).toHaveDocument(doc(p(strong('Hello world'))));
				// reset to normal text
				await toolbar.clickAt('Bold');
			});

			await test.step('changing normal to bold and italic', async () => {
				await toolbar.clickAt('Bold');
				await toolbar.clickAt('Italic');
				await expect(editor).toHaveDocument(doc(p(strong(em('Hello world')))));
				// reset to normal text
				await toolbar.clickAt('Bold');
				await toolbar.clickAt('Italic');
			});

			await test.step('changing to underline', async () => {
				const formattingMenu = await toolbar.openMoreFormattingMenu();
				await formattingMenu.clickAt('Underline');
				await expect(editor).toHaveDocument(doc(p(underline('Hello world'))));
			});

			await test.step('changing to underline and italic', async () => {
				await toolbar.clickAt('Italic');
				await expect(editor).toHaveDocument(doc(p(underline(em('Hello world')))));
				// reset italic
				await toolbar.clickAt('Italic');
			});

			await test.step('changing to underline and bold', async () => {
				await toolbar.clickAt('Bold');
				await expect(editor).toHaveDocument(doc(p(underline(strong('Hello world')))));
			});

			await test.step('changing to underline, bold and italic', async () => {
				await toolbar.clickAt('Italic');
				await expect(editor).toHaveDocument(doc(p(underline(strong(em('Hello world'))))));
			});
		});

		test(`should be able to select heading1 for ${appearance} editor`, async ({ editor }) => {
			const toolbar = EditorMainToolbarModel.from(editor);

			await editor.keyboard.type('Hello world');
			await editor.keyboard.press(shortcutSelectAll);

			await expect(editor).toHaveSelection({
				type: 'all',
			});

			const headingMenu = await toolbar.openHeadingMenu();
			await headingMenu.heading1.click();

			await expect(editor).toMatchDocument(doc(h1('Hello world'), p()));
		});
	}
});

test.describe('text formatting toolbar: advanced', () => {
	for (let appearance of appearances) {
		test.use({
			adf: blockQuoteAdf,
			editorProps: {
				appearance: appearance,
			},
		});

		test(`should be able to select Clear Formatting on toolbar for ${appearance} editor for node-based and mark-based formatting`, async ({
			editor,
		}) => {
			const toolbar = EditorMainToolbarModel.from(editor);

			await editor.keyboard.press(shortcutSelectAll);

			await expect(editor).toHaveSelection({
				type: 'all',
			});

			const moreFormattingMenu = await toolbar.openMoreFormattingMenu();

			await moreFormattingMenu.clickAt('Clear formatting');
			await expect(editor).toHaveSelection({
				type: 'all',
			});
			await expect(editor).toHaveDocument(doc(p('hello'), p(`inside block quote`), p('world')));
		});
	}
});
