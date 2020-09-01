import React from 'react';
import { injectIntl } from 'react-intl';
import { createLocalizationProvider } from '@atlaskit/locale';

export type FormattedDateProps = { timestamp: number };

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

type WithIntlProps = {
  intl?: { locale?: string };
};

export const FormattedDate = injectIntl(
  ({ timestamp, intl }: FormattedDateProps & WithIntlProps) => {
    const { locale = 'en' } = intl || { locale: 'en' };
    const l10n = createLocalizationProvider(locale, formatterOptions);
    const result = partsFormatter(l10n.formatToParts(timestamp));
    return <>{result}</>;
  },
);
