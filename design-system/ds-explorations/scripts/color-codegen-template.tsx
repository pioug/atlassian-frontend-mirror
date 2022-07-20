import prettier from 'prettier';
import parserTypeScript from 'prettier/parser-typescript';

// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import tokens from '@atlaskit/tokens/src/artifacts/tokens-raw/atlassian-light';

import {
  capitalize,
  compose,
  isAccent,
  isHovered,
  isPressed,
  not,
  pick,
  tokenToStyle,
} from './utils';

const colors = {
  text: {
    prefix: 'color.text.',
    cssProperty: 'color',
  },
  background: {
    prefix: 'color.background.',
    cssProperty: 'backgroundColor',
  },
  border: {
    prefix: 'color.border.',
    cssProperty: 'borderColor',
  },
} as const;

const activeTokens = tokens
  .filter(
    (t) =>
      t.attributes.state !== 'deleted' && t.attributes.state !== 'deprecated',
  )
  .map((t) => {
    return {
      token: t.name,
      fallback: t.value,
    };
  })
  .filter(compose(pick('token'), not(isAccent)))
  .filter(compose(pick('token'), not(isPressed)))
  .filter(compose(pick('token'), not(isHovered)));

export const createColorStylesFromTemplate = (
  colorProperty: keyof typeof colors,
) => {
  if (!colors[colorProperty]) {
    throw new Error(`[codegen] Unknown option found "${colorProperty}"`);
  }

  const { prefix, cssProperty } = colors[colorProperty];

  return (
    prettier.format(
      `
const ${colorProperty}ColorMap = {
  ${activeTokens
    .filter(({ token }) => token.includes(prefix))
    // @ts-ignore
    .map((t) => ({ ...t, token: t.token.replaceAll('.[default]', '') }))
    .map((t) => {
      // handle the default case eg color.border or color.text
      const replacedProp = t.token.replace(prefix, '');
      const propName = !t.token.startsWith(prefix) ? 'default' : replacedProp;
      return `'${propName}': ${tokenToStyle(
        cssProperty,
        t.token,
        t.fallback as string,
      )}`;
    })
    .join(',\n\t')}
};`,
      { singleQuote: true, parser: 'typescript', plugins: [parserTypeScript] },
    ) +
    `\ntype ${capitalize(
      colorProperty,
    )}Color = keyof typeof ${colorProperty}ColorMap;\n`
  );
};
