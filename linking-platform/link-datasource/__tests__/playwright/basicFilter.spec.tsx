import { expect, Page, test } from '@af/integration-testing';

const basicFilterContainerTestId = 'jlol-basic-filter-container';

const loadExample = (page: Page) =>
  page.visitExample('linking-platform', 'link-datasource', 'with-modal', {
    featureFlag: 'platform.linking-platform.datasource.show-jlol-basic-filters',
  });

test.describe('JiraIssuesModal: Basic Filters', () => {
  test('should not be visible when in JQL search mode', async ({ page }) => {
    await loadExample(page);

    const basicFilterContainer = await page.getByTestId(
      basicFilterContainerTestId,
    );

    await expect(basicFilterContainer).toBeHidden();
  });

  test('should be visible when switching to basic search mode', async ({
    page,
  }) => {
    await loadExample(page);

    await page.getByTestId('mode-toggle-basic').click();

    const basicFilterContainer = await page.getByTestId(
      basicFilterContainerTestId,
    );

    await expect(basicFilterContainer).toBeVisible();
  });

  test('should open the popup when clicking on the trigger button', async ({
    page,
  }) => {
    await loadExample(page);

    await page.getByTestId('mode-toggle-basic').click();
    await page.getByTestId('jlol-basic-filter-project-trigger').click();

    const popupMenu = await page.getByTestId(
      'jlol-basic-filter-popup-select--menu',
    );
    const popupSearchInput = page.locator(
      '#jlol-basic-filter-popup-select--input',
    );
    const popupFooter = await page.getByTestId(
      'jlol-basic-filter-popup-select--footer',
    );

    await expect(popupMenu).toBeVisible();
    await expect(popupSearchInput).toBeVisible();
    await expect(popupFooter).toBeVisible();
  });

  test('should show more options when scrolling to the bottom of the popup for projects and clicking showMore button', async ({
    page,
  }) => {
    await loadExample(page);

    await page.getByTestId('mode-toggle-basic').click();
    await page.getByTestId('jlol-basic-filter-project-trigger').click();

    const showMoreButton = page.locator(
      '[data-testid="jlol-basic-filter-popup-select--show-more-button"]',
    );

    await showMoreButton.scrollIntoViewIfNeeded();

    await showMoreButton.click();

    await expect(page.getByText('Test10', { exact: true })).toBeVisible();
    await expect(
      page.getByTestId('jlol-basic-filter-popup-select--show-more-button'),
    ).toBeHidden();
  });
});
