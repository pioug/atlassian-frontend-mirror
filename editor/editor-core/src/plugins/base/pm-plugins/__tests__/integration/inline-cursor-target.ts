import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  fullpage,
  editable,
} from '../../../../../__tests__/integration/_helpers';
import { getDocFromElement } from '../../../../../__tests__/__helpers/page-objects/_editor';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../../../../__tests__/__helpers/testing-example-helpers';
import { paragraphWithTwoAdjacentInlineNodes } from './__fixtures__/base-adfs';

describe('inline-cursor-target', () => {
  describe('should not prevent users entering text between inline nodes', () => {
    BrowserTestCase(
      'when entering plain text',
      // the inline-cursor-target plugin is only used in chrome and firefox
      { skip: ['safari'] },
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
