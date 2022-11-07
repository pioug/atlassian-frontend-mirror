/** @jsx jsx */
import { createContext, FC, Fragment, ReactNode, useContext } from 'react';

import { css, jsx } from '@emotion/react';
import invariant from 'tiny-invariant';

import { token } from '@atlaskit/tokens';

import surfaceColorMap from '../internal/color-map';

import { useSurface } from './surface-provider';
import type { BasePrimitiveProps } from './types';

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
  color?: TextColor;
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
  '600': css({ fontWeight: 600 }),
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
  margin: '0px',
  padding: '0px',
  fontFamily,
});

const truncateStyles = css({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
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
 * @codegen <<SignedSource::21771f01de3c37646642de03274f0738>>
 * @codegenId colors
 * @codegenCommand yarn codegen-styles
 * @codegenParams ["text"]
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-light.tsx <<SignedSource::0c1fe9904b2ff2465a532b97ab76491e>>
 */
const textColorMap = {
  'color.text': css({
    color: token('color.text', '#172B4D'),
  }),
  subtle: css({
    color: token('color.text.subtle', '#42526E'),
  }),
  subtlest: css({
    color: token('color.text.subtlest', '#7A869A'),
  }),
  disabled: css({
    color: token('color.text.disabled', '#A5ADBA'),
  }),
  inverse: css({
    color: token('color.text.inverse', '#FFFFFF'),
  }),
  brand: css({
    color: token('color.text.brand', '#0065FF'),
  }),
  selected: css({
    color: token('color.text.selected', '#0052CC'),
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
};

export type TextColor = keyof typeof textColorMap;

/**
 * @codegenEnd
 */
