import { toHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';
import { schema } from '@af/adf-test-helpers/src/adf-schema';
import { orderedList, orderedListWithOrder } from '../../../..';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema orderedList node`, () => {
	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec', () => {
		expect(orderedList).toStrictEqual({
			attrs: {
				order: {
					default: 1,
				},
				localId: {
					default: null,
				},
			},
			content: 'listItem+',
			group: 'block',
			marks: 'unsupportedMark unsupportedNodeAttribute',
			parseDOM: [
				{
					tag: 'ol',
				},
			],
			selectable: false,
			toDOM: expect.anything(),
		});

		expect(orderedListWithOrder).toStrictEqual({
			attrs: {
				order: {
					default: 1,
				},
				localId: {
					default: null,
				},
			},
			content: 'listItem+',
			group: 'block',
			marks: 'unsupportedMark unsupportedNodeAttribute',
			parseDOM: [
				{
					getAttrs: expect.anything(),
					tag: 'ol',
				},
			],
			selectable: false,
			toDOM: expect.anything(),
		});
	});

	it('should be possible to create an ordered list item with an order attribute', () => {
		const html = toHTML(
			schema.nodes.orderedList.create(
				{ order: 6 },
				schema.nodes.listItem.create({}, schema.nodes.paragraph.create()),
			),
			schema,
		);
		expect(html).toContain('<ol start="6" class="ak-ol"><li><p></p></li></ol>');
	});

	it('should not be possible to have an ordered list starting from a negative number', () => {
		const html = toHTML(
			schema.nodes.orderedList.create(
				{ order: -6 },
				schema.nodes.listItem.create({}, schema.nodes.paragraph.create()),
			),
			schema,
		);
		expect(html).toContain('<ol class="ak-ol"><li><p></p></li></ol>');
	});

	it('should not be possible to have an ordered list with order of a string', () => {
		const html = toHTML(
			schema.nodes.orderedList.create(
				{ order: 'string' },
				schema.nodes.listItem.create({}, schema.nodes.paragraph.create()),
			),
			schema,
		);
		expect(html).toContain('<ol class="ak-ol"><li><p></p></li></ol>');
	});

	it('should not be possible to have an ordered list with order of a decimal number', () => {
		const html = toHTML(
			schema.nodes.orderedList.create(
				{ order: 2.9 },
				schema.nodes.listItem.create({}, schema.nodes.paragraph.create()),
			),
			schema,
		);
		expect(html).toContain('<ol start="2" class="ak-ol"><li><p></p></li></ol>');
	});
});
