/** @jsx jsx */
import { forwardRef, memo, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

export interface StackProps {
  /**
   * Used to align children along the main axis.
   */
  alignBlock?: AlignBlock;

  /**
   * Used to align children along the cross axis.
   */
  alignInline?: AlignInline;

  /**
   * Used to distribute the children along the main axis.
   */
  spread?: Spread;

  /**
   * Used to set whether the content should grow to fill the available space.
   */
  grow?: Grow;

  /**
   * Represents the space between each child.
   */
  space?: Space;

  /**
   * A unique string that appears as data attribute data-testid in the rendered code, serving as a hook for automated tests.
   */
  testId?: string;

  /**
   * Elements to be rendered inside the Stack.
   */
  children: ReactNode;
}

export type AlignInline = 'start' | 'center' | 'end';
export type AlignBlock = 'start' | 'center' | 'end';
export type Spread = 'space-between';
export type Grow = 'hug' | 'fill';

const justifyContentMap = {
  start: css({ justifyContent: 'start' }),
  center: css({ justifyContent: 'center' }),
  end: css({ justifyContent: 'end' }),
  'space-between': css({ justifyContent: 'space-between' }),
};

const alignItemsMap = {
  start: css({ alignItems: 'start' }),
  center: css({ alignItems: 'center' }),
  end: css({ alignItems: 'end' }),
};

const flexGrowMap = {
  hug: css({ flexGrow: 0 }),
  fill: css({ flexGrow: 1 }),
};

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::41d7002b7f69aa44d0d8598e07a1afc6>>
 * @codegenId spacing
 * @codegenCommand yarn codegen-styles
 * @codegenParams ["space"]
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-spacing.tsx <<SignedSource::167d3b69b159ae33e74d4ea5ab7eade6>>
 */
const spaceMap = {
  '0': css({
    gap: token('space.0', '0px'),
  }),
  '025': css({
    gap: token('space.025', '2px'),
  }),
  '050': css({
    gap: token('space.050', '4px'),
  }),
  '075': css({
    gap: token('space.075', '6px'),
  }),
  '100': css({
    gap: token('space.100', '8px'),
  }),
  '150': css({
    gap: token('space.150', '12px'),
  }),
  '200': css({
    gap: token('space.200', '16px'),
  }),
  '250': css({
    gap: token('space.250', '20px'),
  }),
  '300': css({
    gap: token('space.300', '24px'),
  }),
  '400': css({
    gap: token('space.400', '32px'),
  }),
  '500': css({
    gap: token('space.500', '40px'),
  }),
  '600': css({
    gap: token('space.600', '48px'),
  }),
  '800': css({
    gap: token('space.800', '64px'),
  }),
  '1000': css({
    gap: token('space.1000', '80px'),
  }),
} as const;

export type Space = keyof typeof spaceMap;

/**
 * @codegenEnd
 */

const baseStyles = css({
  display: 'flex',
  boxSizing: 'border-box',
  flexDirection: 'column',
});

/**
 * __Stack__
 *
 * Stack is a primitive component based on flexbox that manages the vertical layout of direct children.
 *
 * @example
 * ```tsx
 *  <Stack>
 *    <Box padding="space.100" backgroundColor="neutral"></Box>
 *    <Box padding="space.100" backgroundColor="neutral"></Box>
 *  </Stack>
 * ```
 *
 */
const Stack = memo(
  forwardRef<HTMLDivElement, StackProps>(
    (
      {
        alignInline: alignItems,
        alignBlock,
        spread,
        grow,
        space,
        children,
        testId,
      }: StackProps,
      ref,
    ) => {
      const justifyContent = spread || alignBlock;

      return (
        <div
          css={[
            baseStyles,
            space && spaceMap[space],
            alignItems && alignItemsMap[alignItems],
            grow && flexGrowMap[grow],
            justifyContent && justifyContentMap[justifyContent],
          ]}
          data-testid={testId}
          ref={ref}
        >
          {children}
        </div>
      );
    },
  ),
);

Stack.displayName = 'Stack';

export default Stack;
