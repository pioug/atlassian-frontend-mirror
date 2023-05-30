import type { Transform } from 'style-dictionary';

/**
 * transform a value from a raw number to a pixelised value
 */
const rawNumberToPixelTransform: Transform = {
  type: 'value',
  matcher: (token) => {
    return [
      'spacing',
      'shape',
      'typography',
      'lineHeight',
      'fontSize',
    ].includes(token.attributes?.group);
  },
  transformer: (token) => {
    const { value } = token;

    if (typeof value === 'number') {
      return `${value}px`;
    }

    return value;
  },
};

export default rawNumberToPixelTransform;
