/** @jsx jsx */
import { memo } from 'react';

import { jsx } from '@emotion/react';

import Box from '@atlaskit/primitives/box';
import type { ThemeModes } from '@atlaskit/theme/types';

import type { TabIndex } from '../../types';
import { DateObj, Week } from '../types';

import DateComponent from './date';
import WeekdayGrid from './week-day-grid';

interface WeekDaysProps {
  weeks: Week[];
  handleClickDay: (date: DateObj) => void;
  mode?: ThemeModes;
  monthsLong: string[];
  shouldSetFocus: boolean;
  tabIndex: TabIndex;
  testId?: string;
}

const WeekDays = memo<WeekDaysProps>(function WeekDays({
  weeks,
  handleClickDay,
  mode,
  monthsLong,
  shouldSetFocus,
  tabIndex,
  testId,
}) {
  return (
    // TODO: Determine if there is a better way to render the button (should be
    // fixed with introduction of keyboard accessibility of Calendar in
    // DSP-9939) (DSP-11588)
    <Box role="rowgroup" testId={testId && `${testId}--month`}>
      {weeks.map((week, i) => (
        <WeekdayGrid key={i} testId={testId && `${testId}--week`}>
          {week.values.map((weekDay) => (
            <DateComponent
              key={`${week.id}-${weekDay.id}`}
              isDisabled={weekDay.isDisabled}
              isFocused={weekDay.isFocused}
              isToday={weekDay.isToday}
              dayLong={weekDay.weekDayName}
              month={weekDay.month}
              monthLong={monthsLong[weekDay.month - 1]}
              onClick={handleClickDay}
              isPreviouslySelected={weekDay.isPreviouslySelected}
              isSelected={weekDay.isSelected}
              isSibling={weekDay.isSiblingMonth}
              year={weekDay.year}
              mode={mode}
              shouldSetFocus={shouldSetFocus}
              tabIndex={tabIndex}
              testId={testId}
            >
              {weekDay.day}
            </DateComponent>
          ))}
        </WeekdayGrid>
      ))}
    </Box>
  );
});

WeekDays.displayName = 'WeekDays';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default WeekDays;
