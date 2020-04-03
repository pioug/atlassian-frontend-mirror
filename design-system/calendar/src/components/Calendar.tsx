import {
  createLocalizationProvider,
  LocalizationProvider,
} from '@atlaskit/locale';
import { Calendar as CalendarBase } from 'calendar-base';
import pick from 'lodash.pick';
import React, { Component, KeyboardEvent } from 'react';
import { uid } from 'react-uid';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../version.json';
import { dateToString } from '../util';
import DateComponent from './Date';
import Heading from './Heading';
import {
  Announcer,
  CalendarTable,
  CalendarTbody,
  CalendarTh,
  CalendarThead,
  Wrapper,
} from '../styled/Calendar';

import { ChangeEvent, SelectEvent, DateObj, ArrowKeys } from '../types';

const arrowKeys: Record<string, ArrowKeys> = {
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
};
const daysPerWeek = 7;
const monthsPerYear = 12;

export interface CalendarProps extends WithAnalyticsEventsProps {
  /** The number of the day currently focused. Places border around the date. 0 highlights no date. */
  day?: number;
  /** Default for `day`. */
  defaultDay: number;
  /** Default for `disabled`. */
  defaultDisabled: Array<string>;
  /** Default for `month`. */
  defaultMonth?: number;
  /** Default for `previouslySelected`. */
  defaultPreviouslySelected: Array<string>;
  /** Default for `selected`. */
  defaultSelected: Array<string>;
  /** Default for `year`. */
  defaultYear?: number;
  /** Takes an array of dates as string in the format 'YYYY-MM-DD'. All dates provided are greyed out.
   This does not prevent these dates being selected. */
  disabled?: Array<string>;
  /** Props to apply to the container. **/
  innerProps: Object;
  /** The number of the month (from 1 to 12) which the calendar should be on. */
  month?: number;
  /** Function which is called when the calendar is no longer focused. */
  onBlur: React.FocusEventHandler;
  /** Called when the calendar is navigated. This can be triggered by the keyboard, or by clicking the navigational buttons.
   The 'interface' property indicates the the direction the calendar was navigated whereas the 'iso' property is a string of the format YYYY-MM-DD. */
  onChange: (event: ChangeEvent) => void;
  /** Called when the calendar receives focus. This could be from a mouse event on the container by tabbing into it. */
  onFocus: React.FocusEventHandler;
  /** Function called when a day is clicked on. Calls with an object that has
  a day, month and week property as numbers, representing the date just clicked.
  It also has an 'iso' property, which is a string of the selected date in the
  format YYYY-MM-DD. */
  onSelect: (event: SelectEvent) => void;
  /** Takes an array of dates as string in the format 'YYYY-MM-DD'. All dates
   provided are given a background color. */
  previouslySelected?: Array<string>;
  /** Takes an array of dates as string in the format 'YYYY-MM-DD'. All dates
   provided are given a background color. */
  selected?: Array<string>;
  /** Value of current day, as a string in the format 'YYYY-MM-DD'. */
  today?: string;
  /** Year to display the calendar for. */
  year?: number;
  locale: string;
  /**
   * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
   *
   * testId--month - Container containing all available days for the month
   * testId--previous-month - Button to show next month
   * testId--next-month - Button to show previous month
   * testId--current-month-year - Text containing the current month and year
   * testId--selected-day - The currently selected day (may be missing if a date isn’t selected)
   * */
  testId?: string;
}

interface State {
  day: number;
  disabled: Array<string>;
  month: number;
  previouslySelected: Array<string>;
  selected: Array<string>;
  today: string;
  year: number;
  l10n: LocalizationProvider;
}

interface Week {
  key: string;
  components: React.ReactNode[];
}

interface Date {
  day: number;
  month: number;
  year: number;
  weekDay: number;
  selected: boolean;
  siblingMonth: boolean;
  weekNumber: number;
}

function getUniqueId(prefix: string) {
  return `${prefix}-${uid({ id: prefix })}`;
}

function padToTwo(number: number) {
  return number <= 99 ? `0${number}`.slice(-2) : `${number}`;
}

class Calendar extends Component<CalendarProps, State> {
  calendar: any;

  container: HTMLElement | null = null;

  static defaultProps = {
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    onSelect: () => {},
    innerProps: {},
    defaultDay: 0,
    defaultDisabled: [],
    defaultSelected: [],
    defaultPreviouslySelected: [],
    locale: 'en-US',
  };

  constructor(props: CalendarProps) {
    super(props);
    const now = new Date();
    const thisDay = now.getDate();
    const thisMonth = now.getMonth() + 1;
    const thisYear = now.getFullYear();
    this.state = {
      day: this.props.defaultDay || thisDay,
      disabled: this.props.defaultDisabled,
      selected: this.props.defaultSelected,
      month: this.props.defaultMonth || thisMonth,
      previouslySelected: this.props.defaultPreviouslySelected,
      year: this.props.defaultYear || thisYear,
      today:
        this.props.today ||
        `${thisYear}-${padToTwo(thisMonth)}-${padToTwo(thisDay)}`,
      l10n: createLocalizationProvider(this.props.locale),
    };
    this.calendar = new CalendarBase({
      siblingMonths: true,
      weekNumbers: true,
    });
  }

