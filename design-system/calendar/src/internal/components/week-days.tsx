/** @jsx jsx */
import { memo } from 'react';

import { jsx } from '@emotion/react';

import Box from '@atlaskit/primitives/box';

import type { TabIndex } from '../../types';
import { type DateObj, type Week } from '../types';

import DateComponent from './date';
import WeekdayGrid from './week-day-grid';

interface WeekDaysProps {
	weeks: Week[];
	handleClickDay: (date: DateObj) => void;
	monthsLong: string[];
	shouldSetFocus: boolean;
	tabIndex: TabIndex;
	testId?: string;
}

const WeekDays = memo<WeekDaysProps>(function WeekDays({
	weeks,
	handleClickDay,
	monthsLong,
	shouldSetFocus,
	tabIndex,
	testId,
}) {
	return (
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
