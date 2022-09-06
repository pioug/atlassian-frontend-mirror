import type { Transform } from 'style-dictionary';

import type {
  OpacityToken,
  PaintToken,
  RawToken,
  ShadowToken,
} from '../../../src/types';
import { getTokenId } from '../../../src/utils/token-ids';

function isHex(hex: string) {
  return /[0-9A-Fa-f]{6}/g.test(hex);
}

const transform = (palette: Record<string, any>): Transform => {
  return {
    type: 'value',
    matcher: (token) => {
      return !!token.attributes && token.attributes.group !== 'palette';
    },
    transformer: (token) => {
      const originalToken = token.original as
        | PaintToken<any>
        | ShadowToken<any>
        | OpacityToken
        | RawToken;

      if (
        originalToken.attributes.group === 'paint' &&
        !palette.color.palette[originalToken.value]
      ) {
        const value = originalToken.value as string;

        if (isHex(value)) {
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
        const value = originalToken.value;
        return palette.color.palette[value].value;
      }

      if (originalToken.attributes.group === 'raw') {
        return originalToken.value as RawToken['value'];
      }

      if (originalToken.attributes.group === 'shadow') {
        const values = originalToken.value as ShadowToken<any>['value'];

        return values.map((value) => {
          const color = isHex(value.color)
            ? value.color
            : palette.color.palette[value.color].value;

          return {
            ...value,
            color,
          };
        });
      }

      if (originalToken.attributes.group === 'opacity') {
        const value = originalToken.value as OpacityToken['value'];
        return palette.value.opacity[value].value;
      }
    },
  };
};

export default transform;
