import { type TextToken, type TokenParser } from './';
import { createDashTokenParser } from './dash-token-creator';

const token: TextToken = {
	type: 'text',
	text: '\u2013', // EN DASH
	length: 2,
};
const fallback: TextToken = {
	...token,
	text: '--',
};

export const doubleDashSymbol: TokenParser = createDashTokenParser(token, fallback);
