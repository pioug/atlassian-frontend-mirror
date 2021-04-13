import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import { selectors } from '../../__helpers/page-objects/_editor';

const fullPageEditor = getExampleUrl('editor', 'editor-core', 'full-page');
const editorSelector = selectors.editor;

// https://product-fabric.atlassian.net/browse/ED-12006
BrowserTestCase(
  'breadcrumb.ts: user should be navigated to the desired page when breadcrumb is clicked',
  {},
  async (client: any) => {
    const page = new Page(client);
    await page.goto(fullPageEditor);
    await page.waitForSelector(editorSelector);

    await page.click('#breadcrumb');

    const isNavigated = page.waitUntil(async () => {
      return page.url().then(url => {
        return url.indexOf('#') > -1;
      });
    }, 'not navigated to the desired url');
    expect(await isNavigated).toBe(true);
  },
);
