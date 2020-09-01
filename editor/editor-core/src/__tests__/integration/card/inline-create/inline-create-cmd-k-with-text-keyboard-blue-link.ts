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

const mockLinkSearchTitle = 'home opt-in';
const mockLinkUrlEndsWith = 'Home+opt-in+requests';

BrowserTestCase(
  'card: inserting a link with CMD + K with keyboard should retain display text and insert a blue link',
  {
    skip: ['edge'],
  },
  async (client: ConstructorParameters<typeof Page>[0], testName: string) => {
    const page = new Page(client);

    // Go to the editor example.
    await gotoEditor(page);

    // Open up the link toolbar from the Editor toolbar (top).
    await insertLongText(page);
    await page.click(`[aria-label="${messages.link.defaultMessage}"]`);
    await page.waitForSelector(linkUrlSelector);
    await page.waitForSelector(linkLabelSelector);

    // Find the link we want to insert.
    await page.type(linkUrlSelector, [mockLinkSearchTitle, 'Tab']);
    // Give the link display text.
    await page.type(linkLabelSelector, [
      'Go hard or go home',
      'ArrowDown',
      'Return',
    ]);

    // Ensure a link has been inserted.
    await page.waitForSelector(`a[href$="${mockLinkUrlEndsWith}"]`);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
