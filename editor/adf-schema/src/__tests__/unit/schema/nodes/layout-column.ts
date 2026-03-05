import { createSchema } from '../../../../schema/create-schema';
import { fromHTML, toHTML, toContext } from '@af/adf-test-helpers/src/adf-schema/html-helpers';
import { layoutSection, layoutColumn, doc, p } from '@af/adf-test-helpers/src/doc-builder';
import { layoutColumn as layoutColumnNodeSpec } from '../../../..';
import { normalizeNodeSpec } from '../../_utils';

const schema = makeSchema();
const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema layout-column node`, () => {
	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	// @DSLCompatibilityException
	// marks is in different order comparing with original marks
	it('should return correct node spec', () => {
		expect(normalizeNodeSpec(layoutColumnNodeSpec)).toStrictEqual(
			normalizeNodeSpec({
				attrs: {
					width: {
						default: undefined,
					},
					localId: {
						default: null,
					},
				},
				content: '(block | unsupportedBlock)+',
				isolating: true,
				marks:
					'alignment fontSize dataConsumer fragment indentation unsupportedMark unsupportedNodeAttribute',
				parseDOM: [
					{
						context: 'layoutColumn//',
						skip: true,
						tag: 'div[data-layout-column]',
					},
					{
						getAttrs: expect.anything(),
						tag: 'div[data-layout-column]',
					},
				],
				selectable: false,
				toDOM: expect.anything(),
			}),
		);
	});

	it('serializes to <div data-layout-column />', () => {
		const html = toHTML(schema.nodes.layoutColumn.create(), schema);
		expect(html).toContain('<div data-layout-column="true">');
	});

	it('matches <div data-layout-column /> inside layoutSection', () => {
		const doc = fromHTML('<div data-layout-section="true"><div data-layout-column/></div>', schema);
		const node = doc.firstChild!.firstChild!;
		expect(node.type.name).toEqual('layoutColumn');
	});

	it('should not match <div data-layout-column /> when pasted inside layoutSection/layoutColumn', () => {
		const document = doc(
			layoutSection(layoutColumn({ width: 50 })(p('{<>}')), layoutColumn({ width: 50 })(p(''))),
		);
		const context = toContext(document, schema);
		const pmDoc = fromHTML('<div data-layout-column><p>Text</p></div>', schema, { context });
		const node = pmDoc.firstChild!;
		expect(node.type.name).toEqual('paragraph');
	});

	describe('paragraph with fontSize mark', () => {
		const schemaWithFontSize = makeSchemaWithFontSize();

		it('paragraph with fontSize is valid inside layoutColumn', () => {
			const paragraph = schemaWithFontSize.nodes.paragraph.create(
				null,
				schemaWithFontSize.text('Small text'),
				[schemaWithFontSize.marks.fontSize.create({ fontSize: 'small' })],
			);
			const layoutCol = schemaWithFontSize.nodes.layoutColumn.create(null, [paragraph]);

			expect(layoutCol).toBeDefined();
			expect(layoutCol.firstChild).toBe(paragraph);
			expect(layoutCol.firstChild?.marks[0].type.name).toBe('fontSize');
			expect(layoutCol.firstChild?.marks[0].attrs.fontSize).toBe('small');
		});

		it('layoutColumn can contain multiple paragraphs with different fontSize values', () => {
			const paragraphWithFontSize = schemaWithFontSize.nodes.paragraph.create(
				null,
				schemaWithFontSize.text('Small text'),
				[schemaWithFontSize.marks.fontSize.create({ fontSize: 'small' })],
			);
			const paragraphNormal = schemaWithFontSize.nodes.paragraph.create(
				null,
				schemaWithFontSize.text('Normal text'),
			);
			const layoutCol = schemaWithFontSize.nodes.layoutColumn.create(null, [
				paragraphWithFontSize,
				paragraphNormal,
			]);

			expect(layoutCol.childCount).toBe(2);
			expect(layoutCol.firstChild?.marks[0]?.type.name).toBe('fontSize');
			expect(layoutCol.lastChild?.marks.length).toBe(0);
		});

		it('layoutColumn with fontSize paragraph serializes correctly', () => {
			const paragraph = schemaWithFontSize.nodes.paragraph.create(
				null,
				schemaWithFontSize.text('Small text'),
				[schemaWithFontSize.marks.fontSize.create({ fontSize: 'small' })],
			);
			const layoutCol = schemaWithFontSize.nodes.layoutColumn.create(null, [paragraph]);
			const html = toHTML(layoutCol, schemaWithFontSize);

			expect(html).toContain('data-layout-column');
			expect(html).toContain('data-font-size="small"');
		});
	});
});

function makeSchema() {
	return createSchema({
		nodes: ['doc', 'layoutSection', 'layoutColumn', 'paragraph', 'text'],
	});
}

function makeSchemaWithFontSize() {
	return createSchema({
		nodes: ['doc', 'layoutSection', 'layoutColumn', 'paragraph', 'text'],
		marks: ['fontSize', 'alignment', 'indentation'],
	});
}
