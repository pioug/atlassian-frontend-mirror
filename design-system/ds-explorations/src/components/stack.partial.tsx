/** @jsx jsx */
import { forwardRef, memo, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { BasePrimitiveProps } from './types';

interface StackProps extends BasePrimitiveProps {
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
  gap: RowGap;
  /**
   * Elements to be rendered inside the Stack.
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
  flexEnd: css({ justifyContent: 'flex-end' }),
  start: css({ justifyContent: 'start' }),
  end: css({ justifyContent: 'end' }),
};

type FlexWrap = keyof typeof flexWrapMap;
const flexWrapMap = {
  wrap: css({ flexWrap: 'wrap' }),
};

const baseStyles = css({
  display: 'flex',
  boxSizing: 'border-box',
  flexDirection: 'column',
});

/**
 * __Stack__
 *
 * Stack is a primitive component based on flexbox that manages the vertical layout of direct children.
 * Renders a `div` by default.
 *
 */
const Stack = memo(
  forwardRef<HTMLDivElement, StackProps>(
    (
      {
        gap,
        alignItems,
        justifyContent,
        flexWrap,
        children,
        UNSAFE_style,
        testId,
      },
      ref,
    ) => {
      return (
        <div
          style={UNSAFE_style}
          css={[
            baseStyles,
            gap && rowGapMap[gap],
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

Stack.displayName = 'Stack';

export default Stack;

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::e574cf3d5b059f96c6158508fae4a064>>
 * @codegenId spacing
 * @codegenCommand yarn codegen-styles
 * @codegenParams ["rowGap"]
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-spacing.tsx <<SignedSource::a2b43f8447798dfdd9c6223bd22b78c7>>
 */
const rowGapMap = {
  'scale.0': css({
    rowGap: token('space.0', '0px'),
  }),
  'scale.025': css({
    rowGap: token('space.025', '2px'),
  }),
  'scale.050': css({
    rowGap: token('space.050', '4px'),
  }),
  'scale.075': css({
    rowGap: token('space.075', '6px'),
  }),
  'scale.100': css({
    rowGap: token('space.100', '8px'),
  }),
  'scale.1000': css({
    rowGap: token('space.1000', '80px'),
  }),
  'scale.150': css({
    rowGap: token('space.150', '12px'),
  }),
  'scale.200': css({
    rowGap: token('space.200', '16px'),
  }),
  'scale.250': css({
    rowGap: token('space.250', '20px'),
  }),
  'scale.300': css({
    rowGap: token('space.300', '24px'),
  }),
  'scale.400': css({
    rowGap: token('space.400', '32px'),
  }),
  'scale.500': css({
    rowGap: token('space.500', '40px'),
  }),
  'scale.600': css({
    rowGap: token('space.600', '48px'),
  }),
  'scale.800': css({
    rowGap: token('space.800', '64px'),
  }),
};

export type RowGap = keyof typeof rowGapMap;

/**
 * @codegenEnd
 */
