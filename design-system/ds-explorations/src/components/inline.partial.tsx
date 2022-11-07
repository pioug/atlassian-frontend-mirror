/** @jsx jsx */
import { Children, forwardRef, Fragment, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import Text from './text.partial';
import type { BasePrimitiveProps, NonTextChildren } from './types';

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
  gap: ColumnGap;
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
 * @codegen <<SignedSource::cff5655983f2243060cade5b107d7762>>
 * @codegenId spacing
 * @codegenCommand yarn codegen-styles
 * @codegenParams ["columnGap"]
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-light.tsx <<SignedSource::0c1fe9904b2ff2465a532b97ab76491e>>
 */
const columnGapMap = {
  'scale.0': css({
    columnGap: token('spacing.scale.0', '0px'),
  }),
  'scale.025': css({
    columnGap: token('spacing.scale.025', '2px'),
  }),
  'scale.050': css({
    columnGap: token('spacing.scale.050', '4px'),
  }),
  'scale.075': css({
    columnGap: token('spacing.scale.075', '6px'),
  }),
  'scale.100': css({
    columnGap: token('spacing.scale.100', '8px'),
  }),
  'scale.150': css({
    columnGap: token('spacing.scale.150', '12px'),
  }),
  'scale.200': css({
    columnGap: token('spacing.scale.200', '16px'),
  }),
  'scale.250': css({
    columnGap: token('spacing.scale.250', '20px'),
  }),
  'scale.300': css({
    columnGap: token('spacing.scale.300', '24px'),
  }),
  'scale.400': css({
    columnGap: token('spacing.scale.400', '32px'),
  }),
  'scale.500': css({
    columnGap: token('spacing.scale.500', '40px'),
  }),
  'scale.600': css({
    columnGap: token('spacing.scale.600', '48px'),
  }),
};

export type ColumnGap = keyof typeof columnGapMap;

/**
 * @codegenEnd
 */
