import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

import { getRadioForGroup } from './_helper';

const urlForDropdownRadio = getExampleUrl(
  'design-system',
  'dropdown-menu',
  'testing-radio',
);

/* Css selectors used for the test */
const trigger = '[data-testid="lite-mode-ddm--trigger"]';
const dropdownMenu = '[data-testid="lite-mode-ddm--content"]';

BrowserTestCase(
  'Verify that radio in dropdown menu transitions from unchecked to checked - using defaultSelected',
  {},
  async (client: WebdriverIO.BrowserObject) => {
    const page = new Page(client);
    await page.goto(urlForDropdownRadio);

    await page.waitForSelector(trigger);
    await page.click(trigger);

    expect(await page.isExisting(dropdownMenu)).toBe(true);

    await page.waitForSelector('button[aria-checked]');
    expect(await page.isExisting('button[aria-checked]')).toBe(true);

    let checks = await getRadioForGroup(page, 'cities');
    expect(checks).toEqual(['false', 'true']);

    await page.waitForSelector('#sydney');
    await page.click('#sydney');

    checks = await getRadioForGroup(page, 'cities');
    expect(checks).toEqual(['true', 'false']);
  },
);

BrowserTestCase(
  'Verify that radio in dropdown menu can only have one selection in a group',
  {},
  async (client: WebdriverIO.BrowserObject) => {
    const page = new Page(client);
    await page.goto(urlForDropdownRadio);

    await page.waitForSelector(trigger);
    await page.click(trigger);

    expect(await page.isExisting(dropdownMenu)).toBe(true);

    await page.waitForSelector('button[aria-checked]');
    expect(await page.isExisting('button[aria-checked]')).toBe(true);

    let checks = await getRadioForGroup(page, 'other-cities');
    expect(checks).toEqual(['true', 'false', 'false']);

    await page.waitForSelector('#perth');
    await page.click('#perth');

    checks = await getRadioForGroup(page, 'other-cities');
    expect(checks).toEqual(['false', 'false', 'true']);

    await page.waitForSelector('#adelaide');
    await page.click('#adelaide');

    checks = await getRadioForGroup(page, 'other-cities');
    expect(checks).toEqual(['true', 'false', 'false']);
  },
);
