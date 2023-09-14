import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import type Page from '@atlaskit/webdriver-runner/wd-wrapper';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  fullpage,
  editable,
  getDocFromElement,
} from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { unsupportedNodeSelectors } from '@atlaskit/editor-test-helpers/page-objects/unsupported';
import unsupportedBlockAdf from '../../__fixtures__/unsupported-block-adf.json';
import unsupportedInlineAdf from '../../__fixtures__/unsupported-inline-adf.json';

const initEditorWithUnsupportedBlock = async (client: any): Promise<Page> => {
  const page = await goToEditorTestingWDExample(client);
  await mountEditor(page, {
    appearance: fullpage.appearance,
    defaultValue: unsupportedBlockAdf,
  });
  return page;
};

const initEditorWithUnsupportedInline = async (client: any): Promise<Page> => {
  const page = await goToEditorTestingWDExample(client);
  await mountEditor(page, {
    appearance: fullpage.appearance,
    defaultValue: unsupportedInlineAdf,
  });
  return page;
};

BrowserTestCase(
  'unsupported block content: deletes selected node',
  {},
  async (client: any, testName: string) => {
    const page = await initEditorWithUnsupportedBlock(client);
    await page.click(unsupportedNodeSelectors.unsupportedBlock);
    await page.keys('Backspace');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'unsupported block content: types over selected node',
  {},
  async (client: any, testName: string) => {
    const page = await initEditorWithUnsupportedBlock(client);
    await page.click(unsupportedNodeSelectors.unsupportedBlock);
    await page.type(editable, 'A');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'unsupported inline content: deletes selected node',
  {},
  async (client: any, testName: string) => {
    const page = await initEditorWithUnsupportedInline(client);
    await page.click(unsupportedNodeSelectors.unsupportedInline);
    await page.keys('Backspace');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'unsupported inline content: types over selected node',
  {},
  async (client: any, testName: string) => {
    const page = await initEditorWithUnsupportedInline(client);
    await page.click(unsupportedNodeSelectors.unsupportedInline);
    await page.type(editable, 'A');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
