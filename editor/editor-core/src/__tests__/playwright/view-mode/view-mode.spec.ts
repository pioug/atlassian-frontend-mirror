import {
	EditorAnnotationModel,
	EditorInlineCommentModel,
	EditorMainToolbarModel,
	expect,
	editorViewModeTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { annotation, doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

import { justText } from './view-mode.spec.ts-fixtures';

test.describe('view mode', () => {
	test.use({
		adf: justText,
	});

	test.describe('when view mode is enabled', () => {
		test('editor content is not editable', async ({ editor }) => {
			await editor.setViewMode('view');
			await expect(editor.content).toHaveAttribute('contentEditable', 'false');
		});
	});

	test.describe('when view mode is disabled', () => {
		test('editor content is editable', async ({ editor }) => {
			await editor.setViewMode('edit');
			await expect(editor.content).toHaveAttribute('contentEditable', 'true');
		});
	});
});

test.describe('view mode - Toolbar', () => {
	test.use({
		adf: justText,
	});

	test.describe('when view mode is enabled', () => {
		test('the main toolbar is hidden', async ({ editor }) => {
			const model = EditorMainToolbarModel.from(editor);

			await editor.setViewMode('view');

			await expect(model.mainToolbar).toBeHidden();
		});
	});

	test.describe('when view mode is disabled', () => {
		test('the main toolbar is visible', async ({ editor }) => {
			const model = EditorMainToolbarModel.from(editor);

			await editor.setViewMode('edit');

			await expect(model.mainToolbar).toBeVisible();
		});
	});
});

test.describe('view mode - NCS initialise', () => {
	test.describe('when editor and collab is ready', () => {
		test('should add a data-attribute to Editor main component', async ({ editor }) => {
			await expect(editor.content).toHaveAttribute('data-has-collab-initialised', 'true');
		});
	});
});

test.describe('view mode - annotations', () => {
	test.use({
		adf: justText,
	});

	test.describe('when view mode is enabled', () => {
		test('inline comment toolbar should show up', async ({ editor }) => {
			const annotationToolbar = EditorAnnotationModel.from(editor);

			await editor.setViewMode('view');
			await editor.selection.set({ anchor: 14, head: 20 });

			await expect(annotationToolbar.toolbar).toBeVisible();
		});

		test.describe('and when an inline comment is created', () => {
			test('should call the ccollab comment endpoint', async ({ editor }) => {
				const annotationToolbar = EditorAnnotationModel.from(editor);
				const inlineCommentModel = EditorInlineCommentModel.from(editor);

				const commentAPIResquestPromise = editor.page.waitForRequest(
					'*/**/ccollab/document/**/comment',
				);

				await editor.setViewMode('view');

				await editor.selection.set({ anchor: 14, head: 20 });

				await expect(annotationToolbar.toolbar).toBeVisible();

				await annotationToolbar.inlineCommentButton.click();

				await expect(inlineCommentModel.inlineCommentPopup).toBeVisible();
				await expect(inlineCommentModel.inlineCommentEditor).toBeVisible();

				await inlineCommentModel.inlineCommentEditor.focus();
				await expect(inlineCommentModel.inlineCommentEditor).toBeFocused();

				await editor.keyboard.type('Test Comment');
				await inlineCommentModel.inlineCommentSaveButton.click();

				await commentAPIResquestPromise;
			});

			test('should update the document', async ({ editor }) => {
				const annotationToolbar = EditorAnnotationModel.from(editor);
				const inlineCommentModel = EditorInlineCommentModel.from(editor);

				const commentAPIResponsePromise = editor.page.waitForResponse(
					'*/**/ccollab/document/**/comment',
				);

				await editor.setViewMode('view');

				await editor.selection.set({ anchor: 14, head: 20 });

				await expect(annotationToolbar.toolbar).toBeVisible();

				await annotationToolbar.inlineCommentButton.click();

				await expect(inlineCommentModel.inlineCommentPopup).toBeVisible();
				await expect(inlineCommentModel.inlineCommentEditor).toBeVisible();

				await inlineCommentModel.inlineCommentEditor.focus();
				await expect(inlineCommentModel.inlineCommentEditor).toBeFocused();

				await editor.keyboard.type('Test Comment');
				await inlineCommentModel.inlineCommentSaveButton.click();

				await commentAPIResponsePromise;

				await editor.waitForEditorStable();

				await expect(editor).toHaveDocument(
					doc(
						p('Lorem ipsum'),
						p(
							annotation({
								// @ts-expect-error Type '"inlineComment"' is not assignable to type 'AsymmetricMatcher | AnnotationTypes'.
								annotationType: 'inlineComment',
								id: 'inline-comment-id',
							})('Second'),
							' ipsum',
						),
					),
				);
			});
		});

		// We need to fix the annotation flow before uses those tests
		// see: packages/editor/editor-plugin-editor-viewmode/src/plugin.ts
		// test.describe('and when the server does not respond', () => {
		//   test('should not apply the local modifications', async ({ editor }) => {
		//     const annotationToolbar = EditorAnnotationModel.from(editor);
		//     const inlineCommentModel = EditorInlineCommentModel.from(editor);

		//     await editor.page.route('*/**/ccollab/document/**/comment', (route) =>
		//       route.abort(),
		//     );

		//     await editor.setViewMode('view');

		//     await editor.selection.set({ anchor: 14, head: 20 });

		//     await expect(annotationToolbar.toolbar).toBeVisible();

		//     await annotationToolbar.inlineCommentButton.click();

		//     await expect(inlineCommentModel.inlineCommentPopup).toBeVisible();
		//     await expect(inlineCommentModel.inlineCommentEditor).toBeVisible();

		//     await inlineCommentModel.inlineCommentEditor.focus();
		//     await expect(inlineCommentModel.inlineCommentEditor).toBeFocused();

		//     await editor.keyboard.type('Test Comment');
		//     await inlineCommentModel.inlineCommentSaveButton.click();
		//     await inlineCommentModel.inlineCommentCancel.click();

		//     await expect(editor).toHaveDocument(
		//       doc(p('Lorem ipsum'), p('Second ipsum')),
		//     );
		//   });
		// });
	});
});
