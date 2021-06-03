import { normalizeLocale } from '../common';
import { createDateParser, DateParser } from '../date-parser';
import { FormattedParts, toFormattedParts } from './toFormattedParts';

export type DateFormatter = (date: Date) => string;

type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface LocalizationProvider {
  getDaysShort: (weekStartDay?: WeekDay) => Array<string>;
  getMonthsLong: () => Array<string>;
  formatDate: DateFormatter;
  formatTime: DateFormatter;
  parseDate: DateParser;
  formatToParts: (date?: number | Date | undefined) => FormattedParts;
}

export const createLocalizationProvider = (
  locale: string,
  formatterOptions?: Intl.DateTimeFormatOptions,
): LocalizationProvider => {
  // Intl.DateFormat expects locales in the format of 'la-CO' however it is
  // common for locale to be provided in the format of 'la_CO', where 'la' is
  // language and 'CO' is country.
  const normalizedLocale = normalizeLocale(locale);

  const formatDate = (date?: number | Date) =>
    Intl.DateTimeFormat(normalizedLocale).format(date);

  const formatTime = (date?: number | Date) =>
    Intl.DateTimeFormat(normalizedLocale, {
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);

  const getDaysShort = (weekStartDay: WeekDay = 0) => {
    const dayFormatter = Intl.DateTimeFormat(normalizedLocale, {
      weekday: 'short',
    });

    // Right now there is no way to find out first day of the week based on Intl (locale)
    // api. Check issue here: https://github.com/tc39/ecma402/issues/6
    // So we rotate the weekdays based on #weekStartDay parameter.
    const weekdays = [0, 1, 2, 3, 4, 5, 6];
    const rotatedWeekdays =
      weekStartDay > 0
        ? [...weekdays.slice(weekStartDay), ...weekdays.slice(0, weekStartDay)]
        : weekdays;

    return rotatedWeekdays.map((day) =>
      // Some short days are longer than 3 characters but are unique if the first
      // three non-white characters are used.
      dayFormatter
        // Date range chosen which has a Sun-Sat range so we can extract the names
        .format(new Date(2000, 9, day + 1, 12))
        // \u200E matches on the Left-to-Right Mark character in IE/Edge
        .replace(/[\s\u200E]/g, '')
        .substring(0, 3),
    );
  };

  const getMonthsLong = () => {
    const monthFormatter = Intl.DateTimeFormat(normalizedLocale, {
      month: 'long',
    });
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) =>
      // Date chosen for no real reason, the only important part is the month
      // Using 2020 'cos Safari has a faulty implementation when we use the year 2000
      // Intl.DateTimeFormat("en-US", { month: 'long'}).format(new Date(2000, 3, 1))
      // should give "April" but gives "March" in Safari
      monthFormatter.format(new Date(2020, month, 1)),
    );
  };

  const parseDate = (date: string) => createDateParser(normalizedLocale)(date);

  const formatToParts = (date: number | Date = new Date()) => {
    const formatter = new Intl.DateTimeFormat(
      normalizedLocale,
      formatterOptions,
    );
    /**
     * Safari has a bug that returns the wrong month for years 2005 and before.
     * The error occurs when the passed date has been created with numbers, like new Date(2000, 3, 1)
     * Not all the months fail in each year. To ensure the correct output,
     * we select 2020 as the base year for the whole date,
     * then we replace in the result the original input year
     */
    const fixedDate = new Date(date);
    fixedDate.setFullYear(2020);
    const fixedParts = toFormattedParts(formatter.formatToParts(fixedDate));
    const originalParts = toFormattedParts(formatter.formatToParts(date));
    if (fixedParts.year) {
      fixedParts.year = originalParts.year;
    }

    /**
     * Chrome has a bug that returns hour="00" when it's 12:00pm in certain languages
     * We fix it by detecting the real time with getHours method
     */
    if (fixedParts.hour === '00' && fixedDate.getHours() === 12) {
      fixedParts.hour = '12';
    }

    return fixedParts;
  };

  return {
    getDaysShort,
    getMonthsLong,
    formatDate,
    formatTime,
    parseDate,
    formatToParts,
  };
};
