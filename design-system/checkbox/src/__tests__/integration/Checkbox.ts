import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const exampleUrl = getExampleUrl('design-system', 'checkbox', 'testing');

/* Css selectors used for the test */
const checkboxLabelQuery = "[data-testid='the-checkbox--checkbox-label']";
const hiddenCheckboxQuery = "[data-testid='the-checkbox--hidden-checkbox']";

BrowserTestCase(
  'Checkbox should be able to be clicked by data-testid',
  {},
  async (client: any) => {
    const testPage = new Page(client);
    await testPage.goto(exampleUrl);
    await testPage.waitFor(checkboxLabelQuery, 5000);
    await testPage.click(checkboxLabelQuery);
    const checkbox = await testPage.$(hiddenCheckboxQuery);
    const isChecked = await checkbox.getProperty('checked');
    expect(isChecked).toBe(true);
  },
);

BrowserTestCase(
  'Checkbox should be checked when clicked with a modifier such as shift+click',
  { skip: ['chrome'] }, // modified clicks requires the browser.performActions() method, but this function does not exist when running in Chrome
  async (client: any) => {
    const testPage = new Page(client);
    await testPage.goto(exampleUrl);
    await testPage.waitFor(checkboxLabelQuery, 5000);
    await testPage.modifierClick('Shift'); // shift is chosen here as it is OS-agnostic unlike cmd+click, and should behave in the same way
    const checkbox = await testPage.$(hiddenCheckboxQuery);
    const isChecked = await checkbox.getProperty('checked');
    expect(isChecked).toBe(true);
  },
);
