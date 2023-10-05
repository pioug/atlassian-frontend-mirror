import { expect, test } from '@af/integration-testing';
test.describe('DatasourceTableView', () => {
  test('persists column picker when new column added', async ({ page }) => {
    await page.visitExample(
      'linking-platform',
      'link-datasource',
      'jira-issues-table',
    );
    await page.getByTestId('column-picker-trigger-button').click();
    await page.getByText('Due Date0').click();

    expect(await page.isVisible('#react-select-2-option-10')).toEqual(true);
  });
});
