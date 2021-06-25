import { createLocalizationProvider } from '@atlaskit/locale';

export const formatterOptions = {
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

export const partsFormatter = ({
  day,
  month,
  year,
  hour,
  minute,
  dayPeriod = '',
}: PartsFormatterOptions) => {
  const formattedDayPeriod = dayPeriod.replace(/\./g, '').replace(/\s/g, '');
  return `${day} ${month} ${year}, ${hour}:${minute} ${formattedDayPeriod}`;
};

export const formatDate = (timestamp: number, locale: string = 'en') => {
  const l10n = createLocalizationProvider(locale, formatterOptions);
  return partsFormatter(l10n.formatToParts(timestamp));
};
