import { FileInfo } from 'jscodeshift';
import postcss, { Node, Rule, Declaration, Plugin } from 'postcss';
// @ts-ignore
import lessSyntax from 'postcss-less';
import { light as rawTokens } from '@atlaskit/tokens/tokens-raw';
import designTokens from '@atlaskit/tokens/token-names';

import Search from '../theme-to-design-tokens/utils/fuzzy-search';

import {
  knownVariables,
  knownColors,
  knownRawColors,
} from './utils/legacy-colors';
import { cleanMeta } from './utils/meta';

const options = { syntax: lessSyntax, from: undefined };

const tokens = rawTokens
  .filter((t) => t.attributes.state === 'active')
  .map((t) => t.name.replace(/\.\[default\]/g, ''))
  .filter((t) => !t.includes('UNSAFE') && !t.includes('interaction'));

const search = Search(tokens, false);

function isRule(node: Node): node is Rule {
  return node.type === 'rule';
}

function getParentSelectors(node: Node): string {
  if (isRule(node)) {
    // @ts-expect-error
    return getParentSelectors(node.parent) + ' ' + node.selector;
  }

  if (node.parent) {
    return getParentSelectors(node.parent);
  }

  return '';
}

function stripVar(prop: string) {
  return prop.substring(prop.indexOf('(') + 1).split(/\,|\)/)[0];
}

function stripLessVar(prop: string) {
  return prop.substring(1);
}

export function isColorProperty(prop: string) {
  return (
    prop === 'color' ||
    prop === 'background' ||
    prop === 'background-color' ||
    prop === 'box-shadow' ||
    prop === 'border' ||
    prop === 'border-left' ||
    prop === 'border-right' ||
    prop === 'border-top' ||
    prop === 'border-bottom' ||
    prop === 'border-color' ||
    prop === 'outline'
  );
}

function getDeclarationMeta(decl: Declaration) {
  if (decl.prop === 'color') {
    return 'text';
  }

  if (decl.prop.startsWith('background')) {
    return 'background';
  }

  if (decl.prop.includes('shadow')) {
    return 'shadow';
  }

  if (decl.prop.includes('border')) {
    return 'border';
  }

  return '';
}

function isDesignToken(tokenName: string) {
  return Boolean(
    Object.entries(designTokens).find(([_, value]) => tokenName === value),
  );
}

function getMetaFromCssVar(tokenName: string) {
  const meta = knownVariables[tokenName];

  if (!meta || meta.length === 0) {
    return tokenName.split('-');
  }

  return meta;
}

function getMetaFromRawColor(rawColor: string) {
  let cleanColor = rawColor.toLowerCase();

  if (cleanColor.length === 4) {
    cleanColor = cleanColor + cleanColor.substring(cleanColor.indexOf('#') + 1);
  }

  return knownRawColors[cleanColor];
}

// https://github.com/postcss/postcss/blob/main/docs/writing-a-plugin.md
// https://astexplorer.net/#/2uBU1BLuJ1
const plugin = (): Plugin => {
  const processed = Symbol('processed');

  return {
    postcssPlugin: 'UsingTokens',
    Declaration: (decl) => {
      // @ts-expect-error
      if (decl[processed]) {
        return;
      }
      if (!isColorProperty(decl.prop)) {
        return;
      }
      if (decl.value === 'none') {
        return;
      }

      const searchTerms: string[] = [
        getDeclarationMeta(decl),
        ...getParentSelectors(decl)
          .split(/\-|\.|\,|\ |\:|\&/)
          .filter((el) => !!el),
      ];

      let match;

      const cssVarRe = /var\([^\)]+\)/g;
      const lessVarRe = /@[a-zA-Z0-9-]+/g;
      const rawColorRe =
        /(#([0-9a-f]{3}){1,2}|(rgba|hsla)\(\d{1,3}%?(,\s?\d{1,3}%?){2},\s?(1|0|0?\.\d+)\)|(rgb|hsl)\(\d{1,3}%?(,\s?\d{1,3}%?){2}\))/i;

      // CSS variables
      const cssVarMatch = decl.value.match(cssVarRe);
      if (cssVarMatch) {
        match = cssVarMatch[0];
        if (isDesignToken(stripVar(match))) {
          return;
        }

        searchTerms.push(...(getMetaFromCssVar(stripVar(match)) ?? []));
      }

      // Less variables
      const lessVarMatch = decl.value.match(lessVarRe);
      if (lessVarMatch) {
        match = lessVarMatch[0];

        searchTerms.push(
          ...(getMetaFromCssVar(`--${stripLessVar(match)}`) ?? []),
        );
      }

      // Raw colors
      const rawColorMatch = decl.value.match(rawColorRe);
      if (rawColorMatch) {
        match = rawColorMatch[0];
        searchTerms.push(...(getMetaFromRawColor(match) ?? []));
      }

      // Named colors
      if (knownColors.hasOwnProperty(decl.value)) {
        match = decl.value;
        searchTerms.push(...(knownColors[decl.value.toLowerCase()] ?? []));
      }

      if (!match) {
        // eslint-disable-next-line no-console
        console.warn(
          `Unable to find match for declaration: ${decl.prop}: ${decl.value}`,
        );

        return;
      }

      type DesignTokenId = keyof typeof designTokens;
      const cleanSearchTerms = cleanMeta(searchTerms).join(' ');
      const results: DesignTokenId[][] = search.get(cleanSearchTerms);
      const candidates: DesignTokenId[] = results.map((result) => result[1]);
      const replacement = candidates.length
        ? designTokens[candidates[0]]
        : 'MISSING_TOKEN';

      if (decl.prop === 'box-shadow') {
        decl.value = `var(${replacement}, ${decl.value})`;
      } else {
        decl.value = decl.value
          .split(match)
          .join(`var(${replacement}, ${match})`);
      }

      // @ts-expect-error
      decl[processed] = true;
    },
  };
};

export default async function transformer(file: FileInfo | string) {
  const processor = postcss([plugin()]);
  const src = typeof file === 'string' ? file : file.source;
  const { css } = await processor.process(src, options);

  return css;
}
