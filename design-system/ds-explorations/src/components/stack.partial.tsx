/** @jsx jsx */
import { forwardRef, memo, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { BasePrimitiveProps } from './types';

/**
 * @private
 * @deprecated DSP-8009: This type is scheduled for deletion.
 * Please use `Stack` from `@atlaskit/primitives` instead.
 */
export interface StackProps extends BasePrimitiveProps {
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
 * @private
 * @deprecated DSP-8009: This primitive is scheduled for deletion.
 * Please use `Stack` from `@atlaskit/primitives` instead.
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
 * @codegen <<SignedSource::02ffa7c4ee52871441d288f44a054685>>
 * @codegenId spacing
 * @codegenCommand yarn codegen-styles
 * @codegenParams ["rowGap"]
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-spacing.tsx <<SignedSource::298080e8024fb3eb37589721413e0156>>
 */
const rowGapMap = {
  'space.0': css({
    rowGap: token('space.0', '0px'),
  }),
  'space.025': css({
    rowGap: token('space.025', '2px'),
  }),
  'space.050': css({
    rowGap: token('space.050', '4px'),
  }),
  'space.075': css({
    rowGap: token('space.075', '6px'),
  }),
  'space.100': css({
    rowGap: token('space.100', '8px'),
  }),
  'space.1000': css({
    rowGap: token('space.1000', '80px'),
  }),
  'space.150': css({
    rowGap: token('space.150', '12px'),
  }),
  'space.200': css({
    rowGap: token('space.200', '16px'),
  }),
  'space.250': css({
    rowGap: token('space.250', '20px'),
  }),
  'space.300': css({
    rowGap: token('space.300', '24px'),
  }),
  'space.400': css({
    rowGap: token('space.400', '32px'),
  }),
  'space.500': css({
    rowGap: token('space.500', '40px'),
  }),
  'space.600': css({
    rowGap: token('space.600', '48px'),
  }),
  'space.800': css({
    rowGap: token('space.800', '64px'),
  }),
};

export type RowGap = keyof typeof rowGapMap;

/**
 * @codegenEnd
 */
