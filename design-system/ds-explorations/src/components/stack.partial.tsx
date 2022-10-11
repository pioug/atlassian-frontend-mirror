/** @jsx jsx */
import { forwardRef } from 'react';

import { css, jsx } from '@emotion/react';

import { GlobalSpacingToken, SPACING_SCALE } from '../constants';

import { BasePrimitiveProps, NonTextChildren } from './types';

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
  gap: GlobalSpacingToken;
  /**
   * Elements to be rendered inside the Stack.
   */
  children: NonTextChildren;
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
const Stack = forwardRef<HTMLDivElement, StackProps>(
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
        style={{ ...UNSAFE_style }}
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
);

Stack.displayName = 'Stack';

export default Stack;

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::13c9344cdb18845e176c0ca78b2972d3>>
 * @codegenId spacing
 * @codegenCommand yarn codegen-styles
 * @codegenParams ["rowGap"]
 */
const rowGapMap = {
  'sp-0': css({ rowGap: SPACING_SCALE['sp-0'] }),
  'sp-25': css({ rowGap: SPACING_SCALE['sp-25'] }),
  'sp-50': css({ rowGap: SPACING_SCALE['sp-50'] }),
  'sp-75': css({ rowGap: SPACING_SCALE['sp-75'] }),
  'sp-100': css({ rowGap: SPACING_SCALE['sp-100'] }),
  'sp-150': css({ rowGap: SPACING_SCALE['sp-150'] }),
  'sp-200': css({ rowGap: SPACING_SCALE['sp-200'] }),
  'sp-300': css({ rowGap: SPACING_SCALE['sp-300'] }),
  'sp-400': css({ rowGap: SPACING_SCALE['sp-400'] }),
  'sp-500': css({ rowGap: SPACING_SCALE['sp-500'] }),
  'sp-600': css({ rowGap: SPACING_SCALE['sp-600'] }),
  'sp-800': css({ rowGap: SPACING_SCALE['sp-800'] }),
};

/**
 * @codegenEnd
 */
