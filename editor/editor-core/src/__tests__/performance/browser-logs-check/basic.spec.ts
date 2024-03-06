import {
  expect,
  editorBrowserLogCheckTestCase as test,
} from '@af/editor-libra';

import { bigTable } from '../fixtures';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
  },
  adf: bigTable,
});

test.describe('@complex-full-page__browser-logs-check', () => {
  test.describe('full-page__with-big-table', () => {
    test('load and intercept logs within page example', async ({ editor }) => {
      expect(true).toBe(true);
    });
  });
});
