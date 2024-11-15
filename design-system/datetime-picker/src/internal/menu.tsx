/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { type MouseEventHandler } from 'react';

import { css, jsx } from '@emotion/react';
import { isValid, parseISO } from 'date-fns';

import Calendar from '@atlaskit/calendar';
import { Layering } from '@atlaskit/layering';
import { type MenuProps } from '@atlaskit/select';
import { N0, N50A, N60A } from '@atlaskit/theme/colors';
import { layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import FixedLayer from '../internal/fixed-layer';

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

const menuStyles = css({
	zIndex: layers.dialog(),
	backgroundColor: token('elevation.surface.overlay', N0),
	borderRadius: token('border.radius', '3px'),
	boxShadow: token('elevation.shadow.overlay', `0 4px 8px -2px ${N50A}, 0 0 1px ${N60A}`),
	overflow: 'hidden',
});

/**
 * This is the menu used in the select of the date picker.
 */
export const Menu = ({ selectProps, innerProps }: MenuProps<any>) => {
	const { calendarValue, calendarView } = selectProps;
	const { day, month, year } = getValidDate([calendarValue, calendarView]);

	const onMenuMouseDown: MouseEventHandler<HTMLDivElement> = (event) => {
		if (event.button !== 0) {
			return;
		}
		event.stopPropagation();
		event.preventDefault();
	};

	return (
		<Layering isDisabled={false}>
			<FixedLayer
				inputValue={selectProps.inputValue}
				containerRef={selectProps.calendarContainerRef}
				content={
					// The mousedown event is required for a date selection to work when
					// the menu is opened via the calendar button. The reason why is
					// because there is a mousedown event on the menu inside of
					// `react-select` that will stop the calendar select event from
					// firing. This is passed in via the `innerProps`. Therefore, we must
					// pass it in *after* the `innerProps` spread.
					// eslint-disable-next-line jsx-a11y/no-static-element-interactions
					<div css={menuStyles} {...innerProps} onMouseDown={onMenuMouseDown}>
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
					</div>
				}
				testId={selectProps.testId}
			/>
		</Layering>
	);
};
