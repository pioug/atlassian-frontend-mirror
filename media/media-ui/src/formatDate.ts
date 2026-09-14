import { createLocalizationProvider } from '@atlaskit/locale/localization-provider';

import { partsFormatter } from './partsFormatter';

export const formatterOptions: Intl.DateTimeFormatOptions = {
	day: '2-digit',
	month: 'short',
	year: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
	hour12: true,
};

export type PartsFormatterOptions = {
	day: string;
	month: string;
	year: string;
	hour: string;
	minute: string;
	dayPeriod?: string;
};

export const formatDate = (timestamp: number, locale: string = 'en'): string => {
	const l10n = createLocalizationProvider(locale, formatterOptions);
	return partsFormatter(l10n.formatToParts(timestamp));
};

/* eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * @deprecated Use `import { partsFormatter } from '@atlaskit/media-ui/partsFormatter'` instead.
 */
export { partsFormatter } from './partsFormatter';
