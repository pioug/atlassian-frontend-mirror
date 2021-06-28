import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getDocFromElement, comment, fullpage, editable } from '../_helpers';
import { toolbarMessages as textFormattingMessages } from '../../../plugins/text-formatting/ui/Toolbar/toolbar-messages';
import { toolbarMessages as blockTypeToolbarMessages } from '../../../plugins/block-type/ui/ToolbarBlockType/toolbar-messages';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import { messages as blockTypeMessages } from '../../../plugins/block-type/messages';

const input = 'helloworld ';
// https://product-fabric.atlassian.net/browse/ED-4531
[comment, fullpage].forEach((editor) => {
  BrowserTestCase(
    `toolbar-1.ts: should be able to select normal text, bold, italics, underline style for ${editor.name} editor`,
    { skip: ['safari', 'edge'] },
    async (client: any, testName: string) => {
      const bold = `[aria-label="${textFormattingMessages.bold.defaultMessage}"]`;
      const italic = `[aria-label="${textFormattingMessages.italic.defaultMessage}"]`;
      const changeFormatting = `[aria-label="${blockTypeToolbarMessages.textStyles.defaultMessage}"]`;
      const normalText = `span=${blockTypeMessages.normal.defaultMessage}`;
      const more = `[aria-label="${textFormattingMessages.moreFormatting.defaultMessage}"]`;
      const underline = `span=${textFormattingMessages.underline.defaultMessage}`;
      const page = await goToEditorTestingWDExample(client);
      await mountEditor(page, { appearance: editor.appearance });

      await page.click(editable);
      await page.type(editable, input);
      await page.click(changeFormatting);
      await page.click(normalText);
      await page.waitForSelector(bold);
      await page.click(bold);
      await page.type(editable, input);
      await page.waitForSelector('strong');
      await page.click(bold);

      await page.click(italic);
      await page.type(editable, input);
      await page.waitForSelector('em');
      await page.click(italic);

      await page.waitForSelector(more);
      await page.click(more);
      await page.waitForSelector(underline);
      await page.click(underline);
      await page.type(editable, input);
      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );
});
