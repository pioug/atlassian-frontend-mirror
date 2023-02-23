/** @jsx jsx */
import {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  FC,
  forwardRef,
  ReactElement,
  ReactNode,
} from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { Layer, LAYERS } from '../constants';

import { SurfaceContext } from './surface-provider';
import type { BasePrimitiveProps } from './types';

export type BoxProps<T extends ElementType = 'div'> = Omit<
  ComponentPropsWithoutRef<T>,
  'as' | 'className' | 'style'
> &
  BasePrimitiveProps &
  BoxPropsBase<T>;

type BoxPropsBase<T extends ElementType> = {
  /**
   * The DOM element to render as the Box. Defaults to `div`.
   */
  as?: T;
  /**
   * Elements to be rendered inside the Box.
   */
  children?: ReactNode;
  /**
   * The HTML className attribute.
   *
   * Before using this prop please ensure:
   * - The styles cannot otherwise be achieved through `Box` directly.
   * - The use case needs custom styles that cannot be designed or implemented differently
   *
   * Ensure you're using the `@atlaskit/eslint-plugin-design-system` with this prop to prevent unbounded usage.
   *
   * @see `@atlaskit/eslint-plugin-design-system`
   */
  className?: string;
  /**
   * Token representing background color with a fallback.
   */
  backgroundColor?: BackgroundColor;
  /**
   * Token representing shadow with a fallback
   */
  shadow?: Shadow;
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
  borderColor?: BorderColor;
  /**
   * Defines border radius.
   */
  borderRadius?: BorderRadius;
  /**
   * Used for providing a z-index.
   */
  layer?: Layer;
  /**
   * Defines the main axis direction.
   * @deprecated
   */
  flexDirection?: FlexDirection;
  /**
   * Used to align children along the cross axis.
   * @deprecated
   */
  alignItems?: FlexAlignItems;
  /**
   * Used to align children along the main axis.
   * @deprecated
   */
  justifyContent?: FlexJustifyContent;
  /**
   * Defines what happens if content overflows the box.
   */
  overflow?: Overflow;
  /**
   * Shorthand for `paddingBlock` and `paddingInline` together.
   *
   * @see paddingBlock
   * @see paddingInline
   */
  padding?: Padding;
  /**
   * Token representing CSS `paddingBlock`.
   */
  paddingBlock?: PaddingBlock;
  /**
   * Token representing CSS `paddingInline`.
   */
  paddingInline?: PaddingInline;
  /**
   * Token representing width.
   * @experimental The existing tokens will be replaced to better reflect dimensions.
   */
  width?: Width;
  /**
   * Token representing height.
   * @experimental The existing tokens will be replaced to better reflect dimensions.
   */
  height?: Height;
  /**
   * Defines display type and layout. Defaults to `flex`.
   */
  display?: Display;
  /**
   * CSS position property.
   */
  position?: Position;
  ref?: ComponentPropsWithRef<T>['ref'];
};

// Without this type annotation on Box we don't get autocomplete for props due to forwardRef types
type BoxComponent<T extends ElementType = 'div'> = (<
  T extends ElementType = 'div',
>(
  props: BoxProps<T>,
) => ReactElement | null) &
  FC<BoxProps<T>>;

/**
 * __Box__
 *
 * Box is a primitive component that has the design decisions of the Atlassian Design System baked in.
 * Renders a `div` by default.
 *
 * @internal
 */
export const Box: BoxComponent = forwardRef(
  <T extends ElementType = 'div'>(
    {
      children,
      as,
      className,
      display = 'flex',
      flexDirection,
      alignItems,
      justifyContent,
      backgroundColor,
      borderColor,
      borderStyle,
      borderWidth,
      borderRadius,
      shadow,
      layer,
      padding,
      paddingBlock,
      paddingInline,
      position = 'relative',
      height,
      overflow,
      width,
      UNSAFE_style,
      testId,
      ...htmlAttributes
    }: BoxProps<T>,
    ref?: ComponentPropsWithRef<T>['ref'],
  ) => {
    const Component = as || 'div';
    const node = (
      <Component
        style={UNSAFE_style}
        ref={ref}
        // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
        {...htmlAttributes}
        className={className}
        css={[
          baseStyles,
          display && displayMap[display],
          padding && paddingMap[padding],
          position && positionMap[position],
          paddingBlock && paddingBlockMap[paddingBlock],
          paddingInline && paddingInlineMap[paddingInline],
          alignItems && flexAlignItemsMap[alignItems],
          justifyContent && flexJustifyContentMap[justifyContent],
          backgroundColor && backgroundColorMap[backgroundColor],
          borderColor && borderColorMap[borderColor],
          borderStyle && borderStyleMap[borderStyle],
          borderWidth && borderWidthMap[borderWidth],
          borderRadius && borderRadiusMap[borderRadius],
          shadow && shadowMap[shadow],
          layer && layerMap[layer],
          flexDirection && flexDirectionMap[flexDirection],
          overflow && overflowMap[overflow],
          width && widthMap[width],
          height && heightMap[height],
        ]}
        data-testid={testId}
      >
        {children}
      </Component>
    );

    return backgroundColor ? (
      <SurfaceContext.Provider value={backgroundColor}>
        {node}
      </SurfaceContext.Provider>
    ) : (
      node
    );
  },
);

