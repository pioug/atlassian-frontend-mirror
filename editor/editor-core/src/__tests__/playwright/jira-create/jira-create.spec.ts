import { editorTestCase as test, expect } from '@af/editor-libra';
export const emptyDoc = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
    },
  ],
};

test.describe('Jira Create', () => {
  test.describe('Full Page', () => {
    test.use({
      adf: emptyDoc,
      editorProps: {
        appearance: 'full-page',
        linking: {
          smartLinks: {},
        },
      },
      editorMountOptions: {
        withLinkCreateJira: true,
      },
    });

    // This test is currently broken when running not in debug mode due to a bug in how Playwright or the editor loads
    // quick insert items. When stepped through in debug mode it passes fine.
    // Ticket to fix: https://product-fabric.atlassian.net/browse/ED-19690
    test.skip('can find jira create in quick insert menu and open popup', async ({
      editor,
    }) => {
      await editor.typeAhead.searchAndInsert('jira');

      await editor.linkCreate.waitForModal();

      await expect(editor.linkCreate.popup).toBeVisible();
    });
  });
});
