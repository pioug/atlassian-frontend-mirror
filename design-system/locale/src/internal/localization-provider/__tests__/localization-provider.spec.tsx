jest.mock('../to-formatted-parts');
jest.mock('../../date-parser');
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { createDateParser } from '../../date-parser';
import { createLocalizationProvider, type LocalizationProvider } from '../localization-provider';
import { toFormattedParts } from '../to-formatted-parts';

type getDaysCase = [string, Parameters<LocalizationProvider['getDaysShort']>[0], Array<string>];

expect.extend({
	// @ts-expect-error
	toBeDateWithYear: (received: Date, year: number) => {
		const message = () => `expected ${received} to have year ${year}`;
		try {
			if (received.getFullYear() !== year) {
				return { pass: false, message };
			}
		} catch (error) {
			return { pass: false, message: (error as Error).message };
		}
		return { pass: true, message };
	},
});

const origDateTimeFormat = Intl.DateTimeFormat;
const origLocale = Intl.Locale;
const writableIntl = Intl as unknown as { Locale: typeof Intl.Locale };
const mockIntlDateTimeFormat = (mockedReturn: any) => {
	Intl.DateTimeFormat = jest.fn(() => mockedReturn) as unknown as typeof Intl.DateTimeFormat;
};
const mockIntlLocale = (mockedReturn: any) => {
	writableIntl.Locale = jest.fn(() => mockedReturn) as unknown as typeof Intl.Locale;
};

