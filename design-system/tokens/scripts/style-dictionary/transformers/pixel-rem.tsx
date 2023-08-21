import type { Transform } from 'style-dictionary';

const pixelToRem = (value: unknown) =>
  typeof value === 'number' ? `${value / 16}rem` : value;

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

    if (token.attributes?.group === 'typography') {
      return {
        ...value,
        fontSize: pixelToRem(value.fontSize),
        lineHeight: pixelToRem(value.lineHeight),
      };
    }

    return pixelToRem(value);
  },
};

export default pixelRemTransform;
