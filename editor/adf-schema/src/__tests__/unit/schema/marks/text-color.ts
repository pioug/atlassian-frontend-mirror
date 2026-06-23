import { createSchema } from '../../../../schema/create-schema';
import { setGlobalTheme } from '../../../../schema/marks/text-color';
import { fromHTML, toHTML, textWithMarks } from '@af/adf-test-helpers/src/adf-schema';
import { textColor } from '../../../..';
import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';

const testColorObj1 = { color: '#97a0af' };
const testColorObj2 = { color: '#97A0AF' };
const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema textColor mark`, () => {
	beforeEach(() => {
		setupEditorExperiments('test', {
			platform_editor_lovability_text_bg_color: false,
		});
	});

	// The mark spec will be generated from ADF DSL
	// this test would detect any changes if this mark is updated from ADF DSL
	it('should return correct mark spec', () => {
		expect(textColor).toStrictEqual({
			attrs: {
				color: {},
			},
			group: 'color',
			inclusive: true,
			parseDOM: [
				{
					getAttrs: expect.anything(),
					style: 'color',
				},
				{
					getAttrs: expect.anything(),
					tag: '.fabric-text-color-mark',
				},
			],
			toDOM: expect.anything(),
		});
	});

	itMatches(`<span style="color: rgb(151, 160, 175);">text</span>`, 'text', testColorObj1);
	itMatches(`<span style="color: #97a0af;">text</span>`, 'text', testColorObj1);
	itMatches(`<span style="color: #97A0AF;">text</span>`, 'text', testColorObj1);

	it('does not match new text palette colors when platform_editor_lovability_text_bg_color is disabled', () => {
		const schema = makeSchema();
		const doc = fromHTML(`<span style="color: #4c6b1f;">text</span>`, schema);
		const textColorNode = schema.marks.textColor.create({ color: '#4c6b1f' });

		expect(textWithMarks(doc, 'text', [textColorNode])).toBe(false);
	});

	it('matches new text palette colors from inline styles when platform_editor_lovability_text_bg_color is enabled', () => {
		setupEditorExperiments('test', {
			platform_editor_lovability_text_bg_color: true,
		});

		const schema = makeSchema();
		const doc = fromHTML(`<span style="color: #4c6b1f;">text</span>`, schema);
		const textColorNode = schema.marks.textColor.create({ color: '#4c6b1f' });

		expect(textWithMarks(doc, 'text', [textColorNode])).toBe(true);
	});

	it('matches new text palette colors from renderer copy markup when platform_editor_lovability_text_bg_color is enabled', () => {
		setupEditorExperiments('test', {
			platform_editor_lovability_text_bg_color: true,
		});

		const schema = makeSchema();
		const doc = fromHTML(
			`<span class="fabric-text-color-mark" data-text-custom-color="#4c6b1f">text</span>`,
			schema,
		);
		const textColorNode = schema.marks.textColor.create({ color: '#4c6b1f' });

		expect(textWithMarks(doc, 'text', [textColorNode])).toBe(true);
	});

	it('serializes to <span style="color: ...">', () => {
		const schema = makeSchema();
		const node = schema.text('foo', [schema.marks.textColor.create(testColorObj1)]);
		expect(toHTML(node, schema)).toEqual(
			`<span class="fabric-text-color-mark" style="--custom-palette-color: var(--ds-icon-accent-gray, #97A0AF)" data-text-custom-color="#97a0af">foo</span>`,
		);
	});

	it('serializes to <span style="color: ..."> case preserving', () => {
		const schema = makeSchema();
		const node = schema.text('foo', [schema.marks.textColor.create(testColorObj2)]);
		expect(toHTML(node, schema)).toEqual(
			`<span class="fabric-text-color-mark" style="--custom-palette-color: var(--ds-icon-accent-gray, #97A0AF)" data-text-custom-color="#97A0AF">foo</span>`,
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
			const node = schema.text('foo', [schema.marks.textColor.create({ color: '#ff00cc' })]);
			expect(toHTML(node, schema)).toEqual(
				`<span class="fabric-text-color-mark" style="--custom-palette-color: #CE00A1" data-text-custom-color="#ff00cc">foo</span>`,
			);
		});
	});
});

function makeSchema() {
	return createSchema({
		nodes: ['doc', 'paragraph', 'text'],
		marks: ['textColor'],
	});
}

function itMatches(html: string, expectedText: string, attrs: { color: string }) {
	it(`matches ${html}`, () => {
		const schema = makeSchema();
		const doc = fromHTML(`${html}`, schema);
		const textColorNode = schema.marks.textColor.create(attrs);

		expect(textWithMarks(doc, expectedText, [textColorNode])).toBe(true);
	});
}
