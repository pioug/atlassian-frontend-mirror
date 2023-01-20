/** @jsx jsx */
import { memo } from 'react';

import { jsx } from '@emotion/react';

import type { ThemeModes } from '@atlaskit/theme/types';

import { DateObj, Week } from '../types';

import DateComponent from './date';
import WeekdayGrid from './week-day-grid';

interface WeekDaysProps {
  weeks: Week[];
  handleClickDay: (date: DateObj) => void;
  mode?: ThemeModes;
  testId?: string;
}

const WeekDays = memo<WeekDaysProps>(function WeekDays({
  weeks,
  handleClickDay,
  mode,
  testId,
}) {
  return (
    <WeekdayGrid role="grid" testId={testId && `${testId}--month`}>
      {weeks.map((week) =>
        week.values.map((weekDay) => (
          <DateComponent
            key={`${week.id}-${weekDay.id}`}
            isDisabled={weekDay.isDisabled}
            isFocused={weekDay.isFocused}
            isToday={weekDay.isToday}
            month={weekDay.month}
            onClick={handleClickDay}
            isPreviouslySelected={weekDay.isPreviouslySelected}
            isSelected={weekDay.isSelected}
            isSibling={weekDay.isSiblingMonth}
            year={weekDay.year}
            mode={mode}
            testId={testId}
          >
            {weekDay.day}
          </DateComponent>
        )),
      )}
    </WeekdayGrid>
  );
});

WeekDays.displayName = 'WeekDays';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default WeekDays;
