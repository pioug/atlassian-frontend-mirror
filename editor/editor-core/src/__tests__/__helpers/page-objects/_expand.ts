import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { clickToolbarMenu, ToolbarMenuItem } from './_toolbar';
import { expandClassNames } from '../../../plugins/expand/ui/class-names';

const expand = `.${expandClassNames.type('expand')}`;
const nestedExpand = `.${expandClassNames.type('nestedExpand')}`;

export const selectors = {
  expand,
  nestedExpand,
  expandToggle: `${expand} .${expandClassNames.icon} button`,
  nestedExpandToggle: `${nestedExpand} .${expandClassNames.icon} button`,
  expandTitleInput: `${expand} .${expandClassNames.titleInput}`,
  nestedExpandTitleInput: `${nestedExpand} .${expandClassNames.titleInput}`,
  expandContent: `${expand} .${expandClassNames.content}`,
  removeButton: 'button[aria-label="Remove"]',
};

export const insertExpand = async (page: PuppeteerPage) => {
  await clickToolbarMenu(page, ToolbarMenuItem.insertMenu);
  await clickToolbarMenu(page, ToolbarMenuItem.expand);
  await page.waitForSelector(selectors.expand);
  await page.click(selectors.expandContent);
};
