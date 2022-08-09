/** @jsx jsx */
import {
  CSSProperties,
  ElementType,
  forwardRef,
  HTMLAttributes,
  ReactNode,
} from 'react';

import { css, jsx } from '@emotion/core';

import { token } from '@atlaskit/tokens';

import { GlobalSpacingToken, SPACING_SCALE } from '../constants';

import { BasePrimitiveProps } from './types';

export interface BoxProps
  extends Omit<HTMLAttributes<HTMLElement>, 'style'>,
    BasePrimitiveProps {
  /**
   * The DOM element to render as the Box. Defaults to `div`.
   */
  as?: ElementType;
  /**
   * Elements to be rendered inside the Box.
   */
  children: ReactNode;
  /**
   * Token representing background color with a fallback.
   */
  backgroundColor?: [BackgroundColor, string];
  /**
   * Defines border style.
   */
  borderStyle?: BorderStyle;
  /**
   * Defines border width.
   */
  borderWidth?: BorderWidth;
  /**
   * Token representing border color with a fallback.
   */
  borderColor?: [BorderColor, string];
  /**
   * Defines border radius.
   */
  borderRadius?: BorderRadius;
  /**
   * Defines the main axis direction.
   */
  flexDirection?: FlexDirection;
  /**
   * Used to align children along the cross axis.
   */
  alignItems?: FlexAlignItems;
  /**
   * Used to align children along the main axis.
   */
  justifyContent?: FlexJustifyContent;
  /**
   * Shorthand for `paddingBlock` and `paddingInline` together.
   *
   * @see paddingBlock
   * @see paddingInline
   */
  padding?: GlobalSpacingToken;
  /**
   * Token representing CSS `padding-block`.
   */
  paddingBlock?: GlobalSpacingToken;
  /**
   * Token representing CSS `padding-inline`.
   */
  paddingInline?: GlobalSpacingToken;
  /**
   * Token representing width.
   */
  width?: GlobalSpacingToken;
  /**
   * Token representing height.
   */
  height?: GlobalSpacingToken;
  /**
   * Defines display type and layout. Defaults to `flex`.
   */
  display?: Display;
}

type BorderStyle = keyof typeof borderStyleMap;
const borderStyleMap = {
  none: css({ borderStyle: 'none' }),
  solid: css({ borderStyle: 'solid' }),
  dashed: css({ borderStyle: 'dashed' }),
  dotted: css({ borderStyle: 'dotted' }),
};

type BorderWidth = keyof typeof borderWidthMap;
const borderWidthMap = {
  '0px': css({ borderWidth: '0px' }),
  '1px': css({ borderWidth: '1px' }),
  '2px': css({ borderWidth: '2px' }),
  '3px': css({ borderWidth: '3px' }),
};

type BorderRadius = keyof typeof borderRadiusMap;
const borderRadiusMap = {
  normal: css({ borderRadius: '3px' }),
  rounded: css({ borderRadius: '50%' }),
  badge: css({ borderRadius: '8px' }),
};

type FlexDirection = keyof typeof flexDirectionMap;
const flexDirectionMap = {
  column: css({ flexDirection: 'column' }),
  row: css({ flexDirection: 'row' }),
};

type FlexAlignItems = keyof typeof flexAlignItemsMap;
const flexAlignItemsMap = {
  center: css({ alignItems: 'center' }),
  baseline: css({ alignItems: 'baseline' }),
  flexStart: css({ alignItems: 'flex-start' }),
  flexEnd: css({ alignItems: 'flex-end' }),
};

type FlexJustifyContent = keyof typeof flexJustifyContentMap;
const flexJustifyContentMap = {
  center: css({ justifyContent: 'center' }),
  flexStart: css({ justifyContent: 'flex-start' }),
  flexEnd: css({ justifyContent: 'flex-end' }),
};

type Display = keyof typeof displayMap;
const displayMap = {
  block: css({ display: 'block' }),
  inline: css({ display: 'inline' }),
  flex: css({ display: 'flex' }),
  inlineFlex: css({ display: 'inline-flex' }),
};

const baseStyles = css({
  boxSizing: 'border-box',
});

