import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const urlAvatar = getExampleUrl('core', 'avatar', 'testing');

/* Css selectors used for the test */
const avatarTestId = "[data-testid='myAvatar']";

BrowserTestCase(
  'Avatar should be able to be clicked by data-testid',
  {},
  async (client: any) => {
    const avatarTest = new Page(client);
    await avatarTest.goto(urlAvatar);
    await avatarTest.waitFor(avatarTestId, 5000);
    await avatarTest.click(avatarTestId);
    const textAlert = await avatarTest.getAlertText();
    expect(textAlert).toBe('Avatar has been clicked!');
    await avatarTest.acceptAlert();
  },
);
