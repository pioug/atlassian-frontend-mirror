import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDClipboardExample,
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  editable,
  getDocFromElement,
  insertBlockMenuItem,
  fullpage,
} from '@atlaskit/editor-test-helpers/integration/helpers';

/*
 * Safari adds special characters that end up in the snapshot
 */
BrowserTestCase(
  'task-decision-1.ts: can paste rich text into a decision',
  // TODO: Skipped safari, need to unskip again after fixing: https://product-fabric.atlassian.net/browse/ED-16306
  { skip: ['safari'] },
  async (client: any, testName: string) => {
    // Copy stuff to clipboard and go to editor
    const page = await goToEditorTestingWDClipboardExample(
      client,
      '<p>this is a link <a href="http://www.google.com">www.google.com</a></p><p>more elements with some <strong>format</strong></p><p>some addition<em> formatting</em></p>',
      'html',
    );
    await mountEditor(
      page,
      {
        appearance: fullpage.appearance,
        smartLinks: {
          allowEmbeds: true,
        },
        allowPanel: true,
      },
      {
        providers: {
          cards: true,
        },
      },
    );

    await page.waitFor(editable);
    await page.type(editable, '<> ');
    await page.waitForSelector('ol');
    await page.paste();
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'task-decision-1.ts: can paste plain text into a decision',
  {},
  async (client: any, testName: string) => {
    // Copy stuff to clipboard and go to editor
    const page = await goToEditorTestingWDClipboardExample(
      client,
      'this is a link http://www.google.com more elements with some **format** some addition *formatting*',
    );
    await mountEditor(
      page,
      {
        appearance: fullpage.appearance,
        smartLinks: {
          allowEmbeds: true,
        },
        allowPanel: true,
      },
      {
        providers: {
          cards: true,
        },
      },
    );

    await page.waitFor(editable);
    await page.type(editable, '<> ');
    await page.waitForSelector('ol');
    await page.paste();
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'task-decision-1.ts: can type into decision',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(
      page,
      {
        appearance: fullpage.appearance,
        smartLinks: {
          allowEmbeds: true,
        },
        allowPanel: true,
      },
      {
        providers: {
          cards: true,
        },
      },
    );

    await insertBlockMenuItem(page, 'Decision');
    await page.waitForSelector('ol span + div');
    await page.click('ol span + div');
    await page.type(editable, 'adding decisions');
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  `task-decision: Backspacing on second line of multi-line decision shouldnt remove list`,
  {},
  async (client: any, testName: string) => {
    // Copy stuff to clipboard and go to editor
    const page = await goToEditorTestingWDClipboardExample(
      client,
      '<p>Line 1<br/>L2</p>',
      'html',
    );
    await mountEditor(
      page,
      {
        appearance: fullpage.appearance,
        smartLinks: {
          allowEmbeds: true,
        },
        allowPanel: true,
      },
      {
        providers: {
          cards: true,
        },
      },
    );

    await page.waitFor(editable);
    await page.type(editable, '<> ');
    await page.waitForSelector('ol');
    await page.paste();

    await page.keys(['Backspace']);
    await page.keys(['Backspace']);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  `task-decision: Backspacing on second line of multi-line task shouldnt remove list`,
  {},
  async (client: any, testName: string) => {
    // Copy stuff to clipboard and go to editor
    const page = await goToEditorTestingWDClipboardExample(
      client,
      '<p>Line 1<br/>L2</p>',
      'html',
    );
    await mountEditor(
      page,
      {
        appearance: fullpage.appearance,
        smartLinks: {
          allowEmbeds: true,
        },
        allowPanel: true,
      },
      {
        providers: {
          cards: true,
        },
      },
    );

    await page.waitFor(editable);
    await page.type(editable, '[] ');
    await page.waitForSelector('div[data-node-type="actionList"]');
    await page.paste();

    await page.keys(Array(2).fill('Backspace'));

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
