import { PuppeteerPage, TestPage } from './_types';
import { getBoundingRect } from '../../__helpers/page-objects/_editor';

export enum ToolbarMenuItem {
  table,
  insertBlock,
  italic,
  bold,
  moreFormatting,
  alignment,
  alignmentLeft,
  alignmentCenter,
  alignmentRight,
  textColor,
  bulletList,
  numberedList,
  action,
  link,
  filesAndImages,
  layouts,
  mention,
  emoji,
  removeTable,
  fontStyle,
  toolbarDropList,
  insertMenu,
  expand,
  status,
}

export const mainToolbarSelector = '[data-testid="ak-editor-main-toolbar"]';

export const toolbarMenuItemsSelectors = {
  [ToolbarMenuItem.table]: `[aria-label="Table"]`,
  [ToolbarMenuItem.insertBlock]: `[aria-label="Insert"]`,
  [ToolbarMenuItem.italic]: `[aria-label="Italic"]`,
  [ToolbarMenuItem.bold]: `[aria-label="Bold"]`,
  [ToolbarMenuItem.moreFormatting]: `[aria-label="More formatting"]`,
  [ToolbarMenuItem.alignment]: `[aria-label="Text alignment"]`,
  [ToolbarMenuItem.alignmentLeft]: `[aria-label="Align left"]`,
  [ToolbarMenuItem.alignmentCenter]: `[aria-label="Align center"]`,
  [ToolbarMenuItem.alignmentRight]: `[aria-label="Align right"]`,
  [ToolbarMenuItem.textColor]: `[aria-label="Text color"]`,
  [ToolbarMenuItem.bulletList]: `[aria-label="Bullet List"]`,
  [ToolbarMenuItem.numberedList]: `[aria-label="Numbered List"]`,
  [ToolbarMenuItem.layouts]: `[aria-label="Layouts"]`,
  [ToolbarMenuItem.action]: `[aria-label="Action item"]`,
  [ToolbarMenuItem.link]: `[aria-label="Link"]`,
  [ToolbarMenuItem.filesAndImages]: `[aria-label=""Files & images]`,
  [ToolbarMenuItem.mention]: `[aria-label="Mention"]`,
  [ToolbarMenuItem.emoji]: `[aria-label="Emoji"]`,
  [ToolbarMenuItem.removeTable]: `[aria-label="Remove"]`,
  [ToolbarMenuItem.fontStyle]: `[aria-label="Font style"]`,
  [ToolbarMenuItem.toolbarDropList]: '[data-role="droplistContent"]',
  [ToolbarMenuItem.insertMenu]: '[aria-label="Insert"]',
  [ToolbarMenuItem.expand]: '[aria-label="Expand"]',
  [ToolbarMenuItem.status]: '[aria-label="Status"]',
};

export async function clickToolbarMenu(page: TestPage, menu: ToolbarMenuItem) {
  await page.waitForSelector(toolbarMenuItemsSelectors[menu]);
  await page.click(toolbarMenuItemsSelectors[menu]);
}

// Use for floating toolbars other UI controls
export const waitForFloatingControl = async (
  page: PuppeteerPage,
  ariaLabel: string,
  options = { visible: true },
  repositionalWait = true,
) => {
  // Note: there can be multiple popups visible at once...
  // e.g. floating toolbar and breakout controls on a layout.
  const popupSelector = '[data-editor-popup="true"]';
  const forceLayout = async (selector: string, page: PuppeteerPage) =>
    page.$eval<ClientRect>(selector, el => el && el.getBoundingClientRect());

  // Case insensitive fuzzy matching
  const ariaLabelSelector = `[aria-label*="${ariaLabel}" i]`;
  const selector = `${popupSelector}${ariaLabelSelector}`;
  await page.waitForSelector(selector, options);

  if (repositionalWait) {
    // Additional time buffer to account for repositional shifts while
    // centering underneath the anchoring element. This reduces the
    // amount of flaky test failures due to non centered toolbars.
    await page.waitFor(200);

    // Force layout
    await forceLayout(selector, page);

    // Wait for next frame
    await page.$eval(
      selector,
      () => new Promise(resolve => requestAnimationFrame(resolve)),
    );
  }
};

const getTextSelection = (page: PuppeteerPage) =>
  page.evaluate(() => document.getSelection()?.toString());

export const retryUntilStablePosition = async (
  page: any,
  callback: () => Promise<any>,
  stablePosTargetSelector: string,
  stableDuration: number,
  // ED:10448 - Because retries may involve click-based
  // and other operations that modify text selection, we
  // now support consumers explicitly declaring whether
  // they expect text selection to remain stable between
  // retries too.
  stableTextSelection?: boolean,
) => {
  return new Promise(async resolve => {
    let [prevLeft, prevTop] = [0, 0];
    let textSelection = await getTextSelection(page);
    const intervalId = setInterval(async () => {
      await callback();
      if (
        (stableTextSelection === true &&
          textSelection === (await getTextSelection(page))) ||
        stableTextSelection !== true
      ) {
        const { left, top } = await getBoundingRect(
          page,
          stablePosTargetSelector,
        );
        if (left === prevLeft && top === prevTop) {
          clearInterval(intervalId);
          resolve();
        } else {
          prevLeft = left;
          prevTop = top;
        }
      }
    }, stableDuration);
  });
};
