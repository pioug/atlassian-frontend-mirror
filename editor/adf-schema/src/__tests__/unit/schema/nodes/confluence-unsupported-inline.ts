import { toDOM, fromHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';
import { confluenceUnsupportedInline } from '../../../..';

import { schema } from '@af/adf-test-helpers/src/adf-schema';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema unsupportedInline node`, () => {
	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec', () => {
		expect(confluenceUnsupportedInline).toStrictEqual({
			atom: true,
			attrs: {
				cxhtml: {
					default: null,
				},
			},
			group: 'inline',
			inline: true,
			parseDOM: [
				{
					getAttrs: expect.anything(),
					tag: 'div[data-node-type="confluenceUnsupportedInline"]',
				},
			],
			toDOM: expect.anything(),
		});
	});

	it('should parse unsupported inline nodes', () => {
		const doc = fromHTML(
			'<div data-node-type="confluenceUnsupportedInline" data-confluence-unsupported="inline" data-confluence-unsupported-inline-cxhtml="foobar"/>',
			schema,
		);
		const paragraph = doc.firstChild!;
		const unsupportedInlineNode = paragraph.firstChild!;

		expect(unsupportedInlineNode.type).toEqual(schema.nodes.confluenceUnsupportedInline);
		expect(unsupportedInlineNode.attrs.cxhtml).toEqual('foobar');
	});

	it('should encode unsupported inline nodes to html', () => {
		const unsupportedInlineNode = schema.nodes.confluenceUnsupportedInline.create({
			cxhtml: 'foobar',
		});
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		const domNode = toDOM(unsupportedInlineNode, schema).firstChild as HTMLElement;

		expect(domNode.getAttribute('data-confluence-unsupported')).toEqual('inline');
		expect(domNode.getAttribute('data-confluence-unsupported-inline-cxhtml')).toEqual('foobar');
	});
});
