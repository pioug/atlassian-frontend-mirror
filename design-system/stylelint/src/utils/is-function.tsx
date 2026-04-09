import { type FunctionNode, type Node } from 'postcss-value-parser';

export const isFunction = (node: Node): node is FunctionNode => node.type === 'function';
