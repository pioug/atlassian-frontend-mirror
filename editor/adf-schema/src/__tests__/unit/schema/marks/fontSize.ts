import { fontSize } from '../../../..';
import { createSchema } from '../../../../schema/create-schema';
import { toHTML, fromHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema fontSize mark`, () => {
	const schema = makeSchema();

	// The mark spec will be generated from ADF DSL
	// this test would detect any changes if this mark is updated from ADF DSL
	it('should return correct mark spec', () => {
		expect(fontSize).toStrictEqual({
			attrs: {
				fontSize: {},
			},
			parseDOM: [
				{
					getAttrs: expect.anything(),
					tag: 'div.fabric-editor-font-size',
				},
			],
			toDOM: expect.anything(),
		});
	});

	it('serializes to the correct HTML with fontSize="small"', () => {
		const node = schema.nodes.paragraph.create(
			{},
			[],
			[schema.marks.fontSize.create({ fontSize: 'small' })],
		);
		const html = toHTML(node, schema);
		expect(html).toContain('data-font-size="small"');
	});

	it('parses fontSize correctly from html', () => {
		const doc = fromHTML(
			`<div class="fabric-editor-block-mark fabric-editor-font-size" data-font-size="small"><p></p></div>`,
			schema,
		);
		const node = doc.firstChild!;
		expect(node.marks).toHaveLength(1);
		expect(node.marks[0].type.name).toBe('fontSize');
		expect(node.marks[0].attrs).toEqual({
			fontSize: 'small',
		});
	});

	it('allows paragraph to have fontSize mark', () => {
		const mark = schema.marks.fontSize.create({ fontSize: 'small' });
		const node = schema.nodes.paragraph.create({}, [], [mark]);
		expect(node.marks).toHaveLength(1);
		expect(node.marks[0].type.name).toBe('fontSize');
	});
});

function makeSchema() {
	return createSchema({
		nodes: ['doc', 'paragraph', 'text'],
		marks: ['fontSize'],
	});
}
