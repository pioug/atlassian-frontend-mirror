import { createSchema } from '../../../../schema/create-schema';
import { fromHTML, toHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';
import { paragraph } from '../../../..';

import { normalizeNodeSpec } from '../../_utils';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema paragraph node`, () => {
	const schema = makeSchema();

	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	// @DSLCompatibilityException
	// marks is in different order comparing with original marks
	it('should return correct node spec', () => {
		expect(normalizeNodeSpec(paragraph)).toStrictEqual(
			normalizeNodeSpec({
				attrs: {
					localId: {
						default: null,
					},
				},
				content: 'inline*',
				group: 'block',
				marks:
					'strong code em link border strike subsup textColor backgroundColor typeAheadQuery underline confluenceInlineComment annotation unsupportedMark unsupportedNodeAttribute dataConsumer fragment',
				parseDOM: [
					{
						getAttrs: expect.anything(),
						tag: 'p',
					},
				],
				selectable: false,
				toDOM: expect.anything(),
			}),
		);
	});

	it('serializes to <p>', () => {
		const html = toHTML(schema.nodes.paragraph.create(), schema);
		expect(html).toContain('<p>');
	});

	it('matches <p>', () => {
		const doc = fromHTML('<p>Hello World</p>', schema);
		const p = doc.firstChild!;
		expect(p.type.name).toEqual('paragraph');
		expect(p.firstChild!.text!).toEqual('Hello World');
	});

	it('can have a localId attribute', () => {
		const html = toHTML(schema.nodes.paragraph.create({ localId: 'some-local-id' }), schema);
		expect(html).toContain('<p data-local-id="some-local-id"></p>');
	});

	it('matches with localId attribute', () => {
		const doc = fromHTML('<p data-local-id="some-local-id">Hello World</p>', schema);
		const p = doc.firstChild!;
		expect(p.type.name).toEqual('paragraph');
		expect(p.firstChild!.text!).toEqual('Hello World');
		expect(p.attrs!.localId).toEqual('some-local-id');
	});

	it('can have fontSize mark', () => {
		const mark = schema.marks.fontSize.create({ fontSize: 'small' });
		const node = schema.nodes.paragraph.create({}, [], [mark]);
		expect(node.marks).toHaveLength(1);
		expect(node.marks[0].type.name).toBe('fontSize');
		expect(node.marks[0].attrs.fontSize).toBe('small');
	});

	it('can have both fontSize and alignment marks simultaneously', () => {
		const fontSizeMark = schema.marks.fontSize.create({ fontSize: 'small' });
		const alignmentMark = schema.marks.alignment.create({ align: 'center' });
		const node = schema.nodes.paragraph.create({}, [], [fontSizeMark, alignmentMark]);
		expect(node.marks).toHaveLength(2);
		const markNames = node.marks.map((m) => m.type.name);
		expect(markNames).toContain('fontSize');
		expect(markNames).toContain('alignment');
	});

	it('can have both fontSize and indentation marks simultaneously', () => {
		const fontSizeMark = schema.marks.fontSize.create({ fontSize: 'small' });
		const indentationMark = schema.marks.indentation.create({ level: 1 });
		const node = schema.nodes.paragraph.create({}, [], [fontSizeMark, indentationMark]);
		expect(node.marks).toHaveLength(2);
		const markNames = node.marks.map((m) => m.type.name);
		expect(markNames).toContain('fontSize');
		expect(markNames).toContain('indentation');
	});

	it('fontSize mark is preserved in schema transformations', () => {
		const mark = schema.marks.fontSize.create({ fontSize: 'small' });
		const node = schema.nodes.paragraph.create({}, [], [mark]);
		const html = toHTML(node, schema);
		const parsedDoc = fromHTML(html, schema);
		const parsedParagraph = parsedDoc.firstChild!;
		expect(parsedParagraph.marks).toHaveLength(1);
		expect(parsedParagraph.marks[0].type.name).toBe('fontSize');
		expect(parsedParagraph.marks[0].attrs.fontSize).toBe('small');
	});
});

function makeSchema() {
	return createSchema({
		nodes: ['doc', 'paragraph', 'text'],
		marks: ['fontSize', 'alignment', 'indentation'],
	});
}
