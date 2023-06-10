/* eslint-disable @repo/internal/styles/no-exported-styles */
/** @jsx jsx */
import {
  Children,
  ElementType,
  FC,
  forwardRef,
  Fragment,
  memo,
  ReactNode,
  Ref,
} from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { type Space, spaceStylesMap } from '../xcss/style-maps.partial';

export interface InlineProps<T extends ElementType = 'div'> {
  /**
   * The DOM element to render as the Inline. Defaults to `div`.
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
   * Used to set whether children are forced onto one line or will wrap onto multiple lines.
   */
  shouldWrap?: boolean;

  /**
   * Used to distribute the children along the main axis.
   */
  spread?: Spread;

  /**
   * Used to set whether the container should grow to fill the available space.
   */
  grow?: Grow;

  /**
   * Represents the space between each child.
   */
  space?: Space;

  /**
   * Represents the space between rows when content wraps.
   * Used to override the `space` value in between rows.
   */
  rowSpace?: Space;

  /**
   * Renders a separator string between each child.
   */
  separator?: string;

  /**
   * A unique string that appears as data attribute data-testid in the rendered code, serving as a hook for automated tests.
   */
  testId?: string;

  /**
   * Elements to be rendered inside the Inline.
   */
  children: ReactNode;

  /**
   * Forwarded ref element
   */
  ref?: React.ComponentPropsWithRef<T>['ref'];
}

export type AlignInline = 'start' | 'center' | 'end';
export type AlignBlock = 'start' | 'center' | 'end' | 'baseline' | 'stretch';
export type Spread = 'space-between';
export type Grow = 'hug' | 'fill';

const alignItemsMap = {
  center: css({ alignItems: 'center' }),
  baseline: css({ alignItems: 'baseline' }),
  start: css({ alignItems: 'flex-start' }),
  end: css({ alignItems: 'flex-end' }),
  stretch: css({ alignItems: 'stretch' }),
};

const justifyContentMap = {
  start: css({ justifyContent: 'flex-start' }),
  center: css({ justifyContent: 'center' }),
  end: css({ justifyContent: 'flex-end' }),
  'space-between': css({ justifyContent: 'space-between' }),
};

const flexGrowMap = {
  hug: css({ flexGrow: 0 }),
  fill: css({
    width: '100%',
    flexGrow: 1,
  }),
};

const flexWrapStyles = css({ flexWrap: 'wrap' });

const baseStyles = css({
  display: 'flex',
  boxSizing: 'border-box',
  flexDirection: 'row',
});

const separatorStyles = css({
  color: token('color.text.subtle', '#42526E'),
  marginBlock: token('space.0', '0px'),
  marginInline: `calc(-1 * ${token('space.025', '2px')})`,
  pointerEvents: 'none',
  userSelect: 'none',
});

const Separator: FC<{ children: string }> = ({ children }) => (
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
  forwardRef(
    <T extends ElementType = 'div'>(
      {
        as,
        alignInline,
        alignBlock: alignItems = 'start',
        shouldWrap = false,
        spread,
        grow,
        space,
        rowSpace,
        separator,
        testId,
        children: rawChildren,
      }: InlineProps<T>,
      ref: Ref<any>,
    ) => {
      const Component = as || 'div';
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
        <Component
          css={[
            baseStyles,
            space && spaceStylesMap.gap[space],
            justifyContent && justifyContentMap[justifyContent],
            grow && flexGrowMap[grow],
            alignItems && alignItemsMap[alignItems],
            shouldWrap && flexWrapStyles,
            rowSpace && spaceStylesMap.rowGap[rowSpace],
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

Inline.displayName = 'Inline';

export default Inline;
