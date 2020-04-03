import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const urlSpinner = getExampleUrl('core', 'spinner', 'testing');

/* Css selectors used for the test */
const example = '#examples';
const spinnerTestIdXLarge = "[data-testid='my-spinner-xlarge']";
const spinnerTestIdLarge = "[data-testid='my-spinner-large']";
const spinnerTestIdMedium = "[data-testid='my-spinner-medium']";
const spinnerTestIdSmall = "[data-testid='my-spinner-small']";
const spinnerTestIdXSmall = "[data-testid='my-spinner-xsmall']";
const spinnerTestIdInverted = "[data-testid='my-spinner-invert-color']";

BrowserTestCase(
  'Spinner should be able to be identified by data-testid',
  {} as any,
  async (client: any) => {
    const spinnerTest = new Page(client);
    await spinnerTest.goto(urlSpinner);
    await spinnerTest.waitFor(example, 5000);
    expect(await spinnerTest.isVisible(spinnerTestIdXLarge)).toBe(true);
    expect(await spinnerTest.isVisible(spinnerTestIdLarge)).toBe(true);
    expect(await spinnerTest.isVisible(spinnerTestIdMedium)).toBe(true);
    expect(await spinnerTest.isVisible(spinnerTestIdSmall)).toBe(true);
    expect(await spinnerTest.isVisible(spinnerTestIdXSmall)).toBe(true);
    expect(await spinnerTest.isVisible(spinnerTestIdInverted)).toBe(true);
  },
);
