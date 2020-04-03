import {
  timestampToTaskContext,
  timestampToString,
  timestampToUTCDate,
  isPastDate,
} from '../../../utils/date';
import { IntlProvider, InjectedIntl } from 'react-intl';

describe('@atlaskit/editor-common date utils', () => {
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
      const date = Date.parse('2018-06-18');
      expect(isPastDate(date)).toEqual(true);
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
    });
  });
});
