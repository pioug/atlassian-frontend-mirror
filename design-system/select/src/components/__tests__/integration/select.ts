import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

// css-selectors:
const selectDefault = '.react-select__value-container';
const selectMenu = '.react-select__menu';
const selectMenuItem1 = '.react-select__option:nth-child(1)';
// Note: In some cases, those ids are not loaded in the DOM and hence the tests fail.
// This needs proper investigation.
// const selectAdelaide = '#react-select-2-option-0';
// const selectBrisbane = '#react-select-2-option-3';

const selectMultiAdelaide = '[tabIndex="-1"]:nth-child(1)';
const selectMultiBrisbane = '[tabIndex="-1"]:nth-child(2)';

// TODO: there is an inconsistency between tabIndex and tabindex
const selectRadioAdelaide = '[tabindex="-1"]:nth-child(1)';

const selectCheckbox = '.select__control';
const selectCheckboxMenu = '.select__menu';

const selectedValue = '.react-select__value-container';
const selectedValueContainer = '.select__value-container';

// FIXME: This test was automatically skipped due to failure on 9/22/2021: https://product-fabric.atlassian.net/browse/SKIP-54
BrowserTestCase(
  `Single-select should display a menu once clicked and select a menu item`,
  {
    skip: ['*'],
  },
  async (client: any) => {
    const selectTest = new Page(client);
    const urlSelect = getExampleUrl('design-system', 'select', 'single-select');
    await selectTest.goto(urlSelect);
    await selectTest.waitForSelector(selectDefault);
    await selectTest.click(selectDefault);
    const menuIsVisible = await selectTest.isVisible(selectMenu);
    expect(menuIsVisible).toBe(true);
    await selectTest.waitForSelector(selectMenuItem1);
    await selectTest.click(selectMenuItem1);
    //wait for animation to finish
    await client.pause(500);
    await selectTest.waitForSelector(selectedValue);
    expect(await selectTest.getText(selectedValue)).not.toContain(
      'Choose a City',
    );
    await selectTest.checkConsoleErrors();
  },
);

BrowserTestCase(
  `Multi-select should display a menu once clicked and not throwing errors`,
  {},
  async (client: any) => {
    const selectTest = new Page(client);
    const urlSelect = getExampleUrl('design-system', 'select', 'multi-select');
    await selectTest.goto(urlSelect);
    await selectTest.waitForSelector(selectDefault);
    await selectTest.click(selectDefault);
    const menuIsVisible = await selectTest.isVisible(selectMenu);
    expect(menuIsVisible).toBe(true);
    await selectTest.waitFor(selectMultiAdelaide, 15000);
    await selectTest.click(selectMultiAdelaide);
    await selectTest.waitForSelector(selectDefault);
    await selectTest.click(selectDefault);
    await selectTest.waitForSelector(selectMultiBrisbane);
    await selectTest.click(selectMultiBrisbane);
    //wait for animation to finish
    await client.pause(500);
    await selectTest.waitForSelector(selectedValue);
    expect(await selectTest.getText(selectedValue)).not.toContain(
      'Choose a City',
    );
    await selectTest.checkConsoleErrors();
  },
);

BrowserTestCase(
  `Radio-select should display a menu once clicked and not throwing errors`,
  {},
  async (client: any) => {
    const selectTest = new Page(client);
    const urlSelect = getExampleUrl('design-system', 'select', 'radio-select');
    await selectTest.goto(urlSelect);
    await selectTest.waitForSelector(selectDefault);
    await selectTest.click(selectDefault);
    const menuIsVisible = await selectTest.isVisible(selectMenu);
    expect(menuIsVisible).toBe(true);
    await selectTest.waitFor(selectRadioAdelaide, 15000);
    await selectTest.click(selectRadioAdelaide);
    //wait for animation to finish
    await client.pause(500);
    await selectTest.waitForSelector(selectedValue);
    expect(await selectTest.getText(selectedValue)).not.toContain(
      'Choose a City',
    );
    await selectTest.checkConsoleErrors();
  },
);

// FIXME: This test was automatically skipped due to failure on 9/9/2021: https://product-fabric.atlassian.net/browse/SKIP-48
BrowserTestCase(
  `Async-select should display a menu once clicked and not throwing errors`,
  {
    skip: ['*'],
  },
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
    await selectTest.waitFor(selectRadioAdelaide, 15000);
    await selectTest.click(selectRadioAdelaide);
    //wait for animation to finish
    await client.pause(500);
    await selectTest.waitForSelector(selectedValue);
    expect(await selectTest.getText(selectedValue)).not.toContain(
      'Choose a City',
    );
    await selectTest.checkConsoleErrors();
  },
);

BrowserTestCase(
  `Checkbox-select should display a menu once clicked and not throwing errors`,
  {},
  async (client: any) => {
    const selectTest = new Page(client);
    const urlSelect = getExampleUrl(
      'design-system',
      'select',
      'checkbox-select',
    );
    await selectTest.goto(urlSelect);
    await selectTest.waitForSelector(selectCheckbox);
    await selectTest.click(selectCheckbox);
    const menuIsVisible = await selectTest.isVisible(selectCheckboxMenu);
    expect(menuIsVisible).toBe(true);
    await selectTest.waitFor(selectRadioAdelaide, 10000);
    await selectTest.click(selectRadioAdelaide);
    await selectTest.waitForSelector(selectedValueContainer);
    await selectTest.click(selectedValueContainer);
    //wait for animation to finish
    await client.pause(500);
    await selectTest.waitForSelector(selectedValueContainer);
    expect(await selectTest.getText(selectedValueContainer)).not.toContain(
      'Choose a City',
    );
    await selectTest.checkConsoleErrors();
  },
);
