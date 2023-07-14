import React, { forwardRef, ReactNode } from 'react';

import { Box, BoxProps, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

export type BaseCellProps = {
  /**
   * A percentage of pixel width of the table to apply to a column.
   */
  width?: string;
  /**
   * Horizontal alignment of content.
   */
  align?: 'icon' | 'text' | 'number';
  /**
   * Whether the cell should render as a `td` or `th` element.
   */
  as?: 'td' | 'th';
  /**
   * Same behavior as the HTML attribute.
   *
   * @see 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th#attr-scope'
   */
  scope?: 'col' | 'row';
  /**
   * A `testId` prop is a unique string that appears as a data attribute `data-testid`
   * in the rendered code, serving as a hook for automated tests.
   */
  testId?: string;
  /**
   * Content of the cell.
   */
  children?: ReactNode;
  /**
   * Number of columns to span.
   */
  colSpan?: number;
} & Pick<
  BoxProps,
  'paddingBlock' | 'paddingInline' | 'backgroundColor' | 'xcss'
>;

/**
 * https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-sort
 */
export type SortDirection = 'ascending' | 'descending' | 'none' | 'other';

type InternalBaseCellProps = BaseCellProps & { sortDirection?: SortDirection };

const baseResetStyles = xcss({
  display: 'table-cell',
  verticalAlign: 'middle',
  ':first-of-type': {
    paddingLeft: token('space.100', '8px'),
  },
  ':last-of-type': {
    paddingRight: token('space.100', '8px'),
  },
});

const alignMapStyles = {
  text: xcss({
    textAlign: 'left',
  }),
  icon: xcss({
    textAlign: 'center',
  }),
  number: xcss({
    textAlign: 'right',
  }),
} as const;

/**
 * __BaseCell__
 *
 * @internal
 *
 * Basic cell element.
 */
export const BaseCell = forwardRef<HTMLTableCellElement, InternalBaseCellProps>(
  (
    {
      testId,
      as,
      children,
      align = 'text',
      paddingBlock = 'space.100',
      paddingInline = 'space.100',
      backgroundColor,
      scope,
      width,
      xcss,
      sortDirection,
      colSpan,
    },
    ref,
  ) => (
    <Box
      xcss={[
        baseResetStyles,
        alignMapStyles[align],
        ...(Array.isArray(xcss) ? xcss : [xcss]),
      ]}
      ref={ref}
      scope={scope}
      backgroundColor={backgroundColor}
      paddingBlock={paddingBlock}
      paddingInline={paddingInline}
      // @ts-expect-error
      as={as}
      testId={testId}
      style={width ? { width } : undefined}
      aria-sort={sortDirection}
      colSpan={colSpan}
    >
      {children}
    </Box>
  ),
);
