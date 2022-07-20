import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const urlSpinner = getExampleUrl('design-system', 'spinner', 'testing');

/* Css selectors used for the test */
const example = '#examples';

BrowserTestCase(
  'Spinner should be able to be identified by data-testid',
  {},
  async (client: any) => {
    const spinnerTest = new Page(client);
    await spinnerTest.goto(urlSpinner);
    await spinnerTest.waitFor(example, 5000);
    expect(await spinnerTest.isVisible('[data-testid="my-spinner"]')).toBe(
      true,
    );
  },
);
