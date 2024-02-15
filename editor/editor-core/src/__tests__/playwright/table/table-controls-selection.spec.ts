import {
  BROWSERS,
  expect,
  fixTest,
  editorTestCase as test,
} from '@af/editor-libra';

import { tableWidthMultilineDateAdf } from './table-controls-selection.spec.ts-fixtures';

test.describe('table control selection', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowTextAlignment: true,
      allowTables: {
        advanced: true,
        allowColumnResizing: true,
      },
      allowDate: true,
    },
    adf: tableWidthMultilineDateAdf,
  });

  test('Does not select table corner controls when navigating up from a multiline node inside a table', async ({
    editor,
  }) => {
    fixTest({
      jiraIssueId: 'ED-15027',
      reason:
        'TODO: remove and relocate this test once the behaviour has been corrected',
      browsers: [BROWSERS.firefox, BROWSERS.chromium, BROWSERS.webkit],
    });
    await editor.selection.set({ anchor: 27, head: 27 });
    await editor.keyboard.press('ArrowUp');
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 27,
      head: 27,
    });
  });
});
