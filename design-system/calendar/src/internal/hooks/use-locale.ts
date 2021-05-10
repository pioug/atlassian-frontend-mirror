import { useMemo } from 'react';

import { createLocalizationProvider } from '@atlaskit/locale';

import type { WeekDay } from '../../types';

export default function useLocale({
  locale,
  weekStartDay,
}: {
  locale: string;
  weekStartDay: WeekDay;
}) {
  const l10n = useMemo(() => createLocalizationProvider(locale), [locale]);

  const monthsLong = useMemo(() => l10n.getMonthsLong(), [l10n]);
  const daysShort = useMemo(() => l10n.getDaysShort(weekStartDay), [
    l10n,
    weekStartDay,
  ]);

  return {
    monthsLong,
    daysShort,
  };
}
