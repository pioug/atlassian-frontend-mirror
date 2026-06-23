import { Transform } from '@atlaskit/editor-prosemirror/transform';
import { createSchema } from '../../../../schema/create-schema';
import { setGlobalTheme } from '../../../../schema/marks/text-color';
import { defaultSchema } from '@af/adf-test-helpers/src/schema';
import { doc, p, textColor, backgroundColor } from '@af/adf-test-helpers/src/doc-builder';
import { fromHTML, toHTML, textWithMarks } from '@af/adf-test-helpers/src/adf-schema';
import { backgroundColor as backgroundColorNodeSpec } from '../../../..';
import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';

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

function itMatches(html: string, expectedText: string, attrs: { color: string }) {
	it(`matches ${html}`, () => {
		const schema = makeSchema();
		const doc = fromHTML(`${html}`, schema);
		const backgroundColorNode = schema.marks.backgroundColor.create(attrs);

		expect(textWithMarks(doc, expectedText, [backgroundColorNode])).toBe(true);
	});
}
