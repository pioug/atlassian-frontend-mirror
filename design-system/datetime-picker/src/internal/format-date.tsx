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
import { format, parseISO } from 'date-fns';

import { type LocalizationProvider } from '@atlaskit/locale';

import { convertTokens } from './parse-tokens';

import { defaultDateFormat } from './index';

export const formatDate: (
	value: string,
	di: {
		formatDisplayLabel: ((value: string, dateFormat: string) => string) | undefined;
		dateFormat: string | undefined;
		l10n: LocalizationProvider;
	},
) => string = (
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
