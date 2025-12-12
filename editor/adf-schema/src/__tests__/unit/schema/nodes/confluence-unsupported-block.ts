import { schema, toDOM, fromHTML } from '@af/adf-test-helpers/src/adf-schema';
import { confluenceUnsupportedBlock } from '../../../..';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema unsupportedBlock node`, () => {
	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec', () => {
		expect(confluenceUnsupportedBlock).toStrictEqual({
			attrs: {
				cxhtml: {
					default: null,
				},
			},
			group: 'block',
			parseDOM: [
				{
					getAttrs: expect.anything(),
					tag: 'div[data-node-type="confluenceUnsupportedBlock"]',
				},
			],
			toDOM: expect.anything(),
		});
	});

	it('should parse unsupported block nodes', () => {
		const doc = fromHTML(
			'<div data-node-type="confluenceUnsupportedBlock" data-confluence-unsupported="block" data-confluence-unsupported-block-cxhtml="foobar"/>',
			schema,
		);
		const unsupportedBlockNode = doc.firstChild!;
		expect(unsupportedBlockNode.type).toEqual(schema.nodes.confluenceUnsupportedBlock);
		expect(unsupportedBlockNode.attrs.cxhtml).toEqual('foobar');
	});

	it('should encode unsupported block nodes to html', () => {
		const unsupportedBlockNode = schema.nodes.confluenceUnsupportedBlock.create({
			cxhtml: 'foobar',
		});
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		const domNode = toDOM(unsupportedBlockNode, schema).firstChild as HTMLElement;

		expect(domNode.getAttribute('data-confluence-unsupported')).toEqual('block');
		expect(domNode.getAttribute('data-confluence-unsupported-block-cxhtml')).toEqual('foobar');
	});
});
