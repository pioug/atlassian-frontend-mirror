import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

// css-selectors:
const selectDefault = '.react-select__control';
const selectMenu = '.react-select__menu';
const selectmenuItem1 = '.react-select__option:nth-child(1)';
//TODO: Will uncomment it in sub PR
// const selectAdelaide = '#react-select-2-option-0';
// const selectBrisbane = '#react-select-2-option-3';

// const selectCheckbox = '.select__control';
// const selectCheckboxMenu = '.select__menu';

BrowserTestCase(
  `Single-select should display a menu once clicked and select a menu item`,
  {},
  async (client: any) => {
    const selectTest = new Page(client);
    const urlSelect = getExampleUrl('design-system', 'select', 'single-select');
    await selectTest.goto(urlSelect);
    await selectTest.waitForSelector(selectDefault);
    await selectTest.click(selectDefault);
    const menuIsVisible = await selectTest.isVisible(selectMenu);
    expect(menuIsVisible).toBe(true);
    await selectTest.waitForSelector(selectmenuItem1);
    await selectTest.click(selectmenuItem1);
    //wait for animation to finish
    await client.pause(500);
    const selectedValue = '.react-select__value-container';
    expect(await selectTest.getText(selectedValue)).not.toContain(
      'Choose a City',
    );
    await selectTest.checkConsoleErrors();
  },
);

//TODO: Will fix it in sub PR
// BrowserTestCase(
//   `Multi-select should display a menu once clicked and not throwing errors`,
//   {},
//   async (client: any) => {
//     const selectTest = new Page(client);
//     const urlSelect = getExampleUrl('design-system', 'select', 'multi-select');
//     await selectTest.goto(urlSelect);
//     await selectTest.waitForSelector(selectDefault);
//     await selectTest.click(selectDefault);
//     const menuIsVisible = await selectTest.isVisible(selectMenu);
//     expect(menuIsVisible).toBe(true);
//     await selectTest.waitFor(selectAdelaide, 10000);
//     await selectTest.click(selectAdelaide);
//     await selectTest.waitForSelector(selectDefault);
//     await selectTest.click(selectDefault);
//     await client.pause(2000);
//     expect(await selectTest.isExisting(selectAdelaide)).toBe(false);
//     await selectTest.waitForSelector(selectBrisbane);
//     await selectTest.click(selectBrisbane);
//     //wait for animation to finish
//     await client.pause(500);
//     const selectedValue = '.react-select__value-container';
//     expect(await selectTest.getText(selectedValue)).not.toContain(
//       'Choose a City',
//     );
//     await selectTest.checkConsoleErrors();
//   },
// );

// BrowserTestCase(
//   `Radio-select should display a menu once clicked and not throwing errors`,
//   {},
//   async (client: any) => {
//     const selectTest = new Page(client);
//     const urlSelect = getExampleUrl('design-system', 'select', 'radio-select');
//     await selectTest.goto(urlSelect);
//     await selectTest.waitForSelector(selectDefault);
//     await selectTest.click(selectDefault);
//     const menuIsVisible = await selectTest.isVisible(selectMenu);
//     expect(menuIsVisible).toBe(true);
//     await selectTest.waitFor(selectAdelaide, 10000);
//     await selectTest.click(selectAdelaide);
//     //wait for animation to finish
//     await client.pause(500);
//     const selectedValue = '.react-select__value-container';
//     expect(await selectTest.getText(selectedValue)).not.toContain(
//       'Choose a City',
//     );
//     await selectTest.checkConsoleErrors();
//   },
// );

// BrowserTestCase(
//   `Async-select should display a menu once clicked and not throwing errors`,
//   {},
//   async (client: any) => {
//     const selectTest = new Page(client);
//     const urlSelect = getExampleUrl(
//       'design-system',
//       'select',
//       'async-select-with-callback',
//     );
//     await selectTest.goto(urlSelect);
//     await selectTest.waitForSelector(selectDefault);
//     await selectTest.click(selectDefault);
//     const menuIsVisible = await selectTest.isVisible(selectMenu);
//     expect(menuIsVisible).toBe(true);
//     await selectTest.waitFor(selectAdelaide, 10000);
//     await selectTest.click(selectAdelaide);
//     //wait for animation to finish
//     await client.pause(500);
//     const selectedValue = '.react-select__value-container';
//     expect(await selectTest.getText(selectedValue)).not.toContain(
//       'Choose a City',
//     );
//     await selectTest.checkConsoleErrors();
//   },
// );

// BrowserTestCase(
//   `Checkbox-select should display a menu once clicked and not throwing errors`,
//   {},
//   async (client: any) => {
//     const selectTest = new Page(client);
//     const urlSelect = getExampleUrl(
//       'design-system',
//       'select',
//       'checkbox-select',
//     );
//     await selectTest.goto(urlSelect);
//     await selectTest.waitForSelector(selectCheckbox);
//     await selectTest.click(selectCheckbox);
//     const menuIsVisible = await selectTest.isVisible(selectCheckboxMenu);
//     expect(menuIsVisible).toBe(true);
//     await selectTest.waitFor(selectAdelaide, 10000);
//     await selectTest.click(selectAdelaide);
//     //wait for animation to finish
//     await client.pause(500);
//     const selectedValue = '.select__value-container';
//     expect(await selectTest.getText(selectedValue)).not.toContain(
//       'Choose a City',
//     );
//     await selectTest.checkConsoleErrors();
//   },
// );
