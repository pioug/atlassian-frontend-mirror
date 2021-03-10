/** @jsx jsx */
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import { jsx } from '@emotion/core';

import { ThemeModes } from '@atlaskit/theme/types';

import { dateCellStyle as getDateCellStyle, tdStyle } from '../styles/date';
import type { DateObj } from '../types';
import noop from '../utils/noop';

interface Props {
  children: number;
  isDisabled?: boolean;
  isFocused?: boolean;
  isToday?: boolean;
  month: number;
  onClick?: ({ day, month, year }: DateObj) => void;
  isPreviouslySelected?: boolean;
  isSelected?: boolean;
  isSibling?: boolean;
  year: number;
  mode: ThemeModes;
  testId?: string;
}

const Date = memo(
  forwardRef(function Date(
    {
      children: day,
      isDisabled = false,
      isFocused = false,
      isToday = false,
      month,
      onClick = noop,
      isPreviouslySelected = false,
      isSelected = false,
      isSibling = false,
      year,
      mode,
      testId,
    }: Props,
    ref: React.Ref<HTMLTableDataCellElement>,
  ) {
    const dateRef = useRef({
      day,
      month,
      year,
      isDisabled,
    });

    useEffect(() => {
      dateRef.current = {
        day,
        month,
        year,
        isDisabled,
      };
    }, [day, month, year, isDisabled]);

    const handleClick = useCallback(() => {
      const {
        day: dayValue,
        month: monthValue,
        year: yearValue,
        isDisabled: isDisabledValue,
      } = dateRef.current;

      if (!isDisabledValue) {
        onClick({
          day: dayValue,
          month: monthValue,
          year: yearValue,
        });
      }
    }, [onClick]);

    const cellControlProps = {
      'data-disabled': isDisabled || undefined,
      'data-focused': isFocused || undefined,
      'data-prev-selected': isPreviouslySelected || undefined,
      'data-selected': isSelected || undefined,
      'data-sibling': isSibling || undefined,
      'data-today': isToday || undefined,
    };

    const dateCellStyle = useMemo(() => getDateCellStyle(mode), [mode]);

    return (
      <td
        css={tdStyle}
        aria-selected={isSelected ? 'true' : 'false'}
        role="gridcell"
        onClick={handleClick}
        ref={ref}
        data-testid={
          testId && isSelected ? `${testId}--selected-day` : undefined
        }
      >
        <div css={dateCellStyle} {...cellControlProps}>
          {day}
        </div>
      </td>
    );
  }),
);

Date.displayName = 'Date';

export default Date;