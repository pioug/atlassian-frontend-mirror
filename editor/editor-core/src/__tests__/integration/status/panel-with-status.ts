import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '../../__helpers/testing-example-helpers';
import { editable, getDocFromElement, quickInsert } from '../_helpers';

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