  componentWillReceiveProps(nextProps: CalendarProps): void {
    if (this.props.locale !== nextProps.locale) {
      this.setState({ l10n: createLocalizationProvider(nextProps.locale) });
    }
  }

  // All state needs to be accessed via this function so that the state is mapped from props
  // correctly to allow controlled/uncontrolled usage.
  getState = (): State => {
    return {
      ...this.state,
      ...pick(this.props, [
        'day',
        'disabled',
        'selected',
        'month',
        'previouslySelected',
        'year',
        'today',
      ]),
    };
  };

  getNextMonth() {
    let { month, year } = this.getState();

    if (month === monthsPerYear) {
      month = 1;
      year += 1;
    } else {
      month += 1;
    }

    return { month, year };
  }

  getPrevMonth() {
    let { month, year } = this.getState();

    if (month === 1) {
      month = monthsPerYear;
      year -= 1;
    } else {
      month -= 1;
    }

    return { month, year };
  }

  handleContainerKeyDown = (e: KeyboardEvent) => {
    const { key } = e;
    const arrowKey = arrowKeys[key];

    if (key === 'Enter' || key === ' ') {
      const {
        day: selectDay,
        month: selectMonth,
        year: selectYear,
      } = this.getState();
      e.preventDefault();
      this.triggerOnSelect({
        day: selectDay,
        year: selectYear,
        month: selectMonth,
      });
    } else if (arrowKey) {
      e.preventDefault();
      this.navigate(arrowKey);
    }
  };

  handleClickDay = ({ year, month, day }: DateObj) => {
    this.triggerOnSelect({ year, month, day });
  };

  handleClickNext = () => {
    const { day, month, year } = {
      ...this.getState(),
      ...this.getNextMonth(),
    };
    this.triggerOnChange({ day, month, year, type: 'next' });
  };

  handleClickPrev = () => {
    const { day, month, year } = {
      ...this.getState(),
      ...this.getPrevMonth(),
    };
    this.triggerOnChange({ day, month, year, type: 'prev' });
  };

  handleContainerBlur = (event: React.FocusEvent) => {
    this.setState({ day: 0 });
    this.props.onBlur(event);
  };

  handleContainerFocus = (event: React.FocusEvent) => {
    this.setState({ day: this.getState().day || 1 });
    this.props.onFocus(event);
  };

  focus() {
    if (this.container) {
      this.container.focus();
    }
  }

  navigate(type: ArrowKeys) {
    const { day, month, year } = this.getState();

    if (type === 'down') {
      const next = day + daysPerWeek;
      const daysInMonth = CalendarBase.daysInMonth(year, month - 1);

      if (next > daysInMonth) {
        const { month: nextMonth, year: nextYear } = this.getNextMonth();
        this.triggerOnChange({
          year: nextYear,
          month: nextMonth,
          day: next - daysInMonth,
          type,
        });
      } else {
        this.triggerOnChange({ year, month, day: next, type });
      }
    } else if (type === 'left') {
      const prev = day - 1;

      if (prev < 1) {
        const { month: prevMonth, year: prevYear } = this.getPrevMonth();
        const prevDay = CalendarBase.daysInMonth(prevYear, prevMonth - 1);
        this.triggerOnChange({
          year: prevYear,
          month: prevMonth,
          day: prevDay,
          type,
        });
      } else {
        this.triggerOnChange({ year, month, day: prev, type });
      }
    } else if (type === 'right') {
      const next = day + 1;
      const daysInMonth = CalendarBase.daysInMonth(year, month - 1);

      if (next > daysInMonth) {
        const { month: nextMonth, year: nextYear } = this.getNextMonth();
        this.triggerOnChange({
          year: nextYear,
          month: nextMonth,
          day: 1,
          type,
        });
      } else {
        this.triggerOnChange({ year, month, day: next, type });
      }
    } else if (type === 'up') {
      const prev = day - daysPerWeek;

      if (prev < 1) {
        const { month: prevMonth, year: prevYear } = this.getPrevMonth();
        const prevDay =
          CalendarBase.daysInMonth(prevYear, prevMonth - 1) + prev;
        this.triggerOnChange({
          year: prevYear,
          month: prevMonth,
          day: prevDay,
          type,
        });
      } else {
        this.triggerOnChange({ year, month, day: prev, type });
      }
    }
  }

  refContainer = (e: HTMLElement | null) => {
    this.container = e;
  };

