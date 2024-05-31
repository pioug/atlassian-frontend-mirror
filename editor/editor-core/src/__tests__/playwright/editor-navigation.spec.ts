import { expect, editorTestCase as test } from '@af/editor-libra';

const helloWorldADF = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'hello world',
				},
			],
		},
	],
};

test.describe('editor: line navigation', () => {
	test.use({
		adf: helloWorldADF,
		editorProps: {
			appearance: 'full-page',
			// DTR-2024: We found a regression comming from media plugin.
			media: {},
		},
	});

	test.describe('when user hits CMD+ArrowLeft', () => {
		const arrowLeftShortcut =
			process.platform === 'darwin' ? 'Meta+ArrowLeft' : 'Control+ArrowLeft';
		test('should move the cursor at the beginning of the line', async ({ editor }) => {
			// Put the selection right after the space in "Hello World!"
			await editor.selection.set({ anchor: 7, head: 7 });

			await editor.keyboard.press(arrowLeftShortcut);

			await expect(editor).toHaveSelection({
				anchor: 1,
				head: 1,
				type: 'text',
			});
		});
	});

	test.describe('when user hits CMD+ArrowRight', () => {
		const arrowRightShortcut =
			process.platform === 'darwin' ? 'Meta+ArrowRight' : 'Control+ArrowRight';
		test('should move the cursor at the end of the line', async ({ editor }) => {
			// Put the selection right after the space in "Hello World!"
			await editor.selection.set({ anchor: 7, head: 7 });

			await editor.keyboard.press(arrowRightShortcut);

			await expect(editor).toHaveSelection({
				anchor: 12,
				head: 12,
				type: 'text',
			});
		});
	});

	test.describe('when user hits CMD+Shift+ArrowLeft', () => {
		const arrowLeftShiftShortcut =
			process.platform === 'darwin' ? 'Meta+Shift+ArrowLeft' : 'Control+Shift+ArrowLeft';
		test('should create a text selection starting from the cursor until the beginning of the line', async ({
			editor,
		}) => {
			// Put the selection right after the space in "Hello World!"
			await editor.selection.set({ anchor: 7, head: 7 });

			await editor.keyboard.press(arrowLeftShiftShortcut);

			await expect(editor).toHaveSelection({
				anchor: 7,
				head: 1,
				type: 'text',
			});
		});
	});

	test.describe('when user hits CMD+Shift+ArrowRight', () => {
		const arrowRightShiftShortcut =
			process.platform === 'darwin' ? 'Meta+Shift+ArrowRight' : 'Control+Shift+ArrowRight';
		test('should create a text selection starting from the cursor until the end of the line', async ({
			editor,
		}) => {
			// Put the selection right after the space in "Hello World!"
			await editor.selection.set({ anchor: 7, head: 7 });

			await editor.keyboard.press(arrowRightShiftShortcut);

			await expect(editor).toHaveSelection({
				anchor: 7,
				head: 12,
				type: 'text',
			});
		});
	});
});
