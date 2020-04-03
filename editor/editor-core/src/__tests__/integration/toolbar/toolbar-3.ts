import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getDocFromElement, comment, fullpage, editable } from '../_helpers';
import { messages } from '../../../plugins/text-formatting/ui/ToolbarAdvancedTextFormatting';
import {
  goToEditorTestingExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';

const more = `[aria-label="${messages.moreFormatting.defaultMessage}"]`;
const underline = `span=${messages.underline.defaultMessage}`;
const clear = `span=${messages.clearFormatting.defaultMessage}`;

// https://product-fabric.atlassian.net/browse/ED-4531
[comment, fullpage].forEach(editor => {
  BrowserTestCase(
    `toolbar-3.ts: should be able to select Clear Formatting on toolbar for ${editor.name} editor`,
    { skip: ['ie', 'safari', 'edge'] },
    async (client: any, testName: string) => {
      const page = await goToEditorTestingExample(client);
      await mountEditor(page, { appearance: editor.appearance });

      await page.click(editable);
      await page.waitForSelector(more);
      await page.click(more);
      await page.waitForSelector(underline);
      await page.click(underline);
      await page.type(editable, 'test');
      await page.click(more);
      await page.click(clear);
      await page.type(editable, 'cleared');
      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );
});
