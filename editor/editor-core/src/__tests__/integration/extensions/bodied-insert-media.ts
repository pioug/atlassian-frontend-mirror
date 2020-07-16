import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  fullpage,
  editable,
  insertBlockMenuItem,
  insertMedia,
  setupMediaMocksProviders,
} from '../_helpers';

BrowserTestCase(
  `bodied-insert-media.ts: Bodied Extension: Insert Media`,
  { skip: ['edge', 'safari'] },
  async (client: any, testName: string) => {
    const page = new Page(client);
    await page.goto(fullpage.path);

    await setupMediaMocksProviders(page);
    await page.waitForSelector(fullpage.placeholder);
    await page.click(fullpage.placeholder);

    await insertBlockMenuItem(page, 'Bodied macro (EH)');
    await insertMedia(page);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
