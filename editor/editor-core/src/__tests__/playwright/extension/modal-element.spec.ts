import {
  EditorMainToolbarModel,
  EditorModalElementBrowserModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('ModalElement:', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowExtension: {
        allowAutoSave: true,
        allowExtendFloatingToolbars: true,
      },
      allowFragmentMark: true,
      elementBrowser: {
        showModal: true,
        replacePlusMenu: true,
        helpUrl:
          'https://support.atlassian.com/confluence-cloud/docs/what-are-macros/',
      },
      insertMenuItems: [],
    },
    editorMountOptions: {
      withConfluenceMacrosExtensionProvider: true,
    },
  });

  test('should display element list items when new category is clicked on after scrolling', async ({
    editor,
  }) => {
    const toolbar = EditorMainToolbarModel.from(editor);
    const model = EditorModalElementBrowserModel.from(editor);

    const insertMenu = await toolbar.openInsertMenu();

    await insertMenu.viewMoreElementsButton.click();

    await expect(model.modal).toBeVisible();

    await model.listItemsContainer.hover();

    await editor.page.mouse.wheel(0, 1600);

    await editor.waitForEditorStable();

    await expect(model.listItems).not.toHaveCount(10);

    await model.navigationCategory.click();

    await expect(model.listItems).toHaveCount(10);
  });

  test('should add only the highlighted component when using keyboard', async ({
    editor,
  }) => {
    const toolbar = EditorMainToolbarModel.from(editor);
    const model = EditorModalElementBrowserModel.from(editor);

    const insertMenu = await toolbar.openInsertMenu();

    await insertMenu.viewMoreElementsButton.click();

    await expect(model.modal).toBeVisible();

    await editor.keyboard.press('Tab');
    await editor.keyboard.press('Tab');
    await editor.keyboard.press('Tab');
    await editor.keyboard.press('Tab');
    await editor.keyboard.press('Tab');
    await editor.keyboard.press('Tab');

    await editor.keyboard.press('Enter');

    await expect(editor).toHaveDocument(doc(p()));
  });
});
