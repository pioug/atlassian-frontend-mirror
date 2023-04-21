/* eslint-disable @repo/internal/react/require-jsdoc */
/** @jsx jsx */
import { FC, forwardRef, HTMLProps, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { B100, N30A } from '@atlaskit/theme/colors';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { gridSize as getGridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { ASC, DESC } from '../internal/constants';
import { arrow, head, MSThemeColors, tableBorder } from '../theme';
import { SortOrderType } from '../types';

import {
  cellStyles,
  fixedSizeTruncateStyles,
  getTruncationStyleVars,
  overflowTruncateStyles,
  TruncateStyleProps,
  truncationWidthStyles,
} from './constants';

const gridSize = getGridSize();

interface HeadProps {
  isRanking?: boolean;
  children: ReactNode;
  testId?: string;
}

const CSS_VAR_TEXT_COLOR = '--local-dynamic-table-text-color';

const rankingStyles = css({
  display: 'block',
});

const headStyles = css({
  borderBottom: `none`,
});

export const Head: FC<HeadProps> = ({ isRanking, testId, ...props }) => {
  return (
    <thead
      css={[headStyles, isRanking && rankingStyles]}
      data-testid={testId}
      // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
      {...props}
    />
  );
};

type HeadCellProps = TruncateStyleProps &
  HTMLProps<HTMLTableCellElement> & {
    onClick?: () => void;
    isSortable?: boolean;
    sortOrder?: SortOrderType;
    testId?: string;
  };

const headCellStyles = css([
  cellStyles,
  {
    boxSizing: 'border-box',
    position: 'relative',
    border: 'none',
    borderBottom: `2px solid ${tableBorder.borderColor}`,
    color: token('color.text.subtlest', `var(${CSS_VAR_TEXT_COLOR})`),
    fontSize: '12px',
    fontWeight: 600,
    textAlign: 'left',
    verticalAlign: 'top',
    '&:focus': {
      outline: `solid 2px ${token('color.border.focused', B100)}`,
    },
  },
]);

const onClickStyles = css({
  '&:hover': {
    backgroundColor: token('color.background.neutral.hovered', N30A),
    cursor: 'pointer',
  },
});

const baseStyles = css({
  '& > span': {
    position: 'relative',
    '&::before, &::after': {
      display: 'block',
      width: 0,
      height: 0,
      position: 'absolute',
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
      right: `-${gridSize}px`,
      border: '3px solid transparent',
      content: '""',
    },
    '&::before': {
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
      bottom: '8px',
      borderBottom: `3px solid ${arrow.defaultColor}`,
    },
    '&::after': {
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
      bottom: 0,
      borderTop: `3px solid ${arrow.defaultColor}`,
    },
  },
  '@media (forced-colors: active)': {
    '& > span': {
      '&::before, &::after': {
        border: `3px solid ${MSThemeColors.Background}`,
      },
      '&::before': {
        borderBottom: `3px solid ${MSThemeColors.Text}`,
      },
      '&::after': {
        borderTop: `3px solid ${MSThemeColors.Text}`,
      },
    },
  },
});

const ascendingStyles = css({
  '& > span': {
    '&::before': {
      borderBottom: `3px solid ${arrow.selectedColor}`,
    },
  },
  '@media (forced-colors: active)': {
    '& > span': {
      '&::before': {
        borderBottom: `3px solid ${MSThemeColors.SelectedBackground}`,
      },
    },
  },
});

const descendingStyles = css({
  '& > span': {
    '&::after': {
      borderTop: `3px solid ${arrow.selectedColor}`,
    },
  },
  '@media (forced-colors: active)': {
    '& > span': {
      '&::after': {
        borderTop: `3px solid ${MSThemeColors.SelectedBackground}`,
      },
    },
  },
});

export const HeadCell = forwardRef<HTMLTableCellElement, HeadCellProps>(
  (
    {
      width,
      children,
      isSortable,
      sortOrder,
      isFixedSize,
      shouldTruncate,
      onClick,
      style,
      testId,
      ...rest
    },
    ref,
  ) => {
    const mergedStyles = {
      ...style,
      ...(width && getTruncationStyleVars({ width })),
      [CSS_VAR_TEXT_COLOR]: head.textColor,
    };
    const isASC = sortOrder === ASC;
    const isDESC = sortOrder === DESC;

    const getFormattedSortOrder = () => {
      if (isASC) {
        return 'ascending';
      } else if (isDESC) {
        return 'descending';
      }
    };

    return (
      <th
        aria-sort={getFormattedSortOrder()}
        style={mergedStyles}
        css={[
          headCellStyles,
          onClick && onClickStyles,
          truncationWidthStyles,
          isFixedSize && shouldTruncate && fixedSizeTruncateStyles,
          isFixedSize && overflowTruncateStyles,
          isSortable && baseStyles,
          isASC && ascendingStyles,
          isDESC && descendingStyles,
        ]}
        onClick={onClick}
        ref={ref}
        data-testid={testId}
        {...rest}
      >
        {children}
      </th>
    );
  },
);
