/** @jsx jsx */
import { forwardRef, memo, useState } from 'react';

import { jsx } from '@emotion/react';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import noop from '@atlaskit/ds-lib/noop';
import { Box, Stack, xcss } from '@atlaskit/primitives';
import GlobalTheme from '@atlaskit/theme/components';

import Header from './internal/components/header';
import WeekDaysComponent from './internal/components/week-days';
import WeekHeaderComponent from './internal/components/week-header';
import { blankStringArray } from './internal/constants';
import useCalendarRef from './internal/hooks/use-calendar-ref';
import useControlledDateState from './internal/hooks/use-controlled-date-state';
import useFocusing from './internal/hooks/use-focusing';
import useGetWeeks from './internal/hooks/use-get-weeks';
import useHandleDateChange from './internal/hooks/use-handle-date-change';
import useHandleDateSelect from './internal/hooks/use-handle-date-select';
import useLocale from './internal/hooks/use-locale';
import useUniqueId from './internal/hooks/use-unique-id';
import type { CalendarProps } from './types';

const boxStyles = xcss({
  display: 'inline-block',
  userSelect: 'none',
});

const analyticsAttributes = {
  componentName: 'calendar',
  packageName: process.env._PACKAGE_NAME_ as string,
  packageVersion: process.env._PACKAGE_VERSION_ as string,
};

const CalendarWithMode = forwardRef<HTMLDivElement, CalendarProps>(
  function Calendar(
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
      today,
      locale = 'en-US',
      year,
      analyticsContext,
      weekStartDay = 0,
      testId,
      calendarRef,
      mode = 'light',
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

    const { navigate, handleClickNext, handleClickPrev } = useHandleDateChange({
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

    useCalendarRef(calendarRef, {
      navigate,
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

    const getNextHeading = () => {
      // Next month is (currentMonth - 1) + 1, or just currentMonth in this
      // instance.
      const nextMonth = monthValue % 12;
      const showNextYear = monthValue === 12;
      return `${monthsLong[nextMonth]} ${
        showNextYear ? yearValue + 1 : yearValue
      }`;
    };

    const getPreviousHeading = () => {
      // Previous month is (monthValue - 1) - 1. Need to add 12 so the modulo
      // works as expected and stays positive.
      const previousMonth = (monthValue + 12 - 2) % 12;
      const showPreviousYear = monthValue === 1;
      return `${monthsLong[previousMonth]} ${
        showPreviousYear ? yearValue - 1 : yearValue
      }`;
    };

    const headerId = useUniqueId('month-year-header');

    return (
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-static-element-interactions
      <div
        className={className}
        style={style}
        onBlur={handleContainerBlur}
        onFocus={handleContainerFocus}
        data-testid={testId && `${testId}--container`}
        ref={ref}
      >
        <Box
          xcss={boxStyles}
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
              nextHeading={getNextHeading()}
              previousHeading={getPreviousHeading()}
              handleClickNext={handleClickNext}
              handleClickPrev={handleClickPrev}
              headerId={headerId}
              mode={mode}
              tabIndex={tabIndex}
              testId={testId}
            />
            <Box
              role="grid"
              tabIndex={tabIndex}
              onKeyDown={handleContainerKeyDown}
              aria-labelledby={headerId}
              testId={testId && `${testId}--calendar-dates`}
            >
              <WeekHeaderComponent
                daysShort={daysShort}
                mode={mode}
                testId={testId}
              />
              <WeekDaysComponent
                weeks={weeks}
                handleClickDay={handleClickDay}
                mode={mode}
                monthsLong={monthsLong}
                shouldSetFocus={shouldSetFocus}
                tabIndex={tabIndex}
                testId={testId}
              />
            </Box>
          </Stack>
        </Box>
      </div>
    );
  },
);

/**
 * __Calendar__
 *
 * A calendar is used for date selection.
 *
 * - [Examples](https://atlassian.design/components/calendar/examples)
 * - [Code](https://atlassian.design/components/calendar/code)
 * - [Usage](https://atlassian.design/components/calendar/usage)
 */
const Calendar = memo(
  forwardRef<HTMLDivElement, CalendarProps>(function Calendar(props, ref) {
    return (
      <GlobalTheme.Consumer>
        {({ mode }) => <CalendarWithMode {...props} mode={mode} ref={ref} />}
      </GlobalTheme.Consumer>
    );
  }),
);

Calendar.displayName = 'Calendar';

export default Calendar;
