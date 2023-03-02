import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  fullpage,
  editable,
  insertBlockMenuItem,
  insertMedia,
  setupMediaMocksProviders,
} from '@atlaskit/editor-test-helpers/integration/helpers';

// FIXME: This test was automatically skipped due to failure on 01/03/2023: https://product-fabric.atlassian.net/browse/ED-17035
BrowserTestCase(
  `bodied-insert-media.ts: Bodied Extension: Insert Media`,
  {
    // skip: ['safari'],
    skip: ['*'],
  },
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
