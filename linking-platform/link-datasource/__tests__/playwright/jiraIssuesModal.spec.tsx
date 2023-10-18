import { expect, test } from '@af/integration-testing';

const sitePickerSelector = '.jira-jql-datasource-modal--site-selector__control';

test.describe('JiraIssuesModal', () => {
  test('should change site by choosing different site in site selector dropdown', async ({
    page,
  }) => {
    await page.visitExample(
      'linking-platform',
      'link-datasource',
      'with-modal',
    );
    await page.locator(sitePickerSelector).click();

    await page.getByText('test1', { exact: true }).click();

    const newSiteSelected = await page
      .locator(sitePickerSelector)
      .textContent();

    expect(newSiteSelected?.replace('\n', ' ')).toEqual('test1');
  });

  test('should provide autocomplete for JQL fields', async ({ page }) => {
    await page.visitExample(
      'linking-platform',
      'link-datasource',
      'jira-issues-config-modal-no-results-vr',
    );

    const jqlTextField = await page.getByTestId('jql-editor-input');
    await jqlTextField.click({ clickCount: 3 });
    await page.keyboard.press('Backspace');

    await jqlTextField.type('sta');
    expect(
      await page.getByRole('option', { name: 'STATUS' }).isVisible(),
    ).toEqual(true);
  });

  test('should provide query suggestions for JQL fields', async ({ page }) => {
    await page.visitExample(
      'linking-platform',
      'link-datasource',
      'with-modal',
    );

    const jqlTextField = await page.getByTestId('jql-editor-input');
    await jqlTextField.click({ clickCount: 3 });
    await page.keyboard.press('Backspace');

    await jqlTextField.type('status = ', { delay: 50 });
    expect(
      await page.getByRole('option', { name: 'EMPTY' }).isVisible(),
    ).toEqual(true);
  });

  test('should show a placeholder smart card before search, and a smart card after search', async ({
    page,
  }) => {
    await page.visitExample(
      'linking-platform',
      'link-datasource',
      'with-modal',
    );

    await page.getByTestId('mode-toggle-count').click();

    await expect(
      await page
        .getByTestId('jira-jql-datasource-modal--body')
        .locator('div')
        .filter({ hasText: '### Issues' }),
    ).toBeVisible();

    await page.getByTestId('mode-toggle-basic').click();
    const basicTextField = await page.getByTestId(
      'jira-jql-datasource-modal--basic-search-input',
    );
    await basicTextField.click();
    await basicTextField.type('test');
    await page
      .getByTestId('jira-jql-datasource-modal--basic-search-button')
      .click();

    await expect(
      await page
        .getByTestId('jira-jql-datasource-modal--body')
        .locator('div')
        .filter({ hasText: '55 Issues' }),
    ).toBeVisible();
  });

  test('should show issues in a table when basic searched', async ({
    page,
  }) => {
    await page.visitExample(
      'linking-platform',
      'link-datasource',
      'with-modal',
    );

    await page.getByTestId('mode-toggle-basic').click();
    const basicTextField = await page.getByTestId(
      'jira-jql-datasource-modal--basic-search-input',
    );
    await basicTextField.click();
    await basicTextField.type('basic input');
    await page
      .getByTestId('jira-jql-datasource-modal--basic-search-button')
      .click();

    expect(
      await page
        .getByTestId('jira-jql-datasource-table--row-DONUT-11720')
        .getByTestId('jira-jql-datasource-table--cell-2')
        .isVisible(),
    ).toEqual(true);

    expect(
      await page
        .getByTestId('jira-jql-datasource-table--row-DONUT-11730')
        .getByTestId('jira-jql-datasource-table--cell-2')
        .isVisible(),
    ).toEqual(true);
  });

  test('should render error message when request fails', async ({ page }) => {
    await page.visitExample(
      'linking-platform',
      'link-datasource',
      'with-modal',
    );
    await page.locator(sitePickerSelector).click();
    await page.getByText('testNetworkError', { exact: true }).click();
    await page.getByTestId('jql-editor-search').click();
    expect(
      await page
        .getByTestId('jira-jql-datasource-modal--loading-error')
        .isVisible(),
    ).toEqual(true);
  });

  test('should render unauthorized message when a request returns 403', async ({
    page,
  }) => {
    await page.visitExample(
      'linking-platform',
      'link-datasource',
      'with-modal',
    );
    await page.locator(sitePickerSelector).click();
    await page.getByText('testNoAccess', { exact: true }).click();
    await page.getByTestId('jql-editor-search').click();
    expect(
      await page
        .getByText("You don't have access to the following site:")
        .isVisible(),
    ).toEqual(true);
    expect(
      await page.getByText('https://test7.atlassian.net').isVisible(),
    ).toEqual(true);
    expect(
      await page
        .getByText('To request access, contact your site administrator.')
        .isVisible(),
    ).toEqual(true);
  });

  test('should close modal on ESC keydown', async ({ page }) => {
    await page.visitExample(
      'linking-platform',
      'link-datasource',
      'with-modal',
    );
    await page.keyboard.press('Escape');
    expect(
      await page.getByTestId('jira-jql-datasource-modal--body').isVisible(),
    ).toEqual(false);
  });

  test('should render smart link when result is single row', async ({
    page,
  }) => {
    await page.visitExample(
      'linking-platform',
      'link-datasource',
      'with-modal',
    );
    await page.locator(sitePickerSelector).click();
    await page.getByText('testSingleIssue', { exact: true }).click();
    await page.getByTestId('jql-editor-search').click();

    await expect(
      await page.getByTestId('link-datasource-render-type--link-resolved-view'),
    ).toBeVisible();
  });
});
