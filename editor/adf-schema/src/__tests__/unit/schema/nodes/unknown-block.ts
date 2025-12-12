import { fromHTML, toHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';
import { inlineNodes } from '../../../../schema/inline-nodes';
import { unknownBlock } from '../../../..';

import { schema } from '@af/adf-test-helpers/src/adf-schema';

const packageName = process.env.npm_package_name as string;
const nodesToSkip = [
	'image',
	'inlineExtension',
	'dateWithLocalId',
	'emojiWithLocalId',
	'inlineCardWithLocalId',
	'placeholderWithLocalId',
];

describe(`${packageName}/schema unknownBlock node`, () => {
	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec', () => {
		expect(unknownBlock).toStrictEqual({
			content: 'inline+',
			group: 'block',
			marks: '_',
			parseDOM: [
				{
					tag: 'div[data-node-type="unknownBlock"]',
				},
			],
			toDOM: expect.anything(),
		});
	});

	describe('should be able to parse inline node', () => {
		inlineNodes.forEach((node) => {
			/**
			 * It's not going to work for extension since we made extension attrs parsing more strict.
			 * Having an empty `data-extension-type` or `data-extension-key` won't be parsed as valid extension anymore.
			 */
			if (nodesToSkip.includes(node)) {
				return;
			}
			it(node, () => {
				let element;

				// schema.nodes.text.create() is not valid
				// https://discuss.prosemirror.net/t/how-i-can-create-text-node-types/759
				if ('text' === node) {
					element = toHTML(schema.text('foo'), schema);
				} else {
					element = toHTML(schema.nodes[node].create(), schema);
				}

				const doc = fromHTML(`<div data-node-type="unknownBlock">${element}</div>`, schema);
				const span = doc.firstChild!;
				const elementNode = span.firstChild!;

				expect(elementNode).toBeDefined();
				expect(elementNode).toHaveProperty('type');
				expect(elementNode.type).toEqual(schema.nodes[node]);
			});
		});
	});
});
