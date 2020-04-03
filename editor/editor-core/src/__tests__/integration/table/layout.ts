import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  editable,
  getDocFromElement,
  fullpage,
  changeSelectedNodeLayout,
  animationFrame,
  toggleBreakout,
} from '../_helpers';

import { clickFirstCell } from '../../__helpers/page-objects/_table';

import {
  defaultTableInOverflow,
  defaultTableResizedTable,
  nestedTables,
} from './__fixtures__/layout-documents';

import {
  goToEditorTestingExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';

import messages from '../../../messages';

BrowserTestCase(
  'Avoid overflow when table scale to wide',
  { skip: ['edge', 'ie', 'safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(defaultTableInOverflow),
      allowTables: {
        advanced: true,
      },
    });

    await clickFirstCell(page);
    await toggleBreakout(page, 1);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'Avoid overflow when table scale to full width',
  { skip: ['ie', 'edge', 'safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(defaultTableInOverflow),
      allowTables: {
        advanced: true,
      },
    });

    await clickFirstCell(page);
    await toggleBreakout(page, 2);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'Maintains the wide layout size without overflow',
  { skip: ['edge', 'ie', 'firefox', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(defaultTableResizedTable),
      allowTables: {
        advanced: true,
      },
    });

    await clickFirstCell(page);
    await toggleBreakout(page, 1);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'Maintains the wide layout size without overflow with dynamic text sizing',
  { skip: ['ie', 'edge', 'safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(defaultTableResizedTable),
      allowTables: {
        advanced: true,
      },
      allowDynamicTextSizing: true,
    });

    await clickFirstCell(page);
    await toggleBreakout(page, 1);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'Maintains the full-width layout size without overflow',
  { skip: ['edge', 'ie', 'firefox', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(defaultTableResizedTable),
      allowTables: {
        advanced: true,
      },
    });

    await clickFirstCell(page);
    await toggleBreakout(page, 2);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'Maintains the default layout size without overflow when toggling through layouts',
  { skip: ['ie', 'edge', 'safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(defaultTableResizedTable),
      allowTables: {
        advanced: true,
      },
    });

    await clickFirstCell(page);
    await toggleBreakout(page, 3);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'Scales down column sizes when bodied extension parent layout changes',
  { skip: ['ie', 'edge', 'firefox', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(nestedTables),
      allowTables: {
        advanced: true,
      },
      allowExtension: {
        allowBreakout: true,
      },
      allowLayouts: {
        allowBreakout: true,
      },
      allowBreakout: true,
    });

    await page.waitForSelector('.extension-container p');
    await page.click('.extension-container p');
    await changeSelectedNodeLayout(
      page,
      messages.layoutFixedWidth.defaultMessage,
    );
    await animationFrame(page);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'Scales down column sizes when parent layout changes breakout',
  { skip: ['ie', 'edge', 'firefox', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(nestedTables),
      allowTables: {
        advanced: true,
      },
      allowExtension: {
        allowBreakout: true,
      },
      allowLayouts: {
        allowBreakout: true,
      },
      allowBreakout: true,
    });

    await page.waitForSelector('div[data-layout-section]');
    await page.click('div[data-layout-section]');
    await toggleBreakout(page, 2);
    await animationFrame(page);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
