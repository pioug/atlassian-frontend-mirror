import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  fullpage,
  editable,
  getDocFromElement,
} from '../../../../__tests__/integration/_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../../../__tests__/__helpers/testing-example-helpers';
import { selectors } from '../../../../__tests__/__helpers/page-objects/_expand';

import emptyExpandAdf from './__fixtures__/empty-expand.json';
import doubleExpand from './__fixtures__/double-expand.json';

const collapseExpandThenFocusTitle = async (page: any) => {
  await page.click(selectors.expandToggle);
  await page.click(selectors.expandTitleInput);
};

BrowserTestCase(
  'navigation.ts: pressing Backspace should delete an expand when cursor is inside content',
  { skip: ['edge', 'safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: emptyExpandAdf,
      allowExpand: true,
    });

    await page.click(selectors.expandContent);
    await page.keys('Backspace');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'navigation.ts: pressing Backspace should delete an expand when cursor is inside title',
  { skip: ['edge', 'safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: emptyExpandAdf,
      allowExpand: true,
    });

    await collapseExpandThenFocusTitle(page);
    await page.keys('Backspace');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'navigation.ts: pressing Enter should collapse an expand when cursor is inside title',
  { skip: ['edge', 'safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: emptyExpandAdf,
      allowExpand: true,
    });

    await collapseExpandThenFocusTitle(page);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'navigation.ts: when cursor is after a collapsed expand, pressing Backspace should focus the title',
  { skip: ['edge', 'safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: emptyExpandAdf,
      allowExpand: true,
    });

    await collapseExpandThenFocusTitle(page);
    await page.keys(['ArrowDown', 'Backspace']);
    await page.keys('title'); // type into the open, not targeted at a field

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'navigation.ts: when cursor is after two collapsed expands, pressing Backspace should focus the title of the second one',
  { skip: ['edge', 'safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: doubleExpand,
      allowExpand: true,
    });

    await page.click('.ak-editor-expand__title-input[value="Second title"]');
    await page.keys(['ArrowDown', 'Backspace']);
    await page.keys('hello'); // type into the open, not targeted at a field

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
