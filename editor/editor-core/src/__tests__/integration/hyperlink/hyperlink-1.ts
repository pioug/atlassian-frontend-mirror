import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  comment,
  fullpage,
  editable,
  linkToolbar,
} from '../_helpers';
import { messages } from '../../../plugins/insert-block/ui/ToolbarInsertBlock/messages';

const linkText1 = 'http://hello.com ';
const linkText2 = 'FAB-983';

// https://product-fabric.atlassian.net/browse/ED-4162 - Firefox
// Floating toolbar is not showin up on IE and edge
[comment, fullpage].forEach(editor => {
  BrowserTestCase(
    `hyperlink-1.ts: Link:create link using toolbar,unlinkify ${editor.name} editor`,
    {
      skip: ['ie', 'edge', 'safari', 'firefox'],
    },
    async (client: any, testName: string) => {
      let browser = new Page(client);
      await browser.goto(editor.path);
      await browser.waitForSelector(editor.placeholder);
      await browser.click(editor.placeholder);
      await browser.waitForSelector(editable);

      await browser.click(`[aria-label="${messages.link.defaultMessage}"]`);
      await browser.waitForSelector(linkToolbar);
      await browser.type(linkToolbar, [linkText2, 'Return']);
      await browser.waitForSelector('a');

      // unlink
      await browser.type(editable, [
        'Return',
        linkText1,
        'ArrowLeft',
        'ArrowLeft',
      ]);
      await browser.waitForSelector('[aria-label=Unlink]');
      await browser.click('[aria-label=Unlink]');

      const doc = await browser.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );
});
