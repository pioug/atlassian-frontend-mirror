/** @jsx jsx */
import { memo } from 'react';

import { css, jsx } from '@emotion/core';

import type { ThemeModes } from '@atlaskit/theme/types';

import { DateObj, Week } from '../types';

import DateComponent from './date';

const daysGridStyles = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  border: 0,
});

interface Props {
  weeks: Week[];
  handleClickDay: (date: DateObj) => void;
  mode?: ThemeModes;
  testId?: string;
}

const WeekDays = memo<Props>(function WeekDays({
  weeks,
  handleClickDay,
  mode,
  testId,
}) {
  return (
    <div role="grid" data-testid={testId && `${testId}--month`}>
      {weeks.map((week) => (
        <div role="row" key={week.id} css={daysGridStyles}>
          {week.values.map((weekDay) => (
            <DateComponent
              key={weekDay.id}
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
          ))}
        </div>
      ))}
    </div>
  );
});

WeekDays.displayName = 'WeekDays';

export default WeekDays;
