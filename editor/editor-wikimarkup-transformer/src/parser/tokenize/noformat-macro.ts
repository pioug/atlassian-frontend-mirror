import { type Schema, type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { type Token, type TokenParser } from '.';
import { type Context } from '../../interfaces';
import { commonMacro } from './common-macro';
import { parseAttrs } from '../utils/attrs';
import { title } from '../utils/title';

export const noformatMacro: TokenParser = ({ input, position, schema, context }) => {
	return commonMacro(input.substring(position), schema, {
		keyword: 'noformat',
		paired: true,
		context,
		rawContentProcessor,
	});
};

const rawContentProcessor = (
	rawAttrs: string,
	rawContent: string,
	length: number,
	schema: Schema,
	_context: Context,
): Token => {
	const output: PMNode[] = [];
	const { codeBlock } = schema.nodes;

	const parsedAttrs = parseAttrs(rawAttrs);
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	const trimedContent = rawContent.replace(/^\s+|\s+$/g, '');
	const textNode = trimedContent.length ? schema.text(trimedContent) : undefined;

	if (parsedAttrs.title) {
		output.push(title(parsedAttrs.title, schema));
	}

	output.push(codeBlock.createChecked({}, textNode));

	return {
		type: 'pmnode',
		nodes: output,
		length,
	};
};