describe('LocalizationProvider', () => {
	afterEach(() => {
		Intl.DateTimeFormat = origDateTimeFormat;
		writableIntl.Locale = origLocale;
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

		expect(Intl.DateTimeFormat).toHaveBeenCalledWith('en');
		expect(mockedIntl.format).toHaveBeenCalledWith(date);
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

		expect(Intl.DateTimeFormat).toHaveBeenCalledWith(
			'en',
			expect.objectContaining(formatterOptions),
		);
		expect(mockedIntl.format).toHaveBeenCalledWith(date);
		expect(result).toBe(expectedResult);
	});

	it.each([
		['en-AU', , ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']],
		['en-AU', 0, ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']],
		['en-AU', 1, ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']],
		['en-AU', 2, ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon']],
		['en-AU', 6, ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']],

		// TODO: Test below locales after we upgrade to node 14
		// More Info: https://nodejs.org/api/intl.html
		// ['ko-KR', undefined, ['토', '일', '월', '화', '수', '목', '금']],
		// ['nl-NL', undefined, ['za', 'zo', 'ma', 'di', 'wo', 'do', 'vr']],
	] as getDaysCase[])('returns all weekdays in short format', (locale, weekStartDay, expected) => {
		const provider = createLocalizationProvider(locale);
		const result = provider.getDaysShort(weekStartDay);

		expect(result).toEqual(expected);
	});

	it.each([
		['en-AU', , ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']],
		['en-AU', 0, ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']],
		['en-AU', 1, ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']],
		['en-AU', 2, ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday']],
		['en-AU', 6, ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']],
	] as getDaysCase[])('returns all weekdays in long format', (locale, weekStartDay, expected) => {
		const provider = createLocalizationProvider(locale);
		const result = provider.getDaysLong(weekStartDay);

		expect(result).toEqual(expected);
	});

	// TODO: test getMonthsLong

	it('parses date using DateParser', () => {
		const expectedResult = new Date(123456);
		const mockedDateParser = jest.fn().mockReturnValue(expectedResult);
		const input = 'some-string-date';
		(createDateParser as jest.Mock).mockReturnValue(mockedDateParser);

		const provider = createLocalizationProvider('en');
		const result = provider.parseDate(input);

		expect(createDateParser).toHaveBeenCalledWith('en');
		expect(mockedDateParser).toHaveBeenCalledWith(input, {});
		expect(result).toBe(expectedResult);
	});

	it('format to parts with Intl.DateTimeFormat.formatToParts', () => {
		const mockedIntl = { formatToParts: jest.fn() };
		mockIntlDateTimeFormat(mockedIntl);
		const date = new Date('2020-08-15');
		const formatterOptions = { month: 'long', year: 'numeric' };
		const expectedResult = { month: 'August', year: '2020' };
		(toFormattedParts as jest.Mock).mockReturnValue(expectedResult);
		// @ts-ignore non-urgent @fixme TypeScript 4.2.4 upgrade
		const provider = createLocalizationProvider('en', formatterOptions);
		const result = provider.formatToParts(date);

		expect(Intl.DateTimeFormat).toHaveBeenCalledWith('en', formatterOptions);
		expect(mockedIntl.formatToParts).toHaveBeenCalled();
		expect(toFormattedParts).toHaveBeenCalled();
		expect(result).toBe(expectedResult);
	});

	it('internally picks year 2020 to resolve the date parts [Safari bug - See code comments]', () => {
		const mockedIntl = { formatToParts: jest.fn() };
		mockIntlDateTimeFormat(mockedIntl);
		const date = new Date('2000-03-15');
		const expectedResult = { month: 'August', year: '2020' };
		(toFormattedParts as jest.Mock).mockReturnValue(expectedResult);

		const formatterOptions = { month: 'long', year: 'numeric' };
		// @ts-ignore non-urgent @fixme TypeScript 4.2.4 upgrade
		const provider = createLocalizationProvider('en', formatterOptions);
		provider.formatToParts(date);

		expect(mockedIntl.formatToParts).toHaveBeenCalledWith(expect.toBeDateWithYear(2020));
	});

	// smoke test for Locale to have the method we need, see https://github.com/microsoft/TypeScript/issues/61713#issuecomment-5569377698
	it('should make a Locale that has getWeekInfo (smoke test)', () => {
		const locale = new Intl.Locale('en');
		const weekInfo = locale.getWeekInfo();
		expect(weekInfo).toBeDefined();
	});

	it.each([
		// Intl.Locale.getWeekInfo() uses ISO weekdays (1 = Monday … 7 = Sunday).
		// getFirstDayOfWeek maps that onto JS weekdays (0 = Sunday … 6 = Saturday).
		[1, 1],
		[7, 0],
	])(
		'should return first day of week using `Intl.Locale.getWeekInfo`',
		(isoFirstDay, expectedWeekStartDay) => {
			passGate('platform-dst-locale-week-start-day');
			const mockedLocale = {
				getWeekInfo: jest.fn().mockReturnValue({ firstDay: isoFirstDay }),
			};
			mockIntlLocale(mockedLocale);

			const provider = createLocalizationProvider('en');
			const result = provider.getFirstDayOfWeek();

			expect(Intl.Locale).toHaveBeenCalledWith('en');
			expect(mockedLocale.getWeekInfo).toHaveBeenCalled();
			expect(result).toBe(expectedWeekStartDay);
		},
	);

	it('should not construct Intl.Locale until getFirstDayOfWeek is called', () => {
		const mockedLocale = {
			getWeekInfo: jest.fn().mockReturnValue({ firstDay: 1 }),
		};
		mockIntlLocale(mockedLocale);

		createLocalizationProvider('en');
		expect(Intl.Locale).not.toHaveBeenCalled();
	});

	it('should reuse the same Intl.Locale across getFirstDayOfWeek calls', () => {
		passGate('platform-dst-locale-week-start-day');
		const mockedLocale = {
			getWeekInfo: jest.fn().mockReturnValue({ firstDay: 1 }),
		};
		mockIntlLocale(mockedLocale);

		const provider = createLocalizationProvider('en');
		provider.getFirstDayOfWeek();
		provider.getFirstDayOfWeek();

		expect(Intl.Locale).toHaveBeenCalledTimes(1);
		expect(mockedLocale.getWeekInfo).toHaveBeenCalledTimes(2);
	});

	it('should return Sunday when `platform-dst-locale-week-start-day` is off', () => {
		failGate('platform-dst-locale-week-start-day');
		const mockedLocale = {
			getWeekInfo: jest.fn().mockReturnValue({ firstDay: 1 }),
		};
		mockIntlLocale(mockedLocale);

		const provider = createLocalizationProvider('en');
		expect(provider.getFirstDayOfWeek()).toBe(0);
		expect(Intl.Locale).not.toHaveBeenCalled();
		expect(mockedLocale.getWeekInfo).not.toHaveBeenCalled();
	});
});
