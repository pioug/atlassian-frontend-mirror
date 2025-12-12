import { toHTML, fromHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';

import { doc, ol, li, p } from '@af/adf-test-helpers/src/adf-schema/schema-builder';

import { schema } from '@af/adf-test-helpers/src/adf-schema';
import { listItem } from '../../../..';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema listItem node`, () => {
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
		expect(docFromHTML.toJSON()).toEqual(doc(ol({ order: 1 })(li(p('text')))).toJSON());
	});

	it('should be possible to have paragraph inside list', () => {
		const docFromHTML = fromHTML('<ol><li><p>text</p></li></ol>', schema);
		expect(docFromHTML.toJSON()).toEqual(doc(ol({ order: 1 })(li(p('text')))).toJSON());
	});

	it('should be possible to have sublist inside list', () => {
		const docFromHTML = fromHTML(
			'<ol><li><p>text</p><ol><li><p>sublist</p></li></ol></li></ol>',
			schema,
		);
		expect(docFromHTML.toJSON()).toEqual(
			doc(ol({ order: 1 })(li(p('text'), ol({ order: 1 })(li(p('sublist')))))).toJSON(),
		);
	});

	it('should not be possible to have sublist and first child inside list', () => {
		const docFromHTML = fromHTML(
			'<ol><li><ol><li><p>sublist</p></li></ol><p>text</p></li></ol>',
			schema,
		);
		expect(docFromHTML.toJSON()).toEqual(
			doc(ol({ order: 1 })(li(p('sublist'), p('text')))).toJSON(),
		);
	});
});
