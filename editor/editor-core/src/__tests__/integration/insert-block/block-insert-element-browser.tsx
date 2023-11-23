import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { goToFullPageWithXExtensions } from '@atlaskit/editor-test-helpers/testing-example-page';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  ToolbarMenuItem,
  toolbarMenuItemsSelectors,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';

const INSERT_MENU = toolbarMenuItemsSelectors[ToolbarMenuItem.insertMenu];
const POPUP = 'div[aria-label=Popup]';
describe('BlockInsertElementBrowser dropdown', () => {
  BrowserTestCase(
    'it should render dropdown on the bottom right of insert button',
    {},
    async (client: any) => {
      const page = await goToFullPageWithXExtensions(client);
      await page.click(INSERT_MENU);
      await page.waitForSelector(POPUP);

      const insertMenu = await page.$(INSERT_MENU);
      const dropdownList = await page.$(POPUP);
      const insertMenuCoord = await page.evaluate((insertMenu) => {
        const { bottom, right } = insertMenu.getBoundingClientRect();
        return { bottom, right };
      }, insertMenu);
      const dropdownListCoord = await page.evaluate((dropdownList) => {
        const { top, right } = dropdownList.getBoundingClientRect();
        return { top, right };
      }, dropdownList);

      expect(insertMenuCoord.bottom).toBeLessThanOrEqual(dropdownListCoord.top);
      expect(Math.ceil(insertMenuCoord.right)).toBe(
        Math.ceil(dropdownListCoord.right),
      );
    },
  );
});
