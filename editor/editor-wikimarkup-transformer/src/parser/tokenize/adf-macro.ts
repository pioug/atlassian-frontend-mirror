import { type Node as PMNode, type Schema } from '@atlaskit/editor-prosemirror/model';
import { type Token, type TokenParser } from '.';
import { type Context } from '../../interfaces';
import { commonMacro } from './common-macro';

export const adfMacro: TokenParser = ({ input, position, schema, context }) => {
	return commonMacro(input.substring(position), schema, {
		keyword: 'adf',
		paired: true,
		context,
		rawContentProcessor,
	});
};

const rawContentProcessor = (
	_rawAttrs: string,
	rawContent: string,
	length: number,
	schema: Schema,
	_context: Context,
): Token => {
	try {
		const json = JSON.parse(rawContent);
		const node = schema.nodeFromJSON(json);

		return {
			type: 'pmnode',
			nodes: [node],
			length,
		};
	} catch (_e) {
		const textContent = `Invalid ADF Macro: ${rawContent}`;
		const textNode = rawContent.length ? schema.text(textContent) : undefined;

		const { codeBlock } = schema.nodes;
		const node: PMNode = codeBlock.create({ language: undefined }, textNode);

		return {
			type: 'pmnode',
			nodes: [node],
			length,
		};
	}
};
