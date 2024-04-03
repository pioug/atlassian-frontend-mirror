import type { Page } from '@playwright/test';

import { expect, test } from '@af/integration-testing';

const sitePickerSelector =
  '.confluence-search-datasource-modal--site-selector__control';

test.describe('ConfluenceSearchModal', () => {
  async function setup(
    page: Page,
    groupIdSelection: string = 'linking-platform',
    packageIdSelection: string = 'link-datasource',
    exampleIdSelection: string = 'with-confluence-search-modal',
  ) {
    await page.visitExample(
      groupIdSelection,
      packageIdSelection,
      exampleIdSelection,
    );
  }

  test('should change site by choosing different site in site selector dropdown', async ({
    page,
  }) => {
    await setup(page);

    const currentSelectedSite = await page
      .locator(sitePickerSelector)
      .textContent();

    await expect(currentSelectedSite?.replace('\n', ' ')).toEqual('hello');

    await page.locator(sitePickerSelector).click();
    await page.getByText('test1', { exact: true }).click();

    const newSelectedSite = await page
      .locator(sitePickerSelector)
      .textContent();

    await expect(newSelectedSite?.replace('\n', ' ')).toEqual('test1');
  });

  test('should show issues in a table when basic searched', async ({
    page,
  }) => {
    await setup(page);
    await page
      .getByTestId('confluence-search-datasource-modal--basic-search-button')
      .click();
    await expect(
      page.getByTestId('confluence-search-datasource-table--cell-0').first(),
    ).toBeVisible();
    await expect(
      page.getByTestId('confluence-search-datasource-table--cell-1').first(),
    ).toBeVisible();
  });

  test('should render error message when request fails', async ({ page }) => {
    await setup(page);
    await page.locator(sitePickerSelector).click();
    await page.getByText('testNetworkError', { exact: true }).click();
    await page
      .getByTestId('confluence-search-datasource-modal--basic-search-button')
      .click();
    await expect(
      page.getByTestId('datasource-modal--loading-error'),
    ).toBeVisible();
  });

  test('should render unauthorized message when a request returns 403', async ({
    page,
  }) => {
    await setup(page);
    await page.locator(sitePickerSelector).click();
    await page.getByText('testNoAccess', { exact: true }).click();
    await page
      .getByTestId('confluence-search-datasource-modal--basic-search-button')
      .click();
    await expect(
      page.getByText("You don't have access to the following site:"),
    ).toBeVisible();
    await expect(page.getByText('https://test7.atlassian.net')).toBeVisible();
    await expect(
      page.getByText('To request access, contact your site administrator.'),
    ).toBeVisible();
  });

  test('should close modal on ESC keydown', async ({ page }) => {
    await setup(page);
    await page.keyboard.press('Escape');
    await expect(
      page.getByTestId('confluence-search-datasource-modal--body'),
    ).toBeHidden();
  });
});
