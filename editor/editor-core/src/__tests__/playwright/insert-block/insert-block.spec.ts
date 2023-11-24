import {
  editorTestCase as test,
  expect,
  EditorMainToolbarModel,
  EditorPopupModel,
  EditorEmojiPickerModel,
} from '@af/editor-libra';

test.describe('insert-block:', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
    },
  });

  test('opens emoji picker from dropdown after resizing page', async ({
    editor,
  }) => {
    // Sets window width to start wide
    await editor.page.setViewportSize({ width: 3000, height: 750 });

    const toolbar = EditorMainToolbarModel.from(editor);
    await toolbar.clickAt('Emoji');

    const popup = EditorPopupModel.from(editor);

    // Update window size to smaller width.
    await editor.page.setViewportSize({ width: 500, height: 750 });

    const emojiPicker = EditorEmojiPickerModel.from(popup);
    await emojiPicker.toBeVisible();

    await expect(emojiPicker.emojiMenuPopUp).toBeVisible();
  });
});

test.describe('insert-block: with new extensions', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowExtension: { allowAutoSave: true },
      elementBrowser: {
        showModal: true,
        replacePlusMenu: true,
      },
    },
  });

  test('opens emoji picker from dropdown after resizing page', async ({
    editor,
  }) => {
    // Sets window width to start small.
    await editor.page.setViewportSize({ width: 500, height: 750 });

    const toolbar = EditorMainToolbarModel.from(editor);
    await toolbar.clickAt('Emoji');

    const popup = EditorPopupModel.from(editor);

    const emojiPicker = EditorEmojiPickerModel.from(popup);
    await emojiPicker.toBeVisible();

    await expect(emojiPicker.emojiMenuPopUp).toBeVisible();
  });

  test.describe('BlockInsertElementBrowser dropdown', () => {
    test('it should render dropdown on the bottom right of insert button', async ({
      editor,
    }) => {
      const toolbar = EditorMainToolbarModel.from(editor);
      const insertMenuButton = await toolbar.menuItemByLabel('Insert /');
      await insertMenuButton.click();
      const dropdownList = EditorPopupModel.from(editor);

      const insertMenuBoundingBox = await insertMenuButton.boundingBox();
      const dropdownBoundingBox = await dropdownList.popup.boundingBox();
      expect(insertMenuBoundingBox).not.toBe(null);
      expect(dropdownBoundingBox).not.toBe(null);

      const insertMenuBottom =
        insertMenuBoundingBox!.y + insertMenuBoundingBox!.height;
      // Assert that the bottom of the insert menu is above the top of the dropdown.
      expect(insertMenuBottom).toBeLessThanOrEqual(dropdownBoundingBox!.y);

      const insertMenuRight =
        insertMenuBoundingBox!.x + insertMenuBoundingBox!.width;
      const dropdownRight = dropdownBoundingBox!.x + dropdownBoundingBox!.width;
      // Assert that the right of the insert menu is equal to the right of the dropdown.
      expect(insertMenuRight).toBe(dropdownRight);
    });
  });
});
