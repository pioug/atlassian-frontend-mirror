import { type Node, type WordNode } from 'postcss-value-parser';

export const isWord = (node: Node): node is WordNode => node.type === 'word';
