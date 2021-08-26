import type { Transform } from 'style-dictionary';

import palette from '../../../src/tokens/palette';
import type { PaintToken, RawToken, ShadowToken } from '../../../src/types';

const transform: Transform = {
  type: 'value',
  matcher: (token) => {
    return !!token.attributes && !token.attributes.isPalette;
  },
  transformer: (token) => {
    const originalToken = token.original as PaintToken | ShadowToken | RawToken;
    if (originalToken.attributes.group === 'paint') {
      const value = originalToken.value as PaintToken['value'];
      return palette.color.palette[value].value;
    } else if (originalToken.attributes.group === 'raw') {
      const value = originalToken.value as RawToken['value'];
      return value;
    }

    const values = originalToken.value as ShadowToken['value'];
    return values.map((value) => ({
      ...value,
      color: palette.color.palette[value.color].value,
    }));
  },
};

export default transform;
