import { useCallback, useEffect, useRef } from 'react';

import type { ChangeEvent } from '../../types';
import { daysPerWeek, monthsPerYear } from '../constants';
import type { ArrowKeys } from '../types';
import dateToString from '../utils/date-to-string';
import getDaysInMonth from '../utils/get-days-in-month';

const getNextMonth = (monthValue: number, yearValue: number) => {
	let month = monthValue;
	let year = yearValue;

	if (month === monthsPerYear) {
		month = 1;
		year += 1;
	} else {
		month += 1;
	}

	return { month, year };
};

const getPrevMonth = (monthValue: number, yearValue: number) => {
	let month = monthValue;
	let year = yearValue;

	if (month === 1) {
		month = monthsPerYear;
		year -= 1;
	} else {
		month -= 1;
	}

	return { month, year };
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default function useHandleDateChange({
	day: [dayValue, setDayValue],
	month: [monthValue, setMonthValue],
	year: [yearValue, setYearValue],
	shouldSetFocus: [_shouldSetFocus, setShouldSetFocus],
	onChange,
}: {
	day: readonly [number, (newValue: number) => void];
	month: readonly [number, (newValue: number) => void];
	year: readonly [number, (newValue: number) => void];
	shouldSetFocus: readonly [boolean, (newValue: boolean) => void];
	onChange: (event: ChangeEvent) => void;
}) {
	const dateRef = useRef({
		day: dayValue,
		month: monthValue,
		year: yearValue,
	});

	useEffect(() => {
		dateRef.current = {
			day: dayValue,
			month: monthValue,
			year: yearValue,
		};
	}, [dayValue, monthValue, yearValue]);

	const triggerOnChange = useCallback(
		({ year, month, day, type }: Omit<ChangeEvent, 'iso'>) => {
			const iso = dateToString({ year, month, day });
			const isFocusableType = ['up', 'down', 'left', 'right'].includes(type);

			onChange({ day, month, year, iso, type });
			setDayValue(day);
			setMonthValue(month);
			setYearValue(year);
			setShouldSetFocus(isFocusableType);
		},
		[onChange, setDayValue, setMonthValue, setYearValue, setShouldSetFocus],
	);

	const navigate = useCallback(
		(type: ArrowKeys): void => {
			const { day, month, year } = dateRef.current;

			if (type === 'down') {
				const next = day + daysPerWeek;
				const daysInMonth = getDaysInMonth(year, month - 1);

				if (next > daysInMonth) {
					const { month: nextMonth, year: nextYear } = getNextMonth(month, year);
					triggerOnChange({
						year: nextYear,
						month: nextMonth,
						day: next - daysInMonth,
						type,
					});
				} else {
					triggerOnChange({
						year,
						month,
						day: next,
						type,
					});
				}
			} else if (type === 'left') {
				const prev = day - 1;

				if (prev < 1) {
					const { month: prevMonth, year: prevYear } = getPrevMonth(month, year);
					const prevDay = getDaysInMonth(prevYear, prevMonth - 1);
					triggerOnChange({
						year: prevYear,
						month: prevMonth,
						day: prevDay,
						type,
					});
				} else {
					triggerOnChange({
						year,
						month,
						day: prev,
						type,
					});
				}
			} else if (type === 'right') {
				const next = day + 1;
				const daysInMonth = getDaysInMonth(year, month - 1);

				if (next > daysInMonth) {
					const { month: nextMonth, year: nextYear } = getNextMonth(month, year);
					triggerOnChange({
						year: nextYear,
						month: nextMonth,
						day: 1,
						type,
					});
				} else {
					triggerOnChange({
						year,
						month,
						day: next,
						type,
					});
				}
			} else if (type === 'up') {
				const prev = day - daysPerWeek;

				if (prev < 1) {
					const { month: prevMonth, year: prevYear } = getPrevMonth(month, year);
					const prevDay = getDaysInMonth(prevYear, prevMonth - 1) + prev;
					triggerOnChange({
						year: prevYear,
						month: prevMonth,
						day: prevDay,
						type,
					});
				} else {
					triggerOnChange({
						year,
						month,
						day: prev,
						type,
					});
				}
			}
		},
		[triggerOnChange],
	);

	const handleClickNextMonth = useCallback((): void => {
		const { day, month, year } = {
			...dateRef.current,
			...getNextMonth(dateRef.current.month, dateRef.current.year),
		};

		triggerOnChange({ day, month, year, type: 'nextMonth' });
	}, [triggerOnChange]);

	const handleClickNextYear = useCallback((): void => {
		const { day, month, year } = dateRef.current;

		triggerOnChange({ day, month, year: year + 1, type: 'nextYear' });
	}, [triggerOnChange]);

	const handleClickPrevMonth = useCallback((): void => {
		const { day, month, year } = {
			...dateRef.current,
			...getPrevMonth(dateRef.current.month, dateRef.current.year),
		};

		triggerOnChange({ day, month, year, type: 'prevMonth' });
	}, [triggerOnChange]);

	const handleClickPrevYear = useCallback((): void => {
		const { day, month, year } = dateRef.current;

		triggerOnChange({ day, month, year: year - 1, type: 'prevYear' });
	}, [triggerOnChange]);

	return {
		navigate,
		handleClickNextMonth,
		handleClickNextYear,
		handleClickPrevMonth,
		handleClickPrevYear,
	};
}
