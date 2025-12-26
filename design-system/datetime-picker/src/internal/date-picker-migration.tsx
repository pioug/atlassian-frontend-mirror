/**
 * Everything in this file is to smooth out the migration of the new date picker
 * (https://product-fabric.atlassian.net/browse/DSP-20682). When that ticket is
 * complete, all of these functions will ilkely be merged back into the date
 * picker. Please do not pre-optimize and put these back into the date picker
 * unless you are working on the DTP Refresh and you have a good reason to do
 * so, thank you!
 *
 * All variables within the `di` objects are dependency injections. They should
 * be read from within the component at the end of the day. But because we are
 * extracting them, we have to inject them in every place manually. When we
 * re-introduce them to the components, we can likely remove the `di` variables
 * and instead use internal variables.
 *
 * If component _only_ has injected variables, it is fully internal and was
 * broken out to be it's own function.
 */

import { format, lastDayOfMonth, parseISO } from 'date-fns';

import { type LocalizationProvider } from '@atlaskit/locale';

import { convertTokens } from './parse-tokens';

import { defaultDateFormat, padToTwo, placeholderDatetime } from './index';

export const isDateDisabled = (date: string, di: { disabled: string[] }) => {
	const { disabled } = di;
	return disabled.indexOf(date) > -1;
};

export const getParsedISO = (di: { iso: string }): string => {
	const { iso } = di;
	const [year, month, date] = iso.split('-');

	let newIso = iso;

	const parsedDate = parseInt(date, 10);
	const parsedMonth = parseInt(month, 10);
	const parsedYear = parseInt(year, 10);

	const lastDayInMonth = lastDayOfMonth(
		new Date(
			parsedYear,
			parsedMonth - 1, // This needs to be -1, because the Date constructor expects an index of the given month
		),
	).getDate();

	if (lastDayInMonth < parsedDate) {
		newIso = `${parsedYear}-${padToTwo(parsedMonth)}-${padToTwo(lastDayInMonth)}`;
	} else {
		newIso = `${parsedYear}-${padToTwo(parsedMonth)}-${padToTwo(parsedDate)}`;
	}

	return newIso;
};

/**
 * There are two props that can change how the date is parsed.
 * The priority of props used is:
 *   1. `parseInputValue`
 *   2. `locale`
 */
export const parseDate = (
	date: string,
	di: {
		parseInputValue: ((date: string, dateFormat: string) => Date) | undefined;
		dateFormat: string | undefined;
		l10n: LocalizationProvider;
	},
) => {
	const { parseInputValue, dateFormat, l10n } = di;
	if (parseInputValue) {
		return parseInputValue(date, dateFormat || defaultDateFormat);
	}

	return l10n.parseDate(date);
};

/**
 * There are multiple props that can change how the date is formatted.
 * The priority of props used is:
 *   1. `formatDisplayLabel`
 *   2. `dateFormat`
 *   3. `locale`
 */
export const formatDate = (
	value: string,
	di: {
		formatDisplayLabel: ((value: string, dateFormat: string) => string) | undefined;
		dateFormat: string | undefined;
		l10n: LocalizationProvider;
	},
): string => {
	const { formatDisplayLabel, dateFormat, l10n } = di;
	if (formatDisplayLabel) {
		return formatDisplayLabel(value, dateFormat || defaultDateFormat);
	}

	const date = parseISO(value);

	return dateFormat ? format(date, convertTokens(dateFormat)) : l10n.formatDate(date);
};

export const getPlaceholder = (di: {
	placeholder: string | undefined;
	l10n: LocalizationProvider;
}): string => {
	const { placeholder, l10n } = di;
	return placeholder || l10n.formatDate(placeholderDatetime);
};
