import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const urlButton = getExampleUrl('core', 'button', 'Testing');

/* Css selectors used for the test */
const buttonTestId = "[data-testid='MyButtonTestId']";

BrowserTestCase(
  'Button should be able to be clicked by data-testid',
  {} as any,
  async (client: any) => {
    const buttonTest = new Page(client);
    await buttonTest.goto(urlButton);
    await buttonTest.waitFor(buttonTestId, 5000);
    await buttonTest.click(buttonTestId);
    const textAlert = await buttonTest.getAlertText();
    expect(textAlert).toBe('Button has been clicked!');
    await buttonTest.acceptAlert();
  },
);
