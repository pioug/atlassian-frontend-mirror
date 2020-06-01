import { normalizeRecentFilesAge } from '../../normalizeRecentFilesAge';

describe('Normalise Recent Files Age', () => {
  it('should return `N/A` when `createdAt` is undefined', () => {
    expect(normalizeRecentFilesAge(undefined)).toEqual('N/A');
  });

  it('should return "Invalid" when `createdAt` is negative', () => {
    expect(normalizeRecentFilesAge(-1)).toEqual('Invalid');
  });

  it('should return "< 1 hour" when TTL is less than 1 hour', () => {
    const dateLessThanOneHour = new Date();
    dateLessThanOneHour.setMinutes(dateLessThanOneHour.getMinutes() - 20);

    expect(normalizeRecentFilesAge(dateLessThanOneHour.getTime())).toEqual(
      '< 1 hour',
    );
  });

  it('should return "1 hour - 1 day" when TTL is between 1 hour and 1 day', () => {
    const dateMoreThanOneHourAndLessThanOneDay = new Date();
    dateMoreThanOneHourAndLessThanOneDay.setHours(
      dateMoreThanOneHourAndLessThanOneDay.getHours() - 2,
    );
    expect(
      normalizeRecentFilesAge(dateMoreThanOneHourAndLessThanOneDay.getTime()),
    ).toEqual('1 hour - 1 day');
  });

  it('should return "1 day - 1 week" when TTL is between 1 day and 1 week', () => {
    const dateMoreThanOneDayAndLessThanOneWeek = new Date();
    dateMoreThanOneDayAndLessThanOneWeek.setDate(
      dateMoreThanOneDayAndLessThanOneWeek.getDate() - 2,
    );
    expect(
      normalizeRecentFilesAge(dateMoreThanOneDayAndLessThanOneWeek.getTime()),
    ).toEqual('1 day - 1 week');
  });

  it('should return "1 week - 1 month" when TTL is between 1 week and 1 month', () => {
    const dateMoreThanOneDayAndLessThanOneWeek = new Date();
    dateMoreThanOneDayAndLessThanOneWeek.setDate(
      dateMoreThanOneDayAndLessThanOneWeek.getDate() - 8,
    );
    expect(
      normalizeRecentFilesAge(dateMoreThanOneDayAndLessThanOneWeek.getTime()),
    ).toEqual('1 week - 1 month');
  });

  it('should return "1 month - 6 months" when TTL is between 1 month and 6 months', () => {
    const dateMoreThanOneMonthAndLessThanSixMonths = new Date();
    dateMoreThanOneMonthAndLessThanSixMonths.setMonth(
      dateMoreThanOneMonthAndLessThanSixMonths.getMonth() - 2,
    );
    expect(
      normalizeRecentFilesAge(
        dateMoreThanOneMonthAndLessThanSixMonths.getTime(),
      ),
    ).toEqual('1 month - 6 months');
  });

  it('should return "6 months - 1 year" when TTL is between 6 months and 1 year', () => {
    const dateMoreThanOneDayAndLessThanOneWeek = new Date();
    dateMoreThanOneDayAndLessThanOneWeek.setMonth(
      dateMoreThanOneDayAndLessThanOneWeek.getMonth() - 8,
    );
    expect(
      normalizeRecentFilesAge(dateMoreThanOneDayAndLessThanOneWeek.getTime()),
    ).toEqual('6 months - 1 year');
  });

  it('should return "> 1 year" when TTL is greater than 1 year', () => {
    const dateMoreThanOneDayAndLessThanOneWeek = new Date();
    dateMoreThanOneDayAndLessThanOneWeek.setMonth(
      dateMoreThanOneDayAndLessThanOneWeek.getMonth() - 22,
    );
    expect(
      normalizeRecentFilesAge(dateMoreThanOneDayAndLessThanOneWeek.getTime()),
    ).toEqual('> 1 year');
  });
});
