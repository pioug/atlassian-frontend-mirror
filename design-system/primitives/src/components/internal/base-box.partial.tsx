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

import { Layer, LAYERS } from '../../constants';
import type { BasePrimitiveProps } from '../types';

export type BaseBoxProps<T extends ElementType = 'div'> = Omit<
  ComponentPropsWithoutRef<T>,
  'as' | 'className'
> &
  BasePrimitiveProps &
  BaseBoxPropsFoundation<T>;

type BaseBoxPropsFoundation<T extends ElementType> = {
  /**
   * The DOM element to render as the Box. Defaults to `div`.
   */
  as?: 'div' | 'span' | 'li';
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
   * Elements to be rendered inside the Box.
   */
  children?: ReactNode;
  /**
   * @private
   * @deprecated Use `xcss` to achieve this functionality.
   * Token representing color with a fallback.
   */
  color?: TextColor;
  /**
   * Token representing background color with a built-in fallback value.
   */
  backgroundColor?: BackgroundColor;
  /**
   * @private
   * @deprecated Use `xcss` to achieve this functionality.
   * Token representing shadow with a fallback
   */
  shadow?: Shadow;
  /**
   * @private
   * @deprecated Use `xcss` to achieve this functionality.
   * Defines border style.
   */
  borderStyle?: BorderStyle;
  /**
   * @private
   * @deprecated Use `xcss` to achieve this functionality.
   * Defines border width.
   */
  borderWidth?: BorderWidth;
  /**
   * @private
   * @deprecated Use `xcss` to achieve this functionality.
   * Token representing border color with a fallback.
   */
  borderColor?: BorderColor;
  /**
   * @private
   * @deprecated Use `xcss` to achieve this functionality.
   * Defines border radius.
   */
  borderRadius?: BorderRadius;
  /**
   * @private
   * @deprecated Use `xcss` to achieve this functionality.
   * Used for providing a z-index.
   */
  layer?: Layer;
  /**
   * @private
   * @deprecated Use `xcss` to achieve this functionality.
   * Shorthand `flex` property.
   */
  flex?: Flex;
  /**
   * @private
   * @deprecated Use `xcss` to achieve this functionality.
   * Defines the flex grow factor -- how much remaining space should be taken up.
   */
  flexGrow?: FlexGrow;
  /**
   * @private
   * @deprecated Use `xcss` to achieve this functionality.
   * Defines the flex shrink factor -- how the item will shrink relative to other flex items in the container.
   */
  flexShrink?: FlexShrink;
  /**
   * @private
   * @deprecated Use `xcss` to achieve this functionality.
   * Overrides the `align-items` value.
   */
  alignSelf?: AlignSelf;
  /**
   * @private
   * @deprecated Use `xcss` to achieve this functionality.
   * Defines what happens if content overflows the box.
   * Shorthand for overflow-inline and overflow-block.
   *
   * @see overflowInline
   * @see overflowBlock
   */
  overflow?: Overflow;
  /**
   * @private
   * @deprecated Use `xcss` to achieve this functionality.
   * Defines what happens if content overflows the box in the horizontal direction (inline).
   */
  overflowInline?: OverflowInline;
  /**
   * @private
   * @deprecated Use `xcss` to achieve this functionality.
   * Defines what happens if content overflows the box in the vertical direction (block).
   */
  overflowBlock?: OverflowBlock;
  /**
   * Tokens representing CSS shorthand for `paddingBlock` and `paddingInline` together.
   *
   * @see paddingBlock
   * @see paddingInline
   */
  padding?: Padding;
  /**
   * Tokens representing CSS shorthand `paddingBlock`.
   *
   * @see paddingBlockStart
   * @see paddingBlockEnd
   */
  paddingBlock?: PaddingBlock;
  /**
   * Tokens representing CSS `paddingBlockStart`.
   */
  paddingBlockStart?: PaddingBlockStart;
  /**
   * Tokens representing CSS `paddingBlockEnd`.
   */
  paddingBlockEnd?: PaddingBlockEnd;
  /**
   * Tokens representing CSS shorthand `paddingInline`.
   *
   * @see paddingInlineStart
   * @see paddingInlineEnd
   */
  paddingInline?: PaddingInline;
  /**
   * Tokens representing CSS `paddingInlineStart`.
   */
  paddingInlineStart?: PaddingInlineStart;
  /**
   * Tokens representing CSS `paddingInlineEnd`.
   */
  paddingInlineEnd?: PaddingInlineEnd;
  /**
   * @private
   * @deprecated Use `xcss` to achieve this functionality.
   * Token representing width.
   */
  width?: Width;
  /**
   * @private
   * @deprecated Use `xcss` to achieve this functionality.
   * Token representing height.
   */
  height?: Height;
  /**
   * @private
   * @deprecated Use `xcss` to achieve this functionality.
   * Defines display type and layout. Defaults to `block`.
   */
  display?: Display;
  /**
   * @private
   * @deprecated Use `xcss` to achieve this functionality.
   * CSS position property.
   */
  position?: Position;
  /**
   * Forwarded ref element
   */
  ref?: ComponentPropsWithRef<T>['ref'];
};