/**
 * __Box__
 *
 * Box is a primitive component that has the design decisions of the Atlassian Design System baked in.
 * Renders a `div` by default.
 *
 * @internal
 */
const Box = forwardRef<HTMLElement, BoxProps>(
  (
    {
      children,
      as: Component = 'div',
      display = 'flex',
      flexDirection,
      alignItems,
      justifyContent,
      backgroundColor: backgroundColorTuple,
      borderColor: borderColorTuple,
      borderStyle,
      borderWidth,
      borderRadius,
      padding,
      paddingBlock,
      paddingInline,
      height,
      width,
      UNSAFE_style,
      testId,
      /**
       * Pull this out to prevent accidentaly spread
       */
      // @ts-ignore
      // @eslint-disbale-next-line no-unused-vars
      className: dontUseThisProperty,
      ...htmlAttributes
    },
    ref,
  ) => {
    const [backgroundColor, backgroundColorFallback] =
      backgroundColorTuple || [];
    const [borderColor, borderColorFallback] = borderColorTuple || [];
    return (
      <Component
        style={{
          ...UNSAFE_style,
          ...(backgroundColorFallback &&
            ({ '--ds-bg-fb': backgroundColorFallback } as CSSProperties)),
          ...(borderColorFallback &&
            ({ '--ds-bo-fb': borderColorFallback } as CSSProperties)),
        }}
        ref={ref}
        // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
        {...htmlAttributes}
        css={[
          baseStyles,
          display && displayMap[display],
          padding && paddingMap[padding],
          paddingBlock && paddingBlockMap[paddingBlock],
          paddingInline && paddingInlineMap[paddingInline],
          alignItems && flexAlignItemsMap[alignItems],
          justifyContent && flexJustifyContentMap[justifyContent],
          backgroundColor && backgroundColorMap[backgroundColor],
          borderColor && borderColorMap[borderColor],
          borderStyle && borderStyleMap[borderStyle],
          borderWidth && borderWidthMap[borderWidth],
          borderRadius && borderRadiusMap[borderRadius],
          flexDirection && flexDirectionMap[flexDirection],
          width && widthMap[width],
          height && heightMap[height],
        ]}
        data-testid={testId}
      >
        {children}
      </Component>
    );
  },
);

export default Box;

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::c20a27ff33adec8c016044959564409d>>
 * @codegenId spacing
 * @codegenCommand yarn codegen-styles
 * @codegenParams ["padding", "paddingBlock", "paddingInline", "width", "height"]
 */
const paddingMap = {
  'sp-0': css({ padding: SPACING_SCALE['sp-0'] }),
  'sp-25': css({ padding: SPACING_SCALE['sp-25'] }),
  'sp-50': css({ padding: SPACING_SCALE['sp-50'] }),
  'sp-75': css({ padding: SPACING_SCALE['sp-75'] }),
  'sp-100': css({ padding: SPACING_SCALE['sp-100'] }),
  'sp-200': css({ padding: SPACING_SCALE['sp-200'] }),
  'sp-300': css({ padding: SPACING_SCALE['sp-300'] }),
  'sp-400': css({ padding: SPACING_SCALE['sp-400'] }),
  'sp-500': css({ padding: SPACING_SCALE['sp-500'] }),
  'sp-600': css({ padding: SPACING_SCALE['sp-600'] }),
  'sp-800': css({ padding: SPACING_SCALE['sp-800'] }),
};

const paddingBlockMap = {
  'sp-0': css({ paddingBlock: SPACING_SCALE['sp-0'] }),
  'sp-25': css({ paddingBlock: SPACING_SCALE['sp-25'] }),
  'sp-50': css({ paddingBlock: SPACING_SCALE['sp-50'] }),
  'sp-75': css({ paddingBlock: SPACING_SCALE['sp-75'] }),
  'sp-100': css({ paddingBlock: SPACING_SCALE['sp-100'] }),
  'sp-200': css({ paddingBlock: SPACING_SCALE['sp-200'] }),
  'sp-300': css({ paddingBlock: SPACING_SCALE['sp-300'] }),
  'sp-400': css({ paddingBlock: SPACING_SCALE['sp-400'] }),
  'sp-500': css({ paddingBlock: SPACING_SCALE['sp-500'] }),
  'sp-600': css({ paddingBlock: SPACING_SCALE['sp-600'] }),
  'sp-800': css({ paddingBlock: SPACING_SCALE['sp-800'] }),
};

