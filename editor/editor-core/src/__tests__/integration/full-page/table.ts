import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import { toolbarInsertBlockMessages as insertBlockMessages } from '@atlaskit/editor-common/messages';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { selectors } from '@atlaskit/editor-test-helpers/page-objects/editor';

const fullPageEditor = getExampleUrl('editor', 'editor-core', 'full-page');
const editorSelector = selectors.editor;
const enterArr: string[] = [];
const arrowUpArr: string[] = [];
for (let i = 0; i < 80; i++) {
  enterArr.push('Enter');
  arrowUpArr.push('ArrowUp');
}

BrowserTestCase(
  'table.ts: Table floating toolbar should be visible even after table scrolls',
  { skip: ['safari', 'firefox'] },
  async (client: any) => {
    const insertTableMenu = `[aria-label="${insertBlockMessages.table.defaultMessage}"]`;
    const tableControls = '[aria-label="Table floating controls"]';

    const browser = new Page(client);

    await browser.goto(fullPageEditor);
    await browser.waitForSelector(editorSelector);
    await browser.click(editorSelector);
    await browser.click(insertTableMenu);
    await browser.waitForSelector(tableControls);
    await browser.type(editorSelector, enterArr);
    await browser.type(editorSelector, arrowUpArr);
    expect(await browser.isExisting(tableControls)).toBe(true);
    expect(await browser.isVisible(tableControls)).toBe(true);
  },
);
