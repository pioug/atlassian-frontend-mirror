import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const urlDropdown = getExampleUrl(
  'design-system',
  'dropdown-menu',
  'with-keyboard-interaction',
);

/* Css selectors used for the test */
const dropdown = '[data-testid="dropdown--trigger"]';
const dropdownItem = '[data-testid="dropdown--content"]';
const dialogBox = '[data-testid="dialogBox"]';

BrowserTestCase(
  'Verify that Dropdown Menu is able to select an item and validate the associated action',
  {},
  async (client: WebdriverIO.BrowserObject) => {
    const dropdownMenuTest = new Page(client);
    await dropdownMenuTest.goto(urlDropdown);
    await dropdownMenuTest.waitForSelector(dropdown);
    await dropdownMenuTest.click(dropdown);

    expect(await dropdownMenuTest.isExisting(dropdownItem)).toBe(true);

    await dropdownMenuTest.waitForSelector(dropdownItem);

    const menuItem = await dropdownMenuTest.getText(dropdownItem);

    expect(menuItem).toEqual('Open modal');

    await dropdownMenuTest.click(dropdownItem);

    expect(await dropdownMenuTest.isExisting(dialogBox)).toBe(true);

    expect(await dropdownMenuTest.isExisting(dropdownItem)).toBe(false);
  },
);
