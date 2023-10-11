import {
  editorTestCase as test,
  expect,
  EditorTypeAheadModel,
  fixTest,
  BROWSERS,
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
    fixTest({
      jiraIssueId: 'ED-20350, ED-20351',
      reason:
        'FIXME: This test was automatically skipped due to failure on 07/10/2023: https://product-fabric.atlassian.net/browse/ED-20350',
      browsers: [BROWSERS.chromium, BROWSERS.webkit],
    });

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
