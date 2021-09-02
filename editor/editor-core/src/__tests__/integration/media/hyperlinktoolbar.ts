import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { editable, getDocFromElement, fullpage } from '../_helpers';
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '../../__helpers/testing-example-helpers';

const linkUrlSelector = '[data-testid="link-url"]';
const linkLabelSelector = '[data-testid="link-label"]';

async function setupEditor(client: any): Promise<Page> {
  const page = await goToEditorTestingWDExample(client);
  await mountEditor(page, {
    appearance: fullpage.appearance,
  });

  await page.click(editable);
  return page;
}

// FIXME: This test was automatically skipped due to failure on 8/30/2021: https://product-fabric.atlassian.net/browse/ED-13684
BrowserTestCase(
  'Inserts a link via hyperlinktoolbar',
  {
    // skip: ['edge'],
    skip: ['*'],
  },
  async (client: any, testName: string) => {
    const page = await setupEditor(client);

    await page.keyboard.type('k', ['Mod']);

    await page.waitForVisible(linkUrlSelector);
    await page.click(linkUrlSelector);
    await page.keys('www.atlassian.com'.split(''));

    await page.click(linkLabelSelector);
    await page.keys('Hello world!'.split(''));

    await page.keys(['Enter']);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

// FIXME: This test was automatically skipped due to failure on 8/30/2021: https://product-fabric.atlassian.net/browse/ED-13685
BrowserTestCase(
  "Doesn't insert a link via hyperlinktoolbar when switching between fields",
  {
    // skip: ['edge'],
    skip: ['*'],
  },
  async (client: any, testName: string) => {
    const page = await setupEditor(client);

    await page.keyboard.type('k', ['Mod']);

    await page.waitForVisible(linkUrlSelector);
    await page.click(linkUrlSelector);
    await page.keys('www.atlassian.com'.split(''));

    await page.click(linkLabelSelector);
    await page.click(linkUrlSelector);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

// FIXME: This test was automatically skipped due to failure on 8/30/2021: https://product-fabric.atlassian.net/browse/ED-13686
BrowserTestCase(
  "Doesn't insert a link via hyperlinktoolbar when clicking out of toolbar",
  {
    // skip: ['edge'],
    skip: ['*'],
  },
  async (client: any, testName: string) => {
    const page = await setupEditor(client);

    await page.keyboard.type('k', ['Mod']);

    await page.waitForVisible(linkUrlSelector);
    await page.click(linkUrlSelector);
    await page.keys('www.atlassian.com'.split(''));

    await page.click(editable);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

// FIXME: This test was automatically skipped due to failure on 8/30/2021: https://product-fabric.atlassian.net/browse/ED-13687
BrowserTestCase(
  'Inserts a link when tabbing through hyperlinktoolbar',
  {
    // skip: ['edge'],
    skip: ['*'],
  },
  async (client: any, testName: string) => {
    const page = await setupEditor(client);

    await page.keyboard.type('k', ['Mod']);

    await page.waitForVisible(linkUrlSelector);
    await page.keys('www.atlassian.com'.split(''));
    await page.keys(['Tab']);
    await page.keys('Hello world!'.split(''));
    await page.keys(['Tab']);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
