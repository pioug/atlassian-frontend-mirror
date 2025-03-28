import { createRuleNode } from '../nodes/rule';
import { type TokenParser } from './';

// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const RULER_REGEX = /^-{4,5}(\s|$)/;

export const ruler: TokenParser = ({ input, position, schema }) => {
	const match = input.substring(position).match(RULER_REGEX);

	if (match) {
		return {
			type: 'pmnode',
			nodes: createRuleNode(schema),
			length: match[0].length,
		};
	}

	return {
		type: 'text',
		text: input.substring(position, 1),
		length: 1,
	};
};
