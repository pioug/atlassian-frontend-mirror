import { typeAheadQuery } from '../../../..';
import { createSchema } from '../../../../schema/create-schema';
import { toHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema typeAheadQuery mark`, () => {
	const schema = makeSchema();

	// The mark spec will be generated from ADF DSL
	// this test would detect any changes if this mark is updated from ADF DSL
	it('should return correct mark spec', () => {
		expect(typeAheadQuery).toStrictEqual({
			attrs: {
				trigger: {
					default: '',
				},
			},
			group: 'searchQuery',
			inclusive: true,
			parseDOM: [
				{
					tag: 'span[data-type-ahead-query]',
				},
			],
			toDOM: expect.anything(),
		});
	});

	it('serializes typeAheadQuery to the correct HTML', () => {
		const node = schema.nodes.paragraph.create(
			{},
			[],
			[schema.marks.typeAheadQuery.create({ trigger: 'some-test-trigger' })],
		);
		const html = toHTML(node, schema);
		expect(html).toBe(
			'<span data-type-ahead-query="true" data-trigger="some-test-trigger" style="color: #0052CC"><p></p></span>',
		);
		expect(html).toContain('data-trigger="some-test-trigger"');
	});
});

function makeSchema() {
	return createSchema({
		nodes: ['doc', 'paragraph', 'text'],
		marks: ['typeAheadQuery'],
	});
}
