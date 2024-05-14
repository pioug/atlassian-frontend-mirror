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
      {
        featureFlag:
          'platform.linking-platform.datasource.show-clol-basic-filters',
      },
    );
  }

  async function openDropDown(page: Page) {
    await page.getByTestId('datasource-modal--view-drop-down--trigger').click();
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

  test('table and table text in display view dropdown render correctly when table view is selected', async ({
    page,
  }) => {
    await setup(page);
    await page
      .getByTestId('confluence-search-datasource-modal--basic-search-button')
      .click();
    await expect(
      page.getByTestId('datasource-modal--view-drop-down--trigger'),
    ).toHaveText('List');
    await expect(
      page.getByTestId('confluence-search-datasource-table'),
    ).toBeVisible();
  });

  test('Inline smart card for inline view and Inline link text in dropdown render correctly when Inline link view is selected', async ({
    page,
  }) => {
    await setup(page);
    await page
      .getByTestId('confluence-search-datasource-modal--basic-search-button')
      .click();
    await openDropDown(page);
    await page.getByTestId('dropdown-item-inline-link').click();
    await expect(
      page.getByTestId('datasource-modal--view-drop-down--trigger'),
    ).toHaveText('Inline link');
    await expect(
      page.getByRole('link', { name: 'https://hello.atlassian.net/' }),
    ).toBeVisible();
  });

  test('Last Updated custom date range can be set and will search new results', async ({
    page,
  }) => {
    await setup(page);
    await page
      .getByTestId('confluence-search-modal--date-range-button')
      .click();
    await page.getByText('Custom').click();

    const fromContainer = page.getByTestId('date-from-picker--container');
    await fromContainer.locator('input[role="combobox"]').fill('11/11/2023');
    await fromContainer.locator('input[role="combobox"]').press('Enter');

    const toContainer = page.getByTestId('date-to-picker--container');
    await toContainer.locator('input[role="combobox"]').fill('12/12/2023');
    await toContainer.locator('input[role="combobox"]').press('Enter');

    await page.getByTestId('custom-date-range-update-button').click();

    // The locale is set to en not en-AU in the test example, so dates are formatted by the getFormattedDate helper
    // which is why the format is different from what we see locally (Nov 11, 2023 vs 11 Nov 2023).
    await expect(page.getByText(': Nov 11, 2023 - Dec 12, 2023')).toBeVisible();

    await expect(
      page.getByTestId('confluence-search-datasource-table--cell-0').first(),
    ).toBeVisible();
    await expect(
      page.getByTestId('confluence-search-datasource-table--cell-1').first(),
    ).toBeVisible();
  });

  test('Closing and opening the picker after setting a date but not clicking update will clear the selections on reopen', async ({
    page,
  }) => {
    await setup(page);
    const filterButton = page.getByTestId(
      'confluence-search-modal--date-range-button',
    );

    await filterButton.click();
    await page.getByText('Custom').click();

    const fromContainer = page.getByTestId('date-from-picker--container');
    await fromContainer.locator('input[role="combobox"]').fill('11/11/2023');
    await fromContainer.locator('input[role="combobox"]').press('Enter');

    const toContainer = page.getByTestId('date-to-picker--container');
    await toContainer.locator('input[role="combobox"]').fill('12/12/2023');
    await toContainer.locator('input[role="combobox"]').press('Enter');

    await filterButton.click();
    await filterButton.click();

    await expect(fromContainer.locator('input[role="combobox"]')).toBeEmpty();
    await expect(toContainer.locator('input[role="combobox"]')).toBeEmpty();
  });

  test('Choosing from date then closing picker and then chosing to date and clicking update only updates with the from date', async ({
    page,
  }) => {
    await setup(page);
    const filterButton = page.getByTestId(
      'confluence-search-modal--date-range-button',
    );

    await filterButton.click();
    await page.getByText('Custom').click();

    const fromContainer = page.getByTestId('date-from-picker--container');
    await fromContainer.locator('input[role="combobox"]').fill('11/11/2023');
    await fromContainer.locator('input[role="combobox"]').press('Enter');

    await filterButton.click();
    await filterButton.click();

    const toContainer = page.getByTestId('date-to-picker--container');
    await toContainer.locator('input[role="combobox"]').fill('12/12/2023');
    await toContainer.locator('input[role="combobox"]').press('Enter');

    await page.getByTestId('custom-date-range-update-button').click();

    await expect(page.getByText(': before Dec 12, 2023')).toBeVisible();
  });

  test('should reset and clear hydrated filter values after a site change', async ({
    page,
  }) => {
    await setup(page);

    // make both filter selections
    await page
      .getByTestId('confluence-search-modal--date-range-button')
      .click();
    await page.getByText('Today').click();

    await page
      .getByTestId('clol-basic-filter-editedOrCreatedBy-trigger')
      .click();
    await page
      .getByText('Atlassian Assist (staging)', {
        exact: true,
      })
      .click();

    // click on insert button
    await page
      .getByTestId('confluence-search-datasource-modal--insert-button')
      .click();

    // open the modal again and wait for hydration logic to do its thing
    await page.getByTestId('example-toggle-modal').click();

    // ensure values are hydrated and populated in the button label
    await expect(
      page.getByText('Edited or created by: Atlassian Assist (staging)'),
    ).toBeVisible();
    await expect(page.getByText('Last updated: Today')).toBeVisible();

    // change the site and ensure that values have changed and its now showing intial UI
    await page.locator(sitePickerSelector).click();
    await page.getByText('test1', { exact: true }).click();

    await expect(page.getByText('Edited or created by')).toBeVisible();
    await expect(page.getByText('Last updated')).toBeVisible();

    await expect(
      page.getByTestId('datasource-modal--initial-state-view'),
    ).toBeVisible();
  });
});
