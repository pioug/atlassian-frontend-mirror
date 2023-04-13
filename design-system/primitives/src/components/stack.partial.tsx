/* eslint-disable @repo/internal/styles/no-exported-styles */
/** @jsx jsx */
import {
  ComponentPropsWithRef,
  ElementType,
  forwardRef,
  memo,
  ReactNode,
  Ref,
} from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

export interface StackProps<T extends ElementType = 'div'> {
  /**
   * The DOM element to render as the Stack. Defaults to `div`.
   */
  as?: 'div' | 'span' | 'ul' | 'ol';
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
  space?: Gap;

  /**
   * A unique string that appears as data attribute data-testid in the rendered code, serving as a hook for automated tests.
   */
  testId?: string;

  /**
   * Elements to be rendered inside the Stack.
   */
  children: ReactNode;

  /**
   * Forwarded ref element
   */
  ref?: ComponentPropsWithRef<T>['ref'];
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
  fill: css({
    width: '100%',
    flexGrow: 1,
  }),
};

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::4eb2c996d6ce5791acad51e2b226635f>>
 * @codegenId spacing
 * @codegenCommand yarn codegen-styles
 * @codegenParams ["stackSpace"]
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-spacing.tsx <<SignedSource::167d3b69b159ae33e74d4ea5ab7eade6>>
 */
const stackSpaceMap = Object.fromEntries(
  ['gap'].map((property: string) => [
    property,
    {
      '0': css({
        [property]: token('space.0', '0px'),
      }),
      '025': css({
        [property]: token('space.025', '2px'),
      }),
      '050': css({
        [property]: token('space.050', '4px'),
      }),
      '075': css({
        [property]: token('space.075', '6px'),
      }),
      '100': css({
        [property]: token('space.100', '8px'),
      }),
      '150': css({
        [property]: token('space.150', '12px'),
      }),
      '200': css({
        [property]: token('space.200', '16px'),
      }),
      '250': css({
        [property]: token('space.250', '20px'),
      }),
      '300': css({
        [property]: token('space.300', '24px'),
      }),
      '400': css({
        [property]: token('space.400', '32px'),
      }),
      '500': css({
        [property]: token('space.500', '40px'),
      }),
      '600': css({
        [property]: token('space.600', '48px'),
      }),
      '800': css({
        [property]: token('space.800', '64px'),
      }),
      '1000': css({
        [property]: token('space.1000', '80px'),
      }),
    } as const,
  ]),
);

export type Gap = keyof typeof stackSpaceMap.gap;

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
  forwardRef(
    <T extends ElementType = 'div'>(
      {
        as,
        alignInline: alignItems,
        alignBlock,
        spread,
        grow,
        space,
        children,
        testId,
      }: StackProps<T>,
      ref: Ref<any>,
    ) => {
      const Component = as || 'div';
      const justifyContent = spread || alignBlock;

      return (
        <Component
          css={[
            baseStyles,
            space && stackSpaceMap.gap[space],
            alignItems && alignItemsMap[alignItems],
            grow && flexGrowMap[grow],
            justifyContent && justifyContentMap[justifyContent],
          ]}
          data-testid={testId}
          ref={ref}
        >
          {children}
        </Component>
      );
    },
  ),
);

Stack.displayName = 'Stack';

export default Stack;
