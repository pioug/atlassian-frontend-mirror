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
   */
  width?: Width;
  /**
   * Token representing height.
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
 * @codegen <<SignedSource::2d25a493458fa1cefdafcd559404f2ec>>
 * @codegenId spacing
 * @codegenCommand yarn codegen-styles
 * @codegenParams ["padding", "paddingBlock", "paddingInline", "width", "height"]
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-light.tsx <<SignedSource::07ef29d58a2b23af8b098515466d7e22>>
 */
const paddingMap = {
  'scale.0': css({
    padding: token('spacing.scale.0', '0px'),
  }),
  'scale.025': css({
    padding: token('spacing.scale.025', '2px'),
  }),
  'scale.050': css({
    padding: token('spacing.scale.050', '4px'),
  }),
  'scale.075': css({
    padding: token('spacing.scale.075', '6px'),
  }),
  'scale.100': css({
    padding: token('spacing.scale.100', '8px'),
  }),
  'scale.150': css({
    padding: token('spacing.scale.150', '12px'),
  }),
  'scale.200': css({
    padding: token('spacing.scale.200', '16px'),
  }),
  'scale.250': css({
    padding: token('spacing.scale.250', '20px'),
  }),
  'scale.300': css({
    padding: token('spacing.scale.300', '24px'),
  }),
  'scale.400': css({
    padding: token('spacing.scale.400', '32px'),
  }),
  'scale.500': css({
    padding: token('spacing.scale.500', '40px'),
  }),
  'scale.600': css({
    padding: token('spacing.scale.600', '48px'),
  }),
};

export type Padding = keyof typeof paddingMap;

const paddingBlockMap = {
  'scale.0': css({
    paddingBlock: token('spacing.scale.0', '0px'),
  }),
  'scale.025': css({
    paddingBlock: token('spacing.scale.025', '2px'),
  }),
  'scale.050': css({
    paddingBlock: token('spacing.scale.050', '4px'),
  }),
  'scale.075': css({
    paddingBlock: token('spacing.scale.075', '6px'),
  }),
  'scale.100': css({
    paddingBlock: token('spacing.scale.100', '8px'),
  }),
  'scale.150': css({
    paddingBlock: token('spacing.scale.150', '12px'),
  }),
  'scale.200': css({
    paddingBlock: token('spacing.scale.200', '16px'),
  }),
  'scale.250': css({
    paddingBlock: token('spacing.scale.250', '20px'),
  }),
  'scale.300': css({
    paddingBlock: token('spacing.scale.300', '24px'),
  }),
  'scale.400': css({
    paddingBlock: token('spacing.scale.400', '32px'),
  }),
  'scale.500': css({
    paddingBlock: token('spacing.scale.500', '40px'),
  }),
  'scale.600': css({
    paddingBlock: token('spacing.scale.600', '48px'),
  }),
};

export type PaddingBlock = keyof typeof paddingBlockMap;

const paddingInlineMap = {
  'scale.0': css({
    paddingInline: token('spacing.scale.0', '0px'),
  }),
  'scale.025': css({
    paddingInline: token('spacing.scale.025', '2px'),
  }),
  'scale.050': css({
    paddingInline: token('spacing.scale.050', '4px'),
  }),
  'scale.075': css({
    paddingInline: token('spacing.scale.075', '6px'),
  }),
  'scale.100': css({
    paddingInline: token('spacing.scale.100', '8px'),
  }),
  'scale.150': css({
    paddingInline: token('spacing.scale.150', '12px'),
  }),
  'scale.200': css({
    paddingInline: token('spacing.scale.200', '16px'),
  }),
  'scale.250': css({
    paddingInline: token('spacing.scale.250', '20px'),
  }),
  'scale.300': css({
    paddingInline: token('spacing.scale.300', '24px'),
  }),
  'scale.400': css({
    paddingInline: token('spacing.scale.400', '32px'),
  }),
  'scale.500': css({
    paddingInline: token('spacing.scale.500', '40px'),
  }),
  'scale.600': css({
    paddingInline: token('spacing.scale.600', '48px'),
  }),
};

export type PaddingInline = keyof typeof paddingInlineMap;

const widthMap = {
  'scale.0': css({
    width: token('spacing.scale.0', '0px'),
  }),
  'scale.025': css({
    width: token('spacing.scale.025', '2px'),
  }),
  'scale.050': css({
    width: token('spacing.scale.050', '4px'),
  }),
  'scale.075': css({
    width: token('spacing.scale.075', '6px'),
  }),
  'scale.100': css({
    width: token('spacing.scale.100', '8px'),
  }),
  'scale.150': css({
    width: token('spacing.scale.150', '12px'),
  }),
  'scale.200': css({
    width: token('spacing.scale.200', '16px'),
  }),
  'scale.250': css({
    width: token('spacing.scale.250', '20px'),
  }),
  'scale.300': css({
    width: token('spacing.scale.300', '24px'),
  }),
  'scale.400': css({
    width: token('spacing.scale.400', '32px'),
  }),
  'scale.500': css({
    width: token('spacing.scale.500', '40px'),
  }),
  'scale.600': css({
    width: token('spacing.scale.600', '48px'),
  }),
};

export type Width = keyof typeof widthMap;

const heightMap = {
  'scale.0': css({
    height: token('spacing.scale.0', '0px'),
  }),
  'scale.025': css({
    height: token('spacing.scale.025', '2px'),
  }),
  'scale.050': css({
    height: token('spacing.scale.050', '4px'),
  }),
  'scale.075': css({
    height: token('spacing.scale.075', '6px'),
  }),
  'scale.100': css({
    height: token('spacing.scale.100', '8px'),
  }),
  'scale.150': css({
    height: token('spacing.scale.150', '12px'),
  }),
  'scale.200': css({
    height: token('spacing.scale.200', '16px'),
  }),
  'scale.250': css({
    height: token('spacing.scale.250', '20px'),
  }),
  'scale.300': css({
    height: token('spacing.scale.300', '24px'),
  }),
  'scale.400': css({
    height: token('spacing.scale.400', '32px'),
  }),
  'scale.500': css({
    height: token('spacing.scale.500', '40px'),
  }),
  'scale.600': css({
    height: token('spacing.scale.600', '48px'),
  }),
};

export type Height = keyof typeof heightMap;

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
