import { createSchema } from '../../../../schema/create-schema';
import { fromHTML, toHTML, textWithMarks } from '@af/adf-test-helpers/src/adf-schema';
import { underline } from '../../../..';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema underline mark`, () => {
	// The mark spec will be generated from ADF DSL
	// this test would detect any changes if this mark is updated from ADF DSL
	it('should return correct mark spec', () => {
		expect(underline).toStrictEqual({
			group: 'fontStyle',
			inclusive: true,
			parseDOM: [
				{
					tag: 'u',
				},
				{
					getAttrs: expect.anything(),
					style: 'text-decoration',
				},
			],
			toDOM: expect.anything(),
		});
	});

	itMatches('<u>text</u>', 'text');
	itMatches('<span style="text-decoration: underline">text</span>', 'text');

	it('serializes to <u>', () => {
		const schema = makeSchema();
		const node = schema.text('foo', [schema.marks.underline.create()]);
		expect(toHTML(node, schema)).toEqual('<u>foo</u>');
	});
});

function makeSchema() {
	return createSchema({
		nodes: ['doc', 'paragraph', 'text'],
		marks: ['underline'],
	});
}

function itMatches(html: string, expectedText: string) {
	it(`matches ${html}`, () => {
		const schema = makeSchema();
		const doc = fromHTML(`${html}`, schema);
		const underlineNode = schema.marks.underline.create();

		expect(textWithMarks(doc, expectedText, [underlineNode])).toBe(true);
	});
}
