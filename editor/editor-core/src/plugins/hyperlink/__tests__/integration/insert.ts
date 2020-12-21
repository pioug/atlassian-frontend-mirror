import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../../../__tests__/__helpers/testing-example-helpers';
import {
  fullpage,
  editable,
  getDocFromElement,
  quickInsert,
} from '../../../../__tests__/integration/_helpers';
import {
  clickToolbarMenu,
  ToolbarMenuItem,
} from '../../../../__tests__/__helpers/page-objects/_toolbar';
import { hyperlinkSelectors } from '../../../../__tests__/__helpers/page-objects/_hyperlink';

BrowserTestCase(
  'can insert hyperlink with only URL using toolbar',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
    });

    await clickToolbarMenu(page, ToolbarMenuItem.link);
    await page.waitForSelector(hyperlinkSelectors.linkInput);
    await page.type(hyperlinkSelectors.linkInput, 'http://atlassian.com');
    await page.keys('Return');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'can insert hyperlink with URL and text using toolbar',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
    });

    await clickToolbarMenu(page, ToolbarMenuItem.link);
    await page.waitForSelector(hyperlinkSelectors.linkInput);
    await page.type(hyperlinkSelectors.linkInput, 'http://atlassian.com');
    await page.type(hyperlinkSelectors.textInput, 'Atlassian');
    await page.keys('Return');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'can insert hyperlink via quick insert menu',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
    });

    await quickInsert(page, 'Link');
    await page.waitForSelector(hyperlinkSelectors.linkInput);
    await page.type(hyperlinkSelectors.linkInput, 'http://atlassian.com');
    await page.type(hyperlinkSelectors.textInput, 'Atlassian');
    await page.keys('Return');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
