import { fragment } from '../../../..';
import { createSchema } from '../../../../schema/create-schema';
import { toHTML, fromHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema fragment mark`, () => {
	const schema = makeSchema();

	// The mark spec will be generated from ADF DSL
	// this test would detect any changes if this mark is updated from ADF DSL
	it('should return correct mark spec', () => {
		expect(fragment).toStrictEqual({
			attrs: {
				localId: {
					default: '',
				},
				name: {
					default: null,
				},
			},
			excludes: '',
			inclusive: false,
			parseDOM: [
				{
					getAttrs: expect.anything(),
					tag: '[data-mark-type="fragment"]',
				},
			],
			toDOM: expect.anything(),
		});
	});

	it('serializes fragment to the correct HTML', () => {
		const node = schema.nodes.paragraph.create(
			{},
			[],
			[
				schema.marks.fragment.create({
					localId: 'fragment-local-id',
					name: 'test-fragment-name',
				}),
			],
		);
		const html = toHTML(node, schema);
		expect(html).toBe(
			'<div data-mark-type="fragment" data-name="test-fragment-name" data-localid="fragment-local-id"><p></p></div>',
		);
		expect(html).toContain('data-localid="fragment-local-id"');
		expect(html).toContain('data-name="test-fragment-name"');
	});

	it('parses fragment correctly from html', () => {
		const doc = fromHTML(
			'<div data-mark-type="fragment" data-name="test-fragment-name" data-localid="fragment-local-id"><p></p></div>',
			schema,
		);
		const node = doc.firstChild!;
		expect(node.marks).toHaveLength(1);
		expect(node.marks[0].type.name).toBe('fragment');
		expect(node.marks[0].attrs).toEqual({
			localId: 'fragment-local-id',
			name: 'test-fragment-name',
		});
	});
});

function makeSchema() {
	return createSchema({
		nodes: ['doc', 'paragraph', 'text'],
		marks: ['fragment'],
	});
}
