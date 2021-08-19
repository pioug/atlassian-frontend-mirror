import padStart from 'lodash/padStart';
import type { Transform } from 'style-dictionary';

import palette from '../../../src/tokens/palette';
import type { ColorPalette, ShadowToken } from '../../../src/types';

const percentToHex = (percent: number): string => {
  const normalizedPercent = percent * 100;
  const intValue = Math.round((normalizedPercent / 100) * 255); // map percent to nearest integer (0 - 255)
  const hexValue = intValue.toString(16); // get hexadecimal representation
  return hexValue.padStart(2, '0').toUpperCase(); // format with leading 0 and upper case characters
};

const shadowOpacity = (opacity: number): string => {
  // If opacity is 1 don't bother setting a hex.
  return opacity === 1
    ? ''
    : padStart(percentToHex(opacity).toUpperCase(), 2, '0');
};

const paletteValue = (color: ColorPalette): string => {
  return palette.color.palette[
    color
    // Ensure we only pick the color not the alph (get the first 6 characters).
  ].value.slice(0, 7);
};

const transform: Transform = {
  type: 'value',
  matcher: (token) => {
    return !!token.attributes && token.attributes.group === 'shadow';
  },
  transformer: (token) => {
    const shadowToken = token.original as ShadowToken;

    return shadowToken.value
      .splice(0)
      .map((shadow) => {
        // We don't use the opacity from the color value, but the opacity
        // defined in the token declaration.
        const opacityHex = shadowOpacity(shadow.opacity);
        const paletteColor = paletteValue(shadow.color);
        const shadowColor = `${paletteColor}${opacityHex}`;
        const optionalSpread = shadow.spread ? ` ${shadow.spread}px` : '';
        const optionalInset = shadow.inset ? 'inset ' : '';

        return `${optionalInset}${shadow.offset.x}px ${shadow.offset.y}px ${shadow.radius}px${optionalSpread} ${shadowColor}`;
      })
      .join(', ');
  },
};

export default transform;
