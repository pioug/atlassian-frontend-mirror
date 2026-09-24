// oxlint-disable-next-line @atlassian/no-restricted-imports
import { format, isValid, parseISO } from 'date-fns';

import { createLocalizationProvider } from '@atlaskit/locale/localization-provider';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { parseDate } from '../../parse-date';

describe('parseDate reference date', () => {
	const l10n = createLocalizationProvider('en-US');

	beforeEach(() => {
		jest.useFakeTimers();
		jest.setSystemTime(new Date(2026, 8, 16, 12));
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it.each([
		[false, '1926-02-01'],
		[true, '2026-02-01'],
	])('parses two-digit years with reference date gate %s', (referenceDateGate, expected) => {
		(referenceDateGate ? passGate : failGate)('platform-dst-dp-current-reference-date');

		const parsed = parseDate('01.02.26', {
			parseInputValue: undefined,
			dateFormat: 'DD.MM.YY',
			l10n,
		});

		expect(format(parsed, 'yyyy-MM-dd')).toBe(expected);
	});

	describe('current reference date enabled', () => {
		beforeEach(() => {
			passGate('platform-dst-dp-current-reference-date');
		});

		it.each([
			[2026, '01.02.03', 'DD.MM.YY', '2003-02-01'],
			[2026, '09/Jul/18', 'DD/MMM/YY', '2018-07-09'],
			[2026, '01.02.26', 'DD.MM.YY', '2026-02-01'],
			// date-fns resolves YY in the window from 50 years ago to 49 years ahead.
			[2026, '01.02.75', 'DD.MM.YY', '2075-02-01'],
			[2026, '01.02.76', 'DD.MM.YY', '1976-02-01'],
			[2026, '01.02.99', 'DD.MM.YY', '1999-02-01'],
			[2026, '01.02.00', 'DD.MM.YY', '2000-02-01'],
			// The reference year is read at parse time, rather than fixed at module load.
			[2090, '01.02.26', 'DD.MM.YY', '2126-02-01'],
			[2026, 'June/08', 'MMMM/DD', '2026-06-08'],
			[2028, '29.02', 'DD.MM', '2028-02-29'],
			[2026, '01.02.1926', 'DD.MM.YYYY', '1926-02-01'],
		])('in %s parses %s with %s as %s', (year, input, dateFormat, expected) => {
			jest.setSystemTime(new Date(year, 8, 16, 12));

			const parsed = parseDate(input, { parseInputValue: undefined, dateFormat, l10n });

			expect(format(parsed, 'yyyy-MM-dd')).toBe(expected);
		});

		it('rejects February 29 when the omitted year is not a leap year', () => {
			const parsed = parseDate('29.02', {
				parseInputValue: undefined,
				dateFormat: 'DD.MM',
				l10n,
			});

			expect(isValid(parsed)).toBe(false);
		});

		it('preserves locale fallback for inputs that do not match the format', () => {
			const parsed = parseDate('6/8/2026', {
				parseInputValue: undefined,
				dateFormat: 'MMM D, YYYY',
				l10n,
			});

			expect(format(parsed, 'yyyy-MM-dd')).toBe('2026-06-08');
		});
	});

	it('preserves custom parser precedence and its original format argument', () => {
		const parseInputValue = jest.fn(() => parseISO('1926-02-01'));

		const parsed = parseDate('01.02.26', {
			parseInputValue,
			dateFormat: 'DD.MM.YY',
			l10n,
		});

		expect(parseInputValue).toHaveBeenCalledWith('01.02.26', 'DD.MM.YY');
		expect(format(parsed, 'yyyy-MM-dd')).toBe('1926-02-01');
	});
});
