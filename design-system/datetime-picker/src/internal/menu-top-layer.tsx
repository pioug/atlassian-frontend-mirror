/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { Fragment, type MouseEventHandler, useRef } from 'react';

import { jsx } from '@compiled/react';
import { isValid, parseISO } from 'date-fns';

import Calendar from '@atlaskit/calendar';
import { type MenuProps, type OptionType } from '@atlaskit/select';
import { slideAndFade } from '@atlaskit/top-layer/animations';
import { fromLegacyPlacement } from '@atlaskit/top-layer/placement-map';
import { Popover } from '@atlaskit/top-layer/popover';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';

const animation = slideAndFade();

/**
 * Bottom-start placement: calendar appears below and aligned to the
 * start edge of the trigger (the select input).
 */
const popupPlacement = fromLegacyPlacement({ legacy: 'bottom-start' });

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

/**
 * Top-layer version of the date picker menu.
 *
 * Uses `Popover` + `useAnchorPosition` so the calendar renders in the
 * browser's top layer via the native Popover API and is positioned via
 * CSS Anchor Positioning. This avoids overflow clipping, z-index wars,
 * and portal-based layering.
 *
 * Gated behind the `platform-dst-top-layer` feature flag.
 */
export const MenuTopLayer: ({ selectProps, innerProps }: MenuProps<OptionType>) => JSX.Element = ({
	selectProps,
	innerProps,
}: MenuProps<OptionType>) => {
	const { calendarValue, calendarView, menuInnerWrapper: MenuInnerWrapper } = selectProps;
	const { day, month, year } = getValidDate([calendarValue, calendarView]);

	// The select's container element is the anchor for the popup.
	const triggerRef = useRef<HTMLElement | null>(selectProps.calendarContainerRef ?? null);
	triggerRef.current = selectProps.calendarContainerRef ?? null;

	const popoverRef = useRef<HTMLDivElement>(null);

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: popupPlacement,
	});

	const onMenuMouseDown: MouseEventHandler<HTMLDivElement> = (event) => {
		if (event.button !== 0) {
			return;
		}
		event.stopPropagation();
		event.preventDefault();
	};

	const Wrapper = typeof MenuInnerWrapper === 'function' ? MenuInnerWrapper : Fragment;

	return (
		<Popover
			ref={popoverRef}
			role="dialog"
			label="calendar"
			isOpen
			// `mode="manual"` opts out of native popover light-dismiss.
			// react-select / DateTimePicker already own outside-click and
			// Esc handling. Without this, the same click that opens the
			// menu (which targets the select input outside the popover)
			// also bubbles to the browser's auto-dismiss handler and
			// immediately closes the popover.
			mode="manual"
			placement={popupPlacement}
			animate={animation}
			testId={selectProps.testId && `${selectProps.testId}--popup`}
		>
			<PopoverSurface>
				{/*
				 * `role="presentation"` (a.k.a. `role="none"`) tells AT to ignore
				 * this wrapper. It has a non-user mousedown handler whose only
				 * job is to swallow the bubbled click that would otherwise close
				 * the menu, so it must stay in the layout box without becoming
				 * a focusable / announced control.
				 */}
				<div {...innerProps} role="presentation" onMouseDown={onMenuMouseDown}>
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
			</PopoverSurface>
		</Popover>
	);
};