Box.displayName = 'Box';

export default Box;

// <<< STYLES GO HERE >>>
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
  normal: css({ borderRadius: token('border.radius.100', '3px') }),
  rounded: css({ borderRadius: '50%' }),
  badge: css({ borderRadius: '8px' }),
};

/**
 * @experimental - this is likely to be removed
 */
type FlexDirection = keyof typeof flexDirectionMap;
const flexDirectionMap = {
  column: css({ flexDirection: 'column' }),
  row: css({ flexDirection: 'row' }),
};

/**
 * @experimental - this is likely to be removed
 */
type FlexAlignItems = keyof typeof flexAlignItemsMap;
const flexAlignItemsMap = {
  center: css({ alignItems: 'center' }),
  baseline: css({ alignItems: 'baseline' }),
  flexStart: css({ alignItems: 'flex-start' }),
  flexEnd: css({ alignItems: 'flex-end' }),
  start: css({ alignItems: 'start' }),
  end: css({ alignItems: 'end' }),
};

/**
 * @experimental - this is likely to be removed
 */
type FlexJustifyContent = keyof typeof flexJustifyContentMap;
const flexJustifyContentMap = {
  center: css({ justifyContent: 'center' }),
  flexStart: css({ justifyContent: 'flex-start' }),
  flexEnd: css({ justifyContent: 'flex-end' }),
  start: css({ alignItems: 'start' }),
  end: css({ alignItems: 'end' }),
};

type Display = keyof typeof displayMap;
const displayMap = {
  block: css({ display: 'block' }),
  inline: css({ display: 'inline' }),
  flex: css({ display: 'flex' }),
  inlineFlex: css({ display: 'inline-flex' }),
  inlineBlock: css({ display: 'inline-block' }),
};

type Position = keyof typeof positionMap;
const positionMap = {
  absolute: css({ position: 'absolute' }),
  fixed: css({ position: 'fixed' }),
  relative: css({ position: 'relative' }),
  static: css({ position: 'static' }),
};

type Overflow = keyof typeof overflowMap;
const overflowMap = {
  auto: css({ overflow: 'auto' }),
  hidden: css({ overflow: 'hidden' }),
};

const baseStyles = css({
  boxSizing: 'border-box',
  appearance: 'none',
  border: 'none',
});

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::327e769aaa3da9422a919a0ca9490070>>
 * @codegenId dimensions
 * @codegenCommand yarn codegen-styles
 * @codegenParams ["width", "height"]
 */
const widthMap = {
  '100%': css({ width: '100%' }),
  'size.100': css({ width: '16px' }),
  'size.1000': css({ width: '192px' }),
  'size.200': css({ width: '24px' }),
  'size.300': css({ width: '32px' }),
  'size.400': css({ width: '40px' }),
  'size.500': css({ width: '48px' }),
  'size.600': css({ width: '96px' }),
};

export type Width = keyof typeof widthMap;

const heightMap = {
  '100%': css({ height: '100%' }),
  'size.100': css({ height: '16px' }),
  'size.1000': css({ height: '192px' }),
  'size.200': css({ height: '24px' }),
  'size.300': css({ height: '32px' }),
  'size.400': css({ height: '40px' }),
  'size.500': css({ height: '48px' }),
  'size.600': css({ height: '96px' }),
};

export type Height = keyof typeof heightMap;

/**
 * @codegenEnd
 */

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::0ba10ee53636df14b0db65fa1adbc94c>>
 * @codegenId spacing
 * @codegenCommand yarn codegen-styles
 * @codegenParams ["padding", "paddingBlock", "paddingInline"]
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-spacing.tsx <<SignedSource::167d3b69b159ae33e74d4ea5ab7eade6>>
 */
