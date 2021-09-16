import React from 'react';
import {
  waitForNoTooltip,
  waitForTooltip,
} from '@atlaskit/visual-regression/helper';
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
  Device,
  deviceViewPorts,
  editorSelector,
} from '../_utils';
import {
  clickToolbarMenu,
  ToolbarMenuItem,
  toolbarMenuItemsSelectors as selectors,
  mainToolbarSelector,
  retryUntilStablePosition,
  toolbarDropdownMenuSelectors,
} from '../../__helpers/page-objects/_toolbar';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { scrollToBottom } from '../../__helpers/page-objects/_editor';
import * as parapgrahADF from './__fixtures__/paragraph-of-text.adf.json';

describe('Toolbar', () => {
  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      viewport: { width: 1000, height: 350 },
    });
  });

  afterEach(async () => {
    await page.waitForSelector(selectors[ToolbarMenuItem.toolbarDropList]);
    await snapshot(page, undefined, editorSelector);
  });

  it('should display headings menu correctly', async () => {
    await clickToolbarMenu(page, ToolbarMenuItem.fontStyle);
    await waitForTooltip(page, 'Text styles');
  });

  it('should display text color menu correctly', async () => {
    await clickToolbarMenu(page, ToolbarMenuItem.textColor);
    await waitForTooltip(page, 'Text color');
  });

  it('should display insert menu correctly', async () => {
    await page.setViewport({ width: 1000, height: 700 });
    await clickToolbarMenu(page, ToolbarMenuItem.insertMenu);
    await waitForTooltip(page, 'Insert');
  });
});

describe('Toolbar: Text Color', () => {
  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      viewport: { width: 1000, height: 350 },
    });

    await clickToolbarMenu(page, ToolbarMenuItem.textColor);
    await retryUntilStablePosition(
      page,
      async () => {
        await page.waitForSelector(toolbarDropdownMenuSelectors.textColor);
      },
      editorSelector,
    );
    await page.mouse.move(0, 0);
    await waitForNoTooltip(page);
    await snapshot(page, undefined, editorSelector);
  });

  afterEach(async () => {
    await retryUntilStablePosition(
      page,
      async () => {
        await page.waitForSelector(toolbarDropdownMenuSelectors.textColor, {
          hidden: true,
        });
      },
      editorSelector,
    );
    await snapshot(page, undefined, editorSelector);
  });

  it('should close the text color menu when ESC is pressed', async () => {
    await page.keyboard.down('Escape');
  });

  it('should close the text color menu when clicked outside', async () => {
    await page.mouse.click(0, 0);
  });
});

describe('Toolbar: Emoji', () => {
  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      viewport: { width: 1000, height: 350 },
    });

    await clickToolbarMenu(page, ToolbarMenuItem.emoji);
    await page.waitForSelector(toolbarDropdownMenuSelectors.emoji);
  });

  afterEach(async () => {
    await retryUntilStablePosition(
      page,
      async () => {
        await page.waitForSelector(toolbarDropdownMenuSelectors.emoji, {
          hidden: true,
        });
      },
      editorSelector,
    );
    await snapshot(page, undefined, editorSelector);
  });

  it('should close the emoji menu when ESC is pressed', async () => {
    await page.keyboard.down('Escape');
  });

  it('should close the emoji menu when clicked outside', async () => {
    await page.mouse.click(0, 0);
  });
});

describe('Toolbar: Comment', () => {
  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
    await initEditorWithAdf(page, {
      appearance: Appearance.comment,
      device: Device.iPadPro,
    });
  });

  afterEach(async () => {
    await page.waitForSelector(selectors[ToolbarMenuItem.toolbarDropList]);
    await snapshot(page, undefined, editorSelector);
  });

  it('should display text color menu correctly at small viewport', async () => {
    await page.setViewport(deviceViewPorts[Device.iPhonePlus]);
    await clickToolbarMenu(page, ToolbarMenuItem.textColor);
    await waitForTooltip(page, 'Text color');
  });
});

describe('Toolbar: IconBefore', () => {
  let page: PuppeteerPage;

  afterEach(async () => {
    await waitForNoTooltip(page);
    await snapshot(page, undefined, editorSelector);
  });

  describe('enabled', () => {
    beforeEach(async () => {
      page = global.page;
      await initEditorWithAdf(page, {
        adf: parapgrahADF,
        appearance: Appearance.fullPage,
        viewport: { width: 1000, height: 350 },
        editorProps: {
          primaryToolbarIconBefore: <div></div>,
        },
      });
    });

    it('should show the icon', async () => {
      await waitForTooltip(page, 'Bold');
      await page.mouse.move(-30, -30);
      await waitForNoTooltip(page);
    });

    it('should show the icon in narrow view', async () => {
      await page.setViewport({ width: 400, height: 350 });
    });

    it('should carry the keyline across', async () => {
      await page.setViewport({ width: 1000, height: 350 });
      await scrollToBottom(page);
    });
  });

  it('should allow primary toolbar to span entire width when not specified', async () => {
    page = global.page;
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf: parapgrahADF,
      viewport: { width: 1000, height: 350 },
    });
  });
});

describe('Toolbar: Undo Redo', () => {
  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      editorProps: {
        UNSAFE_allowUndoRedoButtons: true,
      },
    });
  });

  afterEach(async () => {
    await snapshot(page, undefined, mainToolbarSelector);
  });

  it('should show the Undo / Redo buttons in a disabled state', async () => {
    await page.waitForSelector(selectors[ToolbarMenuItem.undo]);
  });

  // FIXME These tests were flakey in the Puppeteer v10 Upgrade
  it.skip('should show the Undo button in a active state', async () => {
    await page.waitForSelector(selectors[ToolbarMenuItem.undo]);
    // Add a bullet list to the doc so something can be undone and the Undo button become active
    await clickToolbarMenu(page, ToolbarMenuItem.bulletList);
  });

  // FIXME These tests were flakey in the Puppeteer v10 Upgrade
  it.skip('should show the Redo button in a active state', async () => {
    await page.waitForSelector(selectors[ToolbarMenuItem.undo]);
    // Add a bullet list to the doc so something can be undone and the Undo button become active
    await clickToolbarMenu(page, ToolbarMenuItem.bulletList);
    await clickToolbarMenu(page, ToolbarMenuItem.undo);
  });

  it('should not have overlapping buttons on smaller devices', async () => {
    await page.setViewport({ width: 400, height: 350 });
  });
});
