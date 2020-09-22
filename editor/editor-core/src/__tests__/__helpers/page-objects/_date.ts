import { TestPage } from './_types';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';

export const dateSelectors = {
  // Selector for the textfield in the keyboard accessible datepicker
  dateInput: '[aria-label="Popup"] input',
  dateInputFocused: '[aria-label="Popup"] input:focus',
  calendarNextMonth: 'span[aria-label="Next month"]',
  calendarLastMonth: 'span[aria-label="Last month"]',
  dateLozenge: 'span[timestamp]',
  selector: `.dateView-content-wrap`,
  calendar: `[aria-label="calendar"]`,
};

export const clickOnDate = async (page: TestPage) => {
  await waitForDate(page);
  await page.click(dateSelectors.selector);
};

export const waitForDate = async (page: TestPage) => {
  await page.waitForSelector(dateSelectors.selector);
};

export const waitForDatePicker = async (page: TestPage) => {
  await page.waitForSelector(dateSelectors.calendar);
};

/** Wait until datepicker is not displayed */
export const waitForNoDatePicker = async (page: PuppeteerPage) => {
  // waitForFunction doesn't exist on WebDriverPage.
  await page.waitForFunction(
    (selector: string) => !document.querySelector(selector),
    {},
    dateSelectors.calendar,
  );
};
