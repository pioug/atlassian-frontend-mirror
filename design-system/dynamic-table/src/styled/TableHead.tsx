/** @jsx jsx */
import { FC, forwardRef, HTMLProps } from 'react';

import { css, jsx } from '@emotion/core';

import { B100, N30A } from '@atlaskit/theme/colors';
import { GlobalThemeTokens, useGlobalTheme } from '@atlaskit/theme/components';
import { gridSize as getGridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { ASC, DESC } from '../internal/constants';
import { arrow, head, MSThemeColors } from '../theme';
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
}

const CSS_VAR_TEXT_COLOR = '--local-dynamic-table-text-color';

const rankingStyles = css({
  display: 'block',
});

const getHeadStyles = (theme: GlobalThemeTokens) =>
  css({
    borderBottom: `2px solid ${head.borderColor({ theme })}`,
  });

export const Head: FC<HeadProps> = ({ isRanking, ...props }) => {
  const theme = useGlobalTheme();
  return (
    <thead
      css={[getHeadStyles(theme), isRanking && rankingStyles]}
      {...props}
    />
  );
};

type HeadCellProps = TruncateStyleProps &
  HTMLProps<HTMLTableCellElement> & {
    onClick?: () => void;
    isSortable?: boolean;
    sortOrder?: SortOrderType;
  };

const headCellStyles = css([
  cellStyles,
  {
    border: 'none',
    boxSizing: 'border-box',
    fontSize: '12px',
    fontWeight: 600,
    position: 'relative',
    textAlign: 'left',
    verticalAlign: 'top',
    color: token('color.text.subtlest', `var(${CSS_VAR_TEXT_COLOR})`),
    '&:focus': {
      outline: `solid 2px ${token('color.border.focused', B100)}`,
    },
  },
]);

// this needs to be made static: https://product-fabric.atlassian.net/browse/DSP-2011
export const getArrowStyles = (
  isSortable?: boolean,
  sortOrder?: SortOrderType,
  theme?: GlobalThemeTokens,
) => {
  if (!isSortable) {
    return '';
  }

  const pseudoBaseStyles = {
    border: '3px solid transparent',
    display: 'block',
    height: 0,
    right: `-${gridSize}px`,
    width: 0,

    '@media (forced-colors: active)': {
      border: `3px solid ${MSThemeColors.Background}`,
    },
  };

  return css({
    '& > span': {
      position: 'relative',
      '&::before': {
        ...pseudoBaseStyles,
        position: 'absolute',
        borderBottom: `3px solid ${
          sortOrder === ASC
            ? arrow.selectedColor({ theme })
            : arrow.defaultColor({ theme })
        }`,
        bottom: '8px',
        content: '""',
      },
      '&::after': {
        ...pseudoBaseStyles,
        position: 'absolute',
        borderTop: `3px solid ${
          sortOrder === DESC
            ? arrow.selectedColor({ theme })
            : arrow.defaultColor({ theme })
        }`,
        bottom: 0,
        content: '""',
      },
    },

    '&:hover > span': {
      '&::before': {
        borderBottom: `3px solid
          ${
            sortOrder === ASC
              ? arrow.selectedColor({ theme })
              : arrow.hoverColor({ theme })
          }`,
      },
      '&::after': {
        borderTop: `3px solid
          ${
            sortOrder === DESC
              ? arrow.selectedColor({ theme })
              : arrow.hoverColor({ theme })
          }`,
      },
    },

    '@media (forced-colors: active)': {
      '& > span': {
        '&::before': {
          borderBottom: `3px solid
            ${
              sortOrder === ASC
                ? MSThemeColors.SelectedBackground
                : MSThemeColors.Text
            }`,
        },
        '&::after': {
          borderTop: `3px solid
            ${
              sortOrder === DESC
                ? MSThemeColors.SelectedBackground
                : MSThemeColors.Text
            }`,
        },
      },

      '&:hover > span': {
        '&::before': {
          borderBottom: `3px solid
            ${
              sortOrder === ASC
                ? MSThemeColors.SelectedBackground
                : MSThemeColors.Text
            }`,
        },
        '&::after': {
          borderTop: `3px solid
            ${
              sortOrder === DESC
                ? MSThemeColors.SelectedBackground
                : MSThemeColors.Text
            }`,
        },
      },
    },
  });
};

const onClickStyles = css({
  '&:hover': {
    cursor: 'pointer',
    backgroundColor: token('color.background.neutral.hovered', N30A),
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
      ...rest
    },
    ref,
  ) => {
    const theme = useGlobalTheme();
    const mergedStyles = {
      ...style,
      ...(width && getTruncationStyleVars({ width })),
      [CSS_VAR_TEXT_COLOR]: head.textColor({ theme }),
    };
    return (
      <th
        style={mergedStyles}
        css={[
          headCellStyles,
          onClick && onClickStyles,
          truncationWidthStyles,
          isFixedSize && shouldTruncate && fixedSizeTruncateStyles,
          isFixedSize && overflowTruncateStyles,
          getArrowStyles(isSortable, sortOrder, theme),
        ]}
        onClick={onClick}
        ref={ref}
        {...rest}
      >
        {children}
      </th>
    );
  },
);
