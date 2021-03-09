/** @jsx jsx */
import { memo } from 'react';

import { jsx } from '@emotion/core';

import type { ThemeModes } from '@atlaskit/theme/types';

import { tbodyStyle } from '../styles/table';
import { DateObj, Week } from '../types';

import DateComponent from './date';

interface Props {
  weeks: Week[];
  handleClickDay: ({ year, month, day }: DateObj) => void;
  mode: ThemeModes;
  testId?: string;
}

const WeekDays = memo(function WeekDays({
  weeks,
  handleClickDay,
  mode,
  testId,
}: Props) {
  return (
    <tbody css={tbodyStyle} data-testid={testId && `${testId}--month`}>
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
                isDisabled={isDisabled}
                isFocused={isFocused}
                isToday={isToday}
                month={month}
                onClick={handleClickDay}
                isPreviouslySelected={isPreviouslySelected}
                isSelected={isSelected}
                isSibling={isSiblingMonth}
                year={year}
                mode={mode}
                testId={testId}
              >
                {day}
              </DateComponent>
            ),
          )}
        </tr>
      ))}
    </tbody>
  );
});

WeekDays.displayName = 'WeekDays';

export default WeekDays;
