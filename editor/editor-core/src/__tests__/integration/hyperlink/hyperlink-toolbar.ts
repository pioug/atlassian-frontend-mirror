import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { comment, fullpage, editable, linkToolbar } from '../_helpers';
import { messages } from '../../../plugins/insert-block/ui/ToolbarInsertBlock/messages';

const linkText = 'https://google.com/';
const editLinkSelector = 'button[aria-label="Edit link"]';
const textDisplaySelector = 'input[data-testid="Link label"]';

[comment, fullpage].forEach(editor => {
  BrowserTestCase(
    `hyperlink-toolbar.ts: Link: Empty text to display when link href is same as text`,
    {
      skip: ['ie', 'edge'],
    },
    async (client: any) => {
      const browser = new Page(client);
      await browser.goto(editor.path);
      await browser.waitForSelector(editor.placeholder);
      await browser.click(editor.placeholder);
      await browser.waitForSelector(editable);

      await browser.click(`[aria-label="${messages.link.defaultMessage}"]`);
      await browser.waitForSelector(linkToolbar);

      await browser.type(linkToolbar, [linkText, 'Return']);
      await browser.type(editable, ['ArrowLeft', 'ArrowLeft', 'ArrowLeft']);

      await browser.waitForSelector(editLinkSelector);
      await browser.click(editLinkSelector);

      await browser.waitForSelector(textDisplaySelector);
      const elem = await browser.getValue(textDisplaySelector);
      expect(elem).toEqual('');
    },
  );
});
