import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  getDocFromElement,
  editable,
  quickInsert,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import { TableCssClassName as ClassName } from '@atlaskit/editor-plugin-table/types';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { messages } from '../../../plugins/block-type/messages';
import { runEscapeKeydownSuite } from '@atlaskit/editor-test-helpers/integration/escape-keydown';
import {
  clickToolbarMenu,
  ToolbarMenuItem,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';

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
  {},
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

BrowserTestCase(
  'alignment: disabled when inside special nodes',
  { skip: [] },
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

BrowserTestCase(
  'alignment: disabled when editor is disabled',
  { skip: [] },
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
  {},
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
  { skip: [] },
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

runEscapeKeydownSuite({
  openMenu: async (page) => {
    await clickToolbarMenu(page, ToolbarMenuItem.alignment);
  },
});
