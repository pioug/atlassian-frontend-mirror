import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { goToFullPageWithXExtensions } from '@atlaskit/editor-test-helpers/testing-example-page';
import {
  ToolbarMenuItem,
  toolbarMenuItemsSelectors,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';
import {
  elementBrowserSelectors,
  waitForNumOfModalBrowserItems,
} from '@atlaskit/editor-test-helpers/page-objects/element-browser';

BrowserTestCase(
  'should display element list items when new category is clicked on after scrolling',
  { skip: ['safari'] },
  async (client: any) => {
    const page = await goToFullPageWithXExtensions(client);
    await page.click(toolbarMenuItemsSelectors[ToolbarMenuItem.insertMenu]);
    await page.waitForSelector(elementBrowserSelectors.elementBrowser);
    await page.click(elementBrowserSelectors.viewMore);
    await page.waitForSelector(elementBrowserSelectors.modalBrowser);
    await page.evaluate(
      (selector: string, categoryItemSelector: string) => {
        const itemListContainer = document.querySelector(selector);
        itemListContainer && itemListContainer.scrollTo(0, 1600);
        const categoryItems = document.querySelectorAll(categoryItemSelector);

        if (categoryItems && categoryItems.length) {
          const sixthCategoryItem = categoryItems[5] as HTMLButtonElement;
          sixthCategoryItem.click();
        }
      },
      elementBrowserSelectors.elementListContainer,
      elementBrowserSelectors.categoryItem,
    );
    await waitForNumOfModalBrowserItems(page, 10);
  },
);
