import React from 'react';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  deviceViewPorts,
  Device,
} from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import {
  Appearance,
  editorSelector,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import {
  clickToolbarMenu,
  mainToolbarSelector,
  retryUntilStablePosition,
  toolbarDropdownMenuSelectors,
  ToolbarMenuItem,
  toolbarMenuItemsSelectors as selectors,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';
import {
  animationFrame,
  scrollToBottom,
} from '@atlaskit/editor-test-helpers/page-objects/editor';
import { pressKeyCombo } from '@atlaskit/editor-test-helpers/page-objects/keyboard';
import * as parapgrahADF from './__fixtures__/paragraph-of-text.adf.json';

import { getElementComputedStyle } from '@atlaskit/editor-test-helpers/vr-utils/get-computed-style';
import { N700 } from '@atlaskit/theme/colors';
import { normalizeHexColor } from '@atlaskit/adf-schema';

/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
const selectedColor = N700;

async function focusToolbar(page: PuppeteerPage) {
  await pressKeyCombo(page, ['Alt', 'F9']);
}

// FIXME: Skipped because of flakiness
// https://product-fabric.atlassian.net/browse/ED-16626
describe.skip('Toolbar', () => {
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
  });

  it('should display text alignment menu correctly', async () => {
    await clickToolbarMenu(page, ToolbarMenuItem.alignment);
  });

  it('should display text color menu correctly', async () => {
    await clickToolbarMenu(page, ToolbarMenuItem.textColor);
  });

  it('should display insert menu correctly', async () => {
    await page.setViewport({ width: 1000, height: 700 });
    await clickToolbarMenu(page, ToolbarMenuItem.insertMenu);
  });
});

// FIXME: Skipped because of flakiness
// https://product-fabric.atlassian.net/browse/ED-16626
describe.skip('Toolbar keyboard shortcut', () => {
  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      viewport: { width: 1000, height: 350 },
    });
  });

  it('should focus main toolbar first element and return on "ESC" ', async () => {
    await focusToolbar(page);
    await snapshot(page, undefined, editorSelector);
    await page.keyboard.down('Escape');
    await page.keyboard.type('Test'); //To confirm that focus is back to editor
    await retryUntilStablePosition(
      page,
      async () => {
        await snapshot(page, undefined, editorSelector);
      },
      editorSelector,
    );
  });
});

// FIXME: Skipped because of flakiness
// https://product-fabric.atlassian.net/browse/ED-16626
describe.skip('Toolbar: Text Color', () => {
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

  // Skipped because of flakiness
  // https://product-fabric.atlassian.net/browse/ED-16626
  it.skip('should close the text color menu when ESC is pressed', async () => {
    await page.keyboard.down('Escape');
  });

  // Skipped because of flakiness
  // https://product-fabric.atlassian.net/browse/ED-16626
  it.skip('should close the text color menu when clicked outside', async () => {
    await page.mouse.click(0, 0);
  });
});

// FIXME: Skipped because of flakiness
// https://product-fabric.atlassian.net/browse/ED-16626
describe.skip('Toolbar: Emoji', () => {
  let page: PuppeteerPage;

  const EmojiButtonSelector =
    "[data-testid='ak-editor-main-toolbar'] [data-testid='Emoji']";

  beforeEach(async () => {
    page = global.page;
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      viewport: { width: 1000, height: 350 },
    });

    // make sure mouse position is reset to avoid accidental button hover
    await page.mouse.click(0, 0);

    await clickToolbarMenu(page, ToolbarMenuItem.emoji);
    await page.waitForSelector(toolbarDropdownMenuSelectors.emoji);

    const currentBgColor = await getElementComputedStyle(
      page,
      EmojiButtonSelector,
      'background-color',
    );

    // test if emoji button have selected bg colour
    expect(normalizeHexColor(currentBgColor)).toBe(selectedColor);
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

    const currentBgColor = await getElementComputedStyle(
      page,
      EmojiButtonSelector,
      'background-color',
    );

    // test if emoji button have default bg colour
    // note: rgba(0, 0, 0, 0) is when bg is undefined
    expect(currentBgColor).toBe('rgba(0, 0, 0, 0)');
  });

  // FIXME: Skipped because of flakiness
  // https://product-fabric.atlassian.net/browse/ED-16626
  it.skip('should close the emoji menu when ESC is pressed', async () => {
    await page.keyboard.down('Escape');
  });

  // FIXME: Skipped because of flakiness
  // https://product-fabric.atlassian.net/browse/ED-16626
  it.skip('should close the emoji menu when clicked outside', async () => {
    await page.mouse.click(0, 0);
  });
});