// Without this type annotation on Box we don't get autocomplete for props due to forwardRef types
export type BaseBoxComponent<T extends ElementType = 'div'> = (<
  T extends ElementType = 'div',
>(
  props: BaseBoxProps<T>,
) => ReactElement | null) &
  FC<BaseBoxProps<T>>;

/**
 * __Box__
 *
 * Box is a primitive component that has the design decisions of the Atlassian Design System baked in.
 * Renders a `div` by default.
 *
 * @internal
 */
export const BaseBox: BaseBoxComponent = forwardRef(
  <T extends ElementType = 'div'>(
    {
      as,
      className,
      children,
      color,
      backgroundColor,
      shadow,
      borderStyle,
      borderWidth,
      borderRadius,
      borderColor,
      layer,
      flex,
      flexGrow,
      flexShrink,
      alignSelf,
      overflow,
      overflowInline,
      overflowBlock,
      padding,
      paddingBlock,
      paddingBlockStart,
      paddingBlockEnd,
      paddingInline,
      paddingInlineStart,
      paddingInlineEnd,
      height,
      width,
      display = 'block',
      position = 'static',
      style,
      testId,
      ...htmlAttributes
    }: BaseBoxProps<T>,
    ref?: ComponentPropsWithRef<T>['ref'],
  ) => {
    const Component = as || 'div';
    const node = (
      <Component
        style={style}
        ref={ref}
        // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
        {...htmlAttributes}
        className={className}
        css={[
          baseStyles,
          alignSelf && alignSelfMap[alignSelf],
          backgroundColor && backgroundColorMap[backgroundColor],
          borderColor && borderColorMap[borderColor],
          borderRadius && borderRadiusMap[borderRadius],
          borderStyle && borderStyleMap[borderStyle],
          borderWidth && borderWidthMap[borderWidth],
          color && textColorMap[color],
          display && displayMap[display],
          flex && flexMap[flex],
          flexGrow && flexGrowMap[flexGrow],
          flexShrink && flexShrinkMap[flexShrink],
          height && heightMap[height],
          layer && layerMap[layer],
          overflow && overflowMap[overflow],
          overflow && overflowMap[overflow],
          overflowBlock && overflowBlockMap[overflowBlock],
          overflowInline && overflowInlineMap[overflowInline],
          padding && paddingMap.padding[padding],
          paddingBlock && paddingMap.paddingBlock[paddingBlock],
          paddingBlockStart && paddingMap.paddingBlockStart[paddingBlockStart],
          paddingBlockEnd && paddingMap.paddingBlockEnd[paddingBlockEnd],
          paddingInline && paddingMap.paddingInline[paddingInline],
          paddingInlineStart &&
            paddingMap.paddingInlineStart[paddingInlineStart],
          paddingInlineEnd && paddingMap.paddingInlineEnd[paddingInlineEnd],
          padding && paddingMap.padding[padding],
          position && positionMap[position],
          shadow && shadowMap[shadow],
          width && widthMap[width],
        ]}
        data-testid={testId}
      >
        {children}
      </Component>
    );

    return node;
  },
);

BaseBox.displayName = 'BaseBox';

export default BaseBox;

// <<< STYLES GO HERE >>>
type BorderStyle = keyof typeof borderStyleMap;
const borderStyleMap = {
  none: css({ borderStyle: 'none' }),
  solid: css({ borderStyle: 'solid' }),
} as const;

export type BorderWidth = keyof typeof borderWidthMap;
const borderWidthMap = {
  'size.0': css({ borderWidth: token('border.width.0', '0') }),
  'size.050': css({ borderWidth: token('border.width.050', '1px') }),
  'size.100': css({ borderWidth: token('border.width.100', '2px') }),
} as const;

