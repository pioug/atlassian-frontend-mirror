import { toDOM, fromHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';
import { createSchema } from '../../../../schema/create-schema';
import { embedCard } from '../../../../schema/nodes/embed-card';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema embedCard node`, () => {
	const schema = createSchema({
		nodes: ['doc', 'paragraph', 'embedCard', 'text'],
	});

	const url = 'https://product-fabric.atlassian.net/browse/ED-1';

	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec', () => {
		expect(embedCard).toStrictEqual({
			attrs: {
				layout: {
					default: 'center',
				},
				originalHeight: {
					default: null,
				},
				originalWidth: {
					default: null,
				},
				url: {
					default: '',
				},
				width: {
					default: 100,
				},
				localId: {
					default: null,
				},
			},
			group: 'block',
			parseDOM: [
				{
					getAttrs: expect.anything(),
					tag: 'div[data-embed-card]',
				},
			],
			selectable: true,
			toDOM: expect.anything(),
		});
	});

	describe('embedCard with "url" attribute', () => {
		describe('parse html', () => {
			it('converts to embedCard PM node', () => {
				const doc = fromHTML(
					`<meta charset='utf-8'><div data-embed-card="" data-card-url="https://product-fabric.atlassian.net/browse/ED-1" data-layout="center"></div>`,
					schema,
				);
				const node = doc.firstChild!;
				expect(node.type.spec).toEqual(embedCard);
			});

			it('gets attributes from html', () => {
				const doc = fromHTML(
					`<meta charset='utf-8'><div data-embed-card="" data-card-url="https://product-fabric.atlassian.net/browse/ED-1" data-layout="center"></div>`,
					schema,
				);

				const node = doc.firstChild!;
				expect(node.attrs.url).toEqual(url);
			});
		});

		describe('encode html', () => {
			it('converts html data attributes to node attributes', () => {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = toDOM(
					schema.nodes.embedCard.create({ url, layout: 'center', width: 50 }),
					schema,
				).firstChild as HTMLElement;

				expect(dom.getAttribute('data-card-url')).toEqual(url);
				expect(dom.getAttribute('data-layout')).toEqual('center');
				expect(dom.getAttribute('data-width')).toEqual('50');
			});

			it('encodes and decodes to the same node', () => {
				const node = schema.nodes.embedCard.create({
					url,
					layout: 'center',
					width: 50,
				});
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = toDOM(node, schema).firstChild as HTMLElement;
				const parsedNode = fromHTML(dom.outerHTML, schema).firstChild!;
				expect(parsedNode).toEqual(node);
			});
		});
	});
});
