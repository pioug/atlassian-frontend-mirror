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
// oxlint-disable-next-line @atlassian/no-restricted-imports
import { isValid, parse } from 'date-fns';

import type { LocalizationProvider } from '@atlaskit/locale/localization-provider';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { defaultDateFormat } from './default-date-format';
import { convertTokens } from './parse-tokens';

/**
 * There are props that can change how the date is parsed.
 * The priority of props used is:
 *   1. `parseInputValue`
 *   2. `dateFormat` (when `platform-dst-dp-parse-date-format` is on)
 *   3. `locale`
 *
 * `dateFormat` only wins when the input actually parses against it, otherwise
 * `locale` parsing is used.
 */
export const parseDate: (
	date: string,
	di: {
		parseInputValue: ((date: string, dateFormat: string) => Date) | undefined;
		dateFormat: string | undefined;
		l10n: LocalizationProvider;
	},
) => Date = (
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

	if (dateFormat && fg('platform-dst-dp-parse-date-format')) {
		// date-fns uses the reference year to resolve two-digit years and fill
		// omitted years. Use the current local date rather than the Unix epoch.
		const referenceDate = fg('platform-dst-dp-current-reference-date') ? new Date() : new Date(0);
		const parsed = parse(date, convertTokens(dateFormat), referenceDate);
		// `dateFormat` is a display format, so typed input does not always match
		// it. Locale parsing stays as the fallback so those entries still work.
		if (isValid(parsed)) {
			return parsed;
		}
	}

	return l10n.parseDate(date);
};
