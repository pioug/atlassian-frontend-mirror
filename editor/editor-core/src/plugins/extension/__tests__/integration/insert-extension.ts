/**
 * These test cases are split/duplicated out since we already verify behaviour
 * of "unique extension localId within page" via unit tests, and want general
 * "can insert extension" asserted here.
 */

import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  fullpage,
  editable,
  insertBlockMenuItem,
} from '@atlaskit/editor-test-helpers/integration/helpers';

import { messages } from '../../../insert-block/ui/ToolbarInsertBlock/messages';

BrowserTestCase(
  `insert-extension.ts: Extension: Insert Inline extension`,
  { skip: ['safari'] },
  async (client: any, testName: string) => {
    const page = new Page(client);

    await page.goto(fullpage.path);
    await page.maximizeWindow();

    await page.waitForSelector(fullpage.placeholder);
    await page.click(fullpage.placeholder);

    await page.click(`[aria-label="${messages.table.defaultMessage}"]`);
    await page.waitForSelector('table td p');

    await insertBlockMenuItem(page, `Inline macro (EH)`);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  `insert-extension.ts: Extension: Insert Block extension`,
  { skip: ['safari'] },
  async (client: any, testName: string) => {
    const page = new Page(client);

    await page.goto(fullpage.path);
    await page.maximizeWindow();

    await page.waitForSelector(fullpage.placeholder);
    await page.click(fullpage.placeholder);

    await page.click(`[aria-label="${messages.table.defaultMessage}"]`);
    await page.waitForSelector('table td p');

    await insertBlockMenuItem(page, `Block macro (EH)`);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
