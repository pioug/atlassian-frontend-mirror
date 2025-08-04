/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - CalendarProps
 *
 * @codegen <<SignedSource::9b36c80a1a940e859a1f96608cb912f0>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/calendar/__generated__/index.partial.tsx <<SignedSource::54621340adc2da9cc1951f16867d00f8>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type React from 'react';


// Serialized type
type PlatformCalendarProps = {
  /**
	 * The number of the day currently focused. Places border around the date. Enter `0` to highlight no date.
	 */
	day?: number;
  /**
	 * Sets the default value for `day`.
	 */
	defaultDay?: number;
  /**
	 * Sets the default value for `month`.
	 */
	defaultMonth?: number;
  /**
	 * Sets the default value for `previouslySelected`.
	 */
	defaultPreviouslySelected?: string[];
  /**
	 * Sets the default value for `selected`.
	 */
	defaultSelected?: string[];
  /**
	 * Sets the default value for `year`.
	 */
	defaultYear?: number;
  /**
	 * Takes an array of dates as string in the format 'YYYY-MM-DD'. All dates provided are greyed out and not selectable.
	 */
	disabled?: string[];
  /**
	 * The latest enabled date. All dates in the future after this date will be disabled.
	 */
	maxDate?: string;
  /**
	 * The earliest enabled date. All dates in the past before this date will be disabled.
	 */
	minDate?: string;
  /**
	 * The aria-label attribute associated with the next month arrow, to describe it to assistive technology.
	 */
	nextMonthLabel?: string;
  /**
	 * Function which is called when the calendar is no longer focused.
	 */
	onBlur?: React.FocusEventHandler<Element>;
  /**
	 * Called when the calendar is navigated. This can be triggered by the keyboard, or by clicking the navigational buttons.
	 * The 'interface' property indicates the the direction the calendar was navigated whereas the 'iso' property is a string of the format YYYY-MM-DD.
	 */
	onChange?: (event: { iso: string, type: 'left' | 'up' | 'right' | 'down' | 'prevMonth' | 'prevYear' | 'nextMonth' | 'nextYear', day: number, month: number, year: number }, analyticsEvent: any) => void;
  /**
	 * Called when the calendar receives focus. This could be called from a mouse event on the container, or by tabbing into it.
	 */
	onFocus?: React.FocusEventHandler<Element>;
  /**
	 * Function called when a day is clicked on. Calls with an object that has
	 * a day, month and year property as numbers, representing the date just clicked.
	 * It also has an 'iso' property, which is a string of the selected date in the
	 * format YYYY-MM-DD.
	 */
	onSelect?: (event: { iso: string, day: number, month: number, year: number }, analyticsEvent: any) => void;
  /**
	 * Takes an array of dates as string in the format 'YYYY-MM-DD'. All dates
	 * provided are given a background color.
	 */
	previouslySelected?: string[];
  /**
	 * The aria-label attribute associated with the previous month arrow, to describe it to assistive technology.
	 */
	previousMonthLabel?: string;
  /**
	 * Takes an array of dates as string in the format 'YYYY-MM-DD'. All dates
	 * provided are given a background color.
	 */
	selected?: string[];
  /**
	 * Value of current day, as a string in the format 'YYYY-MM-DD'.
	 */
	today?: string;
  /**
	 * Year to display the calendar for.
	 */
	year?: number;
  /**
	 * BCP 47 language tag (e.g. `ja-JP`) that ensures dates are in the official format for the locale.
	 */
	locale?: string;
  /**
	 * Start day of the week for the calendar. The mapping between numbers and days of the week is as follows:
	 * - `0` Sunday (default value)
	 * - `1` Monday
	 * - `2` Tuesday
	 * - `3` Wednesday
	 * - `4` Thursday
	 * - `5` Friday
	 * - `6` Saturday
	 */
	weekStartDay?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /**
	 * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
	 *
	 * - testId--container - Outermost container containing everything inside calendar
	 * - testId--month - Container containing all available days for the month
	 * - testId--previous-month - Button to show next month
	 * - testId--next-month - Button to show previous month
	 * - testId--current-month-year - Text containing the current month and year
	 * - testId--selected-day - The currently selected day (may be missing if a date isn’t selected)
	 */
	testId?: string;
  /**
	 * Indicates if the calendar can be focused by keyboard or only
	 * programmatically. Defaults to "0".
	 */
	tabIndex?: 0 | -1;
};

export type CalendarProps = Pick<
  PlatformCalendarProps,
  'day' | 'defaultDay' | 'defaultMonth' | 'defaultYear' | 'defaultPreviouslySelected' | 'defaultSelected' | 'disabled' | 'maxDate' | 'minDate' | 'nextMonthLabel' | 'onBlur' | 'onChange' | 'onFocus' | 'onSelect' | 'previouslySelected' | 'previousMonthLabel' | 'selected' | 'today' | 'year' | 'locale' | 'testId' | 'weekStartDay' | 'tabIndex'
>;

/**
 * An interactive calendar for date selection experiences.
 *
 * @see [Calendar](https://developer.atlassian.com/platform/forge/ui-kit/components/calendar/) in UI Kit documentation for more information
 */
export type TCalendar<T> = (props: CalendarProps) => T;