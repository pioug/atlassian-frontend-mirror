import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const exampleUrl = getExampleUrl('core', 'checkbox', 'testing');

/* Css selectors used for the test */
const checkboxLabelQuery = "[data-testid='the-checkbox--checkbox-label']";
const hiddenCheckboxQuery = "[data-testid='the-checkbox--hidden-checkbox']";

BrowserTestCase(
  'Checkbox should be able to be clicked by data-testid',
  {} as any,
  async (client: any) => {
    const testPage = new Page(client);
    await testPage.goto(exampleUrl);
    await testPage.waitFor(checkboxLabelQuery, 5000);
    await testPage.click(checkboxLabelQuery);
    const checkbox = await testPage.$(hiddenCheckboxQuery);
    const isChecked = checkbox.getProperty('checked');
    expect(isChecked).toBeDefined();
  },
);
