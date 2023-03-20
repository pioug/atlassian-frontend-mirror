/** @jsx jsx */
import { forwardRef, memo, useMemo } from 'react';

import { jsx } from '@emotion/react';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import Box from '@atlaskit/ds-explorations/box';
import noop from '@atlaskit/ds-lib/noop';
import Stack from '@atlaskit/primitives/stack';
import GlobalTheme from '@atlaskit/theme/components';
import VisuallyHidden from '@atlaskit/visually-hidden';

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
      weekStartDay,
    });

    const announceId = useUniqueId('announce');
    const announcerDate = useMemo(
      () => new Date(yearValue, monthValue - 1, dayValue).toString(),
      [dayValue, monthValue, yearValue],
    );
    const { monthsLong, daysShort } = useLocale({ locale, weekStartDay });

    return (
      <Box
        className={className}
        UNSAFE_style={style}
        onBlur={handleContainerBlur}
        onFocus={handleContainerFocus}
        onKeyDown={handleContainerKeyDown}
        role="presentation"
        testId={testId && `${testId}--container`}
        ref={ref}
      >
        <VisuallyHidden>
          {/* eslint-disable-next-line @repo/internal/react/use-primitives */}
          <span id={announceId} aria-live="assertive" aria-relevant="text">
            {announcerDate}
          </span>
        </VisuallyHidden>
        <Box
          display="inlineBlock"
          padding="space.200"
          UNSAFE_style={{
            userSelect: 'none',
          }}
          aria-describedby={announceId}
          aria-label="calendar"
          role="grid"
          tabIndex={tabIndex}
        >
          <Stack space="150">
            <Header
              // The month number needs to be translated to index in the month
              // name array e.g. 1 (January) -> 0
              monthLongTitle={monthsLong[monthValue - 1]}
              year={yearValue}
              nextMonthLabel={nextMonthLabel}
              previousMonthLabel={previousMonthLabel}
              handleClickNext={handleClickNext}
              handleClickPrev={handleClickPrev}
              mode={mode}
              testId={testId}
            />
            <Box display="block" role="presentation">
              <WeekHeaderComponent daysShort={daysShort} mode={mode} />
              <WeekDaysComponent
                weeks={weeks}
                handleClickDay={handleClickDay}
                mode={mode}
                testId={testId}
              />
            </Box>
          </Stack>
        </Box>
      </Box>
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
