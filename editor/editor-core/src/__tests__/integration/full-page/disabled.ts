import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { fullpageDisabled } from '@atlaskit/editor-test-helpers/integration/helpers';

// TODO: fix expect condition or find a way to fetch error from api
BrowserTestCase(
  "disabled.ts: Shouldn't be able to type in the disabled editor",
  { skip: ['firefox', 'safari', 'chrome'] },
  async (client: any) => {
    const browser = new Page(client);
    await browser.goto(fullpageDisabled.path);

    return expect(
      browser.click(fullpageDisabled.placeholder),
    ).rejects.toThrowError('unknown error: Element is not clickable at point');
  },
);

BrowserTestCase(
  "disabled.ts: Shouldn't be able to type in a panel",
  { skip: ['firefox', 'safari', 'chrome'] },
  async (client: any) => {
    const browser = new Page(client);
    await browser.goto(fullpageDisabled.path);
    await browser.waitForSelector(fullpageDisabled.placeholder);

    const elem = await browser.$('.ak-editor-panel__content');
    return expect(() => elem.click()).rejects.toThrowError(
      'unknown error: Element is not clickable at point',
    );
  },
);

BrowserTestCase(
  "disabled.ts: Shouldn't be able to type in a table",
  { skip: ['firefox', 'safari', 'chrome'] },
  async (client: any) => {
    const browser = new Page(client);
    await browser.goto(fullpageDisabled.path);
    await browser.waitForSelector(fullpageDisabled.placeholder);
    return expect(
      await browser.click('.pm-table-cell-nodeview-content-dom'),
    ).rejects.toThrowError('unknown error: Element is not clickable at point');
  },
);
