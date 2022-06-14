import valueParser from 'postcss-value-parser';

import tokenNames from '@atlaskit/tokens/token-names';

import { isWord } from '../utils/rules';

const tokenSet = new Set<string>(Object.values(tokenNames));

export const isToken = (node: valueParser.Node): boolean =>
  isWord(node) && tokenSet.has(node.value);
