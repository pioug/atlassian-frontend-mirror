import React from 'react';

/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import { pressKey } from '@atlaskit/editor-test-helpers/page-objects/keyboard';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import { resetMousePosition } from '@atlaskit/editor-test-helpers/page-objects/mouse';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import {
  isDropdownMenuItemFocused,
  mainToolbarSelector,
  toolbarMenuItemsSelectors as selectors,
  selectToolbarMenuWithKeyboard,
  ToolbarMenuItem,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';

describe('Toolbar: Responsive toolbar', () => {
  let page: PuppeteerPage;

  const initEditor = async (viewport: any, twoLineEditorToolbar: boolean) => {
    page = global.page;
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      viewport,
      editorProps: {
        allowUndoRedoButtons: true,
        primaryToolbarIconBefore: <div></div>,
        featureFlags: { twoLineEditorToolbar: twoLineEditorToolbar },
        allowFindReplace: true,
        primaryToolbarComponents: { before: <div></div>, after: <div></div> },
      },
      withCollab: true,
    });
  };

  afterEach(async () => {
    await resetMousePosition(page);
    await snapshot(page, undefined, mainToolbarSelector);
  });

  it('should show one line toolbar when viewport is big if feature flag is off', async () => {
    await initEditor({ width: 1280, height: 300 }, false);
    await page.waitForSelector(mainToolbarSelector);
  });

  it('should show one line toolbar when viewport is small if feature flag is off', async () => {
    await initEditor({ width: 400, height: 300 }, false);
    await page.waitForSelector(mainToolbarSelector);
  });

  it('should show one line toolbar with squashed non-custom toolbar when viewport is around 870px if feature flag is off', async () => {
    await initEditor({ width: 870, height: 300 }, false);
    await page.waitForSelector(mainToolbarSelector);
  });

  it('should show one line toolbar when viewport is big if feature flag is on', async () => {
    await initEditor({ width: 1280, height: 300 }, true);
    await page.waitForSelector(mainToolbarSelector);
  });

  it('should show two line toolbar when viewport is small if feature flag is on', async () => {
    await initEditor({ width: 400, height: 300 }, true);
    await page.waitForSelector(mainToolbarSelector);
  });

  it('should show one line toolbar with squashed non-custom toolbar when viewport is around 870px if feature flag is on', async () => {
    await initEditor({ width: 870, height: 300 }, true);
    await page.waitForSelector(mainToolbarSelector);
  });
});

describe('Toolbar: Dropdown behaviours', () => {
  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      viewport: { width: 500, height: 500 },
      editorProps: {
        showIndentationButtons: true,
      },
    });
    await page.waitForSelector("[data-testid='ak-editor-main-toolbar']");
  });

  const dropdowns = [
    selectors[ToolbarMenuItem.fontStyle],
    selectors[ToolbarMenuItem.moreFormatting],
    selectors[ToolbarMenuItem.alignment],
    '[aria-label="Lists"]',
    selectors[ToolbarMenuItem.insertMenu],
  ];

  dropdowns.forEach((dropdownButton) => {
    it('should focus first menu item when opening Dropdown by keyboard', async () => {
      await page.click('[aria-label="Editable content"]');
      await selectToolbarMenuWithKeyboard(page, dropdownButton);
      await pressKey(page, 'Enter');
      expect(
        await isDropdownMenuItemFocused(
          page,
          '[data-role="droplistContent"] span',
        ),
      ).toBe(true);
    });
  });
});
