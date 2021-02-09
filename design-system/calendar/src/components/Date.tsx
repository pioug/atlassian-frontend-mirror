import React, { forwardRef, memo, useCallback, useState } from 'react';

import type { DateObj } from '../internal/types';
import noop from '../internal/utils/noop';
import { DateDiv, DateTd } from '../styled/Date';

interface Props {
  children: number;
  disabled?: boolean;
  focused?: boolean;
  isToday?: boolean;
  month: number;
  onClick?: ({ day, month, year }: DateObj) => void;
  previouslySelected?: boolean;
  selected?: boolean;
  sibling?: boolean;
  year: number;
  testId?: string;
}

const Date = forwardRef(function Date(
  {
    children,
    disabled = false,
    focused = false,
    isToday = false,
    month,
    onClick = noop,
    previouslySelected = false,
    selected = false,
    sibling = false,
    year,
    testId,
  }: Props,
  ref: React.Ref<HTMLTableDataCellElement>,
) {
  const [isActive, setIsActive] = useState(false);

  const onMouseDown = useCallback(() => {
    setIsActive(true);
  }, []);

  const onMouseUp = useCallback(() => {
    setIsActive(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled) {
      onClick({ day: children, month, year });
    }
  }, [children, month, year, disabled, onClick]);

  return (
    <DateTd
      aria-selected={selected ? 'true' : 'false'}
      role="gridcell"
      onClick={handleClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      // TODO: Remove any when we migrate this code to emotion under lite-mode
      innerRef={ref as any}
      data-testid={testId && selected ? `${testId}--selected-day` : undefined}
    >
      <DateDiv
        disabled={disabled}
        focused={focused}
        isToday={isToday}
        previouslySelected={previouslySelected}
        selected={selected}
        sibling={sibling}
        isActive={isActive}
      >
        {children}
      </DateDiv>
    </DateTd>
  );
});

Date.displayName = 'Date';

export default memo(Date);
