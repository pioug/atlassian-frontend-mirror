import { indentation } from '../../../..';
import { createSchema } from '../../../../schema/create-schema';
import { toHTML, fromHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema indentation mark`, () => {
	const schema = makeSchema();

	// The mark spec will be generated from ADF DSL
	// this test would detect any changes if this mark is updated from ADF DSL
	it('should return correct mark spec', () => {
		expect(indentation).toStrictEqual({
			attrs: {
				level: {},
			},
			excludes: 'indentation alignment',
			group: 'indentation',
			parseDOM: [
				{
					getAttrs: expect.anything(),
					tag: 'div.fabric-editor-indentation-mark',
				},
			],
			toDOM: expect.anything(),
		});
	});

	it('serializes indentation to the correct HTML', () => {
		const node = schema.nodes.paragraph.create(
			{},
			[],
			[schema.marks.indentation.create({ level: 2 })],
		);
		const html = toHTML(node, schema);
		expect(html).toBe(
			'<div class="fabric-editor-block-mark fabric-editor-indentation-mark" data-level="2"><p></p></div>',
		);
		expect(html).toContain('data-level="2"');
	});

	it('parses indentation correctly from html', () => {
		const doc = fromHTML(
			'<div class="fabric-editor-block-mark fabric-editor-indentation-mark" data-level="2"><p></p></div>',
			schema,
		);
		const node = doc.firstChild!;
		expect(node.marks).toHaveLength(1);
		expect(node.marks[0].type.name).toBe('indentation');
		expect(node.marks[0].attrs).toEqual({
			level: 2,
		});
	});
});

function makeSchema() {
	return createSchema({
		nodes: ['doc', 'paragraph', 'text'],
		marks: ['indentation', 'alignment'],
	});
}
