import React, { forwardRef, ReactNode } from 'react';

import { Box, BoxProps, type XCSS, xcss } from '@atlaskit/primitives';

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
  BoxProps<any>,
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
    paddingInlineStart: 'space.100',
  },
  ':last-of-type': {
    paddingInlineEnd: 'space.100',
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
  ) => {
    // We're type coercing this as Compiled styles in an array isn't supported by the types
    // But the runtime accepts it none-the-wiser. We can remove this entire block and replace
    // it with cx(defaultStyles, focusRingStyles, xcssStyles) when we've moved away from Emotion.
    const styles = (Array.isArray(xcss) ? xcss : [xcss]) as XCSS[];

    return (
      <Box
        xcss={[baseResetStyles, alignMapStyles[align], ...styles]}
        ref={ref}
        scope={scope}
        backgroundColor={backgroundColor}
        paddingBlock={paddingBlock}
        paddingInline={paddingInline}
        as={as}
        testId={testId}
        style={width ? { width } : undefined}
        aria-sort={sortDirection}
        colSpan={colSpan}
      >
        {children}
      </Box>
    );
  },
);
