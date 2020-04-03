import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';

import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const urlDrawer = getExampleUrl('core', 'dropdown-menu', 'testing');

/* Css selectors used for the test */
const dropdownMenuTrigger = '[data-testid="dropdown-menu--trigger"]';
const dropdownMenuContent = '[data-testid="dropdown-menu--content"]';
const menuItemSydney = `${dropdownMenuContent} [role="menuitem"]:first-child`;

BrowserTestCase(
  'Dropdown Menu should be able to select an item',
  { skip: ['ie'] },
  async (client: WebdriverIOAsync.BrowserObject) => {
    const dropdownMenuTest = new Page(client);
    await dropdownMenuTest.goto(urlDrawer);
    await dropdownMenuTest.waitForSelector(dropdownMenuTrigger);
    await dropdownMenuTest.click(dropdownMenuTrigger);

    expect(await dropdownMenuTest.isExisting(dropdownMenuContent)).toBe(true);

    await dropdownMenuTest.waitForSelector(dropdownMenuContent);

    const menuItem = await dropdownMenuTest.getText(menuItemSydney);

    expect(menuItem).toEqual('Sydney');

    await dropdownMenuTest.click(menuItemSydney);

    expect(await dropdownMenuTest.isExisting(dropdownMenuContent)).toBe(false);
  },
);
