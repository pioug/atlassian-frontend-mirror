import { createSchema } from '../../../../schema/create-schema';
import { fromHTML, toHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';
import {
	unsupportedBlock,
	layoutSection,
	doc,
	layoutColumn,
	p,
} from '@af/adf-test-helpers/src/doc-builder';
import {
	layoutSection as layoutSectionNodeSpec,
	layoutSectionWithSingleColumn,
} from '../../../../schema/nodes';

const schema = makeSchema();
const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema layout-section node`, () => {
	describe('full schema', () => {
		// The node spec will be generated from ADF DSL
		// this test would detect any changes if this node is updated from ADF DSL
		it('should return correct node spec', () => {
			expect(layoutSectionNodeSpec).toStrictEqual({
				content: '(layoutColumn | unsupportedBlock){1,3} unsupportedBlock*',
				isolating: true,
				attrs: {
					localId: {
						default: null,
					},
				},
				marks: 'unsupportedMark unsupportedNodeAttribute',
				parseDOM: [
					{
						context: 'layoutSection//|layoutColumn//',
						skip: true,
						tag: 'div[data-layout-section]',
					},
					{
						tag: 'div[data-layout-section]',
					},
				],
				toDOM: expect.anything(),
			});
		});

		it('serializes to <div data-layout-section="true"/>', () => {
			const html = toHTML(schema.nodes.layoutSection.create(), schema);
			expect(html).toContain('<div data-layout-section="true">');
		});

		it('matches <div data-layout-section="true" />', () => {
			const doc = fromHTML('<div data-layout-section="true" />', schema);
			const node = doc.firstChild!;
			expect(node.type.name).toEqual('layoutSection');
		});
	});

	describe('stage 0', () => {
		const stage0Schema = makeStage0Schema();

		it('should return correct node spec', () => {
			expect(layoutSectionWithSingleColumn).toStrictEqual({
				content: '(layoutColumn | unsupportedBlock){1,5} unsupportedBlock*',
				isolating: true,
				attrs: {
					columnRuleStyle: { default: null },
					localId: { default: null },
				},
				marks: 'unsupportedMark unsupportedNodeAttribute',
				parseDOM: [
					{
						context: 'layoutSection//|layoutColumn//',
						skip: true,
						tag: 'div[data-layout-section]',
					},
					{
						tag: 'div[data-layout-section]',
						getAttrs: expect.anything(),
					},
				],
				toDOM: expect.anything(),
			});
		});

		it('serializes to <div data-layout-section="true" data-column-rule-style="solid" />', () => {
			const html = toHTML(
				stage0Schema.nodes.layoutSection.create({ columnRuleStyle: 'solid' }),
				stage0Schema,
			);
			expect(html).toContain('<div data-layout-section="true" data-column-rule-style="solid">');
		});

		it('matches <div data-layout-section="true" data-column-rule-style="solid"/>', () => {
			const doc = fromHTML(
				'<div data-layout-section="true" data-column-rule-style="solid" />',
				stage0Schema,
			);
			const node = doc.firstChild!;
			expect(node.type.name).toEqual('layoutSection');
			expect(node.attrs.columnRuleStyle).toEqual('solid');
		});
	});

	describe('when there is multiple unsupportedBlock after some layoutColumn', () => {
		it('should not throw an invalid content exception', () => {
			const documentRaw = doc(
				// prettier-ignore
				layoutSection(
          layoutColumn({ width: 33 })(
            p(''),
          ),
          layoutColumn({ width: 33 })(
            p(''),
          ),
          layoutColumn({ width: 33 })(
            p(''),
          ),

          unsupportedBlock({})(),
        ),
			);

			expect(() => {
				documentRaw(schema);
			}).not.toThrow();
		});
	});

	describe('when there is only one unsupportedBlock inside a layoutSection', () => {
		it('should not throw an invalid content exception', () => {
			const documentRaw = doc(
				// prettier-ignore
				layoutSection(
          unsupportedBlock({})(),
        ),
			);

			expect(() => {
				documentRaw(schema);
			}).not.toThrow();
		});
	});

	describe('when there is only one layoutColumn inside a layoutSection', () => {
		it('should throw an invalid content exception', () => {
			const documentRaw = doc(
				// prettier-ignore
				layoutSection(
          layoutColumn({ width: 100 })(
            p(''),
          ),
        ),
			);

			expect(() => {
				documentRaw(schema);
			}).not.toThrow();
		});
	});
});

function makeSchema() {
	return createSchema({
		nodes: ['doc', 'unsupportedBlock', 'layoutSection', 'layoutColumn', 'paragraph', 'text'],
	});
}

function makeStage0Schema() {
	return createSchema({
		customNodeSpecs: {
			layoutSection: layoutSectionWithSingleColumn,
		},
		nodes: ['doc', 'unsupportedBlock', 'layoutColumn', 'paragraph', 'text'],
	});
}
