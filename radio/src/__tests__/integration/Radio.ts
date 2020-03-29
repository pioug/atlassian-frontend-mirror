import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const exampleUrl = getExampleUrl('core', 'radio', 'testing');

/* Css selectors used for the test */
const labelQuery = "[data-testid='red--radio-label']";
const inputQuery = "[data-testid='red--hidden-radio']";

BrowserTestCase(
  'Radio should be able to be clicked by data-testid',
  {} as any,
  async (client: any) => {
    const testPage = new Page(client);
    await testPage.goto(exampleUrl);
    await testPage.waitFor(labelQuery, 5000);
    await testPage.click(labelQuery);
    const input = await testPage.$(inputQuery);
    const isChecked = input.getProperty('checked');
    expect(isChecked).toBeDefined();
  },
);
