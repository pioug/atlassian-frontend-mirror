import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const urlTooltip = getExampleUrl('core', 'tooltip', 'testing');

/* Css selectors used for the test */
const tooltipBtn = "[data-testid='my-button']";
const tooltipTestId = "[data-testid='my-tooltip']";

BrowserTestCase(
  'Tooltip should be able to be identified by data-testid',
  {} as any,
  async (client: any) => {
    const tooltipTest = new Page(client);
    await tooltipTest.goto(urlTooltip);
    await tooltipTest.waitFor(tooltipBtn, 5000);
    await tooltipTest.hover(tooltipBtn);
    await tooltipTest.waitFor(tooltipTestId, 5000);
    expect(await tooltipTest.getText(tooltipTestId)).toContain('Hello World');
  },
);
