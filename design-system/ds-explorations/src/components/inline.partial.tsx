/** @jsx jsx */
import { Children, forwardRef, Fragment, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { GlobalSpacingToken, SPACING_SCALE } from '../constants';

import Text from './text.partial';
import { BasePrimitiveProps, NonTextChildren } from './types';

interface InlineProps extends BasePrimitiveProps {
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
   * Renders a divider between children.
   * If a string is provided it will automatically be wrapped in a `<Text>` component.
   */
  divider?: ReactNode;
  /**
   * Elements to be rendered inside the Inline.
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
  flexDirection: 'row',
});

/**
 * __Inline__
 *
 * Inline is a primitive component based on flexbox that manages the horizontal layout of direct children.
 * Renders a `div` by default.
 *
 */
const Inline = forwardRef<HTMLDivElement, InlineProps>(
  (
    {
      gap,
      alignItems,
      justifyContent,
      flexWrap,
      divider,
      UNSAFE_style,
      children,
      testId,
    },
    ref,
  ) => {
    const dividerComponent =
      typeof divider === 'string' ? <Text>{divider}</Text> : divider;

    return (
      <div
        style={{ ...UNSAFE_style }}
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
        {Children.map(children, (child, index) => {
          return (
            <Fragment>
              {divider && index > 0 ? dividerComponent : null}
              {child}
            </Fragment>
          );
        })}
      </div>
    );
  },
);

Inline.displayName = 'Inline';

export default Inline;

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7a985afa5e15ffd4f6f9c0db0e99ceb6>>
 * @codegenId spacing
 * @codegenCommand yarn codegen-styles
 * @codegenParams ["columnGap"]
 */
const columnGapMap = {
  'sp-0': css({ columnGap: SPACING_SCALE['sp-0'] }),
  'sp-25': css({ columnGap: SPACING_SCALE['sp-25'] }),
  'sp-50': css({ columnGap: SPACING_SCALE['sp-50'] }),
  'sp-75': css({ columnGap: SPACING_SCALE['sp-75'] }),
  'sp-100': css({ columnGap: SPACING_SCALE['sp-100'] }),
  'sp-150': css({ columnGap: SPACING_SCALE['sp-150'] }),
  'sp-200': css({ columnGap: SPACING_SCALE['sp-200'] }),
  'sp-300': css({ columnGap: SPACING_SCALE['sp-300'] }),
  'sp-400': css({ columnGap: SPACING_SCALE['sp-400'] }),
  'sp-500': css({ columnGap: SPACING_SCALE['sp-500'] }),
  'sp-600': css({ columnGap: SPACING_SCALE['sp-600'] }),
  'sp-800': css({ columnGap: SPACING_SCALE['sp-800'] }),
};

/**
 * @codegenEnd
 */