const paddingMap = {
  'space.0': css({
    padding: token('space.0', '0px'),
  }),
  'space.025': css({
    padding: token('space.025', '2px'),
  }),
  'space.050': css({
    padding: token('space.050', '4px'),
  }),
  'space.075': css({
    padding: token('space.075', '6px'),
  }),
  'space.100': css({
    padding: token('space.100', '8px'),
  }),
  'space.1000': css({
    padding: token('space.1000', '80px'),
  }),
  'space.150': css({
    padding: token('space.150', '12px'),
  }),
  'space.200': css({
    padding: token('space.200', '16px'),
  }),
  'space.250': css({
    padding: token('space.250', '20px'),
  }),
  'space.300': css({
    padding: token('space.300', '24px'),
  }),
  'space.400': css({
    padding: token('space.400', '32px'),
  }),
  'space.500': css({
    padding: token('space.500', '40px'),
  }),
  'space.600': css({
    padding: token('space.600', '48px'),
  }),
  'space.800': css({
    padding: token('space.800', '64px'),
  }),
};

export type Padding = keyof typeof paddingMap;

const paddingBlockMap = {
  'space.0': css({
    paddingBlock: token('space.0', '0px'),
  }),
  'space.025': css({
    paddingBlock: token('space.025', '2px'),
  }),
  'space.050': css({
    paddingBlock: token('space.050', '4px'),
  }),
  'space.075': css({
    paddingBlock: token('space.075', '6px'),
  }),
  'space.100': css({
    paddingBlock: token('space.100', '8px'),
  }),
  'space.1000': css({
    paddingBlock: token('space.1000', '80px'),
  }),
  'space.150': css({
    paddingBlock: token('space.150', '12px'),
  }),
  'space.200': css({
    paddingBlock: token('space.200', '16px'),
  }),
  'space.250': css({
    paddingBlock: token('space.250', '20px'),
  }),
  'space.300': css({
    paddingBlock: token('space.300', '24px'),
  }),
  'space.400': css({
    paddingBlock: token('space.400', '32px'),
  }),
  'space.500': css({
    paddingBlock: token('space.500', '40px'),
  }),
  'space.600': css({
    paddingBlock: token('space.600', '48px'),
  }),
  'space.800': css({
    paddingBlock: token('space.800', '64px'),
  }),
};

export type PaddingBlock = keyof typeof paddingBlockMap;

const paddingInlineMap = {
  'space.0': css({
    paddingInline: token('space.0', '0px'),
  }),
  'space.025': css({
    paddingInline: token('space.025', '2px'),
  }),
  'space.050': css({
    paddingInline: token('space.050', '4px'),
  }),
  'space.075': css({
    paddingInline: token('space.075', '6px'),
  }),
  'space.100': css({
    paddingInline: token('space.100', '8px'),
  }),
  'space.1000': css({
    paddingInline: token('space.1000', '80px'),
  }),
  'space.150': css({
    paddingInline: token('space.150', '12px'),
  }),
  'space.200': css({
    paddingInline: token('space.200', '16px'),
  }),
  'space.250': css({
    paddingInline: token('space.250', '20px'),
  }),
  'space.300': css({
    paddingInline: token('space.300', '24px'),
  }),
  'space.400': css({
    paddingInline: token('space.400', '32px'),
  }),
  'space.500': css({
    paddingInline: token('space.500', '40px'),
  }),
  'space.600': css({
    paddingInline: token('space.600', '48px'),
  }),
  'space.800': css({
    paddingInline: token('space.800', '64px'),
  }),
};

export type PaddingInline = keyof typeof paddingInlineMap;

/**
 * @codegenEnd
 */

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::514663609a5a48a284de40c5c4ad200b>>
 * @codegenId colors
 * @codegenCommand yarn codegen-styles
 * @codegenParams ["border", "background", "shadow"]
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-light.tsx <<SignedSource::10aa7e87eca39e4d6594a764e78e0698>>
 */
const borderColorMap = {
  'color.border': css({
    borderColor: token('color.border', '#091e4221'),
  }),
  disabled: css({
    borderColor: token('color.border.disabled', '#FAFBFC'),
  }),
  focused: css({
    borderColor: token('color.border.focused', '#4C9AFF'),
  }),
  input: css({
    borderColor: token('color.border.input', '#FAFBFC'),
  }),
  inverse: css({
    borderColor: token('color.border.inverse', '#FFFFFF'),
  }),
  selected: css({
    borderColor: token('color.border.selected', '#0052CC'),
  }),
  brand: css({
    borderColor: token('color.border.brand', '#0052CC'),
  }),
  danger: css({
    borderColor: token('color.border.danger', '#FF5630'),
  }),
  warning: css({
    borderColor: token('color.border.warning', '#FFC400'),
  }),
  success: css({
    borderColor: token('color.border.success', '#00875A'),
  }),
  discovery: css({
    borderColor: token('color.border.discovery', '#998DD9'),
  }),
  information: css({
    borderColor: token('color.border.information', '#0065FF'),
  }),
  bold: css({
    borderColor: token('color.border.bold', '#344563'),
  }),
} as const;

export type BorderColor = keyof typeof borderColorMap;

