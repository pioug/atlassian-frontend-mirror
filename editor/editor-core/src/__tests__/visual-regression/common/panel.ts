// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  initFullPageEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { getBoundingClientRect } from '@atlaskit/editor-test-helpers/vr-utils/bounding-client-rect';
import * as panel from './__fixtures__/panel-adf.json';
import * as basicPanel from './__fixtures__/basic-panel-adf.json';
import * as customPanel from './__fixtures__/custom-panel-adf.json';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  waitForFloatingControl,
  retryUntilStablePosition,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';
import {
  PanelSharedCssClassName,
  PanelSharedSelectors,
} from '@atlaskit/editor-common/panel';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { panelSelectors } from '@atlaskit/editor-test-helpers/page-objects/panel';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { waitForEmojisToLoad } from '@atlaskit/editor-test-helpers/page-objects/emoji';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  pressKey,
  pressWithKeyModifier,
} from '@atlaskit/editor-test-helpers/page-objects/keyboard';

describe('Panel:', () => {
  let page: PuppeteerPage;
  let adfContent: Object;
  let hasEmojiAtSnapshot: boolean = true;

  beforeAll(() => {
    page = global.page;
    adfContent = panel;
  });

  beforeEach(async () => {
    await initFullPageEditorWithAdf(page, adfContent, undefined, {
      width: 800,
      height: 720,
    });
    await waitForFloatingControl(page, 'Panel floating controls');
  });

  afterEach(async () => {
    if (hasEmojiAtSnapshot) {
      await waitForEmojisToLoad(page);
    }

    await snapshot(page, { useUnsafeThreshold: true, tolerance: 0.01 });

    hasEmojiAtSnapshot = true;
  });

  it('looks correct', async () => {
    const panelSelector = `.${PanelSharedCssClassName.prefix}`;
    await page.waitForSelector(panelSelector);
    await retryUntilStablePosition(
      page,
      () => page.click(panelSelector),
      '[aria-label*="Panel floating controls"]',
      1000,
    );
  });

  it('displays as selected when click on panel icon', async () => {
    await page.click(`.${PanelSharedCssClassName.icon}`);
  });

  it('displays as selected when click on padding', async () => {
    const contentBoundingRect = await getBoundingClientRect(
      page,
      `.${PanelSharedCssClassName.prefix}`,
    );
    await page.mouse.click(contentBoundingRect.left, contentBoundingRect.top);
  });

  it("doesn't lose node selection after changing panel type", async () => {
    await page.click(`.${PanelSharedCssClassName.icon}`);

    // Change panel type to note
    await page.click(PanelSharedSelectors.noteButton);
  });

  // More basic panels to stop test flakiness
  describe('with basic content', () => {
    beforeAll(() => {
      adfContent = basicPanel;
    });

    beforeEach(() => {
      hasEmojiAtSnapshot = false;
    });

    it('updates the toolbar when changing from one panel to another', async () => {
      await page.click(PanelSharedSelectors.errorPanel);
      await page.click(PanelSharedSelectors.successPanel);
      await page.hover(`${PanelSharedSelectors.title}`);
    });

    it('removes the panel when clicking on remove icon', async () => {
      await page.click(`.${PanelSharedCssClassName.icon}`);
      await page.click(PanelSharedSelectors.removeButton);
      await page.hover(`${PanelSharedSelectors.title}`);
    });
  });
});

