import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  editable,
  gotoEditor,
  linkUrlSelector,
  insertLongText,
} from '../../_helpers';
import { messages } from '../../../../plugins/insert-block/ui/ToolbarInsertBlock/messages';
// TODO: https://product-fabric.atlassian.net/browse/ED-9831
// Selection in Catalina Safari isn't working properly.
BrowserTestCase(
  `card: selecting a link from CMD + K menu should create an inline card with click`,
  {
    skip: ['edge'],
  },
  async (client: ConstructorParameters<typeof Page>[0], testName: string) => {
    const page = new Page(client);

    await gotoEditor(page);

    await insertLongText(page);
    await page.click(`[aria-label="${messages.link.defaultMessage}"]`);
    await page.waitForSelector(linkUrlSelector);

    await page.type(linkUrlSelector, 'home opt-in');
    await page.remoteDOMClick('[data-testid="link-search-list-item"]');
    await page.waitForSelector('[data-testid="inline-card-resolved-view"]');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
