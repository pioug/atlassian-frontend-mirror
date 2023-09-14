import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  fullpage,
  editable,
} from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  clickToolbarMenu,
  ToolbarMenuItem,
  toolbarMenuItemsSelectors,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { elementBrowserSelectors } from '@atlaskit/editor-test-helpers/page-objects/element-browser';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { runEscapeKeydownSuite } from '@atlaskit/editor-test-helpers/integration/escape-keydown';

const emojiPanel = '[data-emoji-picker-container="true"]';

// FIXME: This test was automatically skipped due to failure on 22/08/2023: https://product-fabric.atlassian.net/browse/ED-19661
BrowserTestCase(
  'insert-block.ts: opens emoji picker from dropdown after resizing',
  {
    skip: ['*'],
  },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);

    await page.setWindowSize(3000, 750);

    await mountEditor(page, fullpage);

    await page.setWindowSize(500, 750);

    await page.click(editable);
    await page.click(toolbarMenuItemsSelectors[ToolbarMenuItem.insertMenu]);
    await page.click(toolbarMenuItemsSelectors[ToolbarMenuItem.emoji]);

    await page.waitForSelector(emojiPanel);
    expect(await page.isExisting(emojiPanel)).toBe(true);
  },
);

// FIXME: This test was automatically skipped due to failure on 22/08/2023: https://product-fabric.atlassian.net/browse/ED-19662
BrowserTestCase(
  'insert-block.ts: with new extensions opens emoji picker from dropdown after resizing',
  {
    skip: ['*'],
  },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);

    await page.setWindowSize(500, 750);

    await mountEditor(page, {
      appearance: 'full-page',
      withNewExtensions: true,
      allowExtension: { allowAutoSave: true },
      elementBrowser: {
        showModal: true,
        replacePlusMenu: true,
      },
    });

    await page.click(editable);
    await page.click(toolbarMenuItemsSelectors[ToolbarMenuItem.insertMenu]);
    await page.waitForSelector(elementBrowserSelectors.elementBrowser);
    await page.click(toolbarMenuItemsSelectors[ToolbarMenuItem.emoji]);

    await page.waitForSelector(emojiPanel);
    expect(await page.isExisting(emojiPanel)).toBe(true);
  },
);

runEscapeKeydownSuite({
  openMenu: async (page) => {
    await clickToolbarMenu(page, ToolbarMenuItem.insertBlock);
  },
});
