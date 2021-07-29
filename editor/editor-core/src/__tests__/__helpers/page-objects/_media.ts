import { PuppeteerPage } from './_types';
import { insertMedia as integrationInsertMedia } from '../../integration/_helpers';
import { getBoundingRect, scrollToElement } from './_editor';

import { snapshot } from '../../visual-regression/_utils';
import commonMessages, {
  linkToolbarMessages,
  linkMessages,
} from '../../../messages';
import { toolbarMessages as mediaLayoutToolbarMessages } from '../../../ui/MediaAndEmbedsToolbar/toolbar-messages';
import { waitForLoadedImageElements } from '@atlaskit/visual-regression/helper';
import { MediaPickerPageObject } from '@atlaskit/media-integration-test-helpers';
import Page, { BrowserObject } from '@atlaskit/webdriver-runner/wd-wrapper';
import { messages as insertBlockMessages } from '../../../plugins/insert-block/ui/ToolbarInsertBlock/messages';
import { KEY } from './_keyboard';
import { mediaLinkToolbarMessages } from '../../../plugins/media/ui/media-linking-toolbar-messages';

export enum MediaLayout {
  center,
  wrapLeft,
  wrapRight,
  wide,
  fullWidth,
  alignStart,
  alignEnd,
}

export const mediaSingleLayouts = [
  MediaLayout.center,
  MediaLayout.alignEnd,
  MediaLayout.alignStart,
  MediaLayout.wrapLeft,
  MediaLayout.wrapRight,
  MediaLayout.fullWidth,
  MediaLayout.wide,
];

export enum MediaResizeSide {
  right = 'right',
  left = 'left',
}

export enum MediaToolbarButton {
  addLink,
  editLink,
  openLink,
  backLink,
  unlink,
}

// Selectors
const mediaUploadCardSelector =
  '[data-testid="media-picker-popup"] [data-testid="media-file-card-view"]';
export const mediaImageSelector = `[data-testid="media-file-card-view"][data-test-status="complete"] .img-wrapper, .mediaGroupView-content-wrap .img-wrapper`;
const mediaImageSelected = `.ProseMirror-selectednode [data-testid="media-file-card-view"][data-test-status="complete"] .img-wrapper, .ProseMirror-selectednode .mediaGroupView-content-wrap .img-wrapper`;
const insertMediaFileSelector = 'div[aria-label="%s"]';
export const mediaToolbarRemoveSelector =
  'button[data-testid="media-toolbar-remove-button"]';
export const mediaDangerSelector =
  '.danger [data-testid="media-file-card-view"][data-test-status="complete"]';

export const LinkToolbarSelectors = {
  [MediaToolbarButton.addLink]: `[aria-label="Media floating controls"] [aria-label="${linkToolbarMessages.addLink.defaultMessage}"]`,
  [MediaToolbarButton.editLink]: `[aria-label="Media floating controls"] [aria-label="${linkToolbarMessages.editLink.defaultMessage}"]`,
  [MediaToolbarButton.openLink]: `[aria-label="Media floating controls"] [aria-label="${linkMessages.openLink.defaultMessage}"]`,
  [MediaToolbarButton.unlink]: `[aria-label="Media floating controls"] [aria-label="${linkToolbarMessages.unlink.defaultMessage}"]`,
  [MediaToolbarButton.backLink]: `[aria-label="Media floating controls"] [aria-label="${mediaLinkToolbarMessages.backLink.defaultMessage}"]`,
};

const LayoutSelectors = {
  [MediaLayout.center]: {
    button: `[aria-label="Media floating controls"] [aria-label="${commonMessages.alignImageCenter.defaultMessage}"]`,
    modifier: `.image-center`,
  },
  [MediaLayout.wrapLeft]: {
    button: `[aria-label="Media floating controls"] [aria-label="${mediaLayoutToolbarMessages.wrapLeft.defaultMessage}"]`,
    modifier: `.image-wrap-left`,
  },
  [MediaLayout.wrapRight]: {
    button: `[aria-label="Media floating controls"] [aria-label="${mediaLayoutToolbarMessages.wrapRight.defaultMessage}"]`,
    modifier: `.image-wrap-right`,
  },
  [MediaLayout.wide]: {
    button: `[aria-label="Media floating controls"] [aria-label="${commonMessages.layoutWide.defaultMessage}"]`,
    modifier: `.image-wide`,
  },
  [MediaLayout.fullWidth]: {
    button: `[aria-label="Media floating controls"] [aria-label="${commonMessages.layoutFullWidth.defaultMessage}"]`,
    modifier: `.image-full-width`,
  },
  [MediaLayout.alignStart]: {
    button: `[aria-label="Media floating controls"] [aria-label="${commonMessages.alignImageLeft.defaultMessage}"]`,
    modifier: `.image-align-start`,
  },
  [MediaLayout.alignEnd]: {
    button: `[aria-label="Media floating controls"] [aria-label="${commonMessages.alignImageRight.defaultMessage}"]`,
    modifier: `.image-align-end`,
  },
};

