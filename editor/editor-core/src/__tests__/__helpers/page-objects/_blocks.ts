import { PuppeteerPage } from './_types';
import { clickToolbarMenu, ToolbarMenuItem } from './_toolbar';

import { messages as insertBlockMessages } from '../../../plugins/insert-block/ui/ToolbarInsertBlock/messages';
import { messages } from '../../../plugins/block-type/messages';

export enum BlockMenuItem {
  quote,
  codeSnippet,
  panel,
  decision,
  divider,
  date,
  placeholder,
  columns,
  status,
  inlineExtension,
  blockExtension,
  bodiedExtension,
}

const blockMenuItemsSelectors = {
  [BlockMenuItem.quote]: `[aria-label="${messages.blockquote.defaultMessage}"]`,
  [BlockMenuItem.codeSnippet]: `[aria-label="${messages.codeblock.defaultMessage}"]`,
  [BlockMenuItem.panel]: `[aria-label="${messages.infoPanel.defaultMessage}"]`,
  [BlockMenuItem.decision]: `[aria-label="${insertBlockMessages.decision.defaultMessage}"]`,
  [BlockMenuItem.divider]: `[aria-label="${insertBlockMessages.horizontalRule.defaultMessage}"]`,
  [BlockMenuItem.date]: `[aria-label="${insertBlockMessages.date.defaultMessage}"]`,
  [BlockMenuItem.placeholder]: `[aria-label="${insertBlockMessages.placeholderText.defaultMessage}"]`,
  [BlockMenuItem.columns]: `[aria-label="${insertBlockMessages.columns.defaultMessage}"]`,
  [BlockMenuItem.status]: `[aria-label="${insertBlockMessages.status.defaultMessage}"]`,
  [BlockMenuItem.inlineExtension]: '[aria-label="Inline macro (EH)"]',
  [BlockMenuItem.blockExtension]: '[aria-label="Block macro (EH)"]',
  [BlockMenuItem.bodiedExtension]: '[aria-label="Bodied macro (EH)"]',
};

export async function clickBlockMenuItem(
  page: PuppeteerPage,
  menu: BlockMenuItem,
) {
  await clickToolbarMenu(page, ToolbarMenuItem.insertBlock);
  await page.waitForSelector(blockMenuItemsSelectors[menu]);
  await page.click(blockMenuItemsSelectors[menu]);
}
