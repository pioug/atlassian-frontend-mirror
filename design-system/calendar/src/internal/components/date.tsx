/** @jsx jsx */
import React, { forwardRef, memo, useCallback, useMemo } from 'react';

import { jsx } from '@emotion/core';

import { ThemeModes } from '@atlaskit/theme/types';

import { dateCellStyle as getDateCellStyle, tdStyle } from '../styles/date';
import type { DateObj } from '../types';
import noop from '../utils/noop';

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
  mode: ThemeModes;
  testId?: string;
}

const Date = memo(
  forwardRef(function Date(
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
      mode,
      testId,
    }: Props,
    ref: React.Ref<HTMLTableDataCellElement>,
  ) {
    const handleClick = useCallback(() => {
      if (!disabled) {
        onClick({ day: children, month, year });
      }
    }, [children, month, year, disabled, onClick]);

    const cellControlProps = {
      'data-disabled': disabled ? disabled : undefined,
      'data-focused': focused ? focused : undefined,
      'data-prev-selected': previouslySelected ? previouslySelected : undefined,
      'data-selected': selected ? selected : undefined,
      'data-sibling': sibling ? sibling : undefined,
      'data-today': isToday ? isToday : undefined,
    };

    const dateCellStyle = useMemo(() => getDateCellStyle(mode), [mode]);

    return (
      <td
        css={tdStyle}
        aria-selected={selected ? 'true' : 'false'}
        role="gridcell"
        onClick={handleClick}
        ref={ref}
        data-testid={testId && selected ? `${testId}--selected-day` : undefined}
      >
        <div css={dateCellStyle} {...cellControlProps}>
          {children}
        </div>
      </td>
    );
  }),
);

Date.displayName = 'Date';

export default Date;
