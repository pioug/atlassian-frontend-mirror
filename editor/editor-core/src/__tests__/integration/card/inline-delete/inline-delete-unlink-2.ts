import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  editable,
  gotoEditor,
  linkUrlSelector,
} from '../../_helpers';
import { messages } from '../../../../plugins/insert-block/ui/ToolbarInsertBlock/messages';
import { waitForInlineCardSelection } from '@atlaskit/media-integration-test-helpers';

BrowserTestCase(
  `card: unlinking a card created from CMD + K should leave only url text`,
  {
    skip: ['edge'],
  },
  async (client: ConstructorParameters<typeof Page>[0], testName: string) => {
    const page = new Page(client);

    await gotoEditor(page);

    await page.click(`[aria-label="${messages.link.defaultMessage}"]`);
    await page.waitForSelector(linkUrlSelector);

    await page.type(linkUrlSelector, 'home opt-in');
    await page.keys(['ArrowDown', 'Return']);

    await waitForInlineCardSelection(page);
    await page.click('button[aria-label="Unlink"]');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
