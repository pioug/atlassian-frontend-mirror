import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const urlBreadcrumbs = getExampleUrl('core', 'breadcrumbs', 'testing');

/* Css selectors used for the test */
const breadcrumbsTestId = "[data-testid='MyBreadcrumbsTestId']";
const breadcrumbsEllipsisTestId =
  "[data-testid='MyBreadcrumbsTestId--breadcrumb-ellipsis']";
const breadcrumbsItemTestId = "[data-testid='myBreadcrumbsItemTestId']";

BrowserTestCase(
  'Breadcrumbs should be able to be clicked by data-testid',
  {} as any,
  async (client: any) => {
    const breadcrumbsTest = new Page(client);
    await breadcrumbsTest.goto(urlBreadcrumbs);
    await breadcrumbsTest.waitFor(breadcrumbsTestId, 5000);
    expect(await breadcrumbsTest.isVisible(breadcrumbsTestId)).toBe(true);
    expect(await breadcrumbsTest.isVisible(breadcrumbsEllipsisTestId)).toBe(
      true,
    );
    // The breadcrumbsItem with testId is collapsed and will be displayed once clicked on the `breadcrumbsEllipsisTestId`.
    await breadcrumbsTest.click(breadcrumbsEllipsisTestId);
    expect(await breadcrumbsTest.isVisible(breadcrumbsItemTestId)).toBe(true);
    expect(await breadcrumbsTest.getText(breadcrumbsItemTestId)).toContain(
      'The item with testId',
    );
    // Once the `breadcrumbsItemTestId` is displayed, we can click on it and checks the url redirection.
    await breadcrumbsTest.click(breadcrumbsItemTestId);
    expect(await breadcrumbsTest.url()).toContain('packages/core/breadcrumbs');
  },
);
