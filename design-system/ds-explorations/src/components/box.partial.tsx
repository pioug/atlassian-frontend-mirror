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

import { SurfaceContext } from './surface-provider';
import type { BasePrimitiveProps } from './types';

type PropsToOmit = 'as' | 'className' | 'style';

export type BoxProps<T extends ElementType = 'div'> = Omit<
  ComponentPropsWithoutRef<T>,
  PropsToOmit
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
  normal: css({ borderRadius: '3px' }),
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
};

/**
 * @experimental - this is likely to be removed
 */
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

type Position = keyof typeof positionMap;
const positionMap = {
  absolute: css({ position: 'absolute' }),
  relative: css({ position: 'relative' }),
  static: css({ position: 'static' }),
};

type Overflow = keyof typeof overflowMap;
const overflowMap = {
  auto: css({ overflow: 'auto' }),
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
 * @codegen <<SignedSource::cbecbcc7b02d1d58fdd794542eb54d50>>
 * @codegenId spacing
 * @codegenCommand yarn codegen-styles
 * @codegenParams ["padding", "paddingBlock", "paddingInline"]
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-spacing.tsx <<SignedSource::a2b43f8447798dfdd9c6223bd22b78c7>>
 */
const paddingMap = {
  'scale.0': css({
    padding: token('space.0', '0px'),
  }),
  'scale.025': css({
    padding: token('space.025', '2px'),
  }),
  'scale.050': css({
    padding: token('space.050', '4px'),
  }),
  'scale.075': css({
    padding: token('space.075', '6px'),
  }),
  'scale.100': css({
    padding: token('space.100', '8px'),
  }),
  'scale.1000': css({
    padding: token('space.1000', '80px'),
  }),
  'scale.150': css({
    padding: token('space.150', '12px'),
  }),
  'scale.200': css({
    padding: token('space.200', '16px'),
  }),
  'scale.250': css({
    padding: token('space.250', '20px'),
  }),
  'scale.300': css({
    padding: token('space.300', '24px'),
  }),
  'scale.400': css({
    padding: token('space.400', '32px'),
  }),
  'scale.500': css({
    padding: token('space.500', '40px'),
  }),
  'scale.600': css({
    padding: token('space.600', '48px'),
  }),
  'scale.800': css({
    padding: token('space.800', '64px'),
  }),
};

export type Padding = keyof typeof paddingMap;

const paddingBlockMap = {
  'scale.0': css({
    paddingBlock: token('space.0', '0px'),
  }),
  'scale.025': css({
    paddingBlock: token('space.025', '2px'),
  }),
  'scale.050': css({
    paddingBlock: token('space.050', '4px'),
  }),
  'scale.075': css({
    paddingBlock: token('space.075', '6px'),
  }),
  'scale.100': css({
    paddingBlock: token('space.100', '8px'),
  }),
  'scale.1000': css({
    paddingBlock: token('space.1000', '80px'),
  }),
  'scale.150': css({
    paddingBlock: token('space.150', '12px'),
  }),
  'scale.200': css({
    paddingBlock: token('space.200', '16px'),
  }),
  'scale.250': css({
    paddingBlock: token('space.250', '20px'),
  }),
  'scale.300': css({
    paddingBlock: token('space.300', '24px'),
  }),
  'scale.400': css({
    paddingBlock: token('space.400', '32px'),
  }),
  'scale.500': css({
    paddingBlock: token('space.500', '40px'),
  }),
  'scale.600': css({
    paddingBlock: token('space.600', '48px'),
  }),
  'scale.800': css({
    paddingBlock: token('space.800', '64px'),
  }),
};

export type PaddingBlock = keyof typeof paddingBlockMap;

const paddingInlineMap = {
  'scale.0': css({
    paddingInline: token('space.0', '0px'),
  }),
  'scale.025': css({
    paddingInline: token('space.025', '2px'),
  }),
  'scale.050': css({
    paddingInline: token('space.050', '4px'),
  }),
  'scale.075': css({
    paddingInline: token('space.075', '6px'),
  }),
  'scale.100': css({
    paddingInline: token('space.100', '8px'),
  }),
  'scale.1000': css({
    paddingInline: token('space.1000', '80px'),
  }),
  'scale.150': css({
    paddingInline: token('space.150', '12px'),
  }),
  'scale.200': css({
    paddingInline: token('space.200', '16px'),
  }),
  'scale.250': css({
    paddingInline: token('space.250', '20px'),
  }),
  'scale.300': css({
    paddingInline: token('space.300', '24px'),
  }),
  'scale.400': css({
    paddingInline: token('space.400', '32px'),
  }),
  'scale.500': css({
    paddingInline: token('space.500', '40px'),
  }),
  'scale.600': css({
    paddingInline: token('space.600', '48px'),
  }),
  'scale.800': css({
    paddingInline: token('space.800', '64px'),
  }),
};

export type PaddingInline = keyof typeof paddingInlineMap;

/**
 * @codegenEnd
 */

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::781636715c2bee941d6836a5a90fed5b>>
 * @codegenId colors
 * @codegenCommand yarn codegen-styles
 * @codegenParams ["border", "background"]
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-light.tsx <<SignedSource::07ef29d58a2b23af8b098515466d7e22>>
 */
const borderColorMap = {
  'color.border': css({
    borderColor: token('color.border', '#091e4221'),
  }),
  bold: css({
    borderColor: token('color.border.bold', '#344563'),
  }),
  inverse: css({
    borderColor: token('color.border.inverse', '#FFFFFF'),
  }),
  focused: css({
    borderColor: token('color.border.focused', '#4C9AFF'),
  }),
  input: css({
    borderColor: token('color.border.input', '#FAFBFC'),
  }),
  disabled: css({
    borderColor: token('color.border.disabled', '#FAFBFC'),
  }),
  brand: css({
    borderColor: token('color.border.brand', '#0052CC'),
  }),
  selected: css({
    borderColor: token('color.border.selected', '#0052CC'),
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
};

export type BorderColor = keyof typeof borderColorMap;

const backgroundColorMap = {
  disabled: css({
    backgroundColor: token('color.background.disabled', '#091e4289'),
  }),
  'inverse.subtle': css({
    backgroundColor: token('color.background.inverse.subtle', '#00000029'),
  }),
  input: css({
    backgroundColor: token('color.background.input', '#FAFBFC'),
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
  'brand.bold': css({
    backgroundColor: token('color.background.brand.bold', '#0052CC'),
  }),
  selected: css({
    backgroundColor: token('color.background.selected', '#DEEBFF'),
  }),
  'selected.bold': css({
    backgroundColor: token('color.background.selected.bold', '#0052CC'),
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
  'elevation.surface.sunken': css({
    backgroundColor: token('elevation.surface.sunken', '#F4F5F7'),
  }),
  'elevation.surface.raised': css({
    backgroundColor: token('elevation.surface.raised', '#FFFFFF'),
  }),
  'elevation.surface.overlay': css({
    backgroundColor: token('elevation.surface.overlay', '#FFFFFF'),
  }),
};

export type BackgroundColor = keyof typeof backgroundColorMap;

/**
 * @codegenEnd
 */
