import { toDOM, fromHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';

import { schema } from '@af/adf-test-helpers/src/adf-schema';
import { unsupportedBlock } from '../../../..';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema unsupportedBlock node`, () => {
	const originalValue = {
		type: 'invalidNode',
		content: [
			{
				type: 'text',
				text: 'foo',
			},
		],
	};

	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec', () => {
		expect(unsupportedBlock).toStrictEqual({
			atom: true,
			attrs: {
				originalValue: {
					default: {},
				},
			},
			group: 'block',
			parseDOM: [
				{
					getAttrs: expect.anything(),
					tag: '[data-node-type="unsupportedBlock"]',
				},
			],
			selectable: true,
			toDOM: expect.anything(),
		});
	});

	it('should parse unsupported block nodes', () => {
		const doc = fromHTML(
			`<div
        data-node-type="unsupportedBlock"
        data-original-value='${JSON.stringify(originalValue)}'
      />`,
			schema,
		);
		const unsupportedBlockNode = doc.firstChild!;
		expect(unsupportedBlockNode.type).toEqual(schema.nodes.unsupportedBlock);
		expect(unsupportedBlockNode.attrs.originalValue).toEqual(originalValue);
	});

	it('should encode unsupported block nodes to html', () => {
		const unsupportedBlockNode = schema.nodes.unsupportedBlock.create({
			originalValue,
		});
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		const domNode = toDOM(unsupportedBlockNode, schema).firstChild as HTMLElement;

		expect(domNode.getAttribute('data-original-value')).toEqual(JSON.stringify(originalValue));
	});
});
