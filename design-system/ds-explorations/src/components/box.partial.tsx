/** @jsx jsx */
import { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import { token } from '@atlaskit/tokens';

import { GlobalSpacingToken, SPACING_SCALE } from '../constants';

export interface BoxProps extends HTMLAttributes<HTMLElement> {
  /**
   * The DOM element to render as the Box. Defaults to `div`.
   */
  as?: ElementType;
  /**
   * A unique string that appears as data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
   */
  testId?: string;
  children: ReactNode;
  /**
   * Token representing background color.
   */
  backgroundColor?: BackgroundColor;
  /**
   * Token representing border color. When a border color is provided, border styles default to `2px solid`. This can be overriden with `styles`.
   */
  borderColor?: BorderColor;
  /**
   * The flex property
   */
  justifyContent?: CSSProperties['justifyContent'];
  /**
   * The flex property
   */
  flexDirection?: keyof typeof flexDirectionMap;
  /**
   * The flex property
   */
  alignItems?: keyof typeof flexAlignMap;
  borderRadius?: BorderRadius;
  paddingBlock?: GlobalSpacingToken;
  paddingInline?: GlobalSpacingToken;
  width?: GlobalSpacingToken;
  height?: GlobalSpacingToken;
  gap?: GlobalSpacingToken;
  display?: Display;
}

type BorderRadius = keyof typeof borderRadiusMap;

const borderRadiusMap = {
  normal: css({ borderRadius: '3px' }),
  rounded: css({ borderRadius: '50%' }),
  badge: css({ borderRadius: '8px' }),
};

const flexDirectionMap = {
  column: css({ flexDirection: 'column' }),
  row: css({ flexDirection: 'row' }),
};

const flexAlignMap = {
  center: css({ alignItems: 'center' }),
  baseline: css({ alignItems: 'baseline' }),
};

type Display = keyof typeof displayMap;

const displayMap = {
  flex: css({ display: 'flex' }),
  inline: css({ display: 'inline' }),
  inlineFlex: css({ display: 'inline-flex' }),
};

/**
 * __Box__
 *
 * A Box {description}.
 *
 * @internal
 */
function Box({
  children,
  as: Component = 'div',
  backgroundColor,
  borderColor,
  borderRadius,
  alignItems,
  flexDirection,
  paddingBlock,
  paddingInline,
  gap,
  height,
  width,
  display = 'flex', // should this be the default? i've just set it as the default here to avoid breaking anyone's implem
  style,
  testId,
  /**
   * Pull this out to prevent accidentaly spread
   */
  // @ts-ignore
  // @eslint-disbale-next-line no-unused-vars
  className: dontUseThisProperty,
  ...htmlAttributes
}: BoxProps) {
  return (
    <Component
      style={style}
      // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
      {...htmlAttributes}
      css={[
        display && displayMap[display],
        paddingBlock && paddingBlockMap[paddingBlock],
        paddingInline && paddingInlineMap[paddingInline],
        alignItems && flexAlignMap[alignItems],
        backgroundColor && backgroundColorMap[backgroundColor],
        borderColor && borderColorMap[borderColor],
        borderRadius && borderRadiusMap[borderRadius],
        flexDirection && flexDirectionMap[flexDirection],
        gap && gapMap[gap],
        width && widthMap[width],
        height && heightMap[height],
      ]}
      data-testid={testId}
    >
      {children}
    </Component>
  );
}

export default Box;

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7bc92b308b72d1fe4aa9d758c2d1b073>>
 * @codegenId spacing
 * @codegenCommand yarn codegen-styles
 * @codegenParams ["paddingBlock", "paddingInline", "width", "height", "gap"]
 */
const paddingBlockMap = {
  'sp-25': css({ paddingBlock: SPACING_SCALE['sp-25'] }),
  'sp-50': css({ paddingBlock: SPACING_SCALE['sp-50'] }),
  'sp-75': css({ paddingBlock: SPACING_SCALE['sp-75'] }),
  'sp-100': css({ paddingBlock: SPACING_SCALE['sp-100'] }),
  'sp-200': css({ paddingBlock: SPACING_SCALE['sp-200'] }),
  'sp-300': css({ paddingBlock: SPACING_SCALE['sp-300'] }),
  'sp-400': css({ paddingBlock: SPACING_SCALE['sp-400'] }),
  'sp-600': css({ paddingBlock: SPACING_SCALE['sp-600'] }),
  'sp-800': css({ paddingBlock: SPACING_SCALE['sp-800'] }),
};

const paddingInlineMap = {
  'sp-25': css({ paddingInline: SPACING_SCALE['sp-25'] }),
  'sp-50': css({ paddingInline: SPACING_SCALE['sp-50'] }),
  'sp-75': css({ paddingInline: SPACING_SCALE['sp-75'] }),
  'sp-100': css({ paddingInline: SPACING_SCALE['sp-100'] }),
  'sp-200': css({ paddingInline: SPACING_SCALE['sp-200'] }),
  'sp-300': css({ paddingInline: SPACING_SCALE['sp-300'] }),
  'sp-400': css({ paddingInline: SPACING_SCALE['sp-400'] }),
  'sp-600': css({ paddingInline: SPACING_SCALE['sp-600'] }),
  'sp-800': css({ paddingInline: SPACING_SCALE['sp-800'] }),
};

const widthMap = {
  'sp-25': css({ width: SPACING_SCALE['sp-25'] }),
  'sp-50': css({ width: SPACING_SCALE['sp-50'] }),
  'sp-75': css({ width: SPACING_SCALE['sp-75'] }),
  'sp-100': css({ width: SPACING_SCALE['sp-100'] }),
  'sp-200': css({ width: SPACING_SCALE['sp-200'] }),
  'sp-300': css({ width: SPACING_SCALE['sp-300'] }),
  'sp-400': css({ width: SPACING_SCALE['sp-400'] }),
  'sp-600': css({ width: SPACING_SCALE['sp-600'] }),
  'sp-800': css({ width: SPACING_SCALE['sp-800'] }),
};

const heightMap = {
  'sp-25': css({ height: SPACING_SCALE['sp-25'] }),
  'sp-50': css({ height: SPACING_SCALE['sp-50'] }),
  'sp-75': css({ height: SPACING_SCALE['sp-75'] }),
  'sp-100': css({ height: SPACING_SCALE['sp-100'] }),
  'sp-200': css({ height: SPACING_SCALE['sp-200'] }),
  'sp-300': css({ height: SPACING_SCALE['sp-300'] }),
  'sp-400': css({ height: SPACING_SCALE['sp-400'] }),
  'sp-600': css({ height: SPACING_SCALE['sp-600'] }),
  'sp-800': css({ height: SPACING_SCALE['sp-800'] }),
};

const gapMap = {
  'sp-25': css({ gap: SPACING_SCALE['sp-25'] }),
  'sp-50': css({ gap: SPACING_SCALE['sp-50'] }),
  'sp-75': css({ gap: SPACING_SCALE['sp-75'] }),
  'sp-100': css({ gap: SPACING_SCALE['sp-100'] }),
  'sp-200': css({ gap: SPACING_SCALE['sp-200'] }),
  'sp-300': css({ gap: SPACING_SCALE['sp-300'] }),
  'sp-400': css({ gap: SPACING_SCALE['sp-400'] }),
  'sp-600': css({ gap: SPACING_SCALE['sp-600'] }),
  'sp-800': css({ gap: SPACING_SCALE['sp-800'] }),
};

/**
 * @codegenEnd
 */

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::f48a8ffccf0c385e9e05322037509c45>>
 * @codegenId colors
 * @codegenCommand yarn codegen-styles
 * @codegenParams ["border", "background"]
 */
const borderColorMap = {
  default: css({
    borderColor: token('color.border', '#091E4224'),
  }),
  bold: css({
    borderColor: token('color.border.bold', '#758195'),
  }),
  inverse: css({
    borderColor: token('color.border.inverse', '#FFFFFF'),
  }),
  focused: css({
    borderColor: token('color.border.focused', '#388BFF'),
  }),
  input: css({
    borderColor: token('color.border.input', '#091E4224'),
  }),
  disabled: css({
    borderColor: token('color.border.disabled', '#091E420F'),
  }),
  brand: css({
    borderColor: token('color.border.brand', '#0C66E4'),
  }),
  selected: css({
    borderColor: token('color.border.selected', '#0C66E4'),
  }),
  danger: css({
    borderColor: token('color.border.danger', '#E34935'),
  }),
  warning: css({
    borderColor: token('color.border.warning', '#D97008'),
  }),
  success: css({
    borderColor: token('color.border.success', '#22A06B'),
  }),
  discovery: css({
    borderColor: token('color.border.discovery', '#8270DB'),
  }),
  information: css({
    borderColor: token('color.border.information', '#1D7AFC'),
  }),
};

type BorderColor = keyof typeof borderColorMap;

const backgroundColorMap = {
  disabled: css({
    backgroundColor: token('color.background.disabled', '#091E4208'),
  }),
  'inverse.subtle': css({
    backgroundColor: token('color.background.inverse.subtle', '#00000029'),
  }),
  input: css({
    backgroundColor: token('color.background.input', '#FFFFFF'),
  }),
  neutral: css({
    backgroundColor: token('color.background.neutral', '#091E420F'),
  }),
  'neutral.subtle': css({
    backgroundColor: token('color.background.neutral.subtle', '#00000000'),
  }),
  'neutral.bold': css({
    backgroundColor: token('color.background.neutral.bold', '#44546F'),
  }),
  'brand.bold': css({
    backgroundColor: token('color.background.brand.bold', '#0C66E4'),
  }),
  selected: css({
    backgroundColor: token('color.background.selected', '#E9F2FF'),
  }),
  'selected.bold': css({
    backgroundColor: token('color.background.selected.bold', '#0C66E4'),
  }),
  danger: css({
    backgroundColor: token('color.background.danger', '#FFEDEB'),
  }),
  'danger.bold': css({
    backgroundColor: token('color.background.danger.bold', '#CA3521'),
  }),
  warning: css({
    backgroundColor: token('color.background.warning', '#FFF7D6'),
  }),
  'warning.bold': css({
    backgroundColor: token('color.background.warning.bold', '#E2B203'),
  }),
  success: css({
    backgroundColor: token('color.background.success', '#DFFCF0'),
  }),
  'success.bold': css({
    backgroundColor: token('color.background.success.bold', '#1F845A'),
  }),
  discovery: css({
    backgroundColor: token('color.background.discovery', '#F3F0FF'),
  }),
  'discovery.bold': css({
    backgroundColor: token('color.background.discovery.bold', '#6E5DC6'),
  }),
  information: css({
    backgroundColor: token('color.background.information', '#E9F2FF'),
  }),
  'information.bold': css({
    backgroundColor: token('color.background.information.bold', '#0C66E4'),
  }),
};

type BackgroundColor = keyof typeof backgroundColorMap;

/**
 * @codegenEnd
 */
