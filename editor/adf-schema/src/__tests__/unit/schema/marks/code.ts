import { createSchema } from '../../../../schema/create-schema';
import { fromHTML, toHTML, textWithMarks } from '@af/adf-test-helpers/src/adf-schema';
import { code } from '../../../..';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema code mark`, () => {
	// The mark spec will be generated from ADF DSL
	// this test would detect any changes if this mark is updated from ADF DSL
	it('should return correct mark spec', () => {
		expect(code).toStrictEqual({
			excludes: 'fontStyle link searchQuery color',
			inclusive: true,
			parseDOM: [
				{
					preserveWhitespace: true,
					tag: 'span.code',
				},
				{
					preserveWhitespace: true,
					tag: 'code',
				},
				{
					preserveWhitespace: true,
					tag: 'tt',
				},
				{
					getAttrs: expect.anything(),
					preserveWhitespace: true,
					tag: 'span',
				},
			],
			toDOM: expect.anything(),
		});
	});

	itMatches('<span class="code">text</span>', 'text');
	itMatches('<code>text</code>', 'text');
	itMatches('<tt>text</tt>', 'text');
	itMatches(
		`<span style="font-family: Menlo, Monaco, 'Courier New', monospace;">text</span>`,
		'text',
	);
	itMatches(`<span style="white-space: pre;">text</span>`, 'text');

	it('serializes to <span class="code">', () => {
		const schema = makeSchema();
		const node = schema.text('foo', [schema.marks.code.create()]);
		expect(toHTML(node, schema)).toEqual('<span class="code" spellcheck="false">foo</span>');
	});
});

function makeSchema() {
	return createSchema({
		nodes: ['doc', 'paragraph', 'text'],
		marks: ['code'],
	});
}

function itMatches(html: string, expectedText: string) {
	it(`matches ${html}`, () => {
		const schema = makeSchema();
		const doc = fromHTML(`${html}`, schema);
		const codeNode = schema.marks.code.create();

		expect(textWithMarks(doc, expectedText, [codeNode])).toBe(true);
	});
}
