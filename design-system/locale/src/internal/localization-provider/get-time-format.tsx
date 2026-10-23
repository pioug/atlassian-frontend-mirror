import { normalizeLocale } from '../common';

type HourCycle = 'h11' | 'h12' | 'h23' | 'h24' | undefined;

export interface TimeFormat {
	hourCycle: HourCycle;
	dayPeriods: {
		am: string;
		pm: string;
	};
	digits: Record<string, string>;
	timeParts?: Intl.DateTimeFormatPart[];
}

export const getTimeFormat = (locale: string): TimeFormat => {
	const normalizedLocale = normalizeLocale(locale);
	const formatter = new Intl.DateTimeFormat(normalizedLocale, {
		hour: 'numeric',
		minute: 'numeric',
	});
	const dayPeriod = (hour: number) =>
		formatter.formatToParts(new Date(2020, 0, 1, hour)).find((part) => part.type === 'dayPeriod')
			?.value || '';
	const localizedDigits = new Intl.NumberFormat(normalizedLocale, { useGrouping: false }).format(
		9876543210,
	);

	return {
		hourCycle: (formatter.resolvedOptions() as { hourCycle?: HourCycle }).hourCycle,
		dayPeriods: {
			am: dayPeriod(9),
			pm: dayPeriod(21),
		},
		digits: Object.fromEntries(
			Array.from(localizedDigits).map((digit, index) => [digit, String(9 - index)]),
		),
		timeParts: formatter.formatToParts(new Date(2020, 0, 1, 21, 32)),
	};
};
