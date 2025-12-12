import { toDOM, fromHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';
import { createSchema } from '../../../../schema/create-schema';
import { blockCard } from '../../../..';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema blockCard node`, () => {
	const schema = createSchema({
		nodes: ['doc', 'paragraph', 'blockCard', 'text'],
	});

	const url = 'https://product-fabric.atlassian.net/browse/ED-1';
	const data = {
		'@type': 'Document',
		generator: {
			'@type': 'Application',
			name: 'Confluence',
		},
		url: 'https://extranet.atlassian.com/pages/viewpage.action?pageId=3088533424',
		name: 'Founder Update 76: Hello, Trello!',
		summary:
			'Today is a big day for Atlassian – we have entered into an agreement to buy Trello. (boom)',
	};
	const datasource = {
		id: 'datasource-id',
		parameters: { jql: 'EDM=jql', cloudId: 'cloud-id' },
		views: [
			{
				type: 'table',
				properties: { columns: [{ key: 'col1' }, { key: 'col2' }] },
			},
		],
	};

	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec', () => {
		expect(blockCard).toStrictEqual({
			attrs: {
				data: {
					default: null,
				},
				datasource: {
					default: null,
				},
				layout: {
					default: null,
				},
				url: {
					default: null,
				},
				width: {
					default: null,
				},
				localId: {
					default: null,
				},
			},
			draggable: true,
			group: 'block',
			parseDOM: [
				{
					getAttrs: expect.anything(),
					priority: 100,
					tag: 'a[data-block-card]',
				},
				{
					getAttrs: expect.anything(),
					tag: 'div[data-block-card]',
				},
			],
			selectable: true,
			toDOM: expect.anything(),
		});
	});

	describe('blockCard with "url" attribute', () => {
		describe('parse html', () => {
			it('converts to blockCard PM node', () => {
				const doc = fromHTML(`<a data-block-card href="${url}" />`, schema);
				const node = doc.firstChild!;
				expect(node.type.spec).toEqual(blockCard);
			});

			it('gets attributes from html', () => {
				const doc = fromHTML(`<a data-block-card href="${url}" />`, schema);

				const node = doc.firstChild!;
				expect(node.attrs.url).toEqual(url);
				expect(node.attrs.data).toEqual(null);
			});
		});

		describe('encode html', () => {
			it('converts html data attributes to node attributes', () => {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = toDOM(schema.nodes.blockCard.create({ url }), schema).firstChild as HTMLElement;

				expect(dom.getAttribute('href')).toEqual(url);
				expect(dom.getAttribute('data-card-data')).toEqual('');
			});

			it('encodes and decodes to the same node', () => {
				const node = schema.nodes.blockCard.create({ url });
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = toDOM(node, schema).firstChild as HTMLElement;
				const parsedNode = fromHTML(dom.outerHTML, schema).firstChild!;
				expect(parsedNode).toEqual(node);
			});
		});
	});

	describe('blockCard with "data" attribute', () => {
		describe('parse html', () => {
			it('converts to blockCard PM node', () => {
				const doc = fromHTML(
					`<a data-block-card href="" data-card-data='${JSON.stringify(data)}' />`,
					schema,
				);
				const node = doc.firstChild!;
				expect(node.type.spec).toEqual(blockCard);
			});

			it('gets attributes from html', () => {
				const doc = fromHTML(
					`<a data-block-card href="" data-card-data='${JSON.stringify(data)}' />`,
					schema,
				);

				const node = doc.firstChild!;
				expect(node.attrs.data).toEqual(data);
			});
		});

		describe('encode html', () => {
			it('converts html data attributes to node attributes', () => {
				const dom = // eslint-disable-next-line @atlaskit/editor/no-as-casting
					toDOM(schema.nodes.blockCard.create({ data }), schema).firstChild as HTMLElement;

				expect(dom.getAttribute('href')).toEqual('');
				expect(dom.getAttribute('data-card-data')).toEqual(JSON.stringify(data));
			});

			it('encodes and decodes to the same node', () => {
				const node = schema.nodes.blockCard.create({ data });
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = toDOM(node, schema).firstChild as HTMLElement;
				const parsedNode = fromHTML(dom.outerHTML, schema).firstChild!;
				expect(parsedNode).toEqual(node);
			});
		});
	});

	describe('blockCard with "datasource" attribute', () => {
		describe('parse html', () => {
			it('converts to blockCard PM node', () => {
				const doc = fromHTML(
					`<a data-block-card href="" data-datasource='${JSON.stringify(datasource)}' />`,
					schema,
				);
				const node = doc.firstChild!;
				expect(node.type.spec).toEqual(blockCard);
			});

			it('gets attributes from html', () => {
				const doc = fromHTML(
					`<a data-block-card href="" data-datasource='${JSON.stringify(datasource)}' />`,
					schema,
				);

				const node = doc.firstChild!;
				expect(node.attrs.datasource).toEqual(datasource);
			});

			it('gets layout attribute from html when layout is set', () => {
				const expectedLayout = 'wide';
				const doc = fromHTML(
					`<a data-block-card href="" data-datasource='${JSON.stringify(
						datasource,
					)}' data-layout=${expectedLayout} />`,
					schema,
				);

				const node = doc.firstChild!;
				expect(node.attrs.layout).toEqual(expectedLayout);
			});

			it('get no layout attributes from html when layout is not set', () => {
				const doc = fromHTML(
					`<a
                    data-block-card
                    href=""
                    data-datasource='${JSON.stringify(datasource)}' />`,
					schema,
				);

				const node = doc.firstChild!;
				expect(node.attrs.layout).toBeNull();
			});
		});

		describe('encode html', () => {
			it('converts html datasource attributes to node attributes', () => {
				const dom = // eslint-disable-next-line @atlaskit/editor/no-as-casting
					toDOM(schema.nodes.blockCard.create({ datasource }), schema).firstChild as HTMLElement;

				expect(dom.getAttribute('href')).toEqual('');
				expect(dom.getAttribute('data-datasource')).toEqual(JSON.stringify(datasource));
			});

			it('encodes and decodes to the same node', () => {
				const node = schema.nodes.blockCard.create({ datasource });
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = toDOM(node, schema).firstChild as HTMLElement;

				const parsedNode = fromHTML(dom.outerHTML, schema).firstChild!;

				expect(node.attrs.layout).toBeNull();
				expect(parsedNode).toEqual(node);
			});
		});
	});
});
