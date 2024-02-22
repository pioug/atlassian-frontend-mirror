import {
  EditorAnnotationModel,
  EditorInlineCommentModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { annotation, doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

import {
  noAnnotationADF,
  paragraphADF,
  paragraphEmojiADF,
} from './annotation.spec.ts-fixtures';

test.describe('annotation', () => {
  test.use({
    adf: paragraphADF,
    editorProps: {
      appearance: 'full-page',
    },
    editorMountOptions: {
      providers: {
        annotation: true,
      },
    },
  });

  test(`can open create dialogue from toolbar`, async ({ editor }) => {
    const annotationToolbar = EditorAnnotationModel.from(editor);
    const inlineCommentModel = EditorInlineCommentModel.from(editor);

    await editor.selection.set({ anchor: 5, head: 30 });

    await expect(annotationToolbar.toolbar).toBeVisible();
    await expect(annotationToolbar.inlineCommentButton).toBeEnabled();
    await annotationToolbar.inlineCommentButton.click();
    await expect(inlineCommentModel.inlineCommentPopup).toBeVisible();
  });

  test(`can open create dialogue from keyboard shortcut`, async ({
    editor,
  }) => {
    const annotationToolbar = EditorAnnotationModel.from(editor);
    const inlineCommentModel = EditorInlineCommentModel.from(editor);

    await editor.selection.set({ anchor: 5, head: 30 });

    await editor.keyboard.press(annotationToolbar.inlineCommentShortcut);

    await expect(inlineCommentModel.inlineCommentPopup).toBeVisible();
  });

  test(`can create an annotation from the component`, async ({ editor }) => {
    const annotationToolbar = EditorAnnotationModel.from(editor);
    const inlineCommentModel = EditorInlineCommentModel.from(editor);

    await editor.selection.set({ anchor: 5, head: 30 });

    await expect(annotationToolbar.toolbar).toBeVisible();
    await expect(annotationToolbar.inlineCommentButton).toBeEnabled();
    await annotationToolbar.inlineCommentButton.click();

    await expect(inlineCommentModel.inlineCommentPopup).toBeVisible();
    await expect(inlineCommentModel.inlineCommentEditor).toBeVisible();

    await inlineCommentModel.inlineCommentEditor.focus();
    await expect(inlineCommentModel.inlineCommentEditor).toBeFocused();

    await editor.keyboard.type('Test Comment');
    await inlineCommentModel.inlineCommentSaveButton.click();

    await expect(editor).toHaveDocument(
      doc(
        p(
          'Lore',
          annotation({
            // @ts-expect-error Type '"inlineComment"' is not assignable to type 'AsymmetricMatcher | AnnotationTypes'.
            annotationType: 'inlineComment',
            id: 'inline-comment-id',
          })('m ipsum dolor sit amet, c'),
          'onsectetur adipiscing elit.',
        ),
      ),
    );
  });

  test(`toolbar shows up when selecting whole paragraph and releasing mouse outside editor`, async ({
    editor,
  }) => {
    const OFFSET_OUTSIDE_EDITOR = 10;
    const annotationToolbar = EditorAnnotationModel.from(editor);

    const rectStart = await editor.selection.setCursor({ position: 1 });
    const rectEnd = await editor.selection.setCursor({ position: 57 });

    await editor.page.mouse.move(rectEnd.x, rectEnd.y);
    await editor.page.mouse.down();
    await editor.page.mouse.move(
      rectStart.x - OFFSET_OUTSIDE_EDITOR,
      rectStart.y,
    );
    await editor.page.mouse.up();
    await expect(annotationToolbar.toolbar).toBeVisible();
    await expect(annotationToolbar.inlineCommentButton).toBeEnabled();
  });
});

test.describe('annotation', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
    },
    editorMountOptions: {
      providers: {
        annotation: true,
      },
    },
  });

  test.describe('when emojis is part of the selection', () => {
    test.use({
      adf: paragraphEmojiADF,
    });
    test(`cannot create annotation dialogue from keyboard shortcut with emoji inside the selection`, async ({
      editor,
    }) => {
      const annotationToolbar = EditorAnnotationModel.from(editor);
      const inlineCommentModel = EditorInlineCommentModel.from(editor);

      await test.step('selecting from 🙂 until right before "ipsum"', async () => {
        await editor.selection.set({ anchor: 4, head: 17 });
      });

      await editor.keyboard.press(annotationToolbar.inlineCommentShortcut);
      await expect(inlineCommentModel.inlineCommentPopup).toBeHidden();
    });

    test(`toolbar is visible but inline comment button is disabled`, async ({
      editor,
    }) => {
      const annotationToolbar = EditorAnnotationModel.from(editor);

      await editor.selection.set({ anchor: 1, head: 30 });
      await expect(annotationToolbar.toolbar).toBeVisible();
      await expect(annotationToolbar.inlineCommentButton).toBeDisabled();
    });
  });
});

test.describe('annotation: temporary highlight', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowTables: true,
    },
    editorMountOptions: {
      providers: {
        annotation: true,
      },
    },
    adf: noAnnotationADF,
  });

  test('temporary highlight shows up correctly with different content', async ({
    editor,
  }) => {
    await editor.page.setViewportSize({
      width: 600,
      height: 1200,
    });
    await editor.waitForEditorStable();
    const annotationToolbar = EditorAnnotationModel.from(editor);

    const rectStart = await editor.selection.setCursor({ position: 1 });
    const rectEnd = await editor.selection.setCursor({ position: 735 });

    await editor.page.mouse.move(rectStart.x, rectStart.y);
    await editor.page.mouse.down();
    await editor.page.mouse.move(rectEnd.x, rectEnd.y);
    await editor.page.mouse.up();

    await expect(annotationToolbar.toolbar).toBeVisible();
    await expect(annotationToolbar.inlineCommentButton).toBeEnabled();
    await annotationToolbar.inlineCommentButton.click();
    await expect(annotationToolbar.draft.first()).toBeVisible();

    const AMOUNT_OF_TEXT_BLOCKS = 12;
    await expect(annotationToolbar.draft).toHaveCount(AMOUNT_OF_TEXT_BLOCKS);
  });
});
