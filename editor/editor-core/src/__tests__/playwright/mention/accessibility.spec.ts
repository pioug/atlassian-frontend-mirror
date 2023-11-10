import {
  editorTestCase as test,
  expect,
  EditorNodeContainerModel,
  EditorInlineNodeA11YModel,
  fixTest,
} from '@af/editor-libra';
import { adfWithMention } from './accessibility.spec.ts-fixtures';

test.describe('feature name: Mention Assistive Text', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
    },
    adf: adfWithMention,
  });

  test('Mention assistive text should contain user name', async ({
    editor,
  }) => {
    fixTest({
      jiraIssueId: 'ED-20848',
      reason:
        'FIXME: This test was manually skipped due to failure on 10/11/2023: https://product-fabric.atlassian.net/browse/ED-20848',
    });
    const nodes = EditorNodeContainerModel.from(editor);
    const accessibilityModel = EditorInlineNodeA11YModel.from(
      nodes.mention.first(),
    );
    await expect(accessibilityModel.assistiveText).toHaveText(
      'Tagged user @Kaitlyn Prouty',
    );
  });
});
