import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import {
  editable,
  getDocFromElement,
  fullpage,
  insertBlockMenuItem,
} from '../_helpers';
import placeholderAdf from './__fixtures__/placeholder.adf.json';

const placeholderInputSelector = 'input[placeholder="Add placeholder text"]';
const placeholderNodeSelector = '[data-placeholder]';

BrowserTestCase(
  'placeholder text: can insert placeholder',
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTemplatePlaceholders: {
        allowInserting: true,
      },
    });

    await page.click(fullpage.placeholder);
    await insertBlockMenuItem(page, 'Placeholder text');

    await page.type(placeholderInputSelector, 'Fill this in...');
    await page.keys(['Enter']);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'placeholder text: can type inside placeholder and replace with text',
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTemplatePlaceholders: {
        allowInserting: true,
      },
      defaultValue: placeholderAdf,
    });

    await page.click(placeholderNodeSelector);
    await page.type(fullpage.placeholder, 'This is my text');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
