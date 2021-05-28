import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import { fullpage, editable } from '../_helpers';
import {
  ToolbarMenuItem,
  toolbarMenuItemsSelectors,
} from '../../__helpers/page-objects/_toolbar';
import { elementBrowserSelectors } from '../../__helpers/page-objects/_element-browser';

const emojiPanel = '[data-emoji-picker-container="true"]';

BrowserTestCase(
  'insert-block.ts: opens emoji picker from toolbar button',
  { skip: ['edge'] },
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
  { skip: ['edge'] },
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
  { skip: ['edge'] },
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
