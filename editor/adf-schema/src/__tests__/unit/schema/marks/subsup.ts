import { createSchema } from '../../../../schema/create-schema';
import { fromHTML, toHTML, textWithMarks } from '@af/adf-test-helpers/src/adf-schema';
import { subsup } from '../../../..';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema subsup mark`, () => {
	// The mark spec will be generated from ADF DSL
	// this test would detect any changes if this mark is updated from ADF DSL
	it('should return correct mark spec', () => {
		expect(subsup).toStrictEqual({
			attrs: {
				type: {
					default: 'sub',
				},
			},
			group: 'fontStyle',
			inclusive: true,
			parseDOM: [
				{
					attrs: {
						type: 'sub',
					},
					tag: 'sub',
				},
				{
					attrs: {
						type: 'sup',
					},
					tag: 'sup',
				},
				{
					getAttrs: expect.anything(),
					style: 'vertical-align=super',
				},
				{
					getAttrs: expect.anything(),
					style: 'vertical-align=sub',
				},
			],
			toDOM: expect.anything(),
		});
	});

	itMatches('<sub>text</sub>', 'text', { type: 'sub' });
	itMatches('<sup>text</sup>', 'text', { type: 'sup' });

	itMatches('<span style="vertical-align: sub">text</span>', 'text', {
		type: 'sub',
	});
	itMatches('<span style="vertical-align: super">text</span>', 'text', {
		type: 'sup',
	});

	it('serializes to <sub>', () => {
		const schema = makeSchema();
		const node = schema.text('foo', [schema.marks.subsup.create({ type: 'sub' })]);
		expect(toHTML(node, schema)).toEqual('<sub>foo</sub>');
	});

	it('serializes to <sup>', () => {
		const schema = makeSchema();
		const node = schema.text('foo', [schema.marks.subsup.create({ type: 'sup' })]);
		expect(toHTML(node, schema)).toEqual('<sup>foo</sup>');
	});
});

function makeSchema() {
	return createSchema({
		nodes: ['doc', 'paragraph', 'text'],
		marks: ['subsup'],
	});
}

function itMatches(html: string, expectedText: string, attrs: { type: 'sub' | 'sup' }) {
	it(`matches ${html}`, () => {
		const schema = makeSchema();
		const doc = fromHTML(`${html}`, schema);
		const subsupNode = schema.marks.subsup.create(attrs);

		expect(textWithMarks(doc, expectedText, [subsupNode])).toBe(true);
	});
}
