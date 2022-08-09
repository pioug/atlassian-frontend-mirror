import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
  });

  it('Calendar basic should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'calendar',
      'basic',
      global.__BASEURL__,
    );
    const calendarSelector = '[data-testid="calendar--container"]';
    await loadPage(page, url);
    const image = await takeElementScreenShot(page, calendarSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Calendar should switch dates', async () => {
    const url = getExampleUrl(
      'design-system',
      'calendar',
      'controlled',
      global.__BASEURL__,
    );
    const calendarSelector = '[data-testid="test--container"]';
    await loadPage(page, url);
    const image = await takeElementScreenShot(page, calendarSelector);
    expect(image).toMatchProdImageSnapshot();

    const dateCellSelector = '[role=gridcell]';
    await page.waitForSelector(dateCellSelector);
    const cells = await page.$$(dateCellSelector);

    await cells[15].hover();
    const imageOnHoveringDiffDate = await takeElementScreenShot(
      page,
      calendarSelector,
    );
    expect(imageOnHoveringDiffDate).toMatchProdImageSnapshot();

    await page.mouse.down();
    const imageOnMouseDown = await takeElementScreenShot(
      page,
      calendarSelector,
    );
    expect(imageOnMouseDown).toMatchProdImageSnapshot();

    await cells[15].click();
    const calenderHeadingSelector = '[data-testid="test--current-month-year"]';
    await page.hover(calenderHeadingSelector);
    const imageOnSwitchingToDiffDate = await takeElementScreenShot(
      page,
      calendarSelector,
    );
    expect(imageOnSwitchingToDiffDate).toMatchProdImageSnapshot();
  });

  it('Calendar should switch dates for sibling date', async () => {
    const url = getExampleUrl(
      'design-system',
      'calendar',
      'controlled',
      global.__BASEURL__,
    );
    const calendarSelector = '[data-testid="test--container"]';
    await loadPage(page, url);
    const image = await takeElementScreenShot(page, calendarSelector);
    expect(image).toMatchProdImageSnapshot();

    const dateCellSelector = '[role=gridcell]';
    await page.waitForSelector(dateCellSelector);
    const cells = await page.$$(dateCellSelector);

    await cells[1].hover();
    const imageOnHoveringDiffDate = await takeElementScreenShot(
      page,
      calendarSelector,
    );
    expect(imageOnHoveringDiffDate).toMatchProdImageSnapshot();

    await page.mouse.down();
    const imageOnMouseDown = await takeElementScreenShot(
      page,
      calendarSelector,
    );
    expect(imageOnMouseDown).toMatchProdImageSnapshot();

    await cells[1].click();
    const calenderHeadingSelector = '[data-testid="test--current-month-year"]';
    await page.hover(calenderHeadingSelector);
    const imageOnSwitchingToDiffDate = await takeElementScreenShot(
      page,
      calendarSelector,
    );
    expect(imageOnSwitchingToDiffDate).toMatchProdImageSnapshot();
  });

  it('Calendar should switch dates for today date', async () => {
    const url = getExampleUrl(
      'design-system',
      'calendar',
      'controlled',
      global.__BASEURL__,
    );
    const calendarSelector = '[data-testid="test--container"]';
    await loadPage(page, url);
    const image = await takeElementScreenShot(page, calendarSelector);
    expect(image).toMatchProdImageSnapshot();

    const dateCellSelector = '[role=gridcell]';
    await page.waitForSelector(dateCellSelector);
    const cells = await page.$$(dateCellSelector);

    await cells[17].hover();
    const imageOnHoveringDiffDate = await takeElementScreenShot(
      page,
      calendarSelector,
    );
    expect(imageOnHoveringDiffDate).toMatchProdImageSnapshot();

    await page.mouse.down();
    const imageOnMouseDown = await takeElementScreenShot(
      page,
      calendarSelector,
    );
    expect(imageOnMouseDown).toMatchProdImageSnapshot();

    await cells[17].click();
    const calenderHeadingSelector = '[data-testid="test--current-month-year"]';
    await page.hover(calenderHeadingSelector);
    const imageOnSwitchingToDiffDate = await takeElementScreenShot(
      page,
      calendarSelector,
    );
    expect(imageOnSwitchingToDiffDate).toMatchProdImageSnapshot();
  });

  it('Calendar should switch months', async () => {
    const url = getExampleUrl(
      'design-system',
      'calendar',
      'controlled',
      global.__BASEURL__,
    );
    const calendarSelector = '[data-testid="test--container"]';
    await loadPage(page, url);
    const image = await takeElementScreenShot(page, calendarSelector);
    expect(image).toMatchProdImageSnapshot();

    const nextMonthButtonSelector = '[data-testid="test--next-month"]';
    await page.waitForSelector(nextMonthButtonSelector);
    await page.click(nextMonthButtonSelector);
    const imageOnSwitchingToNextMonth = await takeElementScreenShot(
      page,
      calendarSelector,
    );
    expect(imageOnSwitchingToNextMonth).toMatchProdImageSnapshot();

    const prevMonthButtonSelector = '[data-testid="test--previous-month"]';
    await page.waitForSelector(prevMonthButtonSelector);
    await page.click(prevMonthButtonSelector);
    const imageOnSwitchingBackToPrevMonth = await takeElementScreenShot(
      page,
      calendarSelector,
    );
    expect(imageOnSwitchingBackToPrevMonth).toMatchProdImageSnapshot();
  });

  it('Calendar of different localization', async () => {
    const url = getExampleUrl(
      'design-system',
      'calendar',
      'i18n',
      global.__BASEURL__,
    );

    await loadPage(page, url);

    const calendarSelector = '[data-testid="test--container"]';

    const localizationInputSelector = 'input';
    await page.waitForSelector(localizationInputSelector);
    await page.type(localizationInputSelector, 'brasil');
    await page.keyboard.press('Enter');
    const imageOfBrasilLocalizeCalendar = await takeElementScreenShot(
      page,
      calendarSelector,
    );
    expect(imageOfBrasilLocalizeCalendar).toMatchProdImageSnapshot();
  });
  it('Calendar theme should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'calendar',
      'theme',
      global.__BASEURL__,
    );
    const calendarSelector = '[data-testid="calendar--container"]';
    await loadPage(page, url);
    const image = await takeElementScreenShot(page, calendarSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Calendar with different week start day', async () => {
    const url = getExampleUrl(
      'design-system',
      'calendar',
      'i18n',
      global.__BASEURL__,
    );
    await loadPage(page, url);

    const calendarSelector = '[data-testid="test--container"]';

    const weekStartDayInputSelector = 'input#week-start-day';
    await page.waitForSelector(weekStartDayInputSelector);
    await page.type(weekStartDayInputSelector, 'tuesday');
    await page.keyboard.press('Enter');
    const imageOfCalendarStartingFromTuesday = await takeElementScreenShot(
      page,
      calendarSelector,
    );
    expect(imageOfCalendarStartingFromTuesday).toMatchProdImageSnapshot();

    const nextMonthButtonSelector = '[data-testid="test--next-month"]';
    await page.waitForSelector(nextMonthButtonSelector);
    await page.click(nextMonthButtonSelector);
    const imageOnSwitchingToNextMonth = await takeElementScreenShot(
      page,
      calendarSelector,
    );
    expect(imageOnSwitchingToNextMonth).toMatchProdImageSnapshot();
  });

  it('Calendar with different week start day and localization', async () => {
    const url = getExampleUrl(
      'design-system',
      'calendar',
      'i18n',
      global.__BASEURL__,
    );
    await loadPage(page, url);

    const calendarSelector = '[data-testid="test--container"]';

    const localizationInputSelector = 'input';
    await page.waitForSelector(localizationInputSelector);
    await page.type(localizationInputSelector, 'brasil');
    await page.keyboard.press('Enter');

    const weekStartDayInputSelector = 'input#week-start-day';
    await page.waitForSelector(weekStartDayInputSelector);
    await page.type(weekStartDayInputSelector, 'tuesday');
    await page.keyboard.press('Enter');
    const imageOfCalendarStartingFromTuesday = await takeElementScreenShot(
      page,
      calendarSelector,
    );
    expect(imageOfCalendarStartingFromTuesday).toMatchProdImageSnapshot();

    const nextMonthButtonSelector = '[data-testid="test--next-month"]';
    await page.waitForSelector(nextMonthButtonSelector);
    await page.click(nextMonthButtonSelector);
    const imageOnSwitchingToNextMonth = await takeElementScreenShot(
      page,
      calendarSelector,
    );
    expect(imageOnSwitchingToNextMonth).toMatchProdImageSnapshot();
  });
});
