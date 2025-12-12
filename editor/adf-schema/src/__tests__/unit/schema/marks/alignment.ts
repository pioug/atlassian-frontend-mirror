import { alignment } from '../../../..';
import { createSchema } from '../../../../schema/create-schema';
import { toHTML, fromHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema alignment mark`, () => {
	const schema = makeSchema();

	// The mark spec will be generated from ADF DSL
	// this test would detect any changes if this mark is updated from ADF DSL
	it('should return correct mark spec', () => {
		expect(alignment).toStrictEqual({
			attrs: {
				align: {},
			},
			excludes: 'alignment indentation',
			group: 'alignment',
			parseDOM: [
				{
					getAttrs: expect.anything(),
					tag: 'div.fabric-editor-block-mark',
				},
			],
			toDOM: expect.anything(),
		});
	});

	it('serializes to the correct HTML', () => {
		const node = schema.nodes.paragraph.create(
			{},
			[],
			[schema.marks.alignment.create({ align: 'center' })],
		);
		const html = toHTML(node, schema);
		expect(html).toBe(
			'<div class="fabric-editor-block-mark fabric-editor-alignment fabric-editor-align-center" data-align="center"><p></p></div>',
		);
		expect(html).toContain('data-align="center"');
	});

	it('parses annotation correctly from html', () => {
		const doc = fromHTML(
			`<div class="fabric-editor-block-mark fabric-editor-alignment fabric-editor-align-center" data-align="center"><p></p></div>`,
			schema,
		);
		const node = doc.firstChild!;
		expect(node.marks).toHaveLength(1);
		expect(node.marks[0].type.name).toBe('alignment');
		expect(node.marks[0].attrs).toEqual({
			align: 'center',
		});
	});
});

function makeSchema() {
	return createSchema({
		nodes: ['doc', 'paragraph', 'text'],
		marks: ['alignment', 'indentation'],
	});
}
