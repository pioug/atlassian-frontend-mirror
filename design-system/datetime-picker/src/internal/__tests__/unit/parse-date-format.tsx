// oxlint-disable-next-line @atlassian/no-restricted-imports
import { format, isValid, parseISO } from 'date-fns';

import { createLocalizationProvider } from '@atlaskit/locale/localization-provider';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { parseDate } from '../../parse-date';
import { convertTokens } from '../../parse-tokens';

describe('parseDate', () => {
	const l10n = createLocalizationProvider('en-US');
	const iso = '2018-06-08';
	const dateFormat = 'MMMM/DD/YYYY';
	const displayLabel = format(parseISO(iso), convertTokens(dateFormat));

	it('uses dateFormat with date-fns when the gate is on and dateFormat is set', () => {
		passGate('platform-dst-dp-parse-date-format');

		const parsed = parseDate(displayLabel, {
			parseInputValue: undefined,
			dateFormat,
			l10n,
		});

		expect(isValid(parsed)).toBe(true);
		expect(format(parsed, 'yyyy-MM-dd')).toBe(iso);
	});

	it.each([
		['en-GB', 'DD/MM/YYYY'],
		['de-DE', 'DD.MM.YYYY'],
		['fi-FI', 'D.M.YYYY'],
		['it-IT', 'D/M/YYYY'],
		['nl-NL', 'D-M-YYYY'],
		['tr-TR', 'DD.MM.YYYY'],
		['ja-JP', 'YYYY/MM/DD'],
		['ja-JP', 'YYYY年MM月DD日'],
		['ko-KR', 'YYYY. M. D.'],
		['hu-HU', 'YYYY. MM. DD.'],
		['sv-SE', 'YYYY-MM-DD'],
	])('roundtrips %s with dateFormat %s to the same ISO day', (locale, configuredFormat) => {
		passGate('platform-dst-dp-parse-date-format');

		const localeL10n = createLocalizationProvider(locale);
		const formatted = format(parseISO(iso), convertTokens(configuredFormat));

		const parsed = parseDate(formatted, {
			parseInputValue: undefined,
			dateFormat: configuredFormat,
			l10n: localeL10n,
		});

		expect(isValid(parsed)).toBe(true);
		expect(format(parsed, 'yyyy-MM-dd')).toBe(iso);
	});

	it('falls back to locale when the input does not match dateFormat', () => {
		passGate('platform-dst-dp-parse-date-format');

		// A display-only format such as "MMM D, YYYY" is not what users type
		const parsed = parseDate('6/8/2018', {
			parseInputValue: undefined,
			dateFormat: 'MMM D, YYYY',
			l10n,
		});

		expect(isValid(parsed)).toBe(true);
		expect(format(parsed, 'yyyy-MM-dd')).toBe(iso);
	});

	it('falls back to locale for a partially matching input', () => {
		passGate('platform-dst-dp-parse-date-format');

		const parsed = parseDate('06-08-2018', {
			parseInputValue: undefined,
			dateFormat: 'MMMM/DD/YYYY',
			l10n,
		});

		expect(isValid(parsed)).toBe(true);
		expect(format(parsed, 'yyyy-MM-dd')).toBe(iso);
	});

	it('falls back to locale when dateFormat is not set', () => {
		const parsed = parseDate('6/8/2018', {
			parseInputValue: undefined,
			dateFormat: undefined,
			l10n,
		});

		expect(isValid(parsed)).toBe(true);
		expect(format(parsed, 'yyyy-MM-dd')).toBe(iso);
	});

	it('prefers parseInputValue over dateFormat', () => {
		const customIso = '2020-01-15';
		const parseInputValue = () => parseISO(customIso);

		const parsed = parseDate(displayLabel, {
			parseInputValue,
			dateFormat,
			l10n,
		});

		expect(format(parsed, 'yyyy-MM-dd')).toBe(customIso);
	});

	it('uses locale even with dateFormat when the gate is off', () => {
		failGate('platform-dst-dp-parse-date-format');

		const parsed = parseDate(displayLabel, {
			parseInputValue: undefined,
			dateFormat,
			l10n,
		});

		// Locale numeric parser cannot parse "June/08/2018"
		expect(isValid(parsed)).toBe(false);
	});
});
