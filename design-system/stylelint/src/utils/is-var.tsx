import { type FunctionNode } from 'postcss-value-parser';

export const isVar = (node: FunctionNode): boolean => node.value === 'var';
