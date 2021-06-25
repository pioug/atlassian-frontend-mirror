import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getDocFromElement, editable, quickInsert } from '../_helpers';
import { TableCssClassName as ClassName } from '../../../plugins/table/types';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import { messages } from '../../../plugins/block-type/messages';

const alignButton = 'button[aria-label="Text alignment"]';
const alignRightButton = 'button[aria-label="Align right"]';
const headingButton = 'button[aria-label="Font style"]';
const headingh1 = 'div[role="group"] h1';

const alignRight = async (page: any) => {
  await page.waitFor(alignButton);
  await page.click(alignButton);
  await page.waitForSelector(alignRightButton);
  await page.click(alignRightButton);
};

BrowserTestCase(
  'alignment: should be able to add alignment to paragraphs',
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: 'full-page',
      allowTextAlignment: true,
    });

    await page.type(editable, 'hello');
    await alignRight(page);
    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);

// TODO: https://product-fabric.atlassian.net/browse/ED-13150
BrowserTestCase(
  'alignment: should be able to add alignment to headings',
  { skip: ['*'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: 'full-page',
      allowTextAlignment: true,
    });

    await page.type(editable, 'hello');
    await page.waitFor(headingButton);
    await page.click(headingButton);
    await page.waitFor(headingh1);
    await page.click(headingh1);
    await alignRight(page);
    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);
// https://product-fabric.atlassian.net/browse/ED-6802
// TODO: test failing on safari and edge
BrowserTestCase(
  'alignment: disabled when inside special nodes',
  { skip: ['safari', 'edge'] },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: 'full-page',
      allowTextAlignment: true,
    });

    await page.click(`[aria-label="${messages.codeblock.defaultMessage}"]`);
    await page.waitFor(alignButton);
    const isEnabled = await page.isEnabled(alignButton);
    expect(isEnabled).toBe(false);
  },
);

//  https://product-fabric.atlassian.net/browse/ED-6802
// TODO: test failing on safari and edge
BrowserTestCase(
  'alignment: disabled when editor is disabled',
  { skip: ['safari', 'edge'] },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: 'full-page',
      allowTextAlignment: true,
      disabled: true,
    });
    const isEnabled = await page.isEnabled(alignButton);
    expect(isEnabled).toBe(false);
  },
);

BrowserTestCase(
  'alignment: should maintain alignment when hit return',
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: 'full-page',
      allowTextAlignment: true,
    });
    await alignRight(page);
    await page.click(editable);

    const firstLine = 'this is right';
    const secondLine = 'this is still right';

    await page.type(editable, firstLine);
    await page.waitUntilContainsText(editable, firstLine);
    await page.keys(['Enter']);
    await page.type(editable, secondLine);
    await page.waitUntilContainsText(editable, secondLine);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'alignment: should be able to add alignment to selected cells',
  // @see ED-10292
  { skip: ['edge', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    const CELL = 'tbody td:first-child';

    await mountEditor(page, {
      appearance: 'full-page',
      allowTextAlignment: true,
      allowTables: {
        advanced: true,
      },
    });

    await page.click(editable);

    // Insert table
    await quickInsert(page, 'Table');
    await page.waitForSelector(CELL);
    await page.click(CELL);

    // select a column
    const controlSelector = `.${ClassName.COLUMN_CONTROLS_DECORATIONS}[data-start-index="0"]`;
    await page.waitForSelector(controlSelector);
    await page.click(controlSelector);

    await alignRight(page);
    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);
