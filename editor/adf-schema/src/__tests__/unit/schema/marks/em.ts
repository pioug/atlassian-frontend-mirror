import { createSchema } from '../../../../schema/create-schema';
import { fromHTML, toHTML, textWithMarks } from '@af/adf-test-helpers/src/adf-schema';
import { em } from '../../../..';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema em mark`, () => {
	// The mark spec will be generated from ADF DSL
	// this test would detect any changes if this mark is updated from ADF DSL
	it('should return correct mark spec', () => {
		expect(em).toStrictEqual({
			group: 'fontStyle',
			inclusive: true,
			parseDOM: [
				{
					tag: 'i',
				},
				{
					tag: 'em',
				},
				{
					style: 'font-style=italic',
				},
			],
			toDOM: expect.anything(),
		});
	});

	itMatches('<em>text</em>', 'text');
	itMatches('<i>text</i>', 'text');
	itMatches('<span style="font-style: italic">text</span>', 'text');

	it('serializes to <em>', () => {
		const schema = makeSchema();
		const node = schema.text('foo', [schema.marks.em.create()]);
		expect(toHTML(node, schema)).toEqual('<em>foo</em>');
	});
});

function makeSchema() {
	return createSchema({
		nodes: ['doc', 'paragraph', 'text'],
		marks: ['em'],
	});
}

function itMatches(html: string, expectedText: string) {
	it(`matches ${html}`, () => {
		const schema = makeSchema();
		const doc = fromHTML(`${html}`, schema);
		const emNode = schema.marks.em.create();

		expect(textWithMarks(doc, expectedText, [emNode])).toBe(true);
	});
}
