import {
  EditorMainToolbarModel,
  editorTestCase as test,
  expect,
  EditorTypeAheadModel,
} from '@af/editor-libra';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  taskItem,
  taskList,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('undo-redo ', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowUndoRedoButtons: true,
    },
  });

  test(`should be able to undo & redo via toolbar buttons in the full page editor`, async ({
    editor,
  }) => {
    const toolbar = EditorMainToolbarModel.from(editor);

    await editor.keyboard.type('hello world');

    const undoButton = await toolbar.menuItemByLabel('Undo');
    await expect(undoButton).toBeVisible();
    await undoButton.click();
    await expect(editor).toHaveDocument(doc(p()));

    const redoButton = await toolbar.menuItemByLabel('Redo');
    await expect(redoButton).toBeVisible();
    await redoButton.click();
    await expect(editor).toHaveDocument(doc(p('hello world')));
  });

  const undoShortcut = process.platform === 'darwin' ? 'Meta+z' : 'Control+z';
  const redoShortcut =
    process.platform === 'darwin' ? 'Meta+Shift+z' : 'Control+y';

  test(`should be able to undo & redo via keyboard shortcut`, async ({
    editor,
  }) => {
    await editor.keyboard.type('hello world');

    await editor.keyboard.press(undoShortcut);
    await expect(editor).toHaveDocument(doc(p()));

    await editor.keyboard.press(redoShortcut);
    await expect(editor).toHaveDocument(doc(p('hello world')));
  });

  test.describe('typeahead: ', () => {
    test.describe('when undone twice after insert an item with the typeahead ', () => {
      test('it should keep the focus in the editor', async ({ editor }) => {
        const toolbar = EditorMainToolbarModel.from(editor);
        const typeaheadModel = EditorTypeAheadModel.from(editor);

        await editor.keyboard.type('Movie: ');
        await typeaheadModel.searchAndInsert('Action');

        const undoButton = await toolbar.menuItemByLabel('Undo');
        await expect(undoButton).toBeVisible();
        await undoButton.click();
        await undoButton.click();

        await editor.keyboard.type(' Jackson');

        await expect(editor).toHaveDocument(doc(p('Movie: /Action Jackson')));
      });
    });

    test.describe('when redone after insert an item with the typeahead ', () => {
      test('it should keep the focus in the editor', async ({ editor }) => {
        const toolbar = EditorMainToolbarModel.from(editor);
        const typeaheadModel = EditorTypeAheadModel.from(editor);

        await editor.keyboard.type('Movie: ');
        await typeaheadModel.searchAndInsert('Action');

        const undoButton = await toolbar.menuItemByLabel('Undo');
        await expect(undoButton).toBeVisible();

        const redoButton = await toolbar.menuItemByLabel('Redo');
        await expect(redoButton).toBeVisible();

        await undoButton.click();
        await redoButton.click();

        await editor.keyboard.type('Empire Records');
        await expect(editor).toMatchDocument(
          doc(p('Movie: '), taskList({})(taskItem({})('Empire Records'))),
        );
      });
    });

    test.describe('when the undo button is click when typeahead is opened', () => {
      test('it should undo and close the typeahead without adding the rawtext into the document', async ({
        editor,
      }) => {
        const toolbar = EditorMainToolbarModel.from(editor);
        const typeaheadModel = EditorTypeAheadModel.from(editor);

        const undoButton = await toolbar.menuItemByLabel('Undo');
        await expect(undoButton).toBeVisible();

        await editor.keyboard.type('movie: /action', { delay: 150 });
        await expect(typeaheadModel.popup).toBeVisible();

        await expect(editor).toHaveDocument(doc(p('movie: ')));
      });
    });
  });
});
