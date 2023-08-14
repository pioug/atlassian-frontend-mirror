import {
  editorTestCase as test,
  expect,
  EditorTitleFocusModel,
  EditorNodeContainerModel,
  fixTest,
} from '@af/editor-libra';
import { multipleCustomPanels } from './editor-focus.spec.ts-fixtures';

test.describe('when there is a title managing the focus', () => {
  test.use({
    adf: multipleCustomPanels,
    editorProps: {
      // this is a weird way to enable the Title in the

      appearance: 'full-page',
      allowPanel: {
        allowCustomPanel: true,
        allowCustomPanelEdit: true,
      },
    },
    editorMountOptions: {
      withTitleFocusHandler: true,
    },
  });

  test.describe('and when user focus on title', () => {
    test('it should disable editor', async ({ editor }) => {
      const focusModel = EditorTitleFocusModel.from(editor);
      await focusModel.title.click();

      await expect(focusModel.editorLocator).toHaveAttribute(
        'contenteditable',
        'false',
      );
    });
  });

  test.describe('and when user clicks on a panel', () => {
    test('it should enable editor', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const thirdPanel = nodes.panel.nth(2);

      const focusModel = EditorTitleFocusModel.from(editor);
      await focusModel.title.click();

      await thirdPanel.click();

      await expect(focusModel.editorLocator).toHaveAttribute(
        'contenteditable',
        'true',
      );
    });

    test('it should set the selection to the panel clicked', async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-19417',
        reason:
          'FIXME: This test was manually skipped due to failure on 10/08/2023: https://product-fabric.atlassian.net/browse/ED-19417',
      });
      const nodes = EditorNodeContainerModel.from(editor);
      const thirdPanel = nodes.panel.nth(2);

      const focusModel = EditorTitleFocusModel.from(editor);
      await focusModel.title.click();

      await thirdPanel.click();

      await expect(editor).toHaveSelection({
        anchor: 76,
        head: 76,
        type: 'text',
      });
    });
  });
});
