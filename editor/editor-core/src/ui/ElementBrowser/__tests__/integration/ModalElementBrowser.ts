import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { goToFullPageWithXExtensions } from '@atlaskit/editor-test-helpers/testing-example-page';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  ToolbarMenuItem,
  toolbarMenuItemsSelectors,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  elementBrowserSelectors,
  waitForNumOfModalBrowserItems,
} from '@atlaskit/editor-test-helpers/page-objects/element-browser';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  getDocFromElement,
  editable,
} from '@atlaskit/editor-test-helpers/integration/helpers';

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

BrowserTestCase(
  'should add only the highlighted component when using keyboard',
  { skip: ['safari'] },
  async (client: any, testName: string) => {
    const expandSelector = '.ak-editor-expand__title-container';
    const page = await goToFullPageWithXExtensions(client);
    await page.click(toolbarMenuItemsSelectors[ToolbarMenuItem.insertMenu]);
    await page.waitForSelector(elementBrowserSelectors.elementBrowser);
    await page.click(elementBrowserSelectors.viewMore);
    await page.waitForSelector(elementBrowserSelectors.modalBrowser);

    await page.keys(['Tab']);
    await page.keys(['Tab']);
    await page.keys(['Tab']);
    await page.keys(['Tab']);
    await page.keys(['Tab']);
    await page.keys(['Tab']);
    await page.keys(['Enter']);

    await page.waitForSelector(expandSelector);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
