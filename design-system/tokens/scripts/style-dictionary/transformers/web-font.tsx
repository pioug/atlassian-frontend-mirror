import type { Transform, TransformedToken } from 'style-dictionary';

import { getCSSCustomProperty } from '../../../src/utils/token-ids';

export const fontTokenToCSS = ({
  value: { fontSize, fontStyle, fontWeight, lineHeight, fontFamily },
}: TransformedToken) => {
  return `${fontStyle} ${fontWeight} ${fontSize}/${lineHeight} var(${getCSSCustomProperty(
    fontFamily,
  )})`;
};

/**
 * Transform a value from a raw number to a pixelised value.
 */
const fontTransform: Transform = {
  type: 'value',
  matcher: (token) => {
    return token.attributes?.group === 'typography';
  },
  transformer: fontTokenToCSS,
};

export default fontTransform;
