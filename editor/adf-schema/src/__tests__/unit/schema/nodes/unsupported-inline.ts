import { toDOM, fromHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';

import { schema } from '@af/adf-test-helpers/src/adf-schema';
import { unsupportedInline } from '../../../..';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema unsupportedInline node`, () => {
	const originalValue = {
		type: 'invalidInlineNode',
	};

	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec', () => {
		expect(unsupportedInline).toStrictEqual({
			attrs: {
				originalValue: {
					default: {},
				},
			},
			group: 'inline',
			inline: true,
			parseDOM: [
				{
					getAttrs: expect.anything(),
					tag: '[data-node-type="unsupportedInline"]',
				},
			],
			selectable: true,
			toDOM: expect.anything(),
		});
	});

	it('should parse unsupported inline nodes', () => {
		const doc = fromHTML(
			`<span
        data-node-type="unsupportedInline"
        data-original-value='${JSON.stringify(originalValue)}'
      />`,
			schema,
		);
		const paragraph = doc.firstChild!;
		const unsupportedInlineNode = paragraph.firstChild!;

		expect(unsupportedInlineNode.type).toEqual(schema.nodes.unsupportedInline);
		expect(unsupportedInlineNode.attrs.originalValue).toEqual(originalValue);
	});

	it('should encode unsupported inline nodes to html', () => {
		const unsupportedInlineNode = schema.nodes.unsupportedInline.create({
			originalValue,
		});
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		const domNode = toDOM(unsupportedInlineNode, schema).firstChild as HTMLElement;

		expect(domNode.getAttribute('data-original-value')).toEqual(JSON.stringify(originalValue));
	});
});
