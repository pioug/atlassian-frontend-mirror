import type { FileInfo } from 'jscodeshift';
import postcss, { Plugin } from 'postcss';
// @ts-ignore
import lessSyntax from 'postcss-less';

import {
  isColorRelatedProperty,
  isCssDeclaration,
  splitCssValue,
} from './lib/declaration';
import { getBaseDeclarationMeta } from './lib/meta';
import findToken from './lib/tokens';
import parseValue from './lib/value';

const POSTCSS_OPTIONS = { syntax: lessSyntax, from: undefined };

// https://github.com/postcss/postcss/blob/main/docs/writing-a-plugin.md
// https://astexplorer.net/#/2uBU1BLuJ1
const plugin = (): Plugin => {
  const processed = Symbol('processed');

  return {
    postcssPlugin: 'UsingTokens',
    AtRule(atRule) {
      // @ts-expect-error
      if (atRule[processed]) {
        return;
      }

      // @ts-expect-error: The 'variable' property does not exist on 'AtRule' according to the TypeScript definitions.
      // However, the 'postcss-less' library adds a 'variable' property to 'AtRule' when parsing LESS variables.
      // This property indicates whether the 'AtRule' is a LESS variable.
      if (atRule.variable) {
        // TODO https://hello.atlassian.net/browse/DCA11Y-637
      }

      // @ts-expect-error
      atRule[processed] = true;
    },
    Declaration: (decl) => {
      // @ts-expect-error
      if (decl[processed]) {
        return;
      }
      if (decl.value === 'none') {
        return;
      }

      const baseMeta = getBaseDeclarationMeta(decl);

      if (isCssDeclaration(decl.prop)) {
        // TODO https://hello.atlassian.net/browse/DCA11Y-637
      }

      if (isColorRelatedProperty(decl.prop)) {
        const values = splitCssValue(decl.value);
        if (!values) {
          return;
        }

        switch (decl.prop) {
          case 'box-shadow':
            const meta = values.reduce((acc: string[], curr: string) => {
              const parsedValue = parseValue(curr);
              if (!parsedValue) {
                return acc;
              }
              return [...acc, ...parsedValue.getMeta()];
            }, baseMeta);

            const token = findToken(meta);
            decl.value = `var(${token}, ${decl.value})`;
            break;
          default:
            const replacedValues = values.map((value) => {
              const parsedValue = parseValue(value);
              if (!parsedValue) {
                return value;
              }

              return parsedValue.getReplacement(baseMeta);
            });
            decl.value = replacedValues.join(' ');
            break;
        }
      }

      // @ts-expect-error
      decl[processed] = true;
    },
  };
};

export default async function transformer(file: FileInfo | string) {
  const processor = postcss([plugin()]);
  const src = typeof file === 'string' ? file : file.source;
  const { css } = await processor.process(src, POSTCSS_OPTIONS);
  return css;
}
