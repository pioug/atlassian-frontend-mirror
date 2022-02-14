import {
  initFullPageEditorWithAdf,
  snapshot,
  getBoundingClientRect,
} from '../_utils';
import * as panel from './__fixtures__/panel-adf.json';
import * as basicPanel from './__fixtures__/basic-panel-adf.json';
import * as customPanel from './__fixtures__/custom-panel-adf.json';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  waitForFloatingControl,
  retryUntilStablePosition,
} from '../../__helpers/page-objects/_toolbar';
import {
  PanelSharedCssClassName,
  PanelSharedSelectors,
} from '@atlaskit/editor-common/styles';
import { waitForNoTooltip } from '@atlaskit/visual-regression/helper';
import { panelSelectors } from '../../__helpers/page-objects/_panel';
import { pressKeyCombo } from '../../__helpers/page-objects/_keyboard';

describe('Panel:', () => {
  let page: PuppeteerPage;
  let adfContent: Object;

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
    await snapshot(page);
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

    // await animationFrame doesn't wait for the button to be styled fully selected, and selected
    // buttons don't have any different selectors we can wait for. However, the snapshot importantly
    // shows the new panel colour, icon and node selection intact
    await waitForNoTooltip(page);
  });

  // More basic panels to stop test flakiness
  describe('with basic content', () => {
    beforeAll(() => {
      adfContent = basicPanel;
    });

    it('updates the toolbar when changing from one panel to another', async () => {
      await page.click(PanelSharedSelectors.errorPanel);
      await page.click(PanelSharedSelectors.successPanel);
      await page.hover(`${PanelSharedSelectors.title}`);
      await waitForNoTooltip(page);
    });

    it('removes the panel when clicking on remove icon', async () => {
      await page.click(`.${PanelSharedCssClassName.icon}`);
      await page.click(PanelSharedSelectors.removeButton);
      await page.hover(`${PanelSharedSelectors.title}`);
      await waitForNoTooltip(page);
    });
  });
});

describe('custom panels', () => {
  let page: PuppeteerPage;
  let adfContent: Object;

  beforeEach(async () => {
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
    await snapshot(page);
  });
  beforeAll(() => {
    page = global.page;
    adfContent = customPanel;
  });

  it('open the panel background color picker', async () => {
    await page.click(`.${PanelSharedCssClassName.icon}`);
    await page.click(`${PanelSharedSelectors.colorPalette}`);
    await page.hover(`${PanelSharedSelectors.title}`);
    await waitForNoTooltip(page);
  });

  it('updates the panel background color', async () => {
    await page.click(`.${PanelSharedCssClassName.icon}`);
    await page.click(`${PanelSharedSelectors.colorPalette}`);
    await page.click(`${PanelSharedSelectors.selectedColor}`);
    await page.hover(`${PanelSharedSelectors.title}`);
    await waitForNoTooltip(page);
  });

  it('remove emoji icon from custom panel', async () => {
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
    await waitForNoTooltip(page);
  });

  it('remove icon from Standard panel', async () => {
    await page.click(`.${PanelSharedCssClassName.icon}`);
    await page.click(`${PanelSharedSelectors.infoPanel}`);
    await page.click(`${PanelSharedSelectors.removeEmojiIcon}`);
    await page.hover(`${PanelSharedSelectors.title}`);
    await waitForNoTooltip(page);
  });

  it('updates the panel and add emoji icon', async () => {
    await page.click(`.${PanelSharedCssClassName.icon}`);
    await page.click(`${PanelSharedSelectors.emojiIcon}`);
    const selectedEmoji = `${PanelSharedSelectors.selectedEmoji}`;
    await page.waitForSelector(selectedEmoji);
    await page.click(selectedEmoji);
    await page.waitForSelector(`.${PanelSharedCssClassName.icon}`, {
      visible: true,
    });
    await page.click(`${PanelSharedSelectors.title}`);
    await waitForNoTooltip(page);
  });

  it('should show emoji picker on top of the toolbar', async () => {
    await page.click(`.${PanelSharedCssClassName.icon}`);
    await pressKeyCombo(page, [
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
    await waitForNoTooltip(page);
  });

  describe('should close Popup ', () => {
    it('when clicked on other buttons on floating toolbar', async () => {
      await page.click(`.${PanelSharedCssClassName.icon}`);
      await page.click(`${PanelSharedSelectors.colorPalette}`);
      await page.click(`${PanelSharedSelectors.noteButton}`);
    });

    it('ColorPicker when clicked on EmojiPicker', async () => {
      await page.click(`.${PanelSharedCssClassName.icon}`);
      await page.click(`${PanelSharedSelectors.colorPalette}`);
      await page.click(`${PanelSharedSelectors.emojiIcon}`);
      await page.hover(`${PanelSharedSelectors.title}`);
      await waitForNoTooltip(page);
    });

    it('when clicked on different panel', async () => {
      await page.click(`.${PanelSharedCssClassName.icon}`);
      await page.click(`${PanelSharedSelectors.colorPalette}`);
      await page.click(`${PanelSharedSelectors.infoPanel}`);
    });
  });

  it('should select custom panel with emoji by pressing Shift + ArrowDown', async () => {
    await page.click(`${panelSelectors.panelContent} p`);
    await pressKeyCombo(page, [
      'Shift',
      'ArrowDown',
      'ArrowDown',
      'ArrowDown',
      'ArrowDown',
      'ArrowDown',
      'ArrowDown',
    ]);
  });

  it('should open custom Emoji option when clicked on addYourOwnEmoji button', async () => {
    await page.click(`.${PanelSharedCssClassName.icon}`);
    await page.click(`${PanelSharedSelectors.emojiIcon}`);
    await page.click(`${PanelSharedSelectors.addYourOwnEmoji}`);
    await page.click(`${PanelSharedSelectors.emojiNameInCustomEmoji}`);
    await page.hover(`${PanelSharedSelectors.title}`);
    await page.click(`${PanelSharedSelectors.emojiPopup} input`);
    await waitForNoTooltip(page);
  });

  describe('with a duplicate short name, ', () => {
    it('should be able select yellow warning emoji', async () => {
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

      await waitForNoTooltip(page);
    });
  });
});

describe('Dark mode panel', () => {
  let page: PuppeteerPage;
  let adfContent: Object;

  beforeAll(() => {
    page = global.page;
  });
  afterEach(async () => {
    await snapshot(page);
  });

  it('Should render standarad panels', async () => {
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
