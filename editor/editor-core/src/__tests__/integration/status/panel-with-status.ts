import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  mountEditor,
  goToEditorTestingWDExample,
  goToEditorExampleWDExample,
} from '@atlaskit/editor-test-helpers/testing-example-page';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  editable,
  getDocFromElement,
  quickInsert,
} from '@atlaskit/editor-test-helpers/integration/helpers';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { selectors } from '@atlaskit/editor-test-helpers/page-objects/editor';

BrowserTestCase(
  'status.ts: Insert status into panel, move cursor to right before status, and add text',
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: 'full-page',
      allowPanel: true,
      allowStatus: true,
    });
    await page.click(editable);

    await quickInsert(page, 'Info panel', true);

    await quickInsert(page, 'Status', true);

    await page.waitForSelector(`[aria-label="Popup"] input`);
    await page.type(`[aria-label="Popup"] input`, 'DONE');
    await page.click(editable);
    await page.keys([
      'Backspace',
      'ArrowLeft',
      'ArrowLeft',
      'S',
      'o',
      'm',
      'e',
      ' ',
      't',
      'e',
      'x',
      't',
    ]);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'status.ts: Insert status into panel, move cursor to right before panel, move right, and add text',
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: 'full-page',
      allowPanel: true,
      allowStatus: true,
    });
    await page.click(editable);

    await quickInsert(page, 'Info panel', true);

    await quickInsert(page, 'Status', true);

    await page.waitForSelector(`[aria-label="Popup"] input`);
    await page.type(`[aria-label="Popup"] input`, 'DONE');
    await page.click(editable);
    await page.keys([
      'Backspace',
      'ArrowLeft',
      'ArrowLeft',
      'ArrowLeft',
      'ArrowRight',
      'S',
      'o',
      'm',
      'e',
      ' ',
      't',
      'e',
      'x',
      't',
    ]);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'status.ts: Insert status into panel, click on the status toolbar input, add text',
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await goToEditorExampleWDExample(
      client,
      'editor-core',
      'jira-clone',
    );

    await page.clear(selectors.editor);
    await page.click(editable);

    await quickInsert(page, 'Table');

    await quickInsert(page, 'Info panel', true);

    await quickInsert(page, 'Status', true);

    const isStatusInputClickable = await page.isClickable(
      `[aria-label="Popup"] input`,
    );
    expect(isStatusInputClickable).toBeTruthy();
  },
);