export const mediaResizeSelectors = {
  [MediaResizeSide.right]: '.richMedia-resize-handle-right',
  [MediaResizeSide.left]: '.richMedia-resize-handle-left',
};

export async function waitForMediaToBeLoaded(page: PuppeteerPage) {
  await page.waitForSelector(mediaImageSelector);
  await page.waitForSelector(mediaUploadCardSelector, {
    // We need to wait for the upload card to disappear
    hidden: true,
  });
}

export const scrollToMedia = async (page: PuppeteerPage) => {
  await scrollToElement(page, mediaImageSelector, 50);
};

export const insertMedia = async (
  page: PuppeteerPage,
  filenames = ['one.svg'],
) => {
  await integrationInsertMedia(page, filenames, insertMediaFileSelector);
  await waitForMediaToBeLoaded(page);
};

export async function clickOnToolbarButton(
  page: PuppeteerPage,
  button: MediaToolbarButton,
) {
  const selector = LinkToolbarSelectors[button];

  await page.waitForSelector(selector, { visible: true });
  await page.click(selector);
}

export async function waitForActivityItems(page: PuppeteerPage, items: number) {
  const itemsSelector = `[aria-label="Media floating controls"] .recent-list ul li`;
  await page.waitForFunction(
    (selector: string, items: number) =>
      document.querySelectorAll(selector).length === items,
    {},
    itemsSelector,
    items,
  );
  await waitForLoadedImageElements(page, 3000);
}

export async function changeMediaLayout(
  page: PuppeteerPage,
  layout: MediaLayout,
) {
  const { button, modifier } = LayoutSelectors[layout];

  await page.waitForSelector(button);
  await page.click(button);

  await page.waitForSelector(modifier);
}

export async function clickMediaInPosition(
  page: PuppeteerPage,
  position: number,
) {
  await page.evaluate(
    (position: number, mediaImageSelector: string) => {
      (document.querySelectorAll(mediaImageSelector)[
        position
      ]! as HTMLElement).click();
    },
    position,
    mediaImageSelector,
  );
  await page.waitForSelector(mediaImageSelected);
}

export const pickupHandle = async (
  page: PuppeteerPage,
  side: MediaResizeSide = MediaResizeSide.right,
) => {
  let rect = await getBoundingRect(page, mediaResizeSelectors[side]);

  const resizeHandle = rect.left + rect.width / 2;
  const top = rect.top + rect.height / 2;

  await page.mouse.move(resizeHandle, top);
  await page.mouse.down();
};

const moveHandle = async (
  page: PuppeteerPage,
  distance: number,
  side: MediaResizeSide = MediaResizeSide.right,
) => {
  let rect = await getBoundingRect(page, mediaResizeSelectors[side]);

  const resizeHandle = rect.left + rect.width / 2;
  const top = rect.top + rect.height / 2;

  await page.mouse.move(resizeHandle + distance, top);
};

export const releaseHandle = async (page: PuppeteerPage) => {
  await page.mouse.up();
};
export async function resizeMediaInPositionWithSnapshot(
  page: PuppeteerPage,
  position: number,
  distance: number,
  side: MediaResizeSide = MediaResizeSide.right,
) {
  await clickMediaInPosition(page, position);
  await pickupHandle(page, side);

  await moveHandle(page, distance, side);

  await releaseHandle(page);

  await pickupHandle(page, side);
  await snapshot(page);
}

export async function resizeMediaInPosition(
  page: PuppeteerPage,
  position: number,
  distance: number,
  side: MediaResizeSide = MediaResizeSide.right,
) {
  await clickMediaInPosition(page, position);
  await pickupHandle(page, side);
  await moveHandle(page, distance, side);
  await releaseHandle(page);
}

