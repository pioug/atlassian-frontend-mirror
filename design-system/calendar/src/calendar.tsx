/** @jsx jsx */
import React, { forwardRef, memo, useMemo } from 'react';

import { jsx } from '@emotion/core';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import noop from '@atlaskit/ds-lib/noop';
import GlobalTheme, { GlobalThemeTokens } from '@atlaskit/theme/components';
import { ThemeModes } from '@atlaskit/theme/types';

import HeadingComponent from './internal/components/heading';
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
import {
  announcerStyle,
  wrapperStyle as getWrapperStyle,
} from './internal/styles/container';
import { gridsContainerStyle } from './internal/styles/grid';
import type { CalendarProps } from './types';

export interface InternalProps extends CalendarProps {
  mode: ThemeModes;
}

const analyticsAttributes = {
  componentName: 'calendar',
  packageName: process.env._PACKAGE_NAME_ as string,
  packageVersion: process.env._PACKAGE_VERSION_ as string,
};

const CalendarWithMode = forwardRef(function Calendar(
  {
    day = undefined,
    defaultDay = 0,
    defaultDisabled = blankStringArray,
    defaultMonth = 0,
    defaultPreviouslySelected = blankStringArray,
    defaultSelected = blankStringArray,
    defaultYear = 0,
    disabled = undefined,
    month = undefined,
    onBlur = noop,
    onChange = noop,
    onFocus = noop,
    onSelect = noop,
    previouslySelected = undefined,
    selected = undefined,
    today = undefined,
    locale = 'en-US',
    year = undefined,
    analyticsContext,
    weekStartDay = 0,
    testId,
    calendarRef,
    mode,
    className,
    style,
  }: InternalProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    day: [dayValue, setDayValue],
    month: [monthValue, setMonthValue],
    year: [yearValue, setYearValue],
    today: [todayValue],
    disabled: [disabledValue],
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
    disabled,
    defaultDisabled,
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
    disabled: disabledValue,
    selected: selectedValue,
    previouslySelected: previouslySelectedValue,
    weekStartDay,
  });

  const announceId = useUniqueId('announce');
  const announcerDate = useMemo(
    () => new Date(yearValue, monthValue - 1, dayValue).toString(),
    [dayValue, monthValue, yearValue],
  );
  const { monthsLong, daysShort } = useLocale({ locale, weekStartDay });

  const wrapperStyle = useMemo(() => getWrapperStyle(mode), [mode]);

  return (
    <div
      className={className}
      style={style}
      onBlur={handleContainerBlur}
      onFocus={handleContainerFocus}
      onKeyDown={handleContainerKeyDown}
      role="presentation"
      data-testid={testId && `${testId}--container`}
      ref={ref}
    >
      <div
        css={announcerStyle}
        id={announceId}
        aria-live="assertive"
        aria-relevant="text"
      >
        {announcerDate}
      </div>
      <div
        css={wrapperStyle}
        aria-describedby={announceId}
        aria-label="calendar"
        role="grid"
        tabIndex={0}
      >
        <HeadingComponent
          // The month number needs to be translated to index in the month
          // name array e.g. 1 (January) -> 0
          monthLongTitle={monthsLong[monthValue - 1]}
          year={yearValue}
          handleClickNext={handleClickNext}
          handleClickPrev={handleClickPrev}
          mode={mode}
          testId={testId}
        />
        <div css={gridsContainerStyle} role="presentation">
          <WeekHeaderComponent daysShort={daysShort} mode={mode} />
          <WeekDaysComponent
            weeks={weeks}
            handleClickDay={handleClickDay}
            mode={mode}
            testId={testId}
          />
        </div>
      </div>
    </div>
  );
});

const Calendar = memo(
  forwardRef(function Calendar(
    props: CalendarProps,
    ref: React.Ref<HTMLDivElement>,
  ) {
    return (
      <GlobalTheme.Consumer>
        {({ mode }: GlobalThemeTokens) => (
          <CalendarWithMode {...props} mode={mode} ref={ref} />
        )}
      </GlobalTheme.Consumer>
    );
  }),
);

Calendar.displayName = 'Calendar';

export default Calendar;
