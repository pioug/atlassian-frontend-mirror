import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const urlCalendar = getExampleUrl('core', 'calendar', 'testing');

const monthContainer = '[data-testid="the-calendar--month"]';
const selectedDayQuery = '[data-testid="the-calendar--selected-day"]';
const currentMonthQuery = '[data-testid="the-calendar--current-month-year"]';
const previousMonthQuery = '[data-testid="the-calendar--previous-month"]';
const nextMonthQuery = '[data-testid="the-calendar--next-month"]';

BrowserTestCase(
  'A user is able to select a date',
  { skip: [] },
  async (client: any) => {
    const calendarPage = new Page(client);
    await calendarPage.goto(urlCalendar);

    const expectedDayQuery = `${monthContainer} td`;
    const expectedDay = await calendarPage.getText(expectedDayQuery);

    await calendarPage.click(expectedDayQuery);

    const selectedDay = await calendarPage.getText(selectedDayQuery);

    expect(expectedDay).toEqual(selectedDay);
  },
);

BrowserTestCase(
  'A user is able to navigate between months',
  { skip: [] },
  async (client: any) => {
    const calendar = new Page(client);

    await calendar.goto(urlCalendar);

    const initialMonthYear = await calendar.getText(currentMonthQuery);

    await calendar.click(nextMonthQuery);

    let nextMonthYear = await calendar.getText(currentMonthQuery);

    expect(initialMonthYear).not.toEqual(nextMonthYear);

    await calendar.click(previousMonthQuery);

    nextMonthYear = await calendar.getText(currentMonthQuery);

    expect(initialMonthYear).toEqual(nextMonthYear);
  },
);