// FIXME: Skipped because of flakiness
// https://product-fabric.atlassian.net/browse/ED-16626
describe.skip('Toolbar: Comment', () => {
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

  // FIXME: Skipped because of flakiness
  // https://product-fabric.atlassian.net/browse/ED-16626
  // FIXME: This test was automatically skipped due to failure on 12/02/2023: https://product-fabric.atlassian.net/browse/ED-16859
  it.skip('should display text color menu correctly at small viewport', async () => {
    await page.setViewport(deviceViewPorts[Device.iPhonePlus]);
    await clickToolbarMenu(page, ToolbarMenuItem.textColor);
  });
});

// FIXME: Skipped because of flakiness
// https://product-fabric.atlassian.net/browse/ED-16626
describe.skip('Toolbar: IconBefore', () => {
  let page: PuppeteerPage;

  afterEach(async () => {
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

    // FIXME: Skipped because of flakiness
    // https://product-fabric.atlassian.net/browse/ED-16626
    // FIXME: This test was automatically skipped due to failure on 12/02/2023: https://product-fabric.atlassian.net/browse/ED-16861
    it.skip('should show the icon', async () => {
      await page.mouse.move(-30, -30);
    });

    // FIXME: Skipped because of flakiness
    // https://product-fabric.atlassian.net/browse/ED-16626
    // FIXME: This test was automatically skipped due to failure on 12/02/2023: https://product-fabric.atlassian.net/browse/ED-16863
    it.skip('should show the icon in narrow view', async () => {
      await page.setViewport({ width: 400, height: 350 });
    });

    // TODO: Restore skipped test https://product-fabric.atlassian.net/browse/ED-16795
    it.skip('should carry the keyline across', async () => {
      await page.setViewport({ width: 1000, height: 350 });
      await scrollToBottom(page);
    });
  });

  // TODO: Restore skipped test https://product-fabric.atlassian.net/browse/ED-16794
  it.skip('should allow primary toolbar to span entire width when not specified', async () => {
    page = global.page;
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf: parapgrahADF,
      viewport: { width: 1000, height: 350 },
    });
  });
});

// FIXME: Skipped because of flakiness
// https://product-fabric.atlassian.net/browse/ED-16626
describe.skip('Toolbar: Undo Redo', () => {
  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      editorProps: {
        allowUndoRedoButtons: true,
      },
    });
  });

  afterEach(async () => {
    await snapshot(page, undefined, mainToolbarSelector);
  });

  // TODO: Restore skipped test https://product-fabric.atlassian.net/browse/ED-16793
  it.skip('should show the Undo / Redo buttons in a disabled state', async () => {
    await page.waitForSelector(selectors[ToolbarMenuItem.undo]);
  });

  it('should show the Undo button in a active state', async () => {
    await page.waitForSelector(selectors[ToolbarMenuItem.undo]);
    await animationFrame(page);
    // Add a bullet list to the doc so something can be undone and the Undo button become active
    await clickToolbarMenu(page, ToolbarMenuItem.bulletList);
  });

  it('should show the Redo button in a active state', async () => {
    await page.waitForSelector(selectors[ToolbarMenuItem.undo]);
    await animationFrame(page);
    // Add a bullet list to the doc so something can be undone and the Undo button become active
    await clickToolbarMenu(page, ToolbarMenuItem.bulletList);
    await clickToolbarMenu(page, ToolbarMenuItem.undo);
  });

  it('should not have overlapping buttons on smaller devices', async () => {
    await page.setViewport({ width: 400, height: 350 });
  });
});

// FIXME: Skipped because of flakiness
// https://product-fabric.atlassian.net/browse/ED-16626
describe.skip('Toolbar: Responsive toolbar', () => {
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
