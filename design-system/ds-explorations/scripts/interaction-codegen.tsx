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
  or,
  pick,
} from './utils';

type Token = {
  token: string;
  fallback: string;
};

// NB: Fallback CSS variables can be deleted when tokens are no longer behind a feature flag
const colors = {
  text: {
    prefix: 'color.text.',
    cssProperty: 'color',
    filterFn: <T extends Token>(t: T) => t.token.startsWith(colors.text.prefix),
  },
  background: {
    prefix: 'color.background.',
    cssProperty: 'backgroundColor',
    filterFn: <T extends Token>(t: T) =>
      t.token.startsWith(colors.background.prefix) ||
      t.token.startsWith('elevation.surface') ||
      t.token.startsWith('color.blanket'),
  },
  border: {
    prefix: 'color.border.',
    cssProperty: 'borderColor',
    filterFn: <T extends Token>(t: T) =>
      t.token.startsWith(colors.border.prefix),
  },
} as const;

const activeTokens = tokens
  .filter(
    (t) =>
      t.attributes.state !== 'deleted' && t.attributes.state !== 'deprecated',
  )
  .map(
    (t): Token => ({
      token: t.name,
      fallback: t.value as string,
    }),
  )
  .filter(compose(pick('token'), or(isAccent, isPressed, isHovered)));

const pressedTokens = activeTokens.filter(compose(pick('token'), isPressed));
const hoveredTokens = activeTokens.filter(compose(pick('token'), isHovered));

export const createInteractionStylesFromTemplate = (
  colorProperty: keyof typeof colors,
) => {
  if (!colors[colorProperty]) {
    throw new Error(`[codegen] Unknown option found "${colorProperty}"`);
  }

  const { prefix, cssProperty, filterFn } = colors[colorProperty];

  return (
    prettier.format(
      `
const ${colorProperty}ActiveColorMap = {
  ${pressedTokens
    .filter(filterFn)
    // @ts-ignore
    .map((t) => ({ ...t, token: t.token.replaceAll('.[default]', '') }))
    .map((t) => {
      // handle the default case eg color.border or color.text
      const propName = t.token.replace(prefix, '').replace('.pressed', '');
      return `'${propName}': css({\n\t':active': { ${cssProperty}: token('${t.token}') }\n})`;
    })
    .join(',\n\t')}
};

const ${colorProperty}HoverColorMap = {
  ${hoveredTokens
    .filter(filterFn)
    // @ts-ignore
    .map((t) => ({ ...t, token: t.token.replaceAll('.[default]', '') }))
    .map((t) => {
      // handle the default case eg color.border or color.text
      const propName = t.token.replace(prefix, '').replace('.hovered', '');
      return `'${propName}': css({\n\t':hover': { ${cssProperty}: token('${t.token}') }\n})`;
    })
    .join(',\n\t')}
};`,
      {
        singleQuote: true,
        parser: 'typescript',
        trailingComma: 'all',
        plugins: [parserTypeScript],
      },
    ) +
    `\ntype Interaction${capitalize(
      colorProperty,
    )}Color = keyof typeof ${colorProperty}HoverColorMap;\n`
  );
};
