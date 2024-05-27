import { type FunctionNode, type Node, type WordNode } from 'postcss-value-parser';

const spacingProperties = [
  'gap',
  'column-gap',
  'row-gap',

  'margin',
  'margin-block',
  'margin-bottom',
  'margin-inline',
  'margin-left',
  'margin-right',
  'margin-top',
  'margin-block-start',
  'margin-block-end',
  'margin-inline-start',
  'margin-inline-end',
  '-webkit-margin-before',
  '-webkit-margin-after',

  'scroll-margin',
  'scroll-margin-top',
  'scroll-margin-right',
  'scroll-margin-bottom',
  'scroll-margin-left',
  'scroll-snap-margin-top',
  'scroll-snap-margin-right',
  'scroll-snap-margin-bottom',
  'scroll-snap-margin-left',
  'scroll-snap-margin-block',
  'scroll-snap-margin-block-start',
  'scroll-snap-margin-block-end',
  'scroll-snap-inline-block',
  'scroll-snap-margin-inline-start',
  'scroll-snap-margin-inline-end',

  'shape-margin',
  '-webkit-shape-margin',

  'padding',
  'padding-block',
  'padding-bottom',
  'padding-inline',
  'padding-left',
  'padding-right',
  'padding-top',
  'padding-block-start',
  'padding-block-end',
  'padding-inline-start',
  'padding-inline-end',
  '-webkit-padding-before',
  '-webkit-padding-after',

  'scroll-padding',
  'scroll-padding-top',
  'scroll-padding-right',
  'scroll-padding-bottom',
  'scroll-padding-left',
  'scroll-padding-inline',
  'scroll-padding-inline-start',
  'scroll-padding-inline-end',
  'scroll-padding-block',
  'scroll-padding-block-start',
  'scroll-padding-block-end',
];

const typographyProperties = [
  'font-size',
  'font-weight',
  'font-family',
  'line-height',
];

export const isFunction = (node: Node): node is FunctionNode =>
  node.type === 'function';

export const isWord = (node: Node): node is WordNode => node.type === 'word';

export const isVar = (node: FunctionNode): boolean => node.value === 'var';

export const isSpacingRule = (prop: string): boolean => {
  return spacingProperties.includes(prop);
};

export const isTypographyRule = (prop: string): boolean => {
  return typographyProperties.includes(prop);
};
