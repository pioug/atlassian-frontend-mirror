import { InjectedIntl, IntlProvider } from 'react-intl';

import {
  isPastDate,
  timestampToString,
  timestampToTaskContext,
  timestampToUTCDate,
} from '../../../utils/date';

const UTCPlus10 = 1592179200000;
const UTCMinus7 = 1592092800000;

describe('@atlaskit/editor-common date utils', () => {
  describe('Unit test date mock', () => {
    describe('Date.now()', () => {
      it('should return 1502841600 seconds', () => {
        const date = Date.now();
        expect(date).toEqual(1502841600 * 1000);
      });
    });
    describe('new Date()', () => {
      it('should create a date object with time of Wed, 16 Aug 2017 00:00:00 GMT', () => {
        const date = new Date();
        expect(date.toUTCString()).toEqual('Wed, 16 Aug 2017 00:00:00 GMT');
      });
    });
  });
  describe('timestampToString', () => {
    describe('when there is no intl', () => {
      it('should format date to ISO', () => {
        const date = Date.parse('2018-06-19');
        expect(timestampToString(date, null)).toEqual('2018-06-19');
      });
    });

    describe('when there is intl', () => {
      it('should format using localization', () => {
        const date = Date.parse('2018-06-19');

        const intlProvider = new IntlProvider({
          locale: 'en',
        });
        const { intl } = intlProvider.getChildContext();
        expect(timestampToString(date, intl)).toEqual('Jun 19, 2018');
      });
    });
  });

  describe('timestampToUTCDate', () => {
    it('should correctly return UTC value of date', () => {
      const date = Date.parse('2018-06-19');
      const obj = timestampToUTCDate(date);
      expect(obj.day).toEqual(19);
      expect(obj.month).toEqual(6);
      expect(obj.year).toEqual(2018);
    });
  });

  describe('isPastDate', () => {
    it('should return true if passed date is before current date', () => {
      // This date is before the mocked date of Wed Aug 16 00:00:00 2017 +0000.
      const date = Date.parse('2016-06-18');
      expect(isPastDate(date)).toEqual(true);
    });

    describe('in different UTC timezones', () => {
      const commonTimestamp = 1592092800000;
      let dateUTCMockFn = jest.spyOn(Date, 'UTC');
      let dateNowMockFn = jest.spyOn(Date, 'now');

      afterEach(() => {
        dateUTCMockFn.mockReset();
        dateNowMockFn.mockReset();
      });

      afterAll(() => {
        dateUTCMockFn.mockRestore();
        dateNowMockFn.mockRestore();
      });

      it('when in UTC -7, the date should NOT be in the past', () => {
        dateUTCMockFn.mockImplementation(() => UTCMinus7);
        dateNowMockFn.mockImplementation(() => UTCMinus7);
        expect(isPastDate(commonTimestamp)).toEqual(false);
      });

      it('when in UTC +10, the date should be in the past', () => {
        dateUTCMockFn.mockImplementation(() => UTCPlus10);
        dateNowMockFn.mockImplementation(() => UTCPlus10);
        expect(isPastDate(commonTimestamp)).toEqual(true);
      });
    });
  });

  describe('#timestampToTaskContext', () => {
    describe('given Date.now is mocked', () => {
      let dateNowMockFn: jest.SpyInstance;
      let dateUTCMockFn: jest.SpyInstance;
      let intl: InjectedIntl;

      beforeEach(() => {
        dateNowMockFn = jest.spyOn(Date, 'now');
        dateUTCMockFn = jest.spyOn(Date, 'UTC');

        const intlProvider = new IntlProvider({
          locale: 'en',
        });
        intl = intlProvider.getChildContext().intl;
      });

      afterEach(() => {
        dateNowMockFn.mockRestore();
        dateUTCMockFn.mockRestore();
      });

      describe('and is not from the same year', () => {
        it('should return the date in MMM DD YYYY us format', () => {
          dateNowMockFn.mockImplementation(() => 1040078526); // 16 December 2002 22:42:06 miliseconds
          const oneYearOldInUTC = Date.UTC(2001, 1, 1).toString();

          expect(timestampToTaskContext(oneYearOldInUTC, intl)).toEqual(
            'Feb 1, 2001',
          );
        });
      });

      describe('and is from the same year', () => {
        it('should return the date in ddd, MMM DD us format', () => {
          dateNowMockFn.mockImplementation(() => 1324075326000); // 16 December 2011 22:42:06
          const oneYearOldInUTC = Date.UTC(2011, 1, 1).toString();

          expect(timestampToTaskContext(oneYearOldInUTC, intl)).toEqual(
            'Tue, Feb 1',
          );
        });
      });

      describe('given the timestamp is in UTC', () => {
        beforeEach(() => {
          dateUTCMockFn.mockImplementation(() => '1323993600000'); // 16 December 2011 00:00:00
          dateNowMockFn.mockImplementation(() => '1323993600000'); // 16 December 2011 00:00:00

          const intlProvider = new IntlProvider({
            locale: 'en',
            initialNow: '1323993600000',
          });
          intl = intlProvider.getChildContext().intl;
        });

        it('should return Yesterday the distance from the current day is -1', () => {
          const yesterdayInUTC = 1323907200000; // 15 December 2011 00:00:00

          expect(timestampToTaskContext(yesterdayInUTC, intl)).toEqual(
            'Yesterday',
          );
        });

        it('should return Today the distance from the current day is 0', () => {
          const todayInUTC = 1323993600000; // 16 December 2011 00:00:00

          expect(timestampToTaskContext(todayInUTC, intl)).toEqual('Today');
        });

        it('should returns Tomorrow the distance from the current day is 1', () => {
          const tomorrowInUTC = 1324080000000; // 17 December 2011 00:00:00
          expect(timestampToTaskContext(tomorrowInUTC, intl)).toEqual(
            'Tomorrow',
          );
        });
      });

      describe('contextual dates in different timezones', () => {
        // Sydney based timestamps
        const timestampJun15 = 1592179200000;
        const timestampJun16 = 1592265600000;

        describe('given dates in UTC -7', () => {
          beforeEach(() => {
            // Sunday June 14, 9:20pm (LA)
            dateNowMockFn.mockImplementation(() => UTCMinus7);
          });

          it('should give `Tomorrow` for UTC -7', () => {
            expect(timestampToTaskContext(timestampJun15, intl)).toEqual(
              'Tomorrow',
            );
          });

          it('should give a date for UTC -7', () => {
            expect(timestampToTaskContext(timestampJun16, intl)).toEqual(
              'Tue, Jun 16',
            );
          });
        });

        describe('given dates in UTC +10', () => {
          beforeEach(() => {
            // Monday June 15, 2:23pm (Sydney)
            dateUTCMockFn.mockImplementation(() => UTCPlus10);
            dateNowMockFn.mockImplementation(() => UTCPlus10);
          });

          it('should give `Today` for UTC +10', () => {
            expect(timestampToTaskContext(timestampJun15, intl)).toEqual(
              'Today',
            );
          });

          it('should give `Tomorrow` for UTC +10', () => {
            expect(timestampToTaskContext(timestampJun16, intl)).toEqual(
              'Tomorrow',
            );
          });
        });
      });
    });
  });
});
