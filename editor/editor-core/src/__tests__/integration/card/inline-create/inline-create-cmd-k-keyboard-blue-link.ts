import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  editable,
  gotoEditor,
  linkUrlSelector,
  linkLabelSelector,
  insertLongText,
} from '../../_helpers';
import { messages } from '../../../../plugins/insert-block/ui/ToolbarInsertBlock/messages';

BrowserTestCase(
  'card: inserting a link with CMD + K with link not in recents list inserted as blue link',
  {
    skip: ['edge'],
  },
  async (client: ConstructorParameters<typeof Page>[0], testName: string) => {
    const page = new Page(client);
    const mockUrl = 'https://i.want.donuts';

    // Go to the editor example.
    await gotoEditor(page);

    // Open up the link toolbar from the Editor toolbar (top).
    await insertLongText(page);
    await page.click(`[aria-label="${messages.link.defaultMessage}"]`);
    await page.waitForSelector(linkUrlSelector);
    await page.waitForSelector(linkLabelSelector);

    // Type an arbitrary link we want to insert.
    await page.type(linkUrlSelector, mockUrl);
    await page.keys(['Return']);
    // Ensure a link has been inserted.
    await page.waitForSelector(`a[href="${mockUrl}"]`);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