const backgroundColorMap = {
  disabled: css({
    backgroundColor: token('color.background.disabled', '#091e4289'),
  }),
  input: css({
    backgroundColor: token('color.background.input', '#FAFBFC'),
  }),
  'inverse.subtle': css({
    backgroundColor: token('color.background.inverse.subtle', '#00000029'),
  }),
  neutral: css({
    backgroundColor: token('color.background.neutral', '#DFE1E6'),
  }),
  'neutral.subtle': css({
    backgroundColor: token('color.background.neutral.subtle', 'transparent'),
  }),
  'neutral.bold': css({
    backgroundColor: token('color.background.neutral.bold', '#42526E'),
  }),
  selected: css({
    backgroundColor: token('color.background.selected', '#DEEBFF'),
  }),
  'selected.bold': css({
    backgroundColor: token('color.background.selected.bold', '#0052CC'),
  }),
  'brand.bold': css({
    backgroundColor: token('color.background.brand.bold', '#0052CC'),
  }),
  danger: css({
    backgroundColor: token('color.background.danger', '#FFEBE6'),
  }),
  'danger.bold': css({
    backgroundColor: token('color.background.danger.bold', '#DE350B'),
  }),
  warning: css({
    backgroundColor: token('color.background.warning', '#FFFAE6'),
  }),
  'warning.bold': css({
    backgroundColor: token('color.background.warning.bold', '#FFAB00'),
  }),
  success: css({
    backgroundColor: token('color.background.success', '#E3FCEF'),
  }),
  'success.bold': css({
    backgroundColor: token('color.background.success.bold', '#00875A'),
  }),
  discovery: css({
    backgroundColor: token('color.background.discovery', '#EAE6FF'),
  }),
  'discovery.bold': css({
    backgroundColor: token('color.background.discovery.bold', '#5243AA'),
  }),
  information: css({
    backgroundColor: token('color.background.information', '#DEEBFF'),
  }),
  'information.bold': css({
    backgroundColor: token('color.background.information.bold', '#0052CC'),
  }),
  'color.blanket': css({
    backgroundColor: token('color.blanket', '#091e4289'),
  }),
  'color.blanket.selected': css({
    backgroundColor: token('color.blanket.selected', '#388BFF14'),
  }),
  'color.blanket.danger': css({
    backgroundColor: token('color.blanket.danger', '#EF5C4814'),
  }),
  'elevation.surface': css({
    backgroundColor: token('elevation.surface', '#FFFFFF'),
  }),
  'elevation.surface.overlay': css({
    backgroundColor: token('elevation.surface.overlay', '#FFFFFF'),
  }),
  'elevation.surface.raised': css({
    backgroundColor: token('elevation.surface.raised', '#FFFFFF'),
  }),
  'elevation.surface.sunken': css({
    backgroundColor: token('elevation.surface.sunken', '#F4F5F7'),
  }),
} as const;

export type BackgroundColor = keyof typeof backgroundColorMap;

const shadowMap = {
  overflow: css({
    boxShadow: token(
      'elevation.shadow.overflow',
      '0px 0px 8px #091e423f, 0px 0px 1px #091e424f',
    ),
  }),
  'overflow.perimeter': css({
    boxShadow: token('elevation.shadow.overflow.perimeter', '#091e421f'),
  }),
  'overflow.spread': css({
    boxShadow: token('elevation.shadow.overflow.spread', '#091e4229'),
  }),
  overlay: css({
    boxShadow: token(
      'elevation.shadow.overlay',
      '0px 8px 12px #091e423f, 0px 0px 1px #091e424f',
    ),
  }),
  raised: css({
    boxShadow: token(
      'elevation.shadow.raised',
      '0px 1px 1px #091e423f, 0px 0px 1px #091e4221',
    ),
  }),
} as const;

export type Shadow = keyof typeof shadowMap;

/**
 * @codegenEnd
 */

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::bacbea271b30ec7d2f61306c9a8a9e63>>
 * @codegenId misc
 * @codegenCommand yarn codegen-styles
 * @codegenParams ["layer"]
 */
const layerMap = {
  card: css({ zIndex: LAYERS['card'] }),
  navigation: css({ zIndex: LAYERS['navigation'] }),
  dialog: css({ zIndex: LAYERS['dialog'] }),
  layer: css({ zIndex: LAYERS['layer'] }),
  blanket: css({ zIndex: LAYERS['blanket'] }),
  modal: css({ zIndex: LAYERS['modal'] }),
  flag: css({ zIndex: LAYERS['flag'] }),
  spotlight: css({ zIndex: LAYERS['spotlight'] }),
  tooltip: css({ zIndex: LAYERS['tooltip'] }),
};

/**
 * @codegenEnd
 */
