/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { Fragment, type MouseEventHandler } from 'react';

import { cssMap, jsx } from '@compiled/react';
import { isValid, parseISO } from 'date-fns';

import Calendar from '@atlaskit/calendar/calendar';
import type { MenuProps, OptionType } from '@atlaskit/select/types';
import { token } from '@atlaskit/tokens';

/**
 * @param isos A series of ISO dates.
 * @returns The last valid date within the array of ISO strings.
 */
function getValidDate(isos: string[]): {
	day?: number;
	month?: number;
	year?: number;
} {
	return isos.reduce((acc, iso) => {
		const date: Date = parseISO(iso);
		return isValid(date)
			? {
					day: date.getDate(),
					month: date.getMonth() + 1,
					year: date.getFullYear(),
				}
			: acc;
	}, {});
}

const styles = cssMap({
	root: {
		width: 'max-content',
		backgroundColor: token('elevation.surface.overlay'),
		boxShadow: token('elevation.shadow.overlay'),
		marginBlockStart: token('space.100'),
		marginBlockEnd: token('space.100'),
		borderRadius: token('radius.large'),
	},
});

/**
 * Top-layer version of the date picker menu.
 *
 * The surrounding react-select menu portal owns the native popover and
 * positioning. This component only supplies the calendar dialog content.
 *
 * Gated behind the `platform-dst-top-layer` feature flag.
 */
export const MenuTopLayer: ({ selectProps, innerProps }: MenuProps<OptionType>) => JSX.Element = ({
	selectProps,
	innerProps,
}: MenuProps<OptionType>) => {
	const { calendarValue, calendarView, menuInnerWrapper: MenuInnerWrapper } = selectProps;
	const { day, month, year } = getValidDate([calendarValue, calendarView]);

	const onMenuMouseDown: MouseEventHandler<HTMLDivElement> = (event) => {
		if (event.button !== 0) {
			return;
		}
		event.stopPropagation();
		event.preventDefault();
	};

	const Wrapper = typeof MenuInnerWrapper === 'function' ? MenuInnerWrapper : Fragment;

	return (
		/*
		 * `role="presentation"` (a.k.a. `role="none"`) tells AT to ignore
		 * this wrapper. It has a non-user mousedown handler whose only
		 * job is to swallow the bubbled click that would otherwise close
		 * the menu, so it must stay in the layout box without becoming
		 * a focusable / announced control.
		 */
		<div {...innerProps} onMouseDown={onMenuMouseDown} role="presentation" css={styles.root}>
			<Wrapper>
				<Calendar
					day={day}
					month={month}
					year={year}
					disabled={selectProps.calendarDisabled}
					disabledDateFilter={selectProps.calendarDisabledDateFilter}
					minDate={selectProps.calendarMinDate}
					maxDate={selectProps.calendarMaxDate}
					nextMonthLabel={selectProps.nextMonthLabel}
					onChange={selectProps.onCalendarChange}
					onSelect={selectProps.onCalendarSelect}
					previousMonthLabel={selectProps.previousMonthLabel}
					ref={selectProps.calendarRef}
					selected={[selectProps.calendarValue]}
					shouldSetFocusOnCurrentDay={selectProps.shouldSetFocusOnCurrentDay}
					locale={selectProps.calendarLocale}
					testId={selectProps.testId && `${selectProps.testId}--calendar`}
					weekStartDay={selectProps.calendarWeekStartDay}
				/>
			</Wrapper>
		</div>
	);
};
