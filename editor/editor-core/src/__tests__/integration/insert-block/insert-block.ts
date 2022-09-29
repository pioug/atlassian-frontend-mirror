import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import {
  fullpage,
  editable,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  clickToolbarMenu,
  ToolbarMenuItem,
  toolbarMenuItemsSelectors,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';
import { elementBrowserSelectors } from '@atlaskit/editor-test-helpers/page-objects/element-browser';
import { runEscapeKeydownSuite } from '@atlaskit/editor-test-helpers/integration/escape-keydown';

const emojiPanel = '[data-emoji-picker-container="true"]';

BrowserTestCase(
  'insert-block.ts: opens emoji picker from toolbar button',
  {},
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, fullpage);

    await page.click(editable);
    await page.click(toolbarMenuItemsSelectors[ToolbarMenuItem.emoji]);

    await page.waitForSelector(emojiPanel);
  },
);

BrowserTestCase(
  'insert-block.ts: opens emoji picker from dropdown after resizing',
  {},
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

BrowserTestCase(
  'insert-block.ts: with new extensions opens emoji picker from dropdown after resizing',
  {},
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
