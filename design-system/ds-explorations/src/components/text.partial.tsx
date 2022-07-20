/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import { token } from '@atlaskit/tokens';

interface TextProps {
  children: ReactNode;
  color?: TextColor;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  fontSize?: keyof typeof fontSizeMap;
  fontWeight?: keyof typeof fontWeightMap;
}

// These values are pulled from @atlaskit/theme
const fontSize = 14;
const fontSizeExtraSmall = 11;
const fontSizeSmall = 12;
const fontFamily = `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`;

const fontSizeMap = {
  extraSmall: css({ fontSize: fontSizeExtraSmall }),
  small: css({ fontSize: fontSizeSmall }),
  normal: css({ fontSize }),
};

const fontWeightMap = {
  400: css({ fontWeight: 400 }),
  500: css({ fontWeight: 500 }),
};

const baseStyles = css({
  fontFamily,
});

/**
 * __Text__
 *
 * A text {description}.
 *
 * @internal
 */
function Text({
  as: Component = 'span',
  children,
  color,
  fontSize,
  fontWeight,
}: TextProps) {
  return (
    <Component
      css={[
        baseStyles,
        color && textColorMap[color],
        fontSize && fontSizeMap[fontSize],
        fontWeight && fontWeightMap[fontWeight],
      ]}
    >
      {children}
    </Component>
  );
}

export default Text;

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::588616346f4a4bd0abb93bf324335944>>
 * @codegenId colors
 * @codegenCommand yarn codegen-styles
 * @codegenParams ["text"]
 */
const textColorMap = {
  default: css({
    color: token('color.text', '#172B4D'),
  }),
  subtle: css({
    color: token('color.text.subtle', '#44546F'),
  }),
  subtlest: css({
    color: token('color.text.subtlest', '#626F86'),
  }),
  disabled: css({
    color: token('color.text.disabled', '#8993A5'),
  }),
  inverse: css({
    color: token('color.text.inverse', '#FFFFFF'),
  }),
  brand: css({
    color: token('color.text.brand', '#0C66E4'),
  }),
  selected: css({
    color: token('color.text.selected', '#0C66E4'),
  }),
  danger: css({
    color: token('color.text.danger', '#AE2A19'),
  }),
  warning: css({
    color: token('color.text.warning', '#974F0C'),
  }),
  'warning.inverse': css({
    color: token('color.text.warning.inverse', '#172B4D'),
  }),
  success: css({
    color: token('color.text.success', '#216E4E'),
  }),
  discovery: css({
    color: token('color.text.discovery', '#5E4DB2'),
  }),
  information: css({
    color: token('color.text.information', '#0055CC'),
  }),
};

type TextColor = keyof typeof textColorMap;

/**
 * @codegenEnd
 */
