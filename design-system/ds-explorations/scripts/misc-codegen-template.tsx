import prettier from 'prettier';
import parserTypeScript from 'prettier/parser-typescript';

import { Layer } from '../src/constants';

const styleProperties: Record<'layer', Record<Layer, number>> = {
  layer: {
    card: 100,
    navigation: 200,
    dialog: 300,
    layer: 400,
    blanket: 500,
    modal: 510,
    flag: 600,
    spotlight: 700,
    tooltip: 800,
  },
};

export const createStylesFromTemplate = (
  property: keyof typeof styleProperties,
) => {
  if (!styleProperties[property]) {
    throw new Error(`[codegen] Unknown option found "${property}"`);
  }

  return prettier.format(
    `
const ${property}Map = {
  ${Object.keys(styleProperties[property])
    .map((key) => {
      return `'${key}': css({ zIndex: LAYERS['${key}'] })`;
    })
    .join(',\n\t')}
};`,
    {
      singleQuote: true,
      trailingComma: 'all',
      parser: 'typescript',
      plugins: [parserTypeScript],
    },
  );
};
