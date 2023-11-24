import { expect, test } from '@af/integration-testing';

const breadcrumbsTestId = "[data-testid='MyBreadcrumbsTestId']";

const breadcrumbsEllipsisTestId =
  "[data-testid='MyBreadcrumbsTestId--breadcrumb-ellipsis']";

const breadcrumbsItemTestId = "[data-testid='myBreadcrumbsItemTestId']";

test('Breadcrumbs should be able to be clicked by data-testid', async ({
  page,
}) => {
  await page.visitExample('design-system', 'breadcrumbs', 'testing');
  await expect(page.locator(breadcrumbsTestId).first()).toBeVisible();
  await expect(page.locator(breadcrumbsEllipsisTestId).first()).toBeVisible();

  // The breadcrumbsItem with testId is collapsed and will be displayed once clicked on the `breadcrumbsEllipsisTestId`.
  await page.click(breadcrumbsEllipsisTestId);
  await expect(page.locator(breadcrumbsItemTestId).first()).toBeVisible();
  await expect(page.locator(breadcrumbsItemTestId).first()).toHaveText(
    'The item with testId',
  );

  // Once the `breadcrumbsItemTestId` is displayed, we can click on it and checks the url redirection.
  await page.click(breadcrumbsItemTestId);
  await expect(page).toHaveURL('packages/design-system/breadcrumbs');
});
