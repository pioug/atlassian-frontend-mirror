import { editorTestCase as test, expect, BROWSERS } from '@af/editor-libra';
import { inlineCardAdf } from './inline-selection.spec.ts-fixtures/adf';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { p, doc } from '@atlaskit/editor-test-helpers/doc-builder';

test.use({
  adf: inlineCardAdf,
  editorProps: {
    appearance: 'full-page',
    allowTextAlignment: true,
    smartLinks: {},
  },
});

test.describe('card', () => {
  test('press up key under a long smart link will select the link', async ({
    editor,
    browserName,
  }) => {
    // This test is only relevant for chromium as this issue was reported for a chromium bug: https://product-fabric.atlassian.net/browse/ED-13066. UI behaviour is slightly different for chrome and firefox.
    // eslint-disable-next-line playwright/no-conditional-in-test
    if (browserName === BROWSERS.chromium) {
      await editor.page.click('.inlineCardView-content-wrap');
      await editor.keyboard.press('ArrowRight');
      // This makes sure the cursor is place at right
      await editor.keyboard.type(' right');
      // Should select media inline and override by text
      await editor.keyboard.press('ArrowUp');
      await editor.keyboard.type('inline card');
      await expect(editor).toHaveDocument(
        doc(p('line 1'), p('line 2'), p('inline card right line 3')),
      );
    }
  });
});
