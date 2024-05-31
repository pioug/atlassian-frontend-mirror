import {
	EditorMainToolbarModel,
	EditorUploadMediaModel,
	expect,
	FileResourcesAvailable,
	editorTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
	blockquote,
	doc,
	expand,
	li,
	ol,
	p,
	table,
	taskItem,
	taskList,
	td,
	tr,
	ul,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { nestedNumberedListDocument, numberedListDocument } from '../../__fixtures__/base-adfs';

import {
	blockquoteAdf,
	blockquoteInsideExpandAdf,
	blockquoteInsideTableAdf,
} from './__fixtures__/blockquote';

test.describe('List inside a blockquote', () => {
	test.use({
		editorProps: {
			appearance: 'full-page',
		},
		platformFeatureFlags: {
			'platform.editor.allow-list-in-blockquote': true,
		},
	});
	test.describe('List in a non-nested blockquote', () => {
		test.use({
			adf: blockquoteAdf,
		});

		test(`should insert a bullet list on typing - inside blockquote`, async ({ editor }) => {
			await editor.selection.set({ anchor: 2, head: 2 });
			await editor.keyboard.type('- ');
			await expect(editor).toMatchDocument(doc(blockquote(ul(li(p(''))))));
		});

		test(`should be able to insert nested lists  - inside blockquote`, async ({ editor }) => {
			await editor.selection.set({ anchor: 2, head: 2 });
			await editor.keyboard.type('- ');
			await editor.keyboard.type('item 1');
			await editor.keyboard.press('Enter');
			await editor.keyboard.press('Tab');
			await expect(editor).toMatchDocument(doc(blockquote(ul(li(p('item 1'), ul(li(p(''))))))));
		});

		test(`should remove a list item inside blockquote on pressing delete Key`, async ({
			editor,
		}) => {
			await editor.selection.set({ anchor: 2, head: 2 });
			await editor.keyboard.type('- ');
			await editor.keyboard.press('Backspace');
			await expect(editor).toMatchDocument(doc(blockquote(p(''))));
		});

		test(`should insert an action item outside the blockquote on trying to add an action item in a list inside blockquote`, async ({
			editor,
		}) => {
			await editor.selection.set({ anchor: 2, head: 2 });
			// Add a list item
			await editor.keyboard.type('- item 1');
			await editor.keyboard.press('Enter');
			// Add an action item from the toolbar
			const toolbar = EditorMainToolbarModel.from(editor);
			await toolbar.clickAt('Action item');
			// action item should be inserted outside the blockquote
			await expect(editor).toMatchDocument(
				doc(
					blockquote(ul(li(p('item 1')), li(p('')))),
					taskList({})(taskItem({ state: 'TODO' })('')),
				),
			);
		});
	});

	test.describe('List inside a blockquote nested in a table', () => {
		test.use({
			adf: blockquoteInsideTableAdf,
			editorProps: {
				allowTables: true,
			},
		});

		test(`should insert an ordered list on typing 1.  inside blockquote`, async ({ editor }) => {
			await editor.selection.set({ anchor: 5, head: 5 });
			await editor.keyboard.type('1. ');
			await expect(editor).toMatchDocument(
				doc(table({ localId: 'abc' })(tr(td()(blockquote(ol()(li(p(''))))), td()(p('')))), p('')),
			);
		});
	});

	test.describe('List inside a blockquote nested in an expand', () => {
		test.use({
			adf: blockquoteInsideExpandAdf,
			editorProps: {
				allowExpand: true,
			},
		});

		test(`should insert a bullet list on typing - inside blockquote`, async ({ editor }) => {
			await editor.selection.set({ anchor: 9, head: 9 });
			await editor.keyboard.type('- ');
			await expect(editor).toMatchDocument(
				doc(expand()(blockquote(p('abcd'), ul(li(p(''))))), p('')),
			);
		});
	});

	test.describe('Media inside list within a blockquote', () => {
		test.use({
			adf: blockquoteAdf,
			editorProps: {
				appearance: 'full-page',
				media: {
					allowMediaSingle: true,
					allowAltTextOnImages: true,
				},
			},
		});

		test(`should be able to add media and remove it (via backspace)`, async ({ editor }) => {
			const uploadModel = EditorUploadMediaModel.from(editor);
			await editor.selection.set({ anchor: 2, head: 2 });
			await editor.keyboard.type('1. ');

			await uploadModel.upload({
				actionToTriggerUpload: async () => {
					await editor.typeAhead.searchAndInsert('Image');
				},
				fileToUpload: FileResourcesAvailable.SMALL_IMAGE_9_KB,
			});

			await editor.keyboard.press('Backspace');
			await editor.keyboard.press('Backspace');

			await expect(editor).toMatchDocument(doc(blockquote(ol()(li(p(''))))));
		});
	});
});

test.describe('quick-insert: numbered list', () => {
	test.use({
		adf: numberedListDocument,
	});

	test('Insert blockquote in numbered list', async ({ editor }) => {
		await editor.selection.set({ anchor: 6, head: 6 });
		await editor.keyboard.type(' ');

		await editor.typeAhead.searchAndInsert('quote');

		await expect(editor).toMatchDocument(
			doc(
				ol({ order: 1 })(li(p('one '))),
				blockquote(p('')),
				ol({ order: 2 })(li(p('two')), li(p('three'))),
				p(''),
			),
		);
	});

	test('Insert Blockquote in the middle of numbered list', async ({ editor }) => {
		await editor.selection.set({ anchor: 5, head: 5 });
		await editor.keyboard.type(' ');

		await editor.typeAhead.searchAndInsert('quote');

		await expect(editor).toMatchDocument(
			doc(
				ol({ order: 1 })(li(p('on '))),
				blockquote(p('')),
				ol({ order: 2 })(li(p('e')), li(p('two')), li(p('three'))),
				p(''),
			),
		);
	});

	test('Insert Blockquote in the beginning of numbered list', async ({ editor }) => {
		await editor.selection.set({ anchor: 3, head: 3 });

		await editor.typeAhead.searchAndInsert('quote');

		await expect(editor).toMatchDocument(
			doc(
				ol({ order: 1 })(li(p())),
				blockquote(p('')),
				ol({ order: 2 })(li(p('one')), li(p('two')), li(p('three'))),
				p(''),
			),
		);
	});

	test('Insert Blockquote in the end of numbered list', async ({ editor }) => {
		await editor.selection.set({ anchor: 22, head: 22 });
		await editor.keyboard.type(' ');

		await editor.typeAhead.searchAndInsert('quote');

		await expect(editor).toMatchDocument(
			doc(ol({ order: 1 })(li(p('one')), li(p('two')), li(p('three '))), blockquote(p('')), p('')),
		);
	});
});

test.describe('quick-insert: nested numbered list', () => {
	test.use({
		adf: nestedNumberedListDocument,
	});

	test('Insert Blockquote in nested numbered list', async ({ editor }) => {
		await editor.selection.set({ anchor: 16, head: 16 });
		await editor.keyboard.type(' ');

		await editor.typeAhead.searchAndInsert('quote');

		await expect(editor).toMatchDocument(
			doc(
				ol({ order: 1 })(
					li(p('one'), ol({ order: 1 })(li(p('nested ')))),
					li(p('two')),
					li(p('three')),
				),
				blockquote(p('')),
				p(''),
			),
		);
	});

	test('Insert Blockquote in the middle of nested numbered list', async ({ editor }) => {
		await editor.selection.set({ anchor: 15, head: 15 });
		await editor.keyboard.type(' ');

		await editor.typeAhead.searchAndInsert('quote');

		await expect(editor).toMatchDocument(
			doc(
				ol({ order: 1 })(
					li(p('one'), ol({ order: 1 })(li(p('neste d')))),
					li(p('two')),
					li(p('three')),
				),
				blockquote(p('')),
				p(''),
			),
		);
	});

	test('Insert Blockquote in the beginning of nested numbered list', async ({ editor }) => {
		await editor.selection.set({ anchor: 10, head: 10 });

		await editor.typeAhead.searchAndInsert('quote');

		await expect(editor).toMatchDocument(
			doc(
				ol({ order: 1 })(
					li(p('one'), ol({ order: 1 })(li(p('nested')))),
					li(p('two')),
					li(p('three')),
				),
				blockquote(p('')),
				p(''),
			),
		);
	});

	test('Insert Blockquote in the end of nested numbered list', async ({ editor }) => {
		await editor.selection.set({ anchor: 16, head: 16 });
		await editor.keyboard.type(' ');

		await editor.typeAhead.searchAndInsert('quote');

		await expect(editor).toMatchDocument(
			doc(
				ol({ order: 1 })(
					li(p('one'), ol({ order: 1 })(li(p('nested ')))),
					li(p('two')),
					li(p('three')),
				),
				blockquote(p('')),
				p(''),
			),
		);
	});
});
