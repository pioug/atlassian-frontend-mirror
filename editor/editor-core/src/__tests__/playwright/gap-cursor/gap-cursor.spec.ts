import { expect, editorTestCase as test } from '@af/editor-libra';
import {
	EditorExtensionDeleteConfirmationModel,
	EditorExtensionModel,
	EditorFloatingToolbarModel,
	EditorGapCursorModel,
	EditorNodeContainerModel,
} from '@af/editor-libra/page-models';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

import {
	connectedExtensionADF,
	infoPanelADF,
	listWithCodeBlockADF,
} from './gap-cursor.spec.ts-fixtures';

test.describe('Gap-cursor:', () => {
	test.describe('Connected extension', () => {
		test.use({
			editorProps: {
				appearance: 'full-page',
				allowExtension: {},
				allowFragmentMark: true,
			},
			adf: connectedExtensionADF,
		});
		test(`should stay where it was after confirmation dialog closed`, async ({ editor }) => {
			const nodes = EditorNodeContainerModel.from(editor);
			await nodes.extension.first().waitFor({ state: 'visible' });
			await expect(nodes.extension).toHaveCount(2);

			// Initialise the floating toolbar model for extension
			const dataSourceExtensionModel = EditorExtensionModel.from(nodes.extension.first());
			const floatingToolbarModel = EditorFloatingToolbarModel.from(
				editor,
				dataSourceExtensionModel,
			);

			// Click extension
			await dataSourceExtensionModel.waitForStable();
			await dataSourceExtensionModel.clickTitle();

			// Click remove button on the floating toobar of the extension
			await floatingToolbarModel.waitForStable();
			await floatingToolbarModel.remove();

			// Initialize Delete Confirmation Modal
			const confirmationModal = EditorExtensionDeleteConfirmationModel.from(editor);
			await confirmationModal.waitForStable();

			// Validate if the consumer extension - listed in the modal
			await expect(confirmationModal.consumerList).toHaveCount(1);
			await expect(confirmationModal.consumerList.nth(0)).toHaveText('Test Name 2');

			// Click checkbox on the confirmation dialog
			await confirmationModal.checkbox.isEditable();
			await confirmationModal.checkbox.click();

			// Click Delete on the confirmation dialog
			await confirmationModal.confirm();
			await editor.waitForEditorStable();

			// Validate if both the extensions are deleted from the page
			const updatedNodes = EditorNodeContainerModel.from(editor);
			await expect(updatedNodes.extension).toHaveCount(0);

			// Validate document status
			await expect(editor).toMatchDocument(
				doc(
					p(
						"Trying to delete the below extension will result in a confirmation dialog, because it's being used as a data source for the extension at the bottom",
					),
					p('localId: a, b'),
					p(
						'The below extension ⌄⌄⌄ contains a dataConsumer and is linked to the above extension ^b^ ',
					),
					p('localId: c, d '),
				),
			);

			// Gap cursor should be at position 165
			await expect(editor).toHaveSelection({
				type: 'text',
				anchor: 165,
				head: 165,
			});
		});

		test('should capture and report a11y violations', async ({ editor }) => {
			const nodes = EditorNodeContainerModel.from(editor);
			await nodes.extension.first().waitFor({ state: 'visible' });
			await expect(nodes.extension).toHaveCount(2);

			await expect(editor.page).toBeAccessible();
		});
	});
	test.describe('Comment Editor', () => {
		test.use({
			editorProps: {
				appearance: 'comment',
				allowPanel: true,
			},
			adf: infoPanelADF,
		});
		test('gap-cursor: should display to left of block node after hitting left key for comment editor', async ({
			editor,
		}) => {
			await editor.selection.set({ anchor: 2, head: 2 });
			await editor.keyboard.press('ArrowLeft');
			await editor.keyboard.press('ArrowLeft');
			const gapCursorModel = EditorGapCursorModel.from(editor);
			await expect(gapCursorModel.span).toBeVisible();
		});
		test('gap-cursor: should display to right of block node after hitting right key for comment editor', async ({
			editor,
		}) => {
			await editor.selection.set({ anchor: 2, head: 2 });
			await editor.keyboard.press('ArrowRight');
			await editor.keyboard.press('ArrowRight');
			const gapCursorModel = EditorGapCursorModel.from(editor);
			await expect(gapCursorModel.span).toBeVisible();
		});
	});
	test.describe('Full Page Editor', () => {
		test.use({
			editorProps: {
				appearance: 'full-page',
				allowPanel: true,
			},
			adf: infoPanelADF,
		});
		test('gap-cursor: should display to left of block node after hitting left key for full-page editor', async ({
			editor,
		}) => {
			await editor.selection.set({ anchor: 2, head: 2 });
			await editor.keyboard.press('ArrowLeft');
			await editor.keyboard.press('ArrowLeft');
			const gapCursorModel = EditorGapCursorModel.from(editor);
			await expect(gapCursorModel.span).toBeVisible();
		});
		test('gap-cursor: should display to right of block node after hitting right key for full-page editor', async ({
			editor,
		}) => {
			await editor.selection.set({ anchor: 2, head: 2 });
			await editor.keyboard.press('ArrowRight');
			await editor.keyboard.press('ArrowRight');
			const gapCursorModel = EditorGapCursorModel.from(editor);
			await expect(gapCursorModel.span).toBeVisible();
		});
	});
	test.describe('Code Block', () => {
		test.use({
			editorProps: {
				appearance: 'full-page',
			},
			adf: listWithCodeBlockADF,
		});
		test(`gap-cursor: should display next to codeblock when clicked list item with a code block`, async ({
			editor,
		}) => {
			const nodes = EditorNodeContainerModel.from(editor);
			const gapCursorModel = EditorGapCursorModel.from(editor);
			await nodes.bulletList.first().click({
				// The click should be right before the list item (at the marker)
				// and there is no element to allows us target it
				position: {
					x: 0,
					y: 0,
				},
			});
			await expect(gapCursorModel.span).toBeVisible();
		});
	});
});
