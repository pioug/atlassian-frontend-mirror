import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const url = getExampleUrl('core', 'textfield', 'testing');

/* Css selectors used for the test */
const query = "[data-testid='the-textfield']";

BrowserTestCase(
  'Textfield should be able to be clicked by data-testid',
  {} as any,
  async (client: any) => {
    const page = new Page(client);
    await page.goto(url);
    await page.waitFor(query, 5000);
    expect(await page.isVisible(query)).toBe(true);
    expect(await page.getValue(query)).toContain('I have a data-testid');
  },
);
