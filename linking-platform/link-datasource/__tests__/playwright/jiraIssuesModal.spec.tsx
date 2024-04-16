import type { Page } from '@playwright/test';

import { expect, test } from '@af/integration-testing';

const sitePickerSelector = '.jira-datasource-modal--site-selector__control';

test.describe('JiraIssuesModal', () => {
  async function setup(
    page: Page,
    groupIdSelection: string = 'linking-platform',
    packageIdSelection: string = 'link-datasource',
    exampleIdSelection: string = 'with-issues-modal',
  ) {
    await page.visitExample(
      groupIdSelection,
      packageIdSelection,
      exampleIdSelection,
    );
  }
  async function openDropDown(page: Page) {
    await page.getByTestId('datasource-modal--view-drop-down--trigger').click();
  }

  test('should change site by choosing different site in site selector dropdown', async ({
    page,
  }) => {
    await setup(page);
    await page.locator(sitePickerSelector).click();
    await page.getByText('test1', { exact: true }).click();

    const newSiteSelected = await page
      .locator(sitePickerSelector)
      .textContent();

    expect(newSiteSelected?.replace('\n', ' ')).toEqual('test1');
  });

  test('should provide autocomplete for JQL fields', async ({ page }) => {
    await setup(
      page,
      'linking-platform',
      'link-datasource',
      'jira-issues-config-modal-no-results',
    );

    const jqlTextField = page.getByTestId('jql-editor-input');
    await jqlTextField.click({ clickCount: 3 });
    await page.keyboard.press('Backspace');

    await jqlTextField.type('sta');
    await expect(page.getByRole('option', { name: 'STATUS' })).toBeVisible();
  });

  test('should provide query suggestions for JQL fields', async ({ page }) => {
    await setup(page);

    const jqlTextField = page.getByTestId('jql-editor-input');
    await jqlTextField.click({ clickCount: 3 });
    await page.keyboard.press('Backspace');

    await jqlTextField.type('status = ', { delay: 50 });
    await expect(page.getByRole('option', { name: 'EMPTY' })).toBeVisible();
  });

  test('should show a placeholder smart card before search, and a smart card after search', async ({
    page,
  }) => {
    await setup(page);

    await openDropDown(page);

    await page.getByTestId('dropdown-item-inline-link').click();

    await expect(
      await page
        .getByTestId('jira-datasource-modal--body')
        .locator('div')
        .filter({ hasText: '### Issues' }),
    ).toBeVisible();

    await page.getByTestId('mode-toggle-basic').click();
    const basicTextField = page.getByTestId(
      'jira-datasource-modal--basic-search-input',
    );
    await basicTextField.click();
    await basicTextField.type('test');
    await page
      .getByTestId('jira-datasource-modal--basic-search-button')
      .click();

    await expect(
      await page
        .getByTestId('jira-datasource-modal--body')
        .locator('div')
        .filter({ hasText: '55 Issues' }),
    ).toBeVisible();
  });

  test('should show issues in a table when basic searched', async ({
    page,
  }) => {
    await setup(page);
    await page.getByTestId('mode-toggle-basic').click();
    const basicTextField = page.getByTestId(
      'jira-datasource-modal--basic-search-input',
    );
    await basicTextField.click();
    await basicTextField.type('basic input');
    await page
      .getByTestId('jira-datasource-modal--basic-search-button')
      .click();

    await expect(
      page
        .getByTestId('jira-datasource-table--row-DONUT-11720')
        .getByTestId('jira-datasource-table--cell-2'),
    ).toBeVisible();

    await expect(
      page
        .getByTestId('jira-datasource-table--row-DONUT-11730')
        .getByTestId('jira-datasource-table--cell-2'),
    ).toBeVisible();
  });

  test('should render error message when request fails', async ({ page }) => {
    await setup(page);
    await page.locator(sitePickerSelector).click();
    await page.getByText('testNetworkError', { exact: true }).click();
    await page.getByTestId('jql-editor-search').click();
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
    await page.getByTestId('jql-editor-search').click();
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
    await expect(page.getByTestId('jira-datasource-modal--body')).toBeHidden();
  });

  test('table and table text in dropdown render correctly when table view is selected', async ({
    page,
  }) => {
    await setup(page);
    await page.getByTestId('jql-editor-search').click();
    await expect(
      page.getByTestId('datasource-modal--view-drop-down--trigger'),
    ).toHaveText('Table');
    await expect(page.getByTestId('jira-datasource-table')).toBeVisible();
  });

  test('Inline smart card for count view and Inline link text in dropdown render correctly when Inline link view is selected', async ({
    page,
  }) => {
    await setup(page);
    await page.getByTestId('jql-editor-search').click();
    await openDropDown(page);
    await page.getByTestId('dropdown-item-inline-link').click();
    await expect(
      page.getByTestId('datasource-modal--view-drop-down--trigger'),
    ).toHaveText('Inline link');
    await expect(
      page.getByTestId('link-datasource-render-type--link-resolved-view'),
    ).toBeVisible();
  });

  test('should render smart link in count view when result is single row', async ({
    page,
  }) => {
    await setup(page);
    await page.locator(sitePickerSelector).click();
    await page.getByText('testSingleIssue', { exact: true }).click();
    await page.getByTestId('jql-editor-search').click();
    await openDropDown(page);
    await page.getByTestId('dropdown-item-inline-link').click();
    await expect(
      page.getByTestId('link-datasource-render-type--link-resolved-view'),
    ).toBeVisible();
  });

  test('should render smart link in count view with count number when multiple results returned', async ({
    page,
  }) => {
    await setup(page);
    await page.getByTestId('jql-editor-search').click();
    await openDropDown(page);
    await page.getByTestId('dropdown-item-inline-link').click();
    await expect(
      page.getByTestId('link-datasource-render-type--link-resolved-view'),
    ).toHaveText('55 Issues');
  });
});