type BorderRadius = keyof typeof borderRadiusMap;
const borderRadiusMap = {
  'radius.100': css({ borderRadius: token('border.radius.200', '2px') }),
  'radius.200': css({ borderRadius: token('border.radius.200', '3px') }),
  'radius.round': css({ borderRadius: token('border.radius.round', '50%') }),
  'radius.300': css({ borderRadius: token('border.radius.300', '8px') }),
  'radius.400': css({ borderRadius: token('border.radius.400', '16px') }),
};
type Flex = keyof typeof flexMap;
const flexMap = {
  '1': css({ flex: 1 }),
} as const;

type FlexGrow = keyof typeof flexGrowMap;
const flexGrowMap = {
  '0': css({ flexGrow: 0 }),
  '1': css({ flexGrow: 1 }),
} as const;

type FlexShrink = keyof typeof flexShrinkMap;
const flexShrinkMap = {
  '0': css({ flexShrink: 0 }),
  '1': css({ flexShrink: 1 }),
} as const;

type AlignSelf = keyof typeof alignSelfMap;
const alignSelfMap = {
  center: css({ alignSelf: 'center' }),
  start: css({ alignSelf: 'start' }),
  stretch: css({ alignSelf: 'stretch' }),
  end: css({ alignSelf: 'end' }),
  baseline: css({ alignSelf: 'baseline' }),
} as const;

export type Display = keyof typeof displayMap;
const displayMap = {
  block: css({ display: 'block' }),
  inline: css({ display: 'inline' }),
  flex: css({ display: 'flex' }),
  'inline-flex': css({ display: 'inline-flex' }),
  'inline-block': css({ display: 'inline-block' }),
} as const;

type Position = keyof typeof positionMap;
const positionMap = {
  absolute: css({ position: 'absolute' }),
  fixed: css({ position: 'fixed' }),
  relative: css({ position: 'relative' }),
  static: css({ position: 'static' }),
} as const;

type Overflow = keyof typeof overflowMap;
const overflowMap = {
  auto: css({ overflow: 'auto' }),
  hidden: css({ overflow: 'hidden' }),
} as const;

type OverflowInline = keyof typeof overflowInlineMap;
const overflowInlineMap = {
  auto: css({ overflowInline: 'auto' }),
  hidden: css({ overflowInline: 'hidden' }),
} as const;

type OverflowBlock = keyof typeof overflowBlockMap;
const overflowBlockMap = {
  auto: css({ overflowBlock: 'auto' }),
  hidden: css({ overflowBlock: 'hidden' }),
} as const;

const baseStyles = css({
  boxSizing: 'border-box',
  appearance: 'none',
  border: 'none',
});

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::50178e05b73e6c8ed21bfbc8e6d87a13>>
 * @codegenId dimensions
 * @codegenCommand yarn codegen-styles
 * @codegenParams ["width", "height", "minWidth", "maxWidth", "minHeight", "maxHeight"]
 */
const widthMap = {
  '100%': css({ width: '100%' }),
  'size.100': css({ width: '16px' }),
  'size.200': css({ width: '24px' }),
  'size.300': css({ width: '32px' }),
  'size.400': css({ width: '40px' }),
  'size.500': css({ width: '48px' }),
  'size.600': css({ width: '96px' }),
  'size.1000': css({ width: '192px' }),
} as const;

export type Width = keyof typeof widthMap;

const heightMap = {
  '100%': css({ height: '100%' }),
  'size.100': css({ height: '16px' }),
  'size.200': css({ height: '24px' }),
  'size.300': css({ height: '32px' }),
  'size.400': css({ height: '40px' }),
  'size.500': css({ height: '48px' }),
  'size.600': css({ height: '96px' }),
  'size.1000': css({ height: '192px' }),
} as const;

export type Height = keyof typeof heightMap;

const minWidthMap = {
  '100%': css({ minWidth: '100%' }),
  'size.100': css({ minWidth: '16px' }),
  'size.200': css({ minWidth: '24px' }),
  'size.300': css({ minWidth: '32px' }),
  'size.400': css({ minWidth: '40px' }),
  'size.500': css({ minWidth: '48px' }),
  'size.600': css({ minWidth: '96px' }),
  'size.1000': css({ minWidth: '192px' }),
} as const;

export type MinWidth = keyof typeof minWidthMap;

