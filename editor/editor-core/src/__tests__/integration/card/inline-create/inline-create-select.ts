import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  editable,
  gotoEditor,
  linkUrlSelector,
} from '../../_helpers';
import { messages } from '../../../../plugins/insert-block/ui/ToolbarInsertBlock/messages';

BrowserTestCase(
  `card: selecting a link from CMD + K menu should create an inline card`,
  {
    skip: ['edge'],
  },
  async (client: ConstructorParameters<typeof Page>[0], testName: string) => {
    const page = new Page(client);

    await gotoEditor(page);

    await page.click(`[aria-label="${messages.link.defaultMessage}"]`);
    await page.waitForSelector(linkUrlSelector);

    await page.type(linkUrlSelector, ['home opt-in', 'Return']);
    await page.waitForSelector('.inlineCardView-content-wrap');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
