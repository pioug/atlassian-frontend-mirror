import type { Transform } from 'style-dictionary';

import palette from '../../../src/tokens/palette';
import type { PaintToken, RawToken, ShadowToken } from '../../../src/types';
import { getTokenId } from '../utils/token-ids';

function isHex(hex: string) {
  return /[0-9A-Fa-f]{6}/g.test(hex);
}

const transform: Transform = {
  type: 'value',
  matcher: (token) => {
    return !!token.attributes && token.attributes.group !== 'palette';
  },
  transformer: (token) => {
    const originalToken = token.original as PaintToken | ShadowToken | RawToken;

    if (
      originalToken.attributes.group === 'paint' &&
      !palette.color.palette[originalToken.value as PaintToken['value']]
    ) {
      const value = originalToken.value;

      if (isHex(value as string)) {
        return value;
      }

      if (value === 'transparent') {
        return '#00000000';
      }

      throw new Error(
        `Invalid color format "${value}" provided to token: "${getTokenId(
          token.path,
        )}". Please use either a base token, hexadecimal or "transparent"`,
      );
    }

    if (originalToken.attributes.group === 'paint') {
      const value = originalToken.value as PaintToken['value'];
      return palette.color.palette[value].value;
    }

    if (originalToken.attributes.group === 'raw') {
      return originalToken.value as RawToken['value'];
    }

    const values = originalToken.value as ShadowToken['value'];

    return values.map((value) => {
      const color = isHex(value.color)
        ? value.color
        : palette.color.palette[value.color].value;

      return {
        ...value,
        color,
      };
    });
  },
};

export default transform;
