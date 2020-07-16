import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import { fullpage } from '../_helpers';

const fullPageEditor = getExampleUrl('editor', 'editor-core', 'full-page');
const titleSelector = '.ak-editor-content-area textarea';

BrowserTestCase(
  'focus.ts: Should focus title initially',
  { skip: ['edge', 'safari'] },
  async (client: any) => {
    const browser = new Page(client);
    await browser.goto(fullPageEditor);
    await browser.waitForSelector(fullpage.placeholder);

    expect(await browser.hasFocus(titleSelector)).toBe(true);
  },
);

BrowserTestCase(
  'focus.ts: Should focus editor when click on editor',
  { skip: ['edge', 'safari'] },
  async (client: any) => {
    const browser = new Page(client);
    await browser.goto(fullPageEditor);
    await browser.waitForSelector(fullpage.placeholder);
    await browser.click(fullpage.placeholder);

    expect(await browser.hasFocus(fullpage.placeholder)).toBe(true);
  },
);

BrowserTestCase(
  'focus.ts: Should focus editor when hit tab key',
  { skip: ['edge', 'safari'] },
  async (client: any) => {
    const browser = new Page(client);
    await browser.goto(fullPageEditor);
    await browser.waitForSelector(fullpage.placeholder);
    await browser.keys(['Tab']);

    expect(await browser.hasFocus(fullpage.placeholder)).toBe(true);
  },
);
