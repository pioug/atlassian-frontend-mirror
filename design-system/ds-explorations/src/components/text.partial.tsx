/** @jsx jsx */
import { CSSProperties, FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';
import invariant from 'tiny-invariant';

import { token } from '@atlaskit/tokens';

import { colorMap } from '../internal/color-map';

import { useSurface } from './surface-provider';
import { BasePrimitiveProps } from './types';

const asAllowlist = ['span', 'div', 'p'] as const;
type AsElement = typeof asAllowlist[number];
export interface TextProps extends BasePrimitiveProps {
  /**
   * HTML tag to be rendered. Defaults to `span`.
   */
  as?: AsElement;
  /**
   * Elements rendered within the Text element
   */
  children: ReactNode;
  /**
   * Text color
   */
  color?: [TextColor, string];
  /**
   * Font size https://developer.mozilla.org/en-US/docs/Web/CSS/font-size
   */
  fontSize?: FontSize;
  /**
   * Font weight https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight
   */
  fontWeight?: FontWeight;
  /**
   * Line height https://developer.mozilla.org/en-US/docs/Web/CSS/line-height
   */
  lineHeight?: LineHeight;
  /**
   * Truncates text with an ellipsis when text overflows its parent container
   * (i.e. `width` has been set on parent that is shorter than text length).
   */
  shouldTruncate?: boolean;
  /**
   * Text align https://developer.mozilla.org/en-US/docs/Web/CSS/text-align
   */
  textAlign?: TextAlign;
  /**
   * Text transform https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform
   */
  textTransform?: TextTransform;
  /**
   * Vertical align https://developer.mozilla.org/en-US/docs/Web/CSS/vertical-align
   */
  verticalAlign?: VerticalAlign;
}

const fontFamily = `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`;

type FontSize = keyof typeof fontSizeMap;
const fontSizeMap = {
  '11px': css({ fontSize: '11px' }),
  '12px': css({ fontSize: '12px' }),
  '14px': css({ fontSize: '14px' }),
};

type FontWeight = keyof typeof fontWeightMap;
// NOTE: can't use numbers as keys or Constellation won't build. Weird one.
const fontWeightMap = {
  '400': css({ fontWeight: 400 }),
  '500': css({ fontWeight: 500 }),
  '700': css({ fontWeight: 700 }),
};

type LineHeight = keyof typeof lineHeightMap;
const lineHeightMap = {
  '12px': css({ lineHeight: '12px' }),
  '16px': css({ lineHeight: '16px' }),
  '20px': css({ lineHeight: '20px' }),
  '24px': css({ lineHeight: '24px' }),
  '28px': css({ lineHeight: '28px' }),
  '32px': css({ lineHeight: '32px' }),
  '40px': css({ lineHeight: '40px' }),
};

type TextAlign = keyof typeof textAlignMap;
const textAlignMap = {
  center: css({ textAlign: 'center' }),
  end: css({ textAlign: 'end' }),
  start: css({ textAlign: 'start' }),
};

type TextTransform = keyof typeof textTransformMap;
const textTransformMap = {
  none: css({ textTransform: 'none' }),
  lowercase: css({ textTransform: 'lowercase' }),
  uppercase: css({ textTransform: 'uppercase' }),
};

type VerticalAlign = keyof typeof verticalAlignMap;
const verticalAlignMap = {
  top: css({ verticalAlign: 'top' }),
  middle: css({ verticalAlign: 'middle' }),
  bottom: css({ verticalAlign: 'bottom' }),
};

const baseStyles = css({
  boxSizing: 'border-box',
  fontFamily,
});

const truncateStyles = css({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

/**
 * __Text__
 *
 * Text is a primitive component that has the Atlassian Design System's design guidelines baked in.
 * This includes considerations for text attributes such as color, font size, font weight, and line height.
 * It renders a `span` by default.
 *
 * @internal
 */
const Text: FC<TextProps> = ({
  as: Component = 'span',
  children,
  color: colorTuple,
  fontSize,
  fontWeight,
  lineHeight,
  shouldTruncate = false,
  textAlign,
  textTransform,
  verticalAlign,
  testId,
  UNSAFE_style,
}: TextProps) => {
  const surface = useSurface();
  // @ts-ignore
  const [color = colorMap[surface], fallback] = colorTuple || [];
  invariant(
    asAllowlist.includes(Component),
    `@atlaskit/ds-explorations: Text received an invalid "as" value of "${Component}"`,
  );

  return (
    <Component
      style={{
        ...UNSAFE_style,
        ...(fallback && ({ '--ds-co-fb': fallback } as CSSProperties)),
      }}
      css={[
        baseStyles,
        color && textColorMap[color as TextColor],
        fontSize && fontSizeMap[fontSize],
        fontWeight && fontWeightMap[fontWeight],
        lineHeight && lineHeightMap[lineHeight],
        shouldTruncate && truncateStyles,
        textAlign && textAlignMap[textAlign],
        textTransform && textTransformMap[textTransform],
        verticalAlign && verticalAlignMap[verticalAlign],
      ]}
      data-testid={testId}
    >
      {children}
    </Component>
  );
};

export default Text;

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::140ffff6e1310c1c37e2067e2c232b92>>
 * @codegenId colors
 * @codegenCommand yarn codegen-styles
 * @codegenParams ["text"]
 */
const textColorMap = {
  'color.text': css({
    color: token('color.text', 'var(--ds-co-fb)'),
  }),
  subtle: css({
    color: token('color.text.subtle', 'var(--ds-co-fb)'),
  }),
  subtlest: css({
    color: token('color.text.subtlest', 'var(--ds-co-fb)'),
  }),
  disabled: css({
    color: token('color.text.disabled', 'var(--ds-co-fb)'),
  }),
  inverse: css({
    color: token('color.text.inverse', 'var(--ds-co-fb)'),
  }),
  brand: css({
    color: token('color.text.brand', 'var(--ds-co-fb)'),
  }),
  selected: css({
    color: token('color.text.selected', 'var(--ds-co-fb)'),
  }),
  danger: css({
    color: token('color.text.danger', 'var(--ds-co-fb)'),
  }),
  warning: css({
    color: token('color.text.warning', 'var(--ds-co-fb)'),
  }),
  'warning.inverse': css({
    color: token('color.text.warning.inverse', 'var(--ds-co-fb)'),
  }),
  success: css({
    color: token('color.text.success', 'var(--ds-co-fb)'),
  }),
  discovery: css({
    color: token('color.text.discovery', 'var(--ds-co-fb)'),
  }),
  information: css({
    color: token('color.text.information', 'var(--ds-co-fb)'),
  }),
};

export type TextColor = keyof typeof textColorMap;

/**
 * @codegenEnd
 */
