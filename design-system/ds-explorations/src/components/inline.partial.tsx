/** @jsx jsx */
import { Children, FC, forwardRef, Fragment, memo, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import type { BasePrimitiveProps } from './types';

export interface InlineProps extends BasePrimitiveProps {
  /**
   * Used to align children along the cross axis.
   */
  alignItems?: FlexAlignItems;
  /**
   * Used to align children along the main axis.
   */
  justifyContent?: FlexJustifyContent;
  /**
   * Sets whether children are forced onto one line or can wrap onto multiple lines
   */
  flexWrap?: FlexWrap;
  /**
   * Token representing gap between children.
   */
  gap: ColumnGap;
  /**
   * Renders a divider between children.
   * If a string is provided it will automatically be wrapped in a `<Text>` component.
   */
  divider?: ReactNode;
  /**
   * Elements to be rendered inside the Inline.
   */
  children: ReactNode;
}

type FlexAlignItems = keyof typeof flexAlignItemsMap;
const flexAlignItemsMap = {
  center: css({ alignItems: 'center' }),
  baseline: css({ alignItems: 'baseline' }),
  flexStart: css({ alignItems: 'flex-start' }),
  flexEnd: css({ alignItems: 'flex-end' }),
  start: css({ alignItems: 'start' }),
  end: css({ alignItems: 'end' }),
};

type FlexJustifyContent = keyof typeof flexJustifyContentMap;
const flexJustifyContentMap = {
  center: css({ justifyContent: 'center' }),
  flexStart: css({ justifyContent: 'flex-start' }),
  'space-between': css({ justifyContent: 'space-between' }),
  flexEnd: css({ justifyContent: 'flex-end' }),
  start: css({ justifyContent: 'start' }),
  end: css({ justifyContent: 'end' }),
  spaceBetween: css({ justifyContent: 'space-between' }),
};

type FlexWrap = keyof typeof flexWrapMap;
const flexWrapMap = {
  wrap: css({ flexWrap: 'wrap' }),
};

const baseStyles = css({
  display: 'flex',
  boxSizing: 'border-box',
  flexDirection: 'row',
});

const dividerStyles = css({
  margin: '0 -2px',
  color: token('color.text.subtle', '#42526E'),
  pointerEvents: 'none',
  userSelect: 'none',
});

const Divider: FC = ({ children }) => (
  <span css={dividerStyles}>{children}</span>
);

/**
 * __Inline__
 *
 * Inline is a primitive component based on flexbox that manages the horizontal layout of direct children.
 * Renders a `div` by default.
 *
 * @example
 * ```tsx
 * const App = () => (
 *   <Inline gap="space.100">
 *     <Button />
 *     <Button />
 *   </Inline>
 * )
 * ```
 */
const Inline = memo(
  forwardRef<HTMLDivElement, InlineProps>(
    (
      {
        gap,
        alignItems,
        justifyContent,
        flexWrap,
        divider,
        UNSAFE_style,
        children: rawChildren,
        testId,
      },
      ref,
    ) => {
      const dividerComponent =
        typeof divider === 'string' ? <Divider>{divider}</Divider> : divider;

      const children = divider
        ? Children.toArray(rawChildren)
            .filter(Boolean)
            .map((child, index) => {
              return (
                <Fragment key={index}>
                  {divider && index > 0 ? dividerComponent : null}
                  {child}
                </Fragment>
              );
            })
        : rawChildren;

      return (
        <div
          style={UNSAFE_style}
          css={[
            baseStyles,
            gap && columnGapMap[gap],
            alignItems && flexAlignItemsMap[alignItems],
            justifyContent && flexJustifyContentMap[justifyContent],
            flexWrap && flexWrapMap[flexWrap],
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

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::e4218f7c850d1484a192d5b8b5dce136>>
 * @codegenId spacing
 * @codegenCommand yarn codegen-styles
 * @codegenParams ["columnGap"]
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-spacing.tsx <<SignedSource::b0b8f1a822ed84e0407ad83e6fda5a1c>>
 */
const columnGapMap = {
  'space.0': css({
    columnGap: token('space.0', '0px'),
  }),
  'space.025': css({
    columnGap: token('space.025', '2px'),
  }),
  'space.050': css({
    columnGap: token('space.050', '4px'),
  }),
  'space.075': css({
    columnGap: token('space.075', '6px'),
  }),
  'space.100': css({
    columnGap: token('space.100', '8px'),
  }),
  'space.1000': css({
    columnGap: token('space.1000', '80px'),
  }),
  'space.150': css({
    columnGap: token('space.150', '12px'),
  }),
  'space.200': css({
    columnGap: token('space.200', '16px'),
  }),
  'space.250': css({
    columnGap: token('space.250', '20px'),
  }),
  'space.300': css({
    columnGap: token('space.300', '24px'),
  }),
  'space.400': css({
    columnGap: token('space.400', '32px'),
  }),
  'space.500': css({
    columnGap: token('space.500', '40px'),
  }),
  'space.600': css({
    columnGap: token('space.600', '48px'),
  }),
  'space.800': css({
    columnGap: token('space.800', '64px'),
  }),
};

export type ColumnGap = keyof typeof columnGapMap;

/**
 * @codegenEnd
 */