const maxWidthMap = {
  '100%': css({ maxWidth: '100%' }),
  'size.100': css({ maxWidth: '16px' }),
  'size.200': css({ maxWidth: '24px' }),
  'size.300': css({ maxWidth: '32px' }),
  'size.400': css({ maxWidth: '40px' }),
  'size.500': css({ maxWidth: '48px' }),
  'size.600': css({ maxWidth: '96px' }),
  'size.1000': css({ maxWidth: '192px' }),
} as const;

export type MaxWidth = keyof typeof maxWidthMap;

const minHeightMap = {
  '100%': css({ minHeight: '100%' }),
  'size.100': css({ minHeight: '16px' }),
  'size.200': css({ minHeight: '24px' }),
  'size.300': css({ minHeight: '32px' }),
  'size.400': css({ minHeight: '40px' }),
  'size.500': css({ minHeight: '48px' }),
  'size.600': css({ minHeight: '96px' }),
  'size.1000': css({ minHeight: '192px' }),
} as const;

export type MinHeight = keyof typeof minHeightMap;

const maxHeightMap = {
  '100%': css({ maxHeight: '100%' }),
  'size.100': css({ maxHeight: '16px' }),
  'size.200': css({ maxHeight: '24px' }),
  'size.300': css({ maxHeight: '32px' }),
  'size.400': css({ maxHeight: '40px' }),
  'size.500': css({ maxHeight: '48px' }),
  'size.600': css({ maxHeight: '96px' }),
  'size.1000': css({ maxHeight: '192px' }),
} as const;

export type MaxHeight = keyof typeof maxHeightMap;

/**
 * @codegenEnd
 */

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::6da0ceaa2c227230e3a93bc724ff8648>>
 * @codegenId spacing
 * @codegenCommand yarn codegen-styles
 * @codegenParams ["padding"]
 * @codegenDependency ../../../../tokens/src/artifacts/tokens-raw/atlassian-spacing.tsx <<SignedSource::167d3b69b159ae33e74d4ea5ab7eade6>>
 */
const paddingMap = Object.fromEntries(
  [
    'padding',
    'paddingBlock',
    'paddingBlockStart',
    'paddingBlockEnd',
    'paddingInline',
    'paddingInlineStart',
    'paddingInlineEnd',
  ].map((property: string) => [
    property,
    {
      'space.0': css({
        [property]: token('space.0', '0px'),
      }),
      'space.025': css({
        [property]: token('space.025', '2px'),
      }),
      'space.050': css({
        [property]: token('space.050', '4px'),
      }),
      'space.075': css({
        [property]: token('space.075', '6px'),
      }),
      'space.100': css({
        [property]: token('space.100', '8px'),
      }),
      'space.150': css({
        [property]: token('space.150', '12px'),
      }),
      'space.200': css({
        [property]: token('space.200', '16px'),
      }),
      'space.250': css({
        [property]: token('space.250', '20px'),
      }),
      'space.300': css({
        [property]: token('space.300', '24px'),
      }),
      'space.400': css({
        [property]: token('space.400', '32px'),
      }),
      'space.500': css({
        [property]: token('space.500', '40px'),
      }),
      'space.600': css({
        [property]: token('space.600', '48px'),
      }),
      'space.800': css({
        [property]: token('space.800', '64px'),
      }),
      'space.1000': css({
        [property]: token('space.1000', '80px'),
      }),
    } as const,
  ]),
);

export type Padding = keyof typeof paddingMap.padding;
export type PaddingBlock = keyof typeof paddingMap.paddingBlock;
export type PaddingBlockStart = keyof typeof paddingMap.paddingBlockStart;
export type PaddingBlockEnd = keyof typeof paddingMap.paddingBlockEnd;
export type PaddingInline = keyof typeof paddingMap.paddingInline;
export type PaddingInlineStart = keyof typeof paddingMap.paddingInlineStart;
export type PaddingInlineEnd = keyof typeof paddingMap.paddingInlineEnd;

/**
 * @codegenEnd
 */

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::1e77e4e502cd4d951550637bdce2f3ca>>
 * @codegenId colors
 * @codegenCommand yarn codegen-styles
 * @codegenParams ["border", "background", "shadow", "text"]
 * @codegenDependency ../../../../tokens/src/artifacts/tokens-raw/atlassian-light.tsx <<SignedSource::10aa7e87eca39e4d6594a764e78e0698>>
 */
