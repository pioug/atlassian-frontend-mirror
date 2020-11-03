import { DateType, DateSegment } from '../../types';

import {
  getLocaleDatePlaceholder,
  findDateSegmentByPosition,
  adjustDate,
  isDatePossiblyValid,
} from '../../utils/internal';

/*
We need to mock formatDateType() because i18n functions
(eg. `Intl.DateTimeFormat('en-GB').format(date)`) don't work in Jest,
see https://stackoverflow.com/questions/49052731/jest-test-intl-datetimeformat)

This mocked data comes from creating a date in the Chrome devtools with
```
let dateObj = new Date(Date.UTC(1993, 9 - 1, 3));
```
And then observing the country output with
```
Intl.DateTimeFormat('sr-Cyrl-BA').format(dateObj)
```
for each locale.
*/
jest.mock('../../../../plugins/date/utils/formatParse', () => {
  const { padToTwo } = require('../../utils/internal');
  return {
    formatDateType: jest.fn((dateType: DateType, locale: string) => {
      const day = dateType.day ? dateType.day : 1;
      if (locale === 'en-GB' || locale === 'en-AU') {
        return `${padToTwo(day)}/${padToTwo(dateType.month)}/${dateType.year}`;
      } else if (locale === 'en') {
        return `${dateType.month}/${day}/${dateType.year}`;
      } else if (locale === 'hu-HU') {
        return `${dateType.year}. ${padToTwo(dateType.month)}. ${padToTwo(
          day,
        )}.`;
      } else if (locale === 'cs-CZ') {
        return `${day}.${dateType.month}.${dateType.year}`;
      } else if (locale === 'sr-Cyrl-BA') {
        return `${day}.${dateType.month}.${dateType.year}.`;
      }
    }),

    parseDateType: jest.fn((dateString: string, locale: string):
      | DateType
      | undefined => {
      if (locale === 'en-AU' || locale === 'en-GB') {
        const segments = dateString.split('/');
        const day = parseInt(segments[0]);
        const month = parseInt(segments[1]);
        const year = parseInt(segments[2]);

        const dateObj = {
          day,
          month,
          year,
        };
        return dateObj;
      } else if (locale === 'en') {
        const segments = dateString.split('/');
        const month = parseInt(segments[0]);
        const day = parseInt(segments[1]);
        const year = parseInt(segments[2]);

        const dateObj = {
          day,
          month,
          year,
        };
        return dateObj;
      }

      return undefined;
    }),

    dateTypeToDate: jest.fn(
      (date: DateType): Date => {
        const { day, month, year } = date;
        // Range of month is 0-11!
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
        const dateObj = new Date(Date.UTC(year, month - 1, day));
        return dateObj;
      },
    ),
    dateToDateType: jest.fn(
      (date: Date): DateType => {
        const dateObj = {
          day: date.getUTCDate(),
          month: date.getUTCMonth() + 1,
          year: date.getUTCFullYear(),
        };
        return dateObj;
      },
    ),
  };
});

