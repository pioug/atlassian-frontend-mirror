import { fromHTML, toHTML, textWithMarks } from '@af/adf-test-helpers/src/adf-schema';
import {
	doc,
	p,
	textColor,
	backgroundColor,
	table,
	tr,
	td,
	th,
	layoutSection,
	layoutColumn,
	strong,
} from '@af/adf-test-helpers/src/doc-builder';
import { defaultSchema } from '@af/adf-test-helpers/src/schema';
import { Transform } from '@atlaskit/editor-prosemirror/transform';
import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';

import { backgroundColor as backgroundColorNodeSpec } from '../../../..';
import { createSchema } from '../../../../schema/create-schema';
import { setGlobalTheme } from '../../../../schema/marks/text-color';
import { layoutSectionWithSingleColumn } from '../../../../schema/nodes/layout-section';

const testColorObj1 = { color: '#d3f1a7' };
const testColorObj2 = { color: '#D3F1A7' };
const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema backgroundColor mark`, () => {
	beforeEach(() => {
		setupEditorExperiments('test', {
			platform_editor_lovability_text_bg_color: false,
		});
	});

	// The mark spec will be generated from ADF DSL
	// this test would detect any changes if this mark is updated from ADF DSL
	it('should return correct mark spec', () => {
		expect(backgroundColorNodeSpec).toStrictEqual({
			attrs: {
				color: {},
			},
			group: 'color',
			inclusive: true,
			parseDOM: [
				{
					getAttrs: expect.anything(),
					style: 'background-color',
				},
				{
					getAttrs: expect.anything(),
					tag: '[style]:not(td):not(th)',
					priority: 60,
					consuming: false,
				},
				{
					getAttrs: expect.anything(),
					tag: '.fabric-background-color-mark',
				},
			],
			toDOM: expect.anything(),
		});
	});

	itMatches(
		`<span style="background-color: rgb(211, 241, 167);">text</span>`,
		'text',
		testColorObj1,
	);
	itMatches(`<span style="background-color: #d3f1a7;">text</span>`, 'text', testColorObj1);
	itMatches(`<span style="background-color: #D3F1A7;">text</span>`, 'text', testColorObj1);

	it('does not match new background palette colors when platform_editor_lovability_text_bg_color is disabled', () => {
		const schema = makeSchema();
		const doc = fromHTML(`<span style="background-color: #b3d4ff;">text</span>`, schema);
		const backgroundColorNode = schema.marks.backgroundColor.create({ color: '#b3d4ff' });

		expect(textWithMarks(doc, 'text', [backgroundColorNode])).toBe(false);
	});

	it('matches new background palette colors from inline styles when platform_editor_lovability_text_bg_color is enabled', () => {
		setupEditorExperiments('test', {
			platform_editor_lovability_text_bg_color: true,
		});

		const schema = makeSchema();
		const doc = fromHTML(`<span style="background-color: #b3d4ff;">text</span>`, schema);
		const backgroundColorNode = schema.marks.backgroundColor.create({ color: '#b3d4ff' });

		expect(textWithMarks(doc, 'text', [backgroundColorNode])).toBe(true);
	});

	it('matches new background palette colors from renderer copy markup when platform_editor_lovability_text_bg_color is enabled', () => {
		setupEditorExperiments('test', {
			platform_editor_lovability_text_bg_color: true,
		});

		const schema = makeSchema();
		const doc = fromHTML(
			`<span class="fabric-background-color-mark" data-background-custom-color="#b3d4ff">text</span>`,
			schema,
		);
		const backgroundColorNode = schema.marks.backgroundColor.create({ color: '#b3d4ff' });

		expect(textWithMarks(doc, 'text', [backgroundColorNode])).toBe(true);
	});

	describe('table cell backgrounds', () => {
		beforeEach(() => {
			mockExpEnabled('platform_editor_fix_table_cell_background');
			setupEditorExperiments('test', {
				platform_editor_lovability_text_bg_color: true,
			});
		});

		// these 2 hex values overlap between the table cell color palette and the background color palette
		it.each(['#abf5d1', '#b3d4ff'])('preserves %s as a cell background', (color) => {
			const schema = makeTableSchema();
			const parsed = fromHTML(
				`<div data-layout-section><div data-layout-column data-column-width="100">
					<table data-table-local-id="test-table"><tbody>
						<tr><th style="background-color: ${color}"><p>header</p></th><th><p>other header</p></th></tr>
						<tr><td style="background-color: ${color}"><p>cell</p></td><td><p>other cell</p></td></tr>
					</tbody></table>
				</div></div>`,
				schema,
			);
			const expected = doc(
				layoutSection(
					layoutColumn({ width: 100 })(
						table({ localId: 'test-table' })(
							tr(th({ background: color })(p('header')), th()(p('other header'))),
							tr(td({ background: color })(p('cell')), td()(p('other cell'))),
						),
					),
				),
			)(schema);

			expect(parsed.toJSON()).toEqual(expected.toJSON());
		});

		it('preserves highlighted spans inside coloured cells', () => {
			const schema = makeTableSchema();
			const parsed = fromHTML(
				`<table data-table-local-id="test-table"><tbody><tr><td style="background-color: #abf5d1"><p>
					<span style="background-color: #b3d4ff">inline highlight</span>
					<span class="fabric-background-color-mark" data-background-custom-color="#abf5d1">renderer highlight</span>
				</p></td></tr></tbody></table>`,
				schema,
			);

			expect(
				textWithMarks(parsed, 'inline highlight', [
					schema.marks.backgroundColor.create({ color: '#b3d4ff' }),
				]),
			).toBe(true);
			expect(
				textWithMarks(parsed, 'renderer highlight', [
					schema.marks.backgroundColor.create({ color: '#abf5d1' }),
				]),
			).toBe(true);
			parsed.check();
		});

		it('preserves paragraph and other mark parsing on styled elements', () => {
			const schema = createSchema({
				nodes: ['doc', 'paragraph', 'text'],
				marks: ['backgroundColor', 'strong'],
			});
			const parsed = fromHTML(
				`<p style="background-color: #abf5d1">first paragraph</p>
				<p style="background-color: #abf5d1"><strong style="background-color: #b3d4ff">text</strong></p>`,
				schema,
			);

			const expected = doc(
				p(backgroundColor({ color: '#abf5d1' })('first paragraph')),
				p(strong(backgroundColor({ color: '#b3d4ff' })('text'))),
			)(schema);

			expect(parsed.toJSON()).toEqual(expected.toJSON());
		});
	});

	it('parses cell backgrounds as text highlight when platform_editor_lovability_text_bg_color is disabled', () => {
		mockExpDisabled('platform_editor_fix_table_cell_background');
		setupEditorExperiments('test', {
			platform_editor_lovability_text_bg_color: true,
		});

		const schema = makeTableSchema();
		const parsed = fromHTML(
			'<table data-table-local-id="test-table"><tbody><tr><td style="background-color: #b3d4ff"><p>text</p></td></tr></tbody></table>',
			schema,
		);

		const expected = doc(
			table({ localId: 'test-table' })(
				tr(td({ background: '#b3d4ff' })(p(backgroundColor({ color: '#b3d4ff' })('text')))),
			),
		)(schema);

		expect(parsed.toJSON()).toEqual(expected.toJSON());
	});

	it('serializes to <span style="color: ...">', () => {
		const schema = makeSchema();
		const node = schema.text('foo', [schema.marks.backgroundColor.create(testColorObj1)]);
		expect(toHTML(node, schema)).toEqual(
			`<span class="fabric-background-color-mark" style="--custom-palette-color: var(--ds-background-accent-lime-subtler, #D3F1A7)" data-background-custom-color="#d3f1a7">foo</span>`,
		);
	});

	it('serializes to <span style="background-color: ..."> case preserving', () => {
		const schema = makeSchema();
		const node = schema.text('foo', [schema.marks.backgroundColor.create(testColorObj2)]);
		expect(toHTML(node, schema)).toEqual(
			`<span class="fabric-background-color-mark" style="--custom-palette-color: var(--ds-background-accent-lime-subtler, #D3F1A7)" data-background-custom-color="#D3F1A7">foo</span>`,
		);
	});

	describe('custom text colors inversion in dark mode', () => {
		beforeAll(() => {
			setGlobalTheme('dark');
		});
		afterAll(() => {
			setGlobalTheme('');
		});
		it('inverts', () => {
			const schema = makeSchema();
			const node = schema.text('foo', [schema.marks.backgroundColor.create({ color: '#ffffff' })]);
			expect(toHTML(node, schema)).toEqual(
				`<span class="fabric-background-color-mark" style="--custom-palette-color: #000000" data-background-custom-color="#ffffff">foo</span>`,
			);
		});
	});

	describe('mark coexistence', () => {
		it('allows backgroundColor to coexist with textColor when applied to the same range', () => {
			const originalDocument = doc(p(textColor({ color: 'red' })('lol')))(defaultSchema);

			const tr = new Transform(originalDocument);
			expect(tr.doc.firstChild!.firstChild!.marks.length).toEqual(1);

			tr.addMark(1, 5, defaultSchema.mark('backgroundColor', { color: 'blue' }));

			expect(tr.doc.firstChild!.firstChild!.marks.map((mark) => mark.type.name)).toEqual([
				'textColor',
				'backgroundColor',
			]);
		});

		it('allows textColor to coexist with backgroundColor when applied to the same range', () => {
			const originalDocument = doc(p(backgroundColor({ color: 'blue' })('lol')))(defaultSchema);

			const tr = new Transform(originalDocument);
			expect(tr.doc.firstChild!.firstChild!.marks.length).toEqual(1);

			tr.addMark(1, 5, defaultSchema.mark('textColor', { color: 'red' }));

			expect(tr.doc.firstChild!.firstChild!.marks.map((mark) => mark.type.name)).toEqual([
				'textColor',
				'backgroundColor',
			]);
		});
	});
});

function makeSchema() {
	return createSchema({
		nodes: ['doc', 'paragraph', 'text'],
		marks: ['backgroundColor'],
	});
}

function makeTableSchema() {
	return createSchema({
		nodes: [
			'doc',
			'paragraph',
			'text',
			'table',
			'tableRow',
			'tableHeader',
			'tableCell',
			'layoutColumn',
		],
		customNodeSpecs: { layoutSection: layoutSectionWithSingleColumn },
		marks: ['backgroundColor'],
	});
}

function itMatches(html: string, expectedText: string, attrs: { color: string }) {
	it(`matches ${html}`, () => {
		const schema = makeSchema();
		const doc = fromHTML(`${html}`, schema);
		const backgroundColorNode = schema.marks.backgroundColor.create(attrs);

		expect(textWithMarks(doc, expectedText, [backgroundColorNode])).toBe(true);
	});
}