const borderColorMap = {
  'color.border': css({
    borderColor: token('color.border', '#091e4221'),
  }),
  'accent.red': css({
    borderColor: token('color.border.accent.red', '#FF5630'),
  }),
  'accent.orange': css({
    borderColor: token('color.border.accent.orange', '#D94008'),
  }),
  'accent.yellow': css({
    borderColor: token('color.border.accent.yellow', '#FFAB00'),
  }),
  'accent.green': css({
    borderColor: token('color.border.accent.green', '#36B37E'),
  }),
  'accent.teal': css({
    borderColor: token('color.border.accent.teal', '#00B8D9'),
  }),
  'accent.blue': css({
    borderColor: token('color.border.accent.blue', '#0065FF'),
  }),
  'accent.purple': css({
    borderColor: token('color.border.accent.purple', '#6554C0'),
  }),
  'accent.magenta': css({
    borderColor: token('color.border.accent.magenta', '#CD519D'),
  }),
  'accent.gray': css({
    borderColor: token('color.border.accent.gray', '#5E6C84'),
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
  'accent.red.subtlest': css({
    backgroundColor: token('color.background.accent.red.subtlest', '#FF8F73'),
  }),
  'accent.red.subtler': css({
    backgroundColor: token('color.background.accent.red.subtler', '#FF7452'),
  }),
  'accent.red.subtle': css({
    backgroundColor: token('color.background.accent.red.subtle', '#DE350B'),
  }),
  'accent.red.bolder': css({
    backgroundColor: token('color.background.accent.red.bolder', '#DE350B'),
  }),
  'accent.orange.subtlest': css({
    backgroundColor: token(
      'color.background.accent.orange.subtlest',
      '#F18D13',
    ),
  }),
  'accent.orange.subtler': css({
    backgroundColor: token('color.background.accent.orange.subtler', '#B65C02'),
  }),
  'accent.orange.subtle': css({
    backgroundColor: token('color.background.accent.orange.subtle', '#5F3811'),
  }),
  'accent.orange.bolder': css({
    backgroundColor: token('color.background.accent.orange.bolder', '#43290F'),
  }),
  'accent.yellow.subtlest': css({
    backgroundColor: token(
      'color.background.accent.yellow.subtlest',
      '#FFE380',
    ),
  }),
  'accent.yellow.subtler': css({
    backgroundColor: token('color.background.accent.yellow.subtler', '#FFC400'),
  }),
  'accent.yellow.subtle': css({
    backgroundColor: token('color.background.accent.yellow.subtle', '#FF991F'),
  }),
  'accent.yellow.bolder': css({
    backgroundColor: token('color.background.accent.yellow.bolder', '#FF991F'),
  }),
  'accent.green.subtlest': css({
    backgroundColor: token('color.background.accent.green.subtlest', '#79F2C0'),
  }),
  'accent.green.subtler': css({
    backgroundColor: token('color.background.accent.green.subtler', '#57D9A3'),
  }),
  'accent.green.subtle': css({
    backgroundColor: token('color.background.accent.green.subtle', '#00875A'),
  }),
  'accent.green.bolder': css({
    backgroundColor: token('color.background.accent.green.bolder', '#00875A'),
  }),
  'accent.teal.subtlest': css({
    backgroundColor: token('color.background.accent.teal.subtlest', '#79E2F2'),
  }),
  'accent.teal.subtler': css({
    backgroundColor: token('color.background.accent.teal.subtler', '#00C7E6'),
  }),
  'accent.teal.subtle': css({
    backgroundColor: token('color.background.accent.teal.subtle', '#00A3BF'),
  }),
  'accent.teal.bolder': css({
    backgroundColor: token('color.background.accent.teal.bolder', '#00A3BF'),
  }),
  'accent.blue.subtlest': css({
    backgroundColor: token('color.background.accent.blue.subtlest', '#4C9AFF'),
  }),
  'accent.blue.subtler': css({
    backgroundColor: token('color.background.accent.blue.subtler', '#2684FF'),
  }),
  'accent.blue.subtle': css({
    backgroundColor: token('color.background.accent.blue.subtle', '#0052CC'),
  }),
  'accent.blue.bolder': css({
    backgroundColor: token('color.background.accent.blue.bolder', '#0052CC'),
  }),
  'accent.purple.subtlest': css({
    backgroundColor: token(
      'color.background.accent.purple.subtlest',
      '#998DD9',
    ),
  }),
  'accent.purple.subtler': css({
    backgroundColor: token('color.background.accent.purple.subtler', '#8777D9'),
  }),
  'accent.purple.subtle': css({
    backgroundColor: token('color.background.accent.purple.subtle', '#5243AA'),
  }),
  'accent.purple.bolder': css({
    backgroundColor: token('color.background.accent.purple.bolder', '#5243AA'),
  }),
  'accent.magenta.subtlest': css({
    backgroundColor: token(
      'color.background.accent.magenta.subtlest',
      '#E774BB',
    ),
  }),
  'accent.magenta.subtler': css({
    backgroundColor: token(
      'color.background.accent.magenta.subtler',
      '#E774BB',
    ),
  }),
  'accent.magenta.subtle': css({
    backgroundColor: token('color.background.accent.magenta.subtle', '#E774BB'),
  }),
  'accent.magenta.bolder': css({
    backgroundColor: token('color.background.accent.magenta.bolder', '#E774BB'),
  }),
  'accent.gray.subtlest': css({
    backgroundColor: token('color.background.accent.gray.subtlest', '#6B778C'),
  }),
  'accent.gray.subtler': css({
    backgroundColor: token('color.background.accent.gray.subtler', '#5E6C84'),
  }),
  'accent.gray.subtle': css({
    backgroundColor: token('color.background.accent.gray.subtle', '#42526E'),
  }),
  'accent.gray.bolder': css({
    backgroundColor: token('color.background.accent.gray.bolder', '#505F79'),
  }),
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

const textColorMap = {
  'color.text': css({
    color: token('color.text', '#172B4D'),
  }),
  'accent.red': css({
    color: token('color.text.accent.red', '#DE350B'),
  }),
  'accent.red.bolder': css({
    color: token('color.text.accent.red.bolder', '#BF2600'),
  }),
  'accent.orange': css({
    color: token('color.text.accent.orange', '#F18D13'),
  }),
  'accent.orange.bolder': css({
    color: token('color.text.accent.orange.bolder', '#B65C02'),
  }),
  'accent.yellow': css({
    color: token('color.text.accent.yellow', '#FF991F'),
  }),
  'accent.yellow.bolder': css({
    color: token('color.text.accent.yellow.bolder', '#FF8B00'),
  }),
  'accent.green': css({
    color: token('color.text.accent.green', '#00875A'),
  }),
  'accent.green.bolder': css({
    color: token('color.text.accent.green.bolder', '#006644'),
  }),
  'accent.teal': css({
    color: token('color.text.accent.teal', '#00A3BF'),
  }),
  'accent.teal.bolder': css({
    color: token('color.text.accent.teal.bolder', '#008DA6'),
  }),
  'accent.blue': css({
    color: token('color.text.accent.blue', '#0052CC'),
  }),
  'accent.blue.bolder': css({
    color: token('color.text.accent.blue.bolder', '#0747A6'),
  }),
  'accent.purple': css({
    color: token('color.text.accent.purple', '#5243AA'),
  }),
  'accent.purple.bolder': css({
    color: token('color.text.accent.purple.bolder', '#403294'),
  }),
  'accent.magenta': css({
    color: token('color.text.accent.magenta', '#E774BB'),
  }),
  'accent.magenta.bolder': css({
    color: token('color.text.accent.magenta.bolder', '#DA62AC'),
  }),
  'accent.gray': css({
    color: token('color.text.accent.gray', '#505F79'),
  }),
  'accent.gray.bolder': css({
    color: token('color.text.accent.gray.bolder', '#172B4D'),
  }),
  disabled: css({
    color: token('color.text.disabled', '#A5ADBA'),
  }),
  inverse: css({
    color: token('color.text.inverse', '#FFFFFF'),
  }),
  selected: css({
    color: token('color.text.selected', '#0052CC'),
  }),
  brand: css({
    color: token('color.text.brand', '#0065FF'),
  }),
  danger: css({
    color: token('color.text.danger', '#DE350B'),
  }),
  warning: css({
    color: token('color.text.warning', '#974F0C'),
  }),
  'warning.inverse': css({
    color: token('color.text.warning.inverse', '#172B4D'),
  }),
  success: css({
    color: token('color.text.success', '#006644'),
  }),
  discovery: css({
    color: token('color.text.discovery', '#403294'),
  }),
  information: css({
    color: token('color.text.information', '#0052CC'),
  }),
  subtlest: css({
    color: token('color.text.subtlest', '#7A869A'),
  }),
  subtle: css({
    color: token('color.text.subtle', '#42526E'),
  }),
} as const;

export type TextColor = keyof typeof textColorMap;

/**
 * @codegenEnd
 */

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::8006c040aa4392025298be138271ceae>>
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
} as const;

/**
 * @codegenEnd
 */