describe('dates', () => {
  describe('isDatePossiblyValid()', () => {
    it('should return false when date has letters in it', () => {
      const date = '1/1/2020a';
      const result = isDatePossiblyValid(date);
      expect(result).toEqual(false);
    });
    it('should return true when date contains slashes', () => {
      const date = '1/1/2020';
      const result = isDatePossiblyValid(date);
      expect(result).toEqual(true);
    });
    it('should return true when date contains dots or spaces', () => {
      const date = '1. 1. 2020';
      const result = isDatePossiblyValid(date);
      expect(result).toEqual(true);
    });
    it('should return true when date contains commas', () => {
      const date = '1,1,2020';
      const result = isDatePossiblyValid(date);
      expect(result).toEqual(true);
    });
    it('should return false when string is empty', () => {
      const date = '';
      const result = isDatePossiblyValid(date);
      expect(result).toEqual(true);
    });
  });

  describe('adjustDate()', () => {
    it('should increment year without incrementing day/month where possible', () => {
      const date: DateType = {
        year: 2020,
        month: 7,
        day: 15,
      };

      const activeSegment: DateSegment = 'year';
      const adjustment = 1;

      const newDateType = adjustDate(date, activeSegment, adjustment);
      expect(newDateType).toEqual({ day: 15, month: 7, year: 2021 });
    });
    it("should roll over day when incrementing month by 1 when day doesn't exist in that month", () => {
      const date: DateType = {
        year: 2020,
        month: 10,
        day: 31,
      };
      const activeSegment: DateSegment = 'month';
      const adjustment = 1;

      const newDateType = adjustDate(date, activeSegment, adjustment);
      expect(newDateType).toEqual({ day: 30, month: 11, year: 2020 });
    });
    it("should roll over day when incrementing year by 1 when day doesn't exist in that year", () => {
      const date: DateType = {
        year: 2020,
        month: 2,
        day: 29,
      };
      const activeSegment: DateSegment = 'year';
      const adjustment = 1;

      const newDateType = adjustDate(date, activeSegment, adjustment);
      expect(newDateType).toEqual({ day: 28, month: 2, year: 2021 });
    });

    it('should reduce day by 1 when decrementing day at start of year', () => {
      const date: DateType = {
        year: 2020,
        month: 1,
        day: 1,
      };
      const activeSegment: DateSegment = 'day';
      const adjustment = -1;

      const newDateType = adjustDate(date, activeSegment, adjustment);
      expect(newDateType).toEqual({ day: 31, month: 12, year: 2019 });
    });
  });

  describe('findDateSegmentByPosition()', () => {
    describe('en', () => {
      const locale = 'en';
      it('should output "day" at left boundary of day', () => {
        const position = 3;
        const output = findDateSegmentByPosition(
          position,
          '12/31/2020',
          locale,
        );
        expect(output).toEqual('day');
      });
      it('should output "day" inside boundary of day', () => {
        const position = 4;
        const output = findDateSegmentByPosition(
          position,
          '11/25/2019',
          locale,
        );
        expect(output).toEqual('day');
      });
      it('should output "day" at right boundary of day', () => {
        const position = 5;
        const output = findDateSegmentByPosition(
          position,
          '11/25/2019',
          locale,
        );
        expect(output).toEqual('day');
      });
    });
    describe('en-AU', () => {
      const locale = 'en-AU';
      it('should output "day" at left boundary of day', () => {
        const position = 0;
        const output = findDateSegmentByPosition(
          position,
          '09/03/2020',
          locale,
        );
        expect(output).toEqual('day');
      });
      it('should output "day" inside boundary of day', () => {
        const position = 1;
        const output = findDateSegmentByPosition(
          position,
          '09/03/2020',
          locale,
        );
        expect(output).toEqual('day');
      });
      it('should output "day" at right boundary of day', () => {
        const position = 2;
        const output = findDateSegmentByPosition(
          position,
          '09/03/2020',
          locale,
        );
        expect(output).toEqual('day');
      });

      it('should output "month" at left boundary of month', () => {
        const position = 3;
        const output = findDateSegmentByPosition(
          position,
          '09/03/2020',
          locale,
        );
        expect(output).toEqual('month');
      });
      it('should output "month" inside boundary of month', () => {
        const position = 4;
        const output = findDateSegmentByPosition(
          position,
          '09/03/2020',
          locale,
        );
        expect(output).toEqual('month');
      });
      it('should output "month" at right boundary of month', () => {
        const position = 5;
        const output = findDateSegmentByPosition(
          position,
          '09/03/2020',
          locale,
        );
        expect(output).toEqual('month');
      });

      it('should output "year" at left boundary of year', () => {
        const position = 6;
        const output = findDateSegmentByPosition(
          position,
          '09/03/2020',
          locale,
        );
        expect(output).toEqual('year');
      });
      it('should output "year" inside boundary of year', () => {
        const position = 7;
        const output = findDateSegmentByPosition(
          position,
          '09/03/2020',
          locale,
        );
        expect(output).toEqual('year');
      });
      it('should output "year" at right boundary of year', () => {
        const position = 10;
        const output = findDateSegmentByPosition(
          position,
          '09/03/2020',
          locale,
        );
        expect(output).toEqual('year');
      });
      it('should output undefined when outside length of date string', () => {
        const position = 11;
        const output = findDateSegmentByPosition(
          position,
          '09/03/2020',
          locale,
        );
        expect(output).toEqual(undefined);
      });
    });
    describe('hu-HU', () => {
      const locale = 'hu-HU';
      // yyyy. mm. dd.
      it('should output "year" at left boundary of year', () => {
        const position = 0;
        const output = findDateSegmentByPosition(
          position,
          '2020. 03. 29.',
          locale,
        );
        expect(output).toEqual('year');
      });
      it('should output "year" at right boundary of year', () => {
        const position = 4;
        const output = findDateSegmentByPosition(
          position,
          '2020. 03. 29.',
          locale,
        );
        expect(output).toEqual('year');
      });
      it('should output "month" in between dot and month digit', () => {
        const position = 5;
        const output = findDateSegmentByPosition(
          position,
          '2020. 03. 29.',
          locale,
        );
        expect(output).toEqual('month');
      });
    });
    describe('edge cases', () => {
      it('should output "day" at right boundary even if two characters away', () => {
        const position = 14;
        const output = findDateSegmentByPosition(
          position,
          '2020. 03. 29. ',
          'hu-HU',
        );
        expect(output).toEqual('day');
      });
    });
  });
  describe('getLocaleDatePlaceholder()', () => {
    it('should output "m/d/yyyy" for en', () => {
      const output = getLocaleDatePlaceholder('en');
      expect(output).toEqual('m/d/yyyy');
    });
    it('should output "dd/mm/yyyy" for en-GB', () => {
      const output = getLocaleDatePlaceholder('en-GB');
      expect(output).toEqual('dd/mm/yyyy');
    });
    it('should output "yyyy. MM. dd." for hu-HU', () => {
      const output = getLocaleDatePlaceholder('hu-HU');
      expect(output).toEqual('yyyy. mm. dd.');
    });
    it('should output "d.m.yyyy" for cs-CZ', () => {
      const output = getLocaleDatePlaceholder('cs-CZ');
      expect(output).toEqual('d.m.yyyy');
    });
    it('should output "d.m.yyyy." for sr-Cyrl-BA', () => {
      const output = getLocaleDatePlaceholder('sr-Cyrl-BA');
      expect(output).toEqual('d.m.yyyy.');
    });
  });
});