const paddingInlineMap = {
  'sp-0': css({ paddingInline: SPACING_SCALE['sp-0'] }),
  'sp-25': css({ paddingInline: SPACING_SCALE['sp-25'] }),
  'sp-50': css({ paddingInline: SPACING_SCALE['sp-50'] }),
  'sp-75': css({ paddingInline: SPACING_SCALE['sp-75'] }),
  'sp-100': css({ paddingInline: SPACING_SCALE['sp-100'] }),
  'sp-200': css({ paddingInline: SPACING_SCALE['sp-200'] }),
  'sp-300': css({ paddingInline: SPACING_SCALE['sp-300'] }),
  'sp-400': css({ paddingInline: SPACING_SCALE['sp-400'] }),
  'sp-500': css({ paddingInline: SPACING_SCALE['sp-500'] }),
  'sp-600': css({ paddingInline: SPACING_SCALE['sp-600'] }),
  'sp-800': css({ paddingInline: SPACING_SCALE['sp-800'] }),
};

const widthMap = {
  'sp-0': css({ width: SPACING_SCALE['sp-0'] }),
  'sp-25': css({ width: SPACING_SCALE['sp-25'] }),
  'sp-50': css({ width: SPACING_SCALE['sp-50'] }),
  'sp-75': css({ width: SPACING_SCALE['sp-75'] }),
  'sp-100': css({ width: SPACING_SCALE['sp-100'] }),
  'sp-200': css({ width: SPACING_SCALE['sp-200'] }),
  'sp-300': css({ width: SPACING_SCALE['sp-300'] }),
  'sp-400': css({ width: SPACING_SCALE['sp-400'] }),
  'sp-500': css({ width: SPACING_SCALE['sp-500'] }),
  'sp-600': css({ width: SPACING_SCALE['sp-600'] }),
  'sp-800': css({ width: SPACING_SCALE['sp-800'] }),
};

const heightMap = {
  'sp-0': css({ height: SPACING_SCALE['sp-0'] }),
  'sp-25': css({ height: SPACING_SCALE['sp-25'] }),
  'sp-50': css({ height: SPACING_SCALE['sp-50'] }),
  'sp-75': css({ height: SPACING_SCALE['sp-75'] }),
  'sp-100': css({ height: SPACING_SCALE['sp-100'] }),
  'sp-200': css({ height: SPACING_SCALE['sp-200'] }),
  'sp-300': css({ height: SPACING_SCALE['sp-300'] }),
  'sp-400': css({ height: SPACING_SCALE['sp-400'] }),
  'sp-500': css({ height: SPACING_SCALE['sp-500'] }),
  'sp-600': css({ height: SPACING_SCALE['sp-600'] }),
  'sp-800': css({ height: SPACING_SCALE['sp-800'] }),
};

/**
 * @codegenEnd
 */

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::e3f27406477352f51168b4108558f051>>
 * @codegenId colors
 * @codegenCommand yarn codegen-styles
 * @codegenParams ["border", "background"]
 */
const borderColorMap = {
  'color.border': css({
    borderColor: token('color.border', 'var(--ds-bo-fb)'),
  }),
  bold: css({
    borderColor: token('color.border.bold', 'var(--ds-bo-fb)'),
  }),
  inverse: css({
    borderColor: token('color.border.inverse', 'var(--ds-bo-fb)'),
  }),
  focused: css({
    borderColor: token('color.border.focused', 'var(--ds-bo-fb)'),
  }),
  input: css({
    borderColor: token('color.border.input', 'var(--ds-bo-fb)'),
  }),
  disabled: css({
    borderColor: token('color.border.disabled', 'var(--ds-bo-fb)'),
  }),
  brand: css({
    borderColor: token('color.border.brand', 'var(--ds-bo-fb)'),
  }),
  selected: css({
    borderColor: token('color.border.selected', 'var(--ds-bo-fb)'),
  }),
  danger: css({
    borderColor: token('color.border.danger', 'var(--ds-bo-fb)'),
  }),
  warning: css({
    borderColor: token('color.border.warning', 'var(--ds-bo-fb)'),
  }),
  success: css({
    borderColor: token('color.border.success', 'var(--ds-bo-fb)'),
  }),
  discovery: css({
    borderColor: token('color.border.discovery', 'var(--ds-bo-fb)'),
  }),
  information: css({
    borderColor: token('color.border.information', 'var(--ds-bo-fb)'),
  }),
};

