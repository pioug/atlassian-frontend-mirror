/** @jsx jsx */
import { createContext, FC, Fragment, ReactNode, useContext } from 'react';

import { css, jsx } from '@emotion/react';
import invariant from 'tiny-invariant';

import { token } from '@atlaskit/tokens';

import surfaceColorMap from '../internal/color-map';

import { useSurface } from './surface-provider';
import type { BasePrimitiveProps } from './types';

const asAllowlist = ['span', 'div', 'p', 'strong'] as const;
type AsElement = (typeof asAllowlist)[number];
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
  color?: TextColor;
  /**
   * The HTML id attribute https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id
   */
  id?: string;
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
  margin: token('space.0', '0px'),
  padding: token('space.0', '0px'),
});

const truncateStyles = css({
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  // Use "clip" overflow to allow ellipses on x-axis without clipping descenders
  '@supports not (overflow-x: clip)': {
    overflow: 'hidden',
  },
  '@supports (overflow-x: clip)': {
    overflowX: 'clip',
  },
});

/**
 * Custom hook designed to abstract the parsing of the color props and make it clearer in the future how color is reconciled between themes and tokens.
 */
const useColor = (colorProp: TextColor): NonNullable<TextColor> => {
  const surface = useSurface();
  const inverseTextColor =
    surfaceColorMap[surface as keyof typeof surfaceColorMap];

  /**
   * Where the color of the surface is inverted we override the user choice
   * as there is no valid choice that is not covered by the override.
   */
  const color = inverseTextColor ?? colorProp;

  return color;
};

const HasTextAncestorContext = createContext(false);
const useHasTextAncestor = () => useContext(HasTextAncestorContext);

/**
 * __Text__
 *
 * Text is a primitive component that has the Atlassian Design System's design guidelines baked in.
 * This includes considerations for text attributes such as color, font size, font weight, and line height.
 * It renders a `span` by default.
 *
 * @internal
 */
const Text: FC<TextProps> = ({ children, ...props }) => {
  const {
    as: Component = 'span',
    color: colorProp,
    fontSize,
    fontWeight,
    lineHeight,
    shouldTruncate = false,
    textAlign,
    textTransform,
    verticalAlign,
    testId,
    UNSAFE_style,
    id,
  } = props;
  invariant(
    asAllowlist.includes(Component),
    `@atlaskit/ds-explorations: Text received an invalid "as" value of "${Component}"`,
  );
  const color = useColor(colorProp!);
  const isWrapped = useHasTextAncestor();

  /**
   * If the text is already wrapped and applies no props we can just
   * render the children directly as a fragment.
   */
  if (isWrapped && Object.keys(props).length === 0) {
    return <Fragment>{children}</Fragment>;
  }

  const component = (
    <Component
      style={UNSAFE_style}
      css={[
        baseStyles,
        fontFamilyMap.sans,
        color && textColorMap[color],
        fontSize && fontSizeMap[fontSize],
        fontWeight && fontWeightMap[fontWeight],
        lineHeight && lineHeightMap[lineHeight],
        shouldTruncate && truncateStyles,
        textAlign && textAlignMap[textAlign],
        textTransform && textTransformMap[textTransform],
        verticalAlign && verticalAlignMap[verticalAlign],
      ]}
      data-testid={testId}
      id={id}
    >
      {children}
    </Component>
  );

  return isWrapped ? (
    // no need to re-apply context if the text is already wrapped
    component
  ) : (
    <HasTextAncestorContext.Provider value={true}>
      {component}
    </HasTextAncestorContext.Provider>
  );
};

export default Text;

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::b8b8bbe2326e2cc6d28ce2d7042ab202>>
 * @codegenId typography
 * @codegenCommand yarn codegen-styles
 * @codegenParams ["fontSize", "fontWeight", "fontFamily", "lineHeight"]
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-typography.tsx <<SignedSource::7fa10802b854af6256a8c2d394d59238>>
 */
const fontSizeMap = {
  'size.050': css({
    fontSize: token('font.size.050', '11px'),
  }),
  'size.075': css({
    fontSize: token('font.size.075', '12px'),
  }),
  'size.100': css({
    fontSize: token('font.size.100', '14px'),
  }),
  'size.200': css({
    fontSize: token('font.size.200', '16px'),
  }),
  'size.300': css({
    fontSize: token('font.size.300', '20px'),
  }),
  'size.400': css({
    fontSize: token('font.size.400', '24px'),
  }),
  'size.500': css({
    fontSize: token('font.size.500', '29px'),
  }),
  'size.600': css({
    fontSize: token('font.size.600', '35px'),
  }),
};

export type FontSize = keyof typeof fontSizeMap;

const fontWeightMap = {
  bold: css({
    fontWeight: token('font.weight.bold', '700'),
  }),
  medium: css({
    fontWeight: token('font.weight.medium', '500'),
  }),
  regular: css({
    fontWeight: token('font.weight.regular', '400'),
  }),
  semibold: css({
    fontWeight: token('font.weight.semibold', '600'),
  }),
};

export type FontWeight = keyof typeof fontWeightMap;

const fontFamilyMap = {
  brand: css({
    fontFamily: token('font.family.brand', 'Charlie Sans'),
  }),
  code: css({
    fontFamily: token(
      'font.family.code',
      'ui-monospace, Menlo, "Segoe UI Mono", "Ubuntu Mono", monospace',
    ),
  }),
  monospace: css({
    fontFamily: token(
      'font.family.monospace',
      'ui-monospace, Menlo, "Segoe UI Mono", "Ubuntu Mono", monospace',
    ),
  }),
  product: css({
    fontFamily: token(
      'font.family.product',
      'ui-sans-serif, "Segoe UI", system-ui, Ubuntu, "Helvetica Neue", sans-serif',
    ),
  }),
  sans: css({
    fontFamily: token(
      'font.family.sans',
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    ),
  }),
};

export type FontFamily = keyof typeof fontFamilyMap;

const lineHeightMap = {
  'lineHeight.1': css({
    lineHeight: token('font.lineHeight.1', '1'),
  }),
  'lineHeight.100': css({
    lineHeight: token('font.lineHeight.100', '16px'),
  }),
  'lineHeight.200': css({
    lineHeight: token('font.lineHeight.200', '20px'),
  }),
  'lineHeight.300': css({
    lineHeight: token('font.lineHeight.300', '24px'),
  }),
  'lineHeight.400': css({
    lineHeight: token('font.lineHeight.400', '28px'),
  }),
  'lineHeight.500': css({
    lineHeight: token('font.lineHeight.500', '32px'),
  }),
  'lineHeight.600': css({
    lineHeight: token('font.lineHeight.600', '40px'),
  }),
};

export type LineHeight = keyof typeof lineHeightMap;

/**
 * @codegenEnd
 */

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::8a6efbd43991cb2ebd97bd5eed33e192>>
 * @codegenId colors
 * @codegenCommand yarn codegen-styles
 * @codegenParams ["text"]
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-light.tsx <<SignedSource::65311fc2a6a35bb34b99c859362ac840>>
 */
const textColorMap = {
  'color.text': css({
    color: token('color.text', '#172B4D'),
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