  triggerOnChange = ({ year, month, day, type }: ChangeEvent) => {
    const iso = dateToString({ year, month, day });
    this.props.onChange({ day, month, year, iso, type });
    this.setState({
      day,
      month,
      year,
    });
  };

  triggerOnSelect = ({ year, month, day }: Omit<SelectEvent, 'iso'>) => {
    const iso = dateToString({ year, month, day });
    this.props.onSelect({ day, month, year, iso });
    this.setState({
      previouslySelected: this.getState().selected,
      selected: [iso],
    });
  };

  getCalendarWeeks = (mappedState: State) => {
    const {
      day,
      year,
      month,
      disabled,
      previouslySelected,
      selected,
      today,
    } = mappedState;
    const { testId } = this.props;
    const calendar = this.calendar.getCalendar(year, month - 1);
    const weeks: Week[] = [];
    const shouldDisplaySixthWeek = calendar.length % 6;

    // Some months jump between 5 and 6 weeks to display. In some cases 4 (Feb
    // with the 1st on a Monday etc). This ensures the UI doesn't jump around by
    // catering to always showing 6 weeks.
    if (shouldDisplaySixthWeek) {
      const lastDayIsSibling = calendar[calendar.length - 1].siblingMonth;
      const sliceStart = lastDayIsSibling ? daysPerWeek : 0;

      calendar.push(
        ...this.calendar
          .getCalendar(year, month)
          .slice(sliceStart, sliceStart + daysPerWeek)
          .map((date: Date) => ({ ...date, siblingMonth: true })),
      );
    }

    calendar.forEach((date: Date) => {
      const dateAsString = dateToString(date, { fixMonth: true });

      let week;

      if (date.weekDay === 0) {
        week = { key: dateAsString, components: [] };
        weeks.push(week);
      } else {
        week = weeks[weeks.length - 1];
      }

      const isDisabled = disabled.indexOf(dateAsString) > -1;
      const isFocused = day === date.day && !date.siblingMonth;
      const isPreviouslySelected =
        !isDisabled && previouslySelected.indexOf(dateAsString) > -1;
      const isSelected = !isDisabled && selected.indexOf(dateAsString) > -1;
      const isSiblingMonth = date.siblingMonth;
      const isToday = today === dateAsString;

      week.components.push(
        <DateComponent
          disabled={isDisabled}
          focused={isFocused}
          isToday={isToday}
          key={dateAsString}
          month={date.month + 1}
          onClick={this.handleClickDay}
          previouslySelected={isPreviouslySelected}
          selected={isSelected}
          sibling={isSiblingMonth}
          year={date.year}
          testId={testId}
        >
          {date.day}
        </DateComponent>,
      );
    });

    return weeks;
  };

  render() {
    const mappedState = this.getState();
    const { l10n } = mappedState;
    const { innerProps, testId } = this.props;

    const announceId = getUniqueId('announce');

    return (
      <div
        {...innerProps}
        onBlur={this.handleContainerBlur}
        onFocus={this.handleContainerFocus}
        onKeyDown={this.handleContainerKeyDown}
        role="presentation"
      >
        <Announcer id={announceId} aria-live="assertive" aria-relevant="text">
          {new Date(
            mappedState.year,
            mappedState.month,
            mappedState.day,
          ).toString()}
        </Announcer>
        <Wrapper
          aria-describedby={announceId}
          aria-label="calendar"
          innerRef={this.refContainer}
          role="grid"
          tabIndex={0}
        >
          <Heading
            // The month number needs to be translated to index in the month
            // name array e.g. 1 (January) -> 0
            monthLongTitle={l10n.getMonthsLong()[mappedState.month - 1]}
            year={mappedState.year}
            handleClickNext={this.handleClickNext}
            handleClickPrev={this.handleClickPrev}
            testId={testId}
          />
          <CalendarTable role="presentation">
            <CalendarThead>
              <tr>
                {l10n.getDaysShort().map(shortDay => (
                  <CalendarTh key={shortDay}>{shortDay}</CalendarTh>
                ))}
              </tr>
            </CalendarThead>
            <CalendarTbody data-testid={testId && `${testId}--month`}>
              {this.getCalendarWeeks(mappedState).map(week => (
                <tr key={week.key}>{week.components}</tr>
              ))}
            </CalendarTbody>
          </CalendarTable>
        </Wrapper>
      </div>
    );
  }
}

export { Calendar as CalendarWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'calendar',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onChange: createAndFireEventOnAtlaskit({
      action: 'changed',
      actionSubject: 'calendarDate',
      attributes: {
        componentName: 'calendar',
        packageName,
        packageVersion,
      },
    }),
    onSelect: createAndFireEventOnAtlaskit({
      action: 'selected',
      actionSubject: 'calendarDate',
      attributes: {
        componentName: 'calendar',
        packageName,
        packageVersion,
      },
    }),
  })(Calendar),
);
