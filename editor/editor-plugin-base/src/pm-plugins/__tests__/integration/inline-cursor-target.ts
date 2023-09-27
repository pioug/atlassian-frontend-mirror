// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  editable,
  fullpage,
} from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { getDocFromElement } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import { paragraphWithTwoAdjacentInlineNodes } from './__fixtures__/base-adfs';

describe('inline-cursor-target', () => {
  describe('should not prevent users entering text between inline nodes', () => {
    // FIXME: This test was automatically skipped due to failure on 25/04/2023: https://product-fabric.atlassian.net/browse/ED-17593
    BrowserTestCase(
      'when entering plain text',
      // the inline-cursor-target plugin is only used in chrome and firefox
      {
        // skip: ['safari'],
        skip: ['*'],
      },
      async (client: any, testName: string) => {
        const page = await goToEditorTestingWDExample(client);
        await mountEditor(page, {
          appearance: 'full-page',
          defaultValue: paragraphWithTwoAdjacentInlineNodes,
        });

        // select the editor (should place cursor at the end of the paragraph)
        await page.click(fullpage.placeholder);

        // move the cursor between the two nodes
        await page.keys(['ArrowLeft', 'ArrowLeft']);

        // type some content between the nodes
        await page.keys(['h', 'e', 'l', 'l', 'o']);

        // move the cursor to select the emoji to the right of the newly inserted text
        await page.keys(['ArrowRight']);

        const doc = await page.$eval(editable, getDocFromElement);

        expect(doc).toMatchCustomDocSnapshot(testName);
      },
    );
  });
});
