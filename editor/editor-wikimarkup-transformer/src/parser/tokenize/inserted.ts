import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { type Token, TokenType, type TokenParser } from './';
import { hasAnyOfMarks, getSurroundingSymbols } from '../utils/text';
import { commonFormatter } from './common-formatter';
import { parseString } from '../text';

export const inserted: TokenParser = ({ input, position, schema, context }) => {
	/**
	 * The following token types will be ignored in parsing
	 * the content
	 */
	const ignoreTokenTypes = [
		TokenType.DOUBLE_DASH_SYMBOL,
		TokenType.TRIPLE_DASH_SYMBOL,
		TokenType.QUADRUPLE_DASH_SYMBOL,
		TokenType.ISSUE_KEY,
		TokenType.TABLE,
	];
	// Add underline mark to each text
	const contentDecorator = (n: PMNode) => {
		const mark = schema.marks.underline.create();
		// We don't want to mix `code` mark with others
		if (n.type.name === 'text' && !hasAnyOfMarks(n, ['underline', 'code'])) {
			return n.mark([...n.marks, mark]);
		}
		return n;
	};

	const rawContentProcessor = (raw: string, length: number): Token => {
		const content = parseString({
			ignoreTokenTypes,
			schema,
			context,
			input: raw,
		});
		const decoratedContent = content.map(contentDecorator);

		return {
			type: 'pmnode',
			nodes: decoratedContent,
			length,
		};
	};

	const { openingSymbol, closingSymbol } = getSurroundingSymbols(
		input.substring(position),
		'+',
		'+',
	);

	return commonFormatter(input, position, schema, {
		opening: openingSymbol,
		closing: closingSymbol,
		context,
		rawContentProcessor,
	});
};
