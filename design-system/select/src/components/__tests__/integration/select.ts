import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

// css-selectors:
const selectDefault = '.react-select__control';
const selectMenu = '.react-select__menu';

BrowserTestCase(
  `Single-select should display a menu once clicked and not throwing errors`,
  { skip: [] },
  async (client: any) => {
    const selectTest = new Page(client);
    const urlSelect = getExampleUrl('design-system', 'select', 'single-select');
    await selectTest.goto(urlSelect);
    await selectTest.waitForSelector(selectDefault);
    await selectTest.click(selectDefault);
    const menuIsVisible = await selectTest.isVisible(selectMenu);
    expect(menuIsVisible).toBe(true);
    await selectTest.checkConsoleErrors();
  },
);

BrowserTestCase(
  `Multi-select should display a menu once clicked and not throwing errors`,
  { skip: [] },
  async (client: any) => {
    const selectTest = new Page(client);
    const urlSelect = getExampleUrl('design-system', 'select', 'multi-select');
    await selectTest.goto(urlSelect);
    await selectTest.waitForSelector(selectDefault);
    await selectTest.click(selectDefault);
    const menuIsVisible = await selectTest.isVisible(selectMenu);
    expect(menuIsVisible).toBe(true);
    await selectTest.checkConsoleErrors();
  },
);

BrowserTestCase(
  `Radio-select should display a menu once clicked and not throwing errors`,
  { skip: [] },
  async (client: any) => {
    const selectTest = new Page(client);
    const urlSelect = getExampleUrl('design-system', 'select', 'radio-select');
    await selectTest.goto(urlSelect);
    await selectTest.waitForSelector(selectDefault);
    await selectTest.click(selectDefault);
    const menuIsVisible = await selectTest.isVisible(selectMenu);
    expect(menuIsVisible).toBe(true);
    await selectTest.checkConsoleErrors();
  },
);

BrowserTestCase(
  `Async-select should display a menu once clicked and not throwing errors`,
  { skip: [] },
  async (client: any) => {
    const selectTest = new Page(client);
    const urlSelect = getExampleUrl(
      'design-system',
      'select',
      'async-select-with-callback',
    );
    await selectTest.goto(urlSelect);
    await selectTest.waitForSelector(selectDefault);
    await selectTest.click(selectDefault);
    const menuIsVisible = await selectTest.isVisible(selectMenu);
    expect(menuIsVisible).toBe(true);
    await selectTest.checkConsoleErrors();
  },
);
