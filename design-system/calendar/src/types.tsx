import { type CSSProperties } from 'react';

import {
  type UIAnalyticsEvent,
  type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';

import type { ArrowKeys, DateObj, ISODate } from './internal/types';

export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type TabIndex = -1 | 0;

export type ChangeEvent = {
  iso: ISODate;
  type: 'left' | 'up' | 'right' | 'down' | 'prev' | 'next';
} & DateObj;

export type SelectEvent = {
  iso: ISODate;
} & DateObj;

export interface CalendarProps extends WithAnalyticsEventsProps {
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
  defaultPreviouslySelected?: Array<string>;
  /**
   * Sets the default value for `selected`.
   */
  defaultSelected?: Array<string>;
  /**
   * Sets the default value for `year`.
   */
  defaultYear?: number;
  /**
   * Takes an array of dates as string in the format 'YYYY-MM-DD'. All dates provided are greyed out and not selectable.
   */
  disabled?: Array<string>;
  /**
   * A filter function that takes a date string in the format 'YYYY-MM-DD' and returns true if that date should be disabled.
   */
  disabledDateFilter?: (date: string) => boolean;
  /**
   * The latest enabled date. All dates in the future after this date will be disabled.
   */
  maxDate?: string;
  /**
   * The earliest enabled date. All dates in the past before this date will be disabled.
   */
  minDate?: string;
  /**
   * The number of the month (from 1 to 12) which the calendar should be on.
   */
  month?: number;
  /**
   * The aria-label attribute associated with the next month arrow, to describe it to assistive technology.
   */
  nextMonthLabel?: string;
  /**
   * Function which is called when the calendar is no longer focused.
   */
  onBlur?: React.FocusEventHandler;
  /**
   * Called when the calendar is navigated. This can be triggered by the keyboard, or by clicking the navigational buttons.
   * The 'interface' property indicates the the direction the calendar was navigated whereas the 'iso' property is a string of the format YYYY-MM-DD.
   */
  onChange?: (event: ChangeEvent, analyticsEvent: UIAnalyticsEvent) => void;
  /**
   * Called when the calendar receives focus. This could be called from a mouse event on the container, or by tabbing into it.
   */
  onFocus?: React.FocusEventHandler;
  /**
   * Function called when a day is clicked on. Calls with an object that has
   * a day, month and year property as numbers, representing the date just clicked.
   * It also has an 'iso' property, which is a string of the selected date in the
   * format YYYY-MM-DD.
   */
  onSelect?: (event: SelectEvent, analyticsEvent: UIAnalyticsEvent) => void;
  /**
   * Takes an array of dates as string in the format 'YYYY-MM-DD'. All dates
   * provided are given a background color.
   */
  previouslySelected?: Array<string>;
  /**
   * The aria-label attribute associated with the previous month arrow, to describe it to assistive technology.
   */
  previousMonthLabel?: string;
  /**
   * Takes an array of dates as string in the format 'YYYY-MM-DD'. All dates
   * provided are given a background color.
   */
  selected?: Array<string>;
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
   * Additional information to be included in the `context` of analytics events.
   */
  analyticsContext?: Record<string, any>;
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
  weekStartDay?: WeekDay;
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
   * Class name to apply to the calendar.
   */
  className?: string;
  /**
   * Style customization to apply to the calendar.
   */
  style?: CSSProperties;
  /**
   * @internal An additional ref which exposes Calendar's internal api's. We kept this for
   * backward compatibility. PLEASE DO NOT USE THIS.
   */
  calendarRef?: React.Ref<CalendarRef>;
  /**
   * Indicates if the calendar can be focused by keyboard or only
   * programmatically. Defaults to "0".
   */
  tabIndex?: TabIndex;
}

export interface CalendarRef {
  navigate: (type: ArrowKeys) => void;
}