export const isLayoutAvailable = (
  mode: MediaLayout.wide | MediaLayout.fullWidth,
  width: number,
) => {
  if (mode === MediaLayout.wide) {
    return width >= 960;
  } else if (mode === MediaLayout.fullWidth) {
    return width >= 1280;
  }

  return true;
};

export type TestPageConfig = {
  viewport: {
    width: number;
    height: number;
  };

  dynamicTextSizing: boolean;
};

export class FullPageEditor extends Page {
  mediaPicker: MediaPickerPageObject;

  constructor(browserObject: BrowserObject) {
    super(browserObject);
    this.mediaPicker = new MediaPickerPageObject(this);
  }

  async openMediaPicker() {
    const openMediaPopup = `button:enabled [aria-label="${insertBlockMessages.filesAndImages.defaultMessage}"]`;
    // wait for media button in toolbar
    await this.waitForSelector(openMediaPopup);
    await this.pause(300);
    await this.click(openMediaPopup);
    // wait for media picker popup
    await this.isVisible('[data-testid="media-picker-popup"]');
  }

  async publish() {
    await this.click('[data-testid="publish-button"]');
    await this.isVisible('[data-testid="edit-button"]');
    await this.pause(300);
  }

  async edit() {
    await this.click('[data-testid="edit-button"]');
    await this.isVisible('[data-testid="publish-button"]');
    await this.waitForSelector('.ProseMirror', { timeout: 10000 });
  }

  async clearEditor() {
    await this.click('.ProseMirror');
    const modifierKey = this.isWindowsPlatform() ? KEY.CONTROL : KEY.META;
    await this.keys([modifierKey, 'a'], true);
    await this.keys([modifierKey], true); //WebdriverIo requires the explict unpressing of modifier keys
    await this.keys(['Backspace'], true);
  }
}

interface ResizeMediaSingleOptions {
  amount: number;
  units:
    | 'pixels' // Resize using px value (for resizing down - negative number)
    | 'percent'; // Resizing using % of initial size (for resizing down - negative value)
}

export interface ResizeMediaSingleResult {
  startWidth: number;
  endWidth: number;
}

export const resizeMediaSingle = async (
  page: Page,
  { amount, units }: ResizeMediaSingleOptions,
): Promise<ResizeMediaSingleResult> => {
  const mediaSingleSelector = '.mediaSingleView-content-wrap';
  await page.waitForSelector(mediaSingleSelector);
  const mediaSingleElement = await page.$(mediaSingleSelector);

  const mediaCardInMediaSingleSelector = `${mediaSingleSelector} [data-testid="media-card-view"]`;
  await page.waitForSelector(mediaCardInMediaSingleSelector);
  const cardViewElement = await page.$(mediaCardInMediaSingleSelector);

  await page.click(mediaCardInMediaSingleSelector);
  await page.waitForSelector(
    '[data-testid="media-card-view"] [data-test-selected]',
  );

  const startWidth = await cardViewElement.getSize('width');
  if (units === 'pixels') {
    await moveRightResizeHandler(page, mediaSingleElement, amount);
  } else if (units === 'percent' && amount >= -1 && amount <= 1) {
    const delta = Math.floor(startWidth * amount);
    await moveRightResizeHandler(page, mediaSingleElement, delta);
  } else {
    throw new Error(
      'resizeByPx or resizeByPt should be defined, where resizeByPt is between -1 and 1',
    );
  }

  let endWidth = await cardViewElement.getSize('width');
  await page.waitUntil(async () => {
    const latestWidth = await cardViewElement.getSize('width');
    const isTheSameAsPrevious = latestWidth === endWidth;
    endWidth = latestWidth;
    return isTheSameAsPrevious;
  });

  return {
    startWidth,
    endWidth,
  };
};

const moveRightResizeHandler = async (
  page: Page,
  mediaSingle: WebdriverIO.Element,
  offset: number,
) => {
  // TODO add data-testid for handlers
  const handleElement = await mediaSingle.$('.richMedia-resize-handle-right');
  await handleElement.waitForDisplayed();

  const location = await handleElement.getLocation();
  const size = await handleElement.getSize();

  const startX = location.x + size.width / 2;
  const startY = location.y + size.height / 2;

  return page.simulateUserDragAndDrop(
    startX,
    startY,
    startX + offset,
    startY,
    100,
  );
};
