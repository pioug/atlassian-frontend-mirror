import {
  editorTestCase as test,
  expect,
  EditorTypeAheadModel,
} from '@af/editor-libra';

test.use({
  editorProps: {
    appearance: 'full-page',
    elementBrowser: {
      showModal: true,
      replacePlusMenu: true,
    },
  },
});

test.describe('Quick Insert', () => {
  test('should set selection to after the inserted node', async ({
    editor,
  }) => {
    const toolbar = editor.page.getByRole('toolbar', {
      name: 'Editor toolbar',
    });
    await toolbar.locator(`button[aria-label*="Insert /"]`).click();
    await toolbar
      .locator(`button[data-testid*="view-more-elements-item"]`)
      .click();

    const modal = editor.page.getByTestId('element-browser-modal-dialog');
    await modal.locator(`button[aria-describedby*="Mention"]`).click();
    await modal
      .locator(`button[data-testid*="ModalElementBrowser__insert-button"]`)
      .click();

    const isFocused = await EditorTypeAheadModel.from(
      editor,
    ).waitForMentionSearchToStart();

    expect(isFocused).toBe(true);
  });
});
