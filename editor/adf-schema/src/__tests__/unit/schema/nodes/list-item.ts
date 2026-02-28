import { fromHTML, toHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';

import { doc, nodeFactory, ol, p, ul } from '@af/adf-test-helpers/src/adf-schema/schema-builder';

import { schema } from '@af/adf-test-helpers/src/adf-schema';
import { listItem, uuid } from '../../../..';

const packageName = process.env.npm_package_name as string;
const LIST_LOCAL_ID = 'test-list-local-id';

const liWithLocalId = nodeFactory(schema.nodes.listItem, {
	localId: LIST_LOCAL_ID,
});

describe(`${packageName}/schema listItem node`, () => {
	beforeAll(() => {
		uuid.setStatic(LIST_LOCAL_ID);
	});

	afterAll(() => {
		uuid.setStatic(false);
	});

	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec', () => {
		expect(listItem).toStrictEqual({
			content:
				'(paragraph | mediaSingle | codeBlock | unsupportedBlock | extension) (paragraph | bulletList | orderedList | taskList | mediaSingle | codeBlock | unsupportedBlock | extension)*',
			defining: true,
			marks: 'dataConsumer fragment unsupportedMark unsupportedNodeAttribute',
			parseDOM: [
				{
					tag: 'li',
				},
			],
			selectable: false,
			toDOM: expect.anything(),
			attrs: {
				localId: {
					default: null,
				},
			},
		});
	});

	it('should be possible to create a list item with a single paragraph', () => {
		const html = toHTML(schema.nodes.listItem.create({}, schema.nodes.paragraph.create()), schema);
		expect(html).toContain('<li><p></p></li>');
	});

	it('should not be possible to have blockquote inside list', () => {
		const docFromHTML = fromHTML('<ol><li><blockquote>text</blockquote></li></ol>', schema);
		expect(docFromHTML.toJSON()).toEqual(doc(ol({ order: 1 })(liWithLocalId(p('text')))).toJSON());
	});

	it('should be possible to have paragraph inside list', () => {
		const docFromHTML = fromHTML('<ol><li><p>text</p></li></ol>', schema);
		expect(docFromHTML.toJSON()).toEqual(doc(ol({ order: 1 })(liWithLocalId(p('text')))).toJSON());
	});

	it('should be possible to have sublist inside list', () => {
		const docFromHTML = fromHTML(
			'<ol><li><p>text</p><ol><li><p>sublist</p></li></ol></li></ol>',
			schema,
		);
		expect(docFromHTML.toJSON()).toEqual(
			doc(
				ol({ order: 1 })(liWithLocalId(p('text'), ol({ order: 1 })(liWithLocalId(p('sublist'))))),
			).toJSON(),
		);
	});

	it('should be possible to have a nested list as the first child', () => {
		const docFromHTML = fromHTML('<ol><li><ol><li><p>sublist</p></li></ol></li></ol>', schema);
		expect(docFromHTML.toJSON()).toEqual(
			doc(ol({ order: 1 })(liWithLocalId(ol({ order: 1 })(liWithLocalId(p('sublist')))))).toJSON(),
		);
	});

	it('should be possible to have nested list then paragraph', () => {
		const docFromHTML = fromHTML(
			'<ol><li><ol><li><p>sublist</p></li></ol><p>text</p></li></ol>',
			schema,
		);
		expect(docFromHTML.toJSON()).toEqual(
			doc(
				ol({ order: 1 })(liWithLocalId(ol({ order: 1 })(liWithLocalId(p('sublist'))), p('text'))),
			).toJSON(),
		);
	});

	it('should be possible to have list items that only contain a nested list', () => {
		const docFromHTML = fromHTML('<ul><li><ul><li><p>sublist</p></li></ul></li></ul>', schema);
		expect(docFromHTML.toJSON()).toEqual(
			doc(ul(liWithLocalId(ul(liWithLocalId(p('sublist')))))).toJSON(),
		);
	});
});
