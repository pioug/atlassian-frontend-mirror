import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  fullpage,
  getDocFromElement,
} from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { selectors } from '@atlaskit/editor-test-helpers/page-objects/editor';

// Modifiers like Ctrl, Shift, Alt and Meta will stay pressed so you need to trigger them again to release them.

const editorSelector = selectors.editor;

const createRepeatedArray = <T>(seq: T[], timesRepeated: number): T[] => {
  let out = [] as T[];

  for (let i = 0; i < timesRepeated; i++) {
    out = [...out, ...seq];
  }

  return out;
};

BrowserTestCase(
  'indentation.ts: Should indent when tab is pressed',
  { skip: ['safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = new Page(client);
    await page.goto(fullpage.path);
    await page.waitForSelector(fullpage.placeholder);
    await page.click(fullpage.placeholder);

    await page.type(editorSelector, 'test');
    await page.keys('Tab');

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'indentation.ts: Should indent to max indentation and no more',
  { skip: ['safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = new Page(client);
    await page.goto(fullpage.path);
    await page.waitForSelector(fullpage.placeholder);
    await page.click(fullpage.placeholder);

    await page.type(editorSelector, 'test');
    await page.keys(createRepeatedArray(['Tab'], 7));

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'indentation.ts: Should not indent backwards when at 0 indentation',
  { skip: ['safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = new Page(client);
    await page.goto(fullpage.path);
    await page.waitForSelector(fullpage.placeholder);
    await page.click(fullpage.placeholder);

    await page.type(editorSelector, 'test');
    await page.keys(['Shift', 'Tab', 'Shift']);

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'indentation.ts: Should indent back to 0 when at max indentation',
  { skip: ['safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = new Page(client);
    await page.goto(fullpage.path);
    await page.waitForSelector(fullpage.placeholder);
    await page.click(fullpage.placeholder);

    await page.type(editorSelector, 'test');
    await page.keys(createRepeatedArray(['Tab'], 7));
    await page.keys(createRepeatedArray(['Shift', 'Tab', 'Shift'], 7));

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
