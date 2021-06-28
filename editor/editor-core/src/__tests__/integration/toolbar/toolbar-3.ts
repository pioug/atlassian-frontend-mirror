import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getDocFromElement, comment, fullpage, editable } from '../_helpers';
import { toolbarMessages } from '../../../plugins/text-formatting/ui/Toolbar/toolbar-messages';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';

const more = `[aria-label="${toolbarMessages.moreFormatting.defaultMessage}"]`;
const underline = `span=${toolbarMessages.underline.defaultMessage}`;
const clear = `span=${toolbarMessages.clearFormatting.defaultMessage}`;

// https://product-fabric.atlassian.net/browse/ED-4531
[comment, fullpage].forEach((editor) => {
  BrowserTestCase(
    `toolbar-3.ts: should be able to select Clear Formatting on toolbar for ${editor.name} editor`,
    { skip: ['safari', 'edge'] },
    async (client: any, testName: string) => {
      const page = await goToEditorTestingWDExample(client);
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
