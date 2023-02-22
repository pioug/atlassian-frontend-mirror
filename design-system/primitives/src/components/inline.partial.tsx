/** @jsx jsx */
import { Children, FC, forwardRef, Fragment, memo, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

export interface InlineProps {
  /**
   * Used to align children along the main axis.
   */
  alignBlock?: AlignBlock;

  /**
   * Used to align children along the cross axis.
   */
  alignInline?: AlignInline;

  /**
   * Used to set whether children are forced onto one line or will wrap onto multiple lines.
   */
  shouldWrap?: boolean;

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
   * Renders a separator string between each child.
   */
  separator?: string;

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
export type AlignBlock = 'start' | 'center' | 'end' | 'baseline';
export type Spread = 'space-between';
export type Grow = 'hug' | 'fill';

const alignItemsMap = {
  center: css({ alignItems: 'center' }),
  baseline: css({ alignItems: 'baseline' }),
  start: css({ alignItems: 'flex-start' }),
  end: css({ alignItems: 'flex-end' }),
};

const justifyContentMap = {
  start: css({ justifyContent: 'flex-start' }),
  center: css({ justifyContent: 'center' }),
  end: css({ justifyContent: 'flex-end' }),
  'space-between': css({ justifyContent: 'space-between' }),
};

const flexGrowMap = {
  hug: css({ flexGrow: 0 }),
  fill: css({ flexGrow: 1 }),
};

const flexWrapStyles = css({ flexWrap: 'wrap' });

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::0e30ffcc6aef7932f9d8ff2543327236>>
 * @codegenId spacing
 * @codegenCommand yarn codegen-styles
 * @codegenParams ["space"]
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-spacing.tsx <<SignedSource::167d3b69b159ae33e74d4ea5ab7eade6>>
 */
const spaceMap = Object.fromEntries(
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

export type Space = keyof typeof spaceMap.gap;

/**
 * @codegenEnd
 */

const baseStyles = css({
  display: 'flex',
  boxSizing: 'border-box',
  flexDirection: 'row',
});

const separatorStyles = css({
  color: token('color.text.subtle', '#42526E'),
  marginBlock: token('space.0', '0px'),
  marginInline: `-${token('space.025', '2px')}`,
  pointerEvents: 'none',
  userSelect: 'none',
});

const Separator: FC = ({ children }) => (
  <span css={separatorStyles}>{children}</span>
);

/**
 * __Inline__
 *
 * Inline is a primitive component based on flexbox that manages the horizontal layout of direct children.
 *
 *
 * @example
 * ```tsx
 *  <Inline>
 *    <Box padding="space.100" backgroundColor="neutral"></Box>
 *    <Box padding="space.100" backgroundColor="neutral"></Box>
 *  </Inline>
 * ```
 *
 */
const Inline = memo(
  forwardRef<HTMLDivElement, InlineProps>(
    (
      {
        alignInline,
        alignBlock: alignItems,
        shouldWrap = false,
        spread,
        grow,
        space,
        separator,
        testId,
        children: rawChildren,
      }: InlineProps,
      ref,
    ) => {
      const separatorComponent =
        typeof separator === 'string' ? (
          <Separator>{separator}</Separator>
        ) : (
          separator
        );

      const children = separatorComponent
        ? Children.toArray(rawChildren)
            .filter(Boolean)
            .map((child, index) => {
              return (
                <Fragment key={index}>
                  {separator && index > 0 ? separatorComponent : null}
                  {child}
                </Fragment>
              );
            })
        : rawChildren;

      const justifyContent = spread || alignInline;

      return (
        <div
          css={[
            baseStyles,
            space && spaceMap.gap[space],
            justifyContent && justifyContentMap[justifyContent],
            grow && flexGrowMap[grow],
            alignItems && alignItemsMap[alignItems],
            shouldWrap && flexWrapStyles,
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

Inline.displayName = 'Inline';

export default Inline;
