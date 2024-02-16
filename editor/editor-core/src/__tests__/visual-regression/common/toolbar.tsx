import React from 'react';

/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import {
  animationFrame,
  clickEditableContent,
  scrollToBottom,
} from '@atlaskit/editor-test-helpers/page-objects/editor';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import {
  pressKey,
  pressKeyCombo,
} from '@atlaskit/editor-test-helpers/page-objects/keyboard';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import { resetMousePosition } from '@atlaskit/editor-test-helpers/page-objects/mouse';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import {
  clickToolbarMenu,
  isDropdownMenuItemFocused,
  mainToolbarSelector,
  retryUntilStablePosition,
  toolbarMenuItemsSelectors as selectors,
  selectToolbarMenuWithKeyboard,
  ToolbarMenuItem,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import {
  Appearance,
  editorSelector,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import {
  Device,
  deviceViewPorts,
} from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import { getElementComputedStyle } from '@atlaskit/editor-test-helpers/vr-utils/get-computed-style';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import * as parapgrahADF from './__fixtures__/paragraph-of-text.adf.json';

async function focusToolbar(page: PuppeteerPage) {
  await pressKeyCombo(page, ['Alt', 'F9']);
}

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

describe('Toolbar keyboard shortcut', () => {
  it.each([Appearance.fullPage, Appearance.comment])(
    'in %s, should focus main toolbar and return on "ESC" ',
    async (appearance) => {
      let page = global.page;
      await initEditorWithAdf(page, {
        appearance,
        viewport: { width: 1000, height: 350 },
      });
      await clickEditableContent(page);
      await page.keyboard.type('Before focus. ');
      await focusToolbar(page);
      await snapshot(page, undefined, editorSelector);
      await page.keyboard.down('Escape');
      await page.keyboard.type('After ESC.'); //To confirm that focus is back to editor
      await retryUntilStablePosition(
        page,
        async () => {
          await snapshot(page, undefined, editorSelector);
        },
        editorSelector,
      );
    },
  );
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
  });
});

describe('Toolbar: IconBefore', () => {
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

    // FIXME: Skipping this test as it is flaky
    // Build link: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2287979
    it.skip('should show the icon', async () => {
      await page.mouse.move(-30, -30);
    });

    // FIXME: Skipping this test as it is flaky
    // Build link: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2289567
    it.skip('should show the icon in narrow view', async () => {
      await page.setViewport({ width: 400, height: 350 });
    });
  });

  // FIXME: Skipping this test as it is flaky
  // Build link: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2289567
  it.skip('should allow primary toolbar to span entire width when not specified', async () => {
    page = global.page;
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf: parapgrahADF,
      viewport: { width: 1000, height: 350 },
    });
  });
});

describe('Toolbar: IconBefore enabled', () => {
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

  it('should carry the keyline across', async () => {
    /**
     * Somewhere from 150px < 200px viewport height,
     * the keyline style stops updating.
     * However, browsers don't resize that small unless
     * developer panel is open so testing at 200px is sufficient.
     */
    await page.setViewport({ width: 1000, height: 200 });

    const keylineBoxShadowBefore = await getElementComputedStyle(
      page,
      mainToolbarSelector,
      'box-shadow',
    );
    expect(keylineBoxShadowBefore).toBe('none');

    await scrollToBottom(page);
    await page.waitForTimeout(200); //wait for scroll to finish

    const keylineBoxShadowAfter = await getElementComputedStyle(
      page,
      mainToolbarSelector,
      'box-shadow',
    );
    expect(keylineBoxShadowAfter).not.toBe('none');

    // only capturing the left part of the keyline to avoid capturing overlapping content
    await snapshot(page, undefined, mainToolbarSelector, {
      captureBeyondViewport: false,
      clip: {
        x: 0,
        y: 50,
        width: 100,
        height: 15,
      },
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
        allowUndoRedoButtons: true,
      },
    });
  });

  afterEach(async () => {
    await snapshot(page, undefined, mainToolbarSelector);
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

describe('Toolbar: Undo Redo', () => {
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

  it('should show the Undo / Redo buttons in a disabled state', async () => {
    const undoRedoDisabled = await page.evaluate(() => {
      return (
        (document.querySelector('#editor-toolbar__undo') as HTMLButtonElement)
          ?.disabled &&
        (document.querySelector('#editor-toolbar__redo') as HTMLButtonElement)
          ?.disabled
      );
    });
    expect(undoRedoDisabled).toBe(true);
  });
});

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

describe('Toolbar: No primaryToolbarComponents', () => {
  let page: PuppeteerPage;

  const initEditor = async (viewport: any) => {
    page = global.page;
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      viewport,
      editorProps: {
        allowUndoRedoButtons: true,
        primaryToolbarIconBefore: <div></div>,
        featureFlags: { twoLineEditorToolbar: true },
        allowFindReplace: true,
        primaryToolbarComponents: undefined,
      },
      withCollab: true,
    });
  };

  afterEach(async () => {
    await snapshot(page, undefined, mainToolbarSelector);
  });

  it('should show one line toolbar when viewport is big', async () => {
    await initEditor({ width: 1280, height: 300 });
    await page.waitForSelector(mainToolbarSelector);
  });

  it('should show one line toolbar when viewport is small', async () => {
    await initEditor({ width: 400, height: 300 });
    await page.waitForSelector(mainToolbarSelector);
  });
});

describe('Toolbar: Avatar group', () => {
  let page: PuppeteerPage;

  const initEditor = async ({
    hideAvatarGroup,
  }: {
    hideAvatarGroup: boolean;
  }) => {
    page = global.page;
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      viewport: { width: 1280, height: 300 },
      editorProps: {
        allowUndoRedoButtons: true,
        primaryToolbarIconBefore: <div></div>,
        featureFlags: { twoLineEditorToolbar: true },
        allowFindReplace: true,
        primaryToolbarComponents: undefined,
        hideAvatarGroup: hideAvatarGroup,
      },
      withCollab: true,
    });
  };

  afterEach(async () => {
    await snapshot(page, undefined, mainToolbarSelector);
  });

  it('should show avatar group when hideAvatarGroup is false', async () => {
    await initEditor({ hideAvatarGroup: false });
    await page.waitForSelector(mainToolbarSelector);
  });

  it('should hide avatar group when hideAvatarGroup is true', async () => {
    await initEditor({ hideAvatarGroup: true });
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