type BorderColor = keyof typeof borderColorMap;

const backgroundColorMap = {
  disabled: css({
    backgroundColor: token('color.background.disabled', 'var(--ds-bg-fb)'),
  }),
  'inverse.subtle': css({
    backgroundColor: token(
      'color.background.inverse.subtle',
      'var(--ds-bg-fb)',
    ),
  }),
  input: css({
    backgroundColor: token('color.background.input', 'var(--ds-bg-fb)'),
  }),
  neutral: css({
    backgroundColor: token('color.background.neutral', 'var(--ds-bg-fb)'),
  }),
  'neutral.subtle': css({
    backgroundColor: token(
      'color.background.neutral.subtle',
      'var(--ds-bg-fb)',
    ),
  }),
  'neutral.bold': css({
    backgroundColor: token('color.background.neutral.bold', 'var(--ds-bg-fb)'),
  }),
  'brand.bold': css({
    backgroundColor: token('color.background.brand.bold', 'var(--ds-bg-fb)'),
  }),
  selected: css({
    backgroundColor: token('color.background.selected', 'var(--ds-bg-fb)'),
  }),
  'selected.bold': css({
    backgroundColor: token('color.background.selected.bold', 'var(--ds-bg-fb)'),
  }),
  danger: css({
    backgroundColor: token('color.background.danger', 'var(--ds-bg-fb)'),
  }),
  'danger.bold': css({
    backgroundColor: token('color.background.danger.bold', 'var(--ds-bg-fb)'),
  }),
  warning: css({
    backgroundColor: token('color.background.warning', 'var(--ds-bg-fb)'),
  }),
  'warning.bold': css({
    backgroundColor: token('color.background.warning.bold', 'var(--ds-bg-fb)'),
  }),
  success: css({
    backgroundColor: token('color.background.success', 'var(--ds-bg-fb)'),
  }),
  'success.bold': css({
    backgroundColor: token('color.background.success.bold', 'var(--ds-bg-fb)'),
  }),
  discovery: css({
    backgroundColor: token('color.background.discovery', 'var(--ds-bg-fb)'),
  }),
  'discovery.bold': css({
    backgroundColor: token(
      'color.background.discovery.bold',
      'var(--ds-bg-fb)',
    ),
  }),
  information: css({
    backgroundColor: token('color.background.information', 'var(--ds-bg-fb)'),
  }),
  'information.bold': css({
    backgroundColor: token(
      'color.background.information.bold',
      'var(--ds-bg-fb)',
    ),
  }),
  'color.blanket': css({
    backgroundColor: token('color.blanket', 'var(--ds-bg-fb)'),
  }),
  'color.blanket.selected': css({
    backgroundColor: token('color.blanket.selected', 'var(--ds-bg-fb)'),
  }),
  'color.blanket.danger': css({
    backgroundColor: token('color.blanket.danger', 'var(--ds-bg-fb)'),
  }),
  'elevation.surface': css({
    backgroundColor: token('elevation.surface', 'var(--ds-bg-fb)'),
  }),
  'elevation.surface.sunken': css({
    backgroundColor: token('elevation.surface.sunken', 'var(--ds-bg-fb)'),
  }),
  'elevation.surface.raised': css({
    backgroundColor: token('elevation.surface.raised', 'var(--ds-bg-fb)'),
  }),
  'elevation.surface.overlay': css({
    backgroundColor: token('elevation.surface.overlay', 'var(--ds-bg-fb)'),
  }),
};

type BackgroundColor = keyof typeof backgroundColorMap;

/**
 * @codegenEnd
 */
