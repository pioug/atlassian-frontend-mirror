import { createSchema } from '../../../../schema/create-schema';
import { fromHTML, toHTML, textWithMarks } from '@af/adf-test-helpers/src/adf-schema';
import { strike } from '../../../..';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema strike mark`, () => {
	// The mark spec will be generated from ADF DSL
	// this test would detect any changes if this mark is updated from ADF DSL
	it('should return correct mark spec', () => {
		expect(strike).toStrictEqual({
			group: 'fontStyle',
			inclusive: true,
			parseDOM: [
				{
					tag: 'strike',
				},
				{
					tag: 's',
				},
				{
					tag: 'del',
				},
				{
					getAttrs: expect.anything(),
					style: 'text-decoration',
				},
			],
			toDOM: expect.anything(),
		});
	});

	itMatches('<s>text</s>', 'text');
	itMatches('<del>text</del>', 'text');
	itMatches('<strike>text</strike>', 'text');
	itMatches('<span style="text-decoration: line-through">text</span>', 'text');

	it('serializes to <s>', () => {
		const schema = makeSchema();
		const node = schema.text('foo', [schema.marks.strike.create()]);
		expect(toHTML(node, schema)).toEqual('<s>foo</s>');
	});
});

function makeSchema() {
	return createSchema({
		nodes: ['doc', 'paragraph', 'text'],
		marks: ['strike'],
	});
}

function itMatches(html: string, expectedText: string) {
	it(`matches ${html}`, () => {
		const schema = makeSchema();
		const doc = fromHTML(html, schema);
		const strike = schema.marks.strike.create();
		expect(textWithMarks(doc, expectedText, [strike])).toBe(true);
	});
}
