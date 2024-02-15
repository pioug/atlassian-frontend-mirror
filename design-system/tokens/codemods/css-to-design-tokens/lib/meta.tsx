import type { Declaration, Node, Rule } from 'postcss';

import { uniqueWordsFromTokens } from '../../utils/tokens';

import { extractCssVarName } from './declaration';
import {
  knownNamedColors,
  knownRawColors,
  knownVariables,
} from './legacy-colors';

function filterDuplicateFoundations(meta: string[]) {
  const foundations = ['text', 'background', 'shadow', 'border'];
  let hasFoundation = false;

  return meta.filter((val) => {
    if (!hasFoundation && foundations.includes(val)) {
      hasFoundation = true;
      return true;
    }

    if (hasFoundation && foundations.includes(val)) {
      return false;
    }

    return true;
  });
}

const REPLACEMENTS: Record<string, string> = {
  ':': '',
  ',': '',
  texts: 'text',
  error: 'danger',
  invalid: 'danger',
  removed: 'danger',
  removal: 'danger',
  remove: 'danger',
  focus: 'focused',
  valid: 'success',
  successful: 'success',
  risk: 'warning',
  caution: 'warning',
  warn: 'warning',
  primary: 'bold',
  info: 'bold',
  secondary: 'subtle',
  hyperlink: 'link',
  anchor: 'link',
  active: 'pressed',
  hover: 'hovered',
  dragged: 'overlay',
  dragging: 'overlay',
  drag: 'overlay',
  'background-color': 'background',
  color: 'text',
  icons: 'icon',
  arrow: 'icon',
  glyph: 'icon',
  stroke: 'border',
  'border-left': 'border',
  'border-right': 'border',
  'border-top': 'border',
  'border-bottom': 'border',
  'box-shadow': 'shadow',
};
const ADDITIONAL_META: Record<string, string> = {
  grey: 'neutral',
  red: 'danger',
};

export function cleanMeta(meta: string[]) {
  const cleanMeta = meta
    .reduce(
      (accum: string[], val: string) => [
        ...accum,
        ...(typeof val === 'string'
          ? val.split(/(?=[A-Z])/g).map((e) => e.toLowerCase())
          : []),
      ],
      [],
    )
    .reduce((accum: string[], val: string) => {
      if (val in ADDITIONAL_META) {
        accum.push(val, ADDITIONAL_META[val]);
      } else {
        accum.push(val);
      }
      accum.push(val in REPLACEMENTS ? REPLACEMENTS[val] : val);

      return accum;
    }, [])
    .filter((val: string) => uniqueWordsFromTokens.includes(val))
    .reduce((accum: string[], val: string) => {
      if (!accum.includes(val)) {
        accum.push(val);
      }

      return accum;
    }, []);

  return filterDuplicateFoundations(cleanMeta);
}

export function getBaseDeclarationMeta(decl: Declaration): string[] {
  const parentSelectors = getParentSelectors(decl)
    .split(/\-|\.|\,|\ |\:|\&/)
    .filter(Boolean);

  return [getPropertyMeta(decl.prop), ...parentSelectors];
}

function getPropertyMeta(prop: string) {
  if (prop === 'color') {
    return 'text';
  }

  if (prop.startsWith('background')) {
    return 'background';
  }

  if (prop.includes('shadow')) {
    return 'shadow';
  }

  if (prop.includes('border')) {
    return 'border';
  }

  return '';
}

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

export function getCssVarMeta(cssVariable: string) {
  const tokenName = extractCssVarName(cssVariable);
  const meta = knownVariables[tokenName];

  if (!meta || meta.length === 0) {
    return tokenName.split('-');
  }

  return meta;
}

export function getRawColorMeta(rawColor: string) {
  let cleanColor = rawColor.toLowerCase();

  if (cleanColor.length === 4) {
    cleanColor = cleanColor + cleanColor.substring(cleanColor.indexOf('#') + 1);
  }

  return knownRawColors[cleanColor] ?? [];
}

export function getNamedColorMeta(namedColor: string) {
  return knownNamedColors[namedColor] ?? [];
}
