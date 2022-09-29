import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  fullpage,
  editable,
  getDocFromElement,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { selectors } from '@atlaskit/editor-test-helpers/page-objects/expand';

import emptyExpandAdf from './__fixtures__/empty-expand.json';
import doubleExpand from './__fixtures__/double-expand.json';
import expandWithNestedPanelAdf from './__fixtures__/expand-with-nested-panel.json';
import expandWithNestedCodeBlockAdf from './__fixtures__/expand-with-nested-code-block.json';

const collapseExpandThenFocusTitle = async (page: any) => {
  await page.click(selectors.expandToggle);
  await page.click(selectors.expandTitleInput);
};

BrowserTestCase(
  'navigation.ts: pressing Backspace should delete an expand when cursor is inside content',
  { skip: ['safari', 'firefox'] },
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
  { skip: ['safari', 'firefox'] },
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
  'navigation.ts: pressing Backspace should NOT delete an expand when cursor is inside content within a nested panel',
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: expandWithNestedPanelAdf,
      allowExpand: true,
      allowPanel: true,
    });

    await page.click(selectors.panelInExpandContent);
    await page.keys('Backspace');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'navigation.ts: pressing Backspace should NOT delete an expand when cursor is inside content within a nested code block',
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: expandWithNestedCodeBlockAdf,
      allowExpand: true,
      allowCodeBlock: true,
    });

    await page.click(selectors.codeBlockInExpandContent);
    await page.keys('Backspace');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'navigation.ts: pressing Enter should collapse an expand when cursor is inside title',
  { skip: ['safari', 'firefox'] },
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
  { skip: ['safari', 'firefox'] },
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
  { skip: ['safari', 'firefox'] },
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
