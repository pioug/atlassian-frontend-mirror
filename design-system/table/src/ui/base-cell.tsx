/* eslint-disable @atlassian/tangerine/import/entry-points */
/** @jsx jsx */
import { forwardRef, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import Box, { BoxProps } from '@atlaskit/ds-explorations/box';
import Inline from '@atlaskit/ds-explorations/inline';
import { token } from '@atlaskit/tokens';

export type BaseCellProps = {
  /**
   * A percentage of pixel width of the table to apply to a column.
   */
  width?: string;
  /**
   * Horizontal alignment of content.
   */
  align?: keyof typeof alignMap;
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
} & Pick<
  BoxProps,
  'paddingBlock' | 'paddingInline' | 'backgroundColor' | 'className'
>;

/**
 * https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-sort
 */
export type SortDirection = 'ascending' | 'descending' | 'none' | 'other';

type InternalBaseCellProps = BaseCellProps & { sortDirection?: SortDirection };

const alignMap = {
  text: 'flexStart',
  number: 'flexEnd',
  icon: 'center',
} as const;

const baseResetStyles = css({
  display: 'table-cell',
  verticalAlign: 'middle',
  '&:first-of-type': {
    paddingLeft: token('space.100', '8px'),
  },
  '&:last-of-type': {
    paddingRight: token('space.100', '8px'),
  },
});

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
      paddingInline = 'space.200',
      backgroundColor,
      scope,
      width,
      className,
      sortDirection,
    },
    ref,
  ) => (
    <Box
      css={baseResetStyles}
      ref={ref}
      scope={scope}
      backgroundColor={backgroundColor}
      paddingBlock={paddingBlock}
      paddingInline={paddingInline}
      as={as}
      testId={testId}
      className={className}
      UNSAFE_style={width ? { width } : undefined}
      aria-sort={sortDirection}
    >
      <Inline justifyContent={alignMap[align]} gap="space.0">
        {children}
      </Inline>
    </Box>
  ),
);
