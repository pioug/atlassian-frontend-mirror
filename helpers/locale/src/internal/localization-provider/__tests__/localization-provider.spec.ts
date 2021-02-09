jest.mock('../toFormattedParts');
jest.mock('../../date-parser');
import {
  createLocalizationProvider,
  LocalizationProvider,
} from '../localization-provider';
import { toFormattedParts } from '../toFormattedParts';
import { createDateParser } from '../../date-parser';

expect.extend({
  toBeDateWithYear: (received: Date, year: number) => {
    const message = () => `expected ${received} to have year ${year}`;
    try {
      if (received.getFullYear() !== year) {
        return { pass: false, message };
      }
    } catch ({ message }) {
      return { pass: false, message };
    }
    return { pass: true, message };
  },
});

const origDateTimeFormat = Intl.DateTimeFormat;
const mockIntlDateTimeFormat = (mockedReturn: any) => {
  Intl.DateTimeFormat = (jest.fn(
    () => mockedReturn,
  ) as unknown) as typeof Intl.DateTimeFormat;
};

describe('LocalizationProvider', () => {
  afterEach(() => {
    Intl.DateTimeFormat = origDateTimeFormat;
  });

  it('formats date with Intl.DateTimeFormat.format', () => {
    const date = new Date('2020-08-15');
    const expectedResult = 'some-formatted-date';
    const mockedIntl = {
      format: jest.fn().mockReturnValue(expectedResult),
    };
    mockIntlDateTimeFormat(mockedIntl);
    const provider = createLocalizationProvider('en');
    const result = provider.formatDate(date);

    expect(Intl.DateTimeFormat).toBeCalledWith('en');
    expect(mockedIntl.format).toBeCalledWith(date);
    expect(result).toBe(expectedResult);
  });

  it('formats time with Intl.DateTimeFormat.format', () => {
    const date = new Date('2020-08-15');
    const formatterOptions = {
      hour: 'numeric',
      minute: 'numeric',
    };
    const expectedResult = 'some-formatted-time';
    const mockedIntl = {
      format: jest.fn().mockReturnValue(expectedResult),
    };
    mockIntlDateTimeFormat(mockedIntl);

    const provider = createLocalizationProvider('en');
    const result = provider.formatTime(date);

    expect(Intl.DateTimeFormat).toBeCalledWith(
      'en',
      expect.objectContaining(formatterOptions),
    );
    expect(mockedIntl.format).toBeCalledWith(date);
    expect(result).toBe(expectedResult);
  });

  it.each<
    [string, Parameters<LocalizationProvider['getDaysShort']>[0], Array<string>]
  >([
    ['en-AU', , ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']],
    ['en-AU', 0, ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']],
    ['en-AU', 1, ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']],
    ['en-AU', 2, ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon']],
    ['en-AU', 6, ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']],

    // TODO: Test below locales after we upgrade to node 14
    // More Info: https://nodejs.org/api/intl.html
    // ['ko-KR', undefined, ['토', '일', '월', '화', '수', '목', '금']],
    // ['nl-NL', undefined, ['za', 'zo', 'ma', 'di', 'wo', 'do', 'vr']],
  ])(
    'returns all weekdays in short format',
    (locale, weekStartDay, expected) => {
      const provider = createLocalizationProvider(locale);
      const result = provider.getDaysShort(weekStartDay);

      expect(result).toEqual(expected);
    },
  );

  // TODO: test getMonthsLong

  it('parses date using DateParser', () => {
    const expectedResult = new Date(123456);
    const mockedDateParser = jest.fn().mockReturnValue(expectedResult);
    const input = 'some-string-date';
    (createDateParser as jest.Mock).mockReturnValue(mockedDateParser);

    const provider = createLocalizationProvider('en');
    const result = provider.parseDate(input);

    expect(createDateParser).toBeCalledWith('en');
    expect(mockedDateParser).toBeCalledWith(input);
    expect(result).toBe(expectedResult);
  });

  it('format to parts with Intl.DateTimeFormat.formatToParts', () => {
    const mockedIntl = { formatToParts: jest.fn() };
    mockIntlDateTimeFormat(mockedIntl);
    const date = new Date('2020-08-15');
    const formatterOptions = { month: 'long', year: 'numeric' };
    const expectedResult = { month: 'August', year: '2020' };
    (toFormattedParts as jest.Mock).mockReturnValue(expectedResult);

    const provider = createLocalizationProvider('en', formatterOptions);
    const result = provider.formatToParts(date);

    expect(Intl.DateTimeFormat).toBeCalledWith('en', formatterOptions);
    expect(mockedIntl.formatToParts).toBeCalled();
    expect(toFormattedParts).toBeCalled();
    expect(result).toBe(expectedResult);
  });

  it('internally picks year 2020 to resolve the date parts [Safari bug - See code comments]', () => {
    const mockedIntl = { formatToParts: jest.fn() };
    mockIntlDateTimeFormat(mockedIntl);
    const date = new Date('2000-03-15');
    const expectedResult = { month: 'August', year: '2020' };
    (toFormattedParts as jest.Mock).mockReturnValue(expectedResult);

    const formatterOptions = { month: 'long', year: 'numeric' };
    const provider = createLocalizationProvider('en', formatterOptions);
    provider.formatToParts(date);

    expect(mockedIntl.formatToParts).toBeCalledWith(
      expect.toBeDateWithYear(2020),
    );
  });
});
