import {
  editorTestCase as test,
  expect,
  fixTest,
  BROWSERS,
} from '@af/editor-libra';
import { simpleTableAfterParagraph } from './__fixtures__/base-adfs';
test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
  },

  adf: simpleTableAfterParagraph,
});

test('ED-14152: pressing arrow down above table should move cursor into first row', async ({
  editor,
}) => {
  fixTest({
    jiraIssueId: 'DTR-155',
    reason:
      'Pressing ArrowDown before a table in Firefox does not move the cursor into the table',
    browsers: [BROWSERS.firefox],
  });
  await editor.selection.set({ anchor: 4, head: 4 });

  await editor.keyboard.press('ArrowDown');

  await expect(editor).toHaveSelection({
    type: 'text',
    anchor: 13,
    head: 13,
  });
});
