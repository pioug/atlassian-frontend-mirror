import { createSchema } from '../../../../schema/create-schema';
import { toHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';
import { confluenceInlineComment } from '../../../..';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema confluence-inline-comment mark`, () => {
	// The mark spec will be generated from ADF DSL
	// this test would detect any changes if this mark is updated from ADF DSL
	it('should return correct mark spec', () => {
		expect(confluenceInlineComment).toStrictEqual({
			attrs: {
				reference: {
					default: '',
				},
			},
			excludes: '',
			inclusive: false,
			parseDOM: [
				{
					tag: 'span[data-mark-type="confluenceInlineComment"]',
				},
			],
			toDOM: expect.anything(),
		});
	});

	it('serializes to <span data-reference="hash-ref-goes-here">', () => {
		const schema = makeSchema();
		const node = schema.text('foo', [
			schema.marks.confluenceInlineComment.create({
				reference: 'hash-ref-goes-here',
			}),
		]);
		expect(toHTML(node, schema)).toContain('data-reference="hash-ref-goes-here"');
	});
});

function makeSchema() {
	return createSchema({
		nodes: ['doc', 'paragraph', 'text'],
		marks: ['confluenceInlineComment'],
	});
}
