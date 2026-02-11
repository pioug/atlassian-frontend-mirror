/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, memo, useState } from 'react';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import { cssMap, jsx } from '@atlaskit/css';
import noop from '@atlaskit/ds-lib/noop';
import { useId } from '@atlaskit/ds-lib/use-id';
import { Box, Stack } from '@atlaskit/primitives/compiled';

import Header from './internal/components/header';
import WeekDaysComponent from './internal/components/week-days';
import WeekHeaderComponent from './internal/components/week-header';
import { blankStringArray } from './internal/constants';
import useControlledDateState from './internal/hooks/use-controlled-date-state';
import useFocusing from './internal/hooks/use-focusing';
import useGetWeeks from './internal/hooks/use-get-weeks';
import useHandleDateChange from './internal/hooks/use-handle-date-change';
import useHandleDateSelect from './internal/hooks/use-handle-date-select';
import useLocale from './internal/hooks/use-locale';
import type { CalendarProps } from './types';

const styles = cssMap({
	box: {
		display: 'inline-block',
		userSelect: 'none',
	},
});

const analyticsAttributes = {
	componentName: 'calendar',
	packageName: process.env._PACKAGE_NAME_ as string,
	packageVersion: process.env._PACKAGE_VERSION_ as string,
};

const InnerCalendar: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<CalendarProps> & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, CalendarProps>(function Calendar(
	{
		day,
		defaultDay = 0,
		defaultMonth = 0,
		defaultPreviouslySelected = blankStringArray,
		defaultSelected = blankStringArray,
		defaultYear = 0,
		disabled,
		disabledDateFilter,
		minDate,
		maxDate,
		month,
		nextMonthLabel,
		onBlur = noop,
		onChange = noop,
		onFocus = noop,
		onSelect = noop,
		previouslySelected,
		previousMonthLabel,
		selected,
		shouldSetFocusOnCurrentDay = false,
		today,
		locale = 'en-US',
		year,
		analyticsContext,
		weekStartDay = 0,
		testId,
		className,
		style,
		tabIndex = 0,
	},
	ref,
) {
	const {
		day: [dayValue, setDayValue],
		month: [monthValue, setMonthValue],
		year: [yearValue, setYearValue],
		today: [todayValue],
		selected: [selectedValue, setSelectedValue],
		previous: [previouslySelectedValue, setPreviouslySelectedValue],
	} = useControlledDateState({
		day,
		defaultDay,
		month,
		defaultMonth,
		year,
		defaultYear,
		today,
		selected,
		defaultSelected,
		previouslySelected,
		defaultPreviouslySelected,
	});
	const [shouldSetFocus, setShouldSetFocus] = useState(false);

	const onChangeWithAnalytics = usePlatformLeafEventHandler({
		fn: onChange,
		action: 'changed',
		analyticsData: analyticsContext,
		...analyticsAttributes,
	});

	const {
		navigate,
		handleClickNextMonth,
		handleClickNextYear,
		handleClickPrevMonth,
		handleClickPrevYear,
	} = useHandleDateChange({
		day: [dayValue, setDayValue],
		month: [monthValue, setMonthValue],
		year: [yearValue, setYearValue],
		shouldSetFocus: [shouldSetFocus, setShouldSetFocus],
		onChange: onChangeWithAnalytics,
	});

	const onSelectWithAnalytics = usePlatformLeafEventHandler({
		fn: onSelect,
		action: 'selected',
		analyticsData: analyticsContext,
		...analyticsAttributes,
	});

	const { handleClickDay, handleContainerKeyDown } = useHandleDateSelect({
		day: [dayValue, setDayValue],
		month: [monthValue, setMonthValue],
		year: [yearValue, setYearValue],
		selected: [selectedValue, setSelectedValue],
		previous: [, setPreviouslySelectedValue],
		onSelect: onSelectWithAnalytics,
		navigate,
	});

	const { handleContainerBlur, handleContainerFocus } = useFocusing({
		onFocus,
		onBlur,
	});

	const { monthsLong, daysShort, daysLong } = useLocale({
		locale,
		weekStartDay,
	});

	const weeks = useGetWeeks({
		day: dayValue,
		month: monthValue,
		year: yearValue,
		today: todayValue,
		selected: selectedValue,
		previouslySelected: previouslySelectedValue,
		disabled,
		disabledDateFilter,
		minDate,
		maxDate,
		daysLong,
		weekStartDay,
	});

	const getNextMonthHeading = () => {
		// Next month is (currentMonth - 1) + 1, or just currentMonth in this
		// instance.
		const nextMonth = monthValue % 12;
		const showNextYear = monthValue === 12;
		return `${monthsLong[nextMonth]} ${showNextYear ? yearValue + 1 : yearValue}`;
	};

	const getNextYearHeading = () => {
		// Months are held in Date object as zero-indexed
		const thisMonth = (monthValue - 1) % 12;
		const nextYear = yearValue + 1;
		return `${monthsLong[thisMonth]} ${nextYear}`;
	};

	const getPreviousMonthHeading = () => {
		// Previous month is (monthValue - 1) - 1. Need to add 12 so the modulo
		// works as expected and stays positive.
		const previousMonth = (monthValue + 12 - 2) % 12;
		const showPreviousYear = monthValue === 1;
		return `${monthsLong[previousMonth]} ${showPreviousYear ? yearValue - 1 : yearValue}`;
	};

	const getPreviousYearHeading = () => {
		// Months are held in Date object as zero-indexed
		const thisMonth = (monthValue - 1) % 12;
		const previousYear = yearValue - 1;
		return `${monthsLong[thisMonth]} ${previousYear}`;
	};

	const headerId = useId();

	return (
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={style}
			onBlur={handleContainerBlur}
			onFocus={handleContainerFocus}
			data-testid={testId && `${testId}--container`}
			ref={ref}
		>
			<Box
				xcss={styles.box}
				padding="space.200"
				aria-label="calendar"
				testId={testId && `${testId}--calendar`}
			>
				<Stack space="space.150">
					<Header
						// The month number needs to be translated to index in the month
						// name array e.g. 1 (January) -> 0
						monthLongTitle={monthsLong[monthValue - 1]}
						year={yearValue}
						nextMonthLabel={nextMonthLabel}
						previousMonthLabel={previousMonthLabel}
						nextMonthHeading={getNextMonthHeading()}
						nextYearHeading={getNextYearHeading()}
						previousMonthHeading={getPreviousMonthHeading()}
						previousYearHeading={getPreviousYearHeading()}
						handleClickNextMonth={handleClickNextMonth}
						handleClickNextYear={handleClickNextYear}
						handleClickPrevMonth={handleClickPrevMonth}
						handleClickPrevYear={handleClickPrevYear}
						headerId={headerId}
						tabIndex={tabIndex}
						testId={testId}
					/>
					<Box
						role="grid"
						onKeyDown={handleContainerKeyDown}
						aria-labelledby={headerId}
						testId={testId && `${testId}--calendar-dates`}
					>
						<WeekHeaderComponent daysShort={daysShort} testId={testId} />
						<WeekDaysComponent
							weeks={weeks}
							handleClickDay={handleClickDay}
							monthsLong={monthsLong}
							shouldSetFocus={shouldSetFocus || shouldSetFocusOnCurrentDay}
							tabIndex={tabIndex}
							testId={testId}
						/>
					</Box>
				</Stack>
			</Box>
		</div>
	);
});

/**
 * __Calendar__
 *
 * A calendar is used for date selection.
 *
 * - [Examples](https://atlassian.design/components/calendar/examples)
 * - [Code](https://atlassian.design/components/calendar/code)
 * - [Usage](https://atlassian.design/components/calendar/usage)
 */
const Calendar: import("react").MemoExoticComponent<import("react").ForwardRefExoticComponent<Omit<CalendarProps, "ref"> & import("react").RefAttributes<HTMLDivElement>>> = memo(
	forwardRef<HTMLDivElement, CalendarProps>(function Calendar(props, ref) {
		return <InnerCalendar {...props} ref={ref} />;
	}),
);

Calendar.displayName = 'Calendar';

export default Calendar;
