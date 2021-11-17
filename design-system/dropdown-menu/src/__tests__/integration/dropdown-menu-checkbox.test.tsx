import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const urlForDropdownCheckbox = getExampleUrl(
  'design-system',
  'dropdown-menu',
  'testing-checkbox',
);

const urlForDropdownCheckboxSelected = getExampleUrl(
  'design-system',
  'dropdown-menu',
  'testing-checkbox-stateless',
);

/* Css selectors used for the test */
const trigger = '[data-testid="lite-mode-ddm--trigger"]';
const dropdownMenu = '[data-testid="lite-mode-ddm--content"]';

const getCheckboxes = async (page: Page) => {
  const buttons = await page.$$('button[aria-checked]');
  return await page.evaluate(
    (elements) =>
      (elements || []).map((x: any) => x.getAttribute('aria-checked')),
    buttons,
  );
};

BrowserTestCase(
  'Verify that checkbox in dropdown menu transitions from unchecked to checked - using defaultSelected',
  {},
  async (client: WebdriverIO.BrowserObject) => {
    const page = new Page(client);
    await page.goto(urlForDropdownCheckbox);

    await page.waitForSelector(trigger);
    await page.click(trigger);

    expect(await page.isExisting(dropdownMenu)).toBe(true);

    await page.waitForSelector('button[aria-checked]');
    expect(await page.isExisting('button[aria-checked]')).toBe(true);

    let checks = await getCheckboxes(page);
    expect(checks).toEqual(expect.arrayContaining(['false', 'true']));

    await page.waitForSelector('#sydney');
    await page.click('#sydney');

    checks = await getCheckboxes(page);
    expect(checks).toEqual(expect.arrayContaining(['true', 'true']));
  },
);

BrowserTestCase(
  'Verify that checkbox in dropdown menu transitions from unchecked to checked - using isSelected',
  {},
  async (client: WebdriverIO.BrowserObject) => {
    const page = new Page(client);
    await page.goto(urlForDropdownCheckboxSelected);

    await page.waitForSelector(trigger);
    await page.click(trigger);

    expect(await page.isExisting(dropdownMenu)).toBe(true);

    await page.waitForSelector('button[aria-checked]');
    expect(await page.isExisting('button[aria-checked]')).toBe(true);

    let checks = await getCheckboxes(page);
    expect(checks).toEqual(expect.arrayContaining(['false', 'false']));

    await page.waitForSelector('#sydney');
    await page.click('#sydney');

    checks = await getCheckboxes(page);
    expect(checks).toEqual(expect.arrayContaining(['true', 'false']));
  },
);
