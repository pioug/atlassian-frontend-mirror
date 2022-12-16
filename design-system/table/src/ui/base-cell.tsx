/* eslint-disable @atlassian/tangerine/import/entry-points */
/** @jsx jsx */
import { forwardRef, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import Box, { BoxProps } from '@atlaskit/ds-explorations/box';
import Inline from '@atlaskit/ds-explorations/inline';
import { token } from '@atlaskit/tokens';

export type BaseCellProps = {
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
export const BaseCell = forwardRef<HTMLTableCellElement, BaseCellProps>(
  (
    {
      testId,
      as,
      children,
      align = 'text',
      paddingBlock = 'scale.100',
      paddingInline = 'scale.200',
      backgroundColor,
      scope,
      className,
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
    >
      <Inline justifyContent={alignMap[align]} gap="scale.0">
        {children}
      </Inline>
    </Box>
  ),
);
