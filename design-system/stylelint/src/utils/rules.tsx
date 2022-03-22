import valueParser from 'postcss-value-parser';

export const isFunction = (
  node: valueParser.Node,
): node is valueParser.FunctionNode => node.type === 'function';

export const isWord = (node: valueParser.Node): node is valueParser.WordNode =>
  node.type === 'word';

export const isVar = (node: valueParser.FunctionNode): boolean =>
  node.value === 'var';
