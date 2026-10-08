import { useMemo } from 'react';

import { createLocalizationProvider } from '@atlaskit/locale/localization-provider';

import type { WeekDay } from '../../types';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default function useLocale({
	locale,
	weekStartDay,
}: {
	locale: string;
	weekStartDay?: WeekDay;
}): {
	monthsLong: string[];
	daysShort: string[];
	daysLong: string[];
	weekStartDay: WeekDay;
} {
	const l10n = useMemo(() => createLocalizationProvider(locale), [locale]);
	const resolvedWeekStartDay = useMemo(
		() => weekStartDay ?? l10n.getFirstDayOfWeek(),
		[l10n, weekStartDay],
	);

	const monthsLong = useMemo(() => l10n.getMonthsLong(), [l10n]);
	const daysShort = useMemo(
		() => l10n.getDaysShort(resolvedWeekStartDay),
		[l10n, resolvedWeekStartDay],
	);
	const daysLong = useMemo(
		() => l10n.getDaysLong(resolvedWeekStartDay),
		[l10n, resolvedWeekStartDay],
	);

	return {
		monthsLong,
		daysShort,
		daysLong,
		weekStartDay: resolvedWeekStartDay,
	};
}
