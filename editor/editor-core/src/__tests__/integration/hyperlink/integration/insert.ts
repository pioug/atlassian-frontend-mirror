// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  animationFrame,
  editable,
  fullpage,
  getDocFromElement,
  quickInsert,
} from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { selectors } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  hyperlinkSelectors,
  linkPickerSelectors,
} from '@atlaskit/editor-test-helpers/page-objects/hyperlink';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  clickToolbarMenu,
  ToolbarMenuItem,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

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

    const editor = await page.$(selectors.editor);
    expect(await editor.isFocused()).toBe(true);
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

    const editor = await page.$(selectors.editor);
    expect(await editor.isFocused()).toBe(true);
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

    const editor = await page.$(selectors.editor);
    expect(await editor.isFocused()).toBe(true);
  },
);

describe('with feature flag: lp-link-picker', () => {
  BrowserTestCase(
    'can insert hyperlink with only URL using toolbar',
    {},
    async (client: any, testName: string) => {
      const page = await goToEditorTestingWDExample(client);
      await mountEditor(
        page,
        {
          appearance: fullpage.appearance,
          featureFlags: {
            'lp-link-picker': true,
          },
        },
        {
          withLinkPickerOptions: true,
        },
      );

      await clickToolbarMenu(page, ToolbarMenuItem.link);
      await page.waitForSelector(linkPickerSelectors.linkInput);
      await page.type(linkPickerSelectors.linkInput, 'http://atlassian.com');
      await page.keys('Return');

      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);

      const editor = await page.$(selectors.editor);
      expect(await editor.isFocused()).toBe(true);
    },
  );

  BrowserTestCase(
    'can insert hyperlink with URL and text using toolbar',
    {},
    async (client: any, testName: string) => {
      const page = await goToEditorTestingWDExample(client);
      await mountEditor(
        page,
        {
          appearance: fullpage.appearance,
          featureFlags: {
            'lp-link-picker': true,
          },
        },
        {
          withLinkPickerOptions: true,
        },
      );

      await clickToolbarMenu(page, ToolbarMenuItem.link);
      await page.waitForSelector(linkPickerSelectors.linkInput);
      await animationFrame(page);
      await page.type(linkPickerSelectors.linkInput, 'http://atlassian.com');
      await page.type(linkPickerSelectors.linkDisplayTextInput, 'Atlassian');
      await page.keys('Return');
      await animationFrame(page);

      const doc = await page.$eval(editable, getDocFromElement);
      await animationFrame(page);
      expect(doc).toMatchCustomDocSnapshot(testName);

      const editor = await page.$(selectors.editor);
      expect(await editor.isFocused()).toBe(true);
    },
  );

  BrowserTestCase(
    'can insert hyperlink via quick insert menu',
    {},
    async (client: any, testName: string) => {
      const page = await goToEditorTestingWDExample(client);
      await mountEditor(
        page,
        {
          appearance: fullpage.appearance,
          featureFlags: {
            'lp-link-picker': true,
          },
        },
        {
          withLinkPickerOptions: true,
        },
      );

      await quickInsert(page, 'Link');
      await page.waitForSelector(linkPickerSelectors.linkInput);
      await page.type(linkPickerSelectors.linkInput, 'http://atlassian.com');
      await page.type(linkPickerSelectors.linkDisplayTextInput, 'Atlassian');
      await page.keys('Return');

      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);

      const editor = await page.$(selectors.editor);
      expect(await editor.isFocused()).toBe(true);
    },
  );
});