describe('custom panels', () => {
  let page: PuppeteerPage;
  let adfContent: Object;
  let selector: string | undefined;

  beforeEach(async () => {
    selector = undefined;
    await initFullPageEditorWithAdf(
      page,
      adfContent,
      undefined,
      {
        width: 800,
        height: 720,
      },
      {
        allowPanel: {
          allowCustomPanel: true,
          allowCustomPanelEdit: true,
        },
      },
    );
    await waitForFloatingControl(page, 'Panel floating controls');
  });

  afterEach(async () => {
    await waitForEmojisToLoad(page);
    await snapshot(page, undefined, selector);
  });

  beforeAll(() => {
    page = global.page;
    adfContent = customPanel;
  });

  it('open the panel background color picker', async () => {
    await page.click(`.${PanelSharedCssClassName.icon}`);
    await page.click(`${PanelSharedSelectors.colorPalette}`);
    await page.hover(`${PanelSharedSelectors.title}`);
  });

  it('updates the panel background color', async () => {
    await page.click(`.${PanelSharedCssClassName.icon}`);
    await page.click(`${PanelSharedSelectors.colorPalette}`);
    await page.click(`${PanelSharedSelectors.selectedColor}`);
    await page.hover(`${PanelSharedSelectors.title}`);
  });

  // FIXME: This test was automatically skipped due to failure on 22/08/2023: https://product-fabric.atlassian.net/browse/ED-19651
  it.skip('remove emoji icon from custom panel', async () => {
    await page.click(`.${PanelSharedCssClassName.icon}`);
    await page.click(`${PanelSharedSelectors.emojiIcon}`);
    const selectedEmoji = `${PanelSharedSelectors.selectedEmoji}`;
    await page.waitForSelector(selectedEmoji);
    await page.click(selectedEmoji);
    await page.waitForSelector(`.${PanelSharedCssClassName.icon}`, {
      visible: true,
    });
    await page.click(`${PanelSharedSelectors.removeEmojiIcon}`);
    await page.hover(`${PanelSharedSelectors.title}`);
  });

  it('remove icon from Standard panel', async () => {
    await page.click(`.${PanelSharedCssClassName.icon}`);
    await page.click(`${PanelSharedSelectors.infoPanel}`);
    await page.click(`${PanelSharedSelectors.removeEmojiIcon}`);
    await page.hover(`${PanelSharedSelectors.title}`);
  });

  // FIXME: This test was automatically skipped due to failure on 22/08/2023: https://product-fabric.atlassian.net/browse/ED-19652
  it.skip('updates the panel and add emoji icon', async () => {
    await page.click(`.${PanelSharedCssClassName.icon}`);
    await page.click(`${PanelSharedSelectors.emojiIcon}`);
    const selectedEmoji = `${PanelSharedSelectors.selectedEmoji}`;
    await page.waitForSelector(selectedEmoji);
    await page.click(selectedEmoji);
    await page.waitForSelector(`.${PanelSharedCssClassName.icon}`, {
      visible: true,
    });
    await page.click(`${PanelSharedSelectors.title}`);
  });

  // FIXME: This test was automatically skipped due to failure on 22/08/2023: https://product-fabric.atlassian.net/browse/ED-19653
  it.skip('should show emoji picker on top of the toolbar', async () => {
    await page.click(`.${PanelSharedCssClassName.icon}`);
    await pressKey(page, [
      'ArrowRight',
      'ArrowRight',
      'ArrowDown',
      'ArrowDown',
      'ArrowDown',
      'ArrowDown',
      'ArrowDown',
      'ArrowDown',
      'ArrowDown',
      'ArrowDown',
    ]);
    await page.click(`${PanelSharedSelectors.colorPalette}`);
    await page.click(`${PanelSharedSelectors.emojiIcon}`);
    await page.hover(`${PanelSharedSelectors.title}`);
  });

  describe('should close Popup ', () => {
    it('when clicked on other buttons on floating toolbar', async () => {
      await page.click(`.${PanelSharedCssClassName.icon}`);
      await page.click(`${PanelSharedSelectors.colorPalette}`);
      await page.click(`${PanelSharedSelectors.noteButton}`);
    });

    // FIXME: This test was manually skipped due to failure on 23/08/2023: https://product-fabric.atlassian.net/browse/ED-19654
    it.skip('ColorPicker when clicked on EmojiPicker', async () => {
      await page.click(`.${PanelSharedCssClassName.icon}`);
      await page.click(`${PanelSharedSelectors.colorPalette}`);
      await page.click(`${PanelSharedSelectors.emojiIcon}`);
      await page.hover(`${PanelSharedSelectors.title}`);
    });

    it('when clicked on different panel', async () => {
      await page.click(`.${PanelSharedCssClassName.icon}`);
      await page.click(`${PanelSharedSelectors.colorPalette}`);
      await page.click(`${PanelSharedSelectors.infoPanel}`);
    });
  });

  it('should select custom panel with emoji by pressing Shift + ArrowDown', async () => {
    await page.click(`${panelSelectors.panelContent} p`);
    await pressWithKeyModifier(page, {
      modifierKeys: ['Shift'],
      keys: [
        'ArrowDown',
        'ArrowDown',
        'ArrowDown',
        'ArrowDown',
        'ArrowDown',
        'ArrowDown',
      ],
      // We need a timeout here as there is custom interception of shift + Arrow down in packages/editor/editor-core/src/plugins/selection/pm-plugins/selection-main.ts,
      // which takes time to run and update the selection.
      timeoutRequired: true,
    });
  });

  // FIXME: This test was automatically skipped due to failure on 22/08/2023: https://product-fabric.atlassian.net/browse/ED-19655
  it.skip('should open custom Emoji option when clicked on addYourOwnEmoji button', async () => {
    await page.click(`.${PanelSharedCssClassName.icon}`);
    await page.click(`${PanelSharedSelectors.emojiIcon}`);
    await page.click(`${PanelSharedSelectors.addYourOwnEmoji}`);
    await page.click(`${PanelSharedSelectors.emojiNameInCustomEmoji}`);
    await page.hover(`${PanelSharedSelectors.title}`);
    await page.click(`${PanelSharedSelectors.emojiPopup} input`);
  });

  // FIXME: This test was automatically skipped due to failure on 22/08/2023: https://product-fabric.atlassian.net/browse/ED-19656
  it.skip('with a duplicate short name, should be able select yellow warning emoji', async () => {
    await page.click(`.${PanelSharedCssClassName.icon}`);
    await page.click(`${PanelSharedSelectors.warningButton}`);
    await page.click(`${PanelSharedSelectors.emojiIcon}`);
    await page.waitForSelector(`${PanelSharedSelectors.emojiPopup}`, {
      visible: true,
    });
    //Search warning in emojiPicker
    await page.focus(`${PanelSharedSelectors.searchEmoji}`);
    await page.keyboard.type('warning');
    await page.waitForSelector(`${PanelSharedSelectors.orangeWarningIcon}`, {
      visible: true,
    });
    await page.waitForSelector(`${PanelSharedSelectors.yellowWarningIcon}`, {
      visible: true,
    });

    //Select yellow warning icon
    await page.click(`${PanelSharedSelectors.yellowWarningIcon}`);
    await page.waitForSelector(`.${PanelSharedCssClassName.icon}`, {
      visible: true,
    });
    await page.click(`${PanelSharedSelectors.title}`);

    selector = '.ak-editor-panel';
  });
});

describe('Dark mode panel', () => {
  let page: PuppeteerPage;
  let adfContent: Object;

  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    await waitForEmojisToLoad(page);
    await snapshot(page);
  });

  // FIXME: This test was automatically skipped due to failure on 24/05/2023: https://product-fabric.atlassian.net/browse/ED-18043
  it.skip('Should render standard panels', async () => {
    adfContent = panel;
    await initFullPageEditorWithAdf(
      page,
      adfContent,
      undefined,
      {
        width: 800,
        height: 720,
      },
      undefined,
      'dark',
    );
    await waitForFloatingControl(page, 'Panel floating controls');
    const panelSelector = `.${PanelSharedCssClassName.prefix}`;
    await page.waitForSelector(panelSelector);
    await retryUntilStablePosition(
      page,
      () => page.click(panelSelector),
      '[aria-label*="Panel floating controls"]',
      1000,
    );
  });
});
