import type valueParser from 'postcss-value-parser';

import tokenNames from '@atlaskit/tokens/token-names';

import { isWord } from './is-word';

const invertedTokenNames = Object.entries(tokenNames).reduce<
	Record<string, keyof typeof tokenNames>
>((acc, [name, cssName]) => {
	acc[cssName] = name as keyof typeof tokenNames;
	return acc;
}, {});

export const isToken = (node: valueParser.Node): boolean =>
	isWord(node) && !!invertedTokenNames[node.value];
