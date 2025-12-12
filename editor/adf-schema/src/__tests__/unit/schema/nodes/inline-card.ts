import { toDOM, fromHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';
import { createSchema } from '../../../../schema/create-schema';
import { inlineCard } from '../../../../schema/nodes/inline-card';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema inlineCard node`, () => {
	const schema = createSchema({
		nodes: ['doc', 'paragraph', 'inlineCard', 'text'],
		marks: ['annotation'],
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

	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec', () => {
		expect(inlineCard).toStrictEqual({
			attrs: {
				data: {
					default: null,
				},
				url: {
					default: null,
				},
				localId: {
					default: null,
				},
			},
			draggable: true,
			group: 'inline',
			inline: true,
			parseDOM: [
				{
					getAttrs: expect.anything(),
					priority: 100,
					tag: 'a[data-inline-card], span[data-inline-card]',
				},
				{
					getAttrs: expect.anything(),
					tag: 'div[data-inline-card]',
				},
			],
			selectable: true,
			toDOM: expect.anything(),
		});
	});

	describe('inlineCard with "url" attribute', () => {
		describe('parse html', () => {
			it('converts to inlineCard PM node', () => {
				const doc = fromHTML(`<a data-inline-card href="${url}" />`, schema);
				const node = doc.firstChild!.firstChild!;
				expect(node.type.spec).toEqual(inlineCard);
			});

			it('gets attributes from html', () => {
				const doc = fromHTML(`<a data-inline-card href="${url}" />`, schema);

				const node = doc.firstChild!.firstChild!;
				expect(node.attrs.url).toEqual(url);
				expect(node.attrs.data).toEqual(null);
			});

			it('gets annotation marks from html', () => {
				const doc = fromHTML(
					`<span data-mark-type="annotation" data-mark-annotation-type="inlineComment" data-id="comment-id"><a data-inline-card href="${url}" /></span>`,
					schema,
				);

				const node = doc.firstChild!.firstChild!;
				expect(node.attrs.url).toEqual(url);
				expect(node.marks[0].type.name).toEqual('annotation');
				expect(node.marks[0].attrs).toEqual({
					id: 'comment-id',
					annotationType: 'inlineComment',
				});
			});
		});

		describe('encode html', () => {
			it('converts html data attributes to node attributes', () => {
				const dom = // eslint-disable-next-line @atlaskit/editor/no-as-casting
					toDOM(schema.nodes.inlineCard.create({ url }), schema).firstChild as HTMLElement;

				expect(dom.getAttribute('href')).toEqual(url);
			});

			it('encodes and decodes to the same node', () => {
				const node = schema.nodes.inlineCard.create({ url });
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = toDOM(node, schema).firstChild as HTMLElement;
				const parsedNode = fromHTML(dom.outerHTML, schema).firstChild!.firstChild!;
				expect(parsedNode).toEqual(node);
			});

			it('encodes and decodes to the same node with annotation marks', () => {
				const node = schema.nodes.inlineCard.create({ url }, null, [
					schema.marks.annotation.create({ id: 'test-comment' }),
				]);
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = toDOM(node, schema).firstChild as HTMLElement;
				expect(dom.getAttribute('data-mark-type')).toEqual('annotation');
				expect(dom.getAttribute('data-mark-annotation-type')).toEqual('inlineComment');
				const parsedNode = fromHTML(dom.outerHTML, schema).firstChild!.firstChild!;
				expect(parsedNode).toEqual(node);
			});
		});
	});

	describe('inlineCard with "data" attribute', () => {
		describe('parse html', () => {
			it('converts to inlineCard PM node', () => {
				const doc = fromHTML(
					`<a data-inline-card href="" data-card-data='${JSON.stringify(data)}' />`,
					schema,
				);
				const node = doc.firstChild!.firstChild!;
				expect(node.type.spec).toEqual(inlineCard);
			});

			it('gets attributes from html', () => {
				const doc = fromHTML(
					`<a data-inline-card href="" data-card-data='${JSON.stringify(data)}' />`,
					schema,
				);

				const node = doc.firstChild!.firstChild!;
				expect(node.attrs.data).toEqual(data);
			});
		});

		describe('encode html', () => {
			it('converts html data attributes to node attributes', () => {
				const dom = // eslint-disable-next-line @atlaskit/editor/no-as-casting
					toDOM(schema.nodes.inlineCard.create({ data }), schema).firstChild as HTMLElement;

				expect(dom.getAttribute('href')).toEqual('');
				expect(dom.getAttribute('data-card-data')).toEqual(JSON.stringify(data));
			});

			it('encodes and decodes to the same node', () => {
				const node = schema.nodes.inlineCard.create({ url });
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = toDOM(node, schema).firstChild as HTMLElement;
				const parsedNode = fromHTML(dom.outerHTML, schema).firstChild!.firstChild!;
				expect(parsedNode).toEqual(node);
			});
		});
	});
});
