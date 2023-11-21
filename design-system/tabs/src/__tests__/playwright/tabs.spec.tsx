import { expect, test } from '@af/integration-testing';

const tab1 = "[data-testid='tab-1']";

const tab2 = "[data-testid='tab-2']";

const tab3 = "[data-testid='tab-3']";

const tab4 = "[data-testid='tab-4']";

const tabPanel = '[role="tabpanel"]';

const tabPanel1 = "[data-testid='tab-panel-1']";

const tabPanel2 = "[data-testid='tab-panel-2']";

const tabPanel3 = "[data-testid='tab-panel-3']";

const tabPanel4 = "[data-testid='tab-panel-4']";

test('Tabs should be able to be identified and navigated by data-testid', async ({
  page,
}) => {
  await page.visitExample('design-system', 'tabs', 'testing');
  await expect(page.locator(tab1).first()).toBeVisible();
  await expect(page.locator(tab2).first()).toBeVisible();
  await expect(page.locator(tab3).first()).toBeVisible();
  await expect(page.locator(tab4).first()).toBeVisible();
  await expect(page.locator(tab1).first()).toHaveText('Tab 1');
  await expect(page.locator(tab2).first()).toHaveText('Tab 2');
  await expect(page.locator(tab3).first()).toHaveText('Tab 3');
  await expect(page.locator(tab4).first()).toHaveText('Tab 4');
  await expect(page.locator(tab1).first()).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(page.locator(tab1).first()).toHaveAttribute('aria-setsize', '4');
  await expect(page.locator(tab1).first()).toHaveAttribute(
    'aria-posinset',
    '1',
  );
  await expect(page.locator(tab1).first()).toHaveAttribute(
    'aria-controls',
    'testing-0-tab',
  );
  await expect(page.locator(tabPanel).first()).toHaveText('One');
  await expect(page.locator(tabPanel).first()).toHaveAttribute(
    'aria-labelledby',
    'testing-0',
  );
  await page.locator(tab3).first().click();
  await expect(page.locator(tab3).first()).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(page.locator(tabPanel3).first()).toHaveText('Three');
});

test('Content should be visible only on the focused tab', async ({ page }) => {
  await page.visitExample('design-system', 'tabs', 'testing');

  // Navigate between tab and check the selection, content and focus.
  // Tab then use arrow right to navigate.
  await page.webdriverCompatUtils.pressMultiple([
    'Tab',
    'ArrowRight',
    'ArrowRight',
    'ArrowRight',
  ]);

  // Tab 4 is in focus and it's content should be visible
  await expect(page.locator(tab4).first()).toBeFocused();
  await expect(page.locator(tabPanel4)).toBeVisible();

  // Content of rest of the three tab should not be visible
  await expect(page.locator(tabPanel1)).toBeHidden();
  await expect(page.locator(tabPanel2)).toBeHidden();
  await expect(page.locator(tabPanel3)).toBeHidden();
});
