/** @jsx jsx */
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import { jsx } from '@emotion/core';

import noop from '@atlaskit/ds-lib/noop';
import { ThemeModes } from '@atlaskit/theme/types';

import { dateCellStyles as getDateCellStyles } from '../styles/date';
import type { DateObj } from '../types';

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
  mode?: ThemeModes;
  testId?: string;
}

const Date = memo(
  forwardRef<HTMLButtonElement, Props>(function Date(
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
    },
    ref,
  ) {
    const dateRef = useRef({ day, month, year, isDisabled });

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

    const dateCellStyles = useMemo(() => getDateCellStyles(mode), [mode]);

    return (
      <button
        // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
        css={dateCellStyles}
        aria-selected={isSelected ? 'true' : 'false'}
        tabIndex={isSelected ? 0 : -1}
        type="button"
        role="gridcell"
        onClick={handleClick}
        ref={ref}
        data-disabled={isDisabled || undefined}
        data-focused={isFocused || undefined}
        data-prev-selected={isPreviouslySelected || undefined}
        data-selected={isSelected || undefined}
        data-sibling={isSibling || undefined}
        data-today={isToday || undefined}
        data-testid={
          testId && isSelected ? `${testId}--selected-day` : undefined
        }
      >
        {day}
      </button>
    );
  }),
);

Date.displayName = 'Date';

export default Date;
