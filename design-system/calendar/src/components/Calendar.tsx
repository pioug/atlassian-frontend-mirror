import React, { forwardRef, memo } from 'react';

import {
  createAndFireEvent,
  withAnalyticsContext,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';

import { blankObject, blankStringArray } from '../internal/constants';
import useControlledDateState from '../internal/hooks/use-controlled-date-state';
import useFocusing from '../internal/hooks/use-focusing';
import useGetWeeks from '../internal/hooks/use-get-weeks';
import useHandleDateChange from '../internal/hooks/use-handle-date-change';
import useHandleDateSelect from '../internal/hooks/use-handle-date-select';
import useInternalRef from '../internal/hooks/use-internal-ref';
import useLocale from '../internal/hooks/use-locale';
import useUniqueId from '../internal/hooks/use-unique-id';
import noop from '../internal/utils/noop';
import {
  Announcer,
  CalendarTable,
  CalendarTbody,
  CalendarTh,
  CalendarThead,
  Wrapper,
} from '../styled/Calendar';
import type { CalendarProps } from '../types';
import {
  name as packageName,
  version as packageVersion,
} from '../version.json';

import DateComponent from './Date';
import Heading from './Heading';

const Calendar = memo(
  forwardRef(function Calendar(
    {
      day = undefined,
      defaultDay = 0,
      defaultDisabled = blankStringArray,
      defaultMonth = 0,
      defaultPreviouslySelected = blankStringArray,
      defaultSelected = blankStringArray,
      defaultYear = 0,
      disabled = undefined,
      innerProps = blankObject,
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
      weekStartDay = 0,
      testId,
      internalRef,
    }: CalendarProps,
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

    const { navigate, handleClickNext, handleClickPrev } = useHandleDateChange({
      day: [dayValue, setDayValue],
      month: [monthValue, setMonthValue],
      year: [yearValue, setYearValue],
      onChange,
    });

    const { handleClickDay, handleContainerKeyDown } = useHandleDateSelect({
      day: [dayValue, setDayValue],
      month: [monthValue, setMonthValue],
      year: [yearValue, setYearValue],
      selected: [selectedValue, setSelectedValue],
      previous: [, setPreviouslySelectedValue],
      onSelect,
      navigate,
    });

    const { handleContainerBlur, handleContainerFocus } = useFocusing({
      day: [dayValue, setDayValue],
      onFocus,
      onBlur,
    });

    useInternalRef(internalRef, {
      navigate,
    });

    const weeks = useGetWeeks({
      day: [dayValue],
      month: [monthValue],
      year: [yearValue],
      today: [todayValue],
      disabled: [disabledValue],
      selected: [selectedValue],
      previous: [previouslySelectedValue],
      weekStartDay,
    });

    const announceId = useUniqueId('announce');
    const { monthsLong, daysShort } = useLocale({ locale, weekStartDay });

    return (
      <div
        {...innerProps}
        onBlur={handleContainerBlur}
        onFocus={handleContainerFocus}
        onKeyDown={handleContainerKeyDown}
        role="presentation"
        data-testid={testId && `${testId}--container`}
        ref={ref}
      >
        <Announcer id={announceId} aria-live="assertive" aria-relevant="text">
          {new Date(yearValue, monthValue, dayValue).toString()}
        </Announcer>
        <Wrapper
          aria-describedby={announceId}
          aria-label="calendar"
          role="grid"
          tabIndex={0}
        >
          <Heading
            // The month number needs to be translated to index in the month
            // name array e.g. 1 (January) -> 0
            monthLongTitle={monthsLong[monthValue - 1]}
            year={yearValue}
            handleClickNext={handleClickNext}
            handleClickPrev={handleClickPrev}
            testId={testId}
          />
          <CalendarTable role="presentation">
            <CalendarThead>
              <tr>
                {daysShort.map(shortDay => (
                  <CalendarTh key={shortDay}>{shortDay}</CalendarTh>
                ))}
              </tr>
            </CalendarThead>
            <CalendarTbody data-testid={testId && `${testId}--month`}>
              {weeks.map(week => (
                <tr key={week.id}>
                  {week.values.map(
                    ({
                      id,
                      isDisabled,
                      isFocused,
                      isToday,
                      month,
                      isPreviouslySelected,
                      isSelected,
                      isSiblingMonth,
                      year,
                      day,
                    }) => (
                      <DateComponent
                        key={id}
                        disabled={isDisabled}
                        focused={isFocused}
                        isToday={isToday}
                        month={month}
                        onClick={handleClickDay}
                        previouslySelected={isPreviouslySelected}
                        selected={isSelected}
                        sibling={isSiblingMonth}
                        year={year}
                        testId={testId}
                      >
                        {day}
                      </DateComponent>
                    ),
                  )}
                </tr>
              ))}
            </CalendarTbody>
          </CalendarTable>
        </Wrapper>
      </div>
    );
  }),
);

Calendar.displayName = 'Calendar';

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
