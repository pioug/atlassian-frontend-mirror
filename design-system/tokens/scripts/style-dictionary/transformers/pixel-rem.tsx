import type { Transform } from 'style-dictionary';

/**
 * transform a raw value to a rem based value
 */
const pixelRemTransform: Transform = {
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
      return `${value / 16}rem`;
    }

    return value;
  },
};

export default pixelRemTransform;
