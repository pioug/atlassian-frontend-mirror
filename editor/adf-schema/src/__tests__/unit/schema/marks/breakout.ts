import { createSchema } from '../../../../schema/create-schema';
import { fromHTML, toHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';
import { breakout } from '../../../..';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema breakout mark`, () => {
	// The mark spec will be generated from ADF DSL
	// this test would detect any changes if this mark is updated from ADF DSL
	it('should return correct mark spec', () => {
		expect(breakout).toStrictEqual({
			attrs: {
				mode: {
					default: 'wide',
				},
				width: {
					default: null,
				},
			},
			inclusive: false,
			parseDOM: [
				{
					getAttrs: expect.anything(),
					tag: 'div.fabric-editor-breakout-mark',
				},
			],
			spanning: false,
			toDOM: expect.anything(),
		});
	});

	describe('with optional width attribute not defined', () => {
		it('serializes to the correct HTML when mode is wide', () => {
			const schema = makeSchema();
			const node = schema.nodes.codeBlock.create(
				{},
				[],
				[schema.marks.breakout.create({ mode: 'wide' })],
			);
			const html = toHTML(node, schema);
			// eslint-disable-next-line no-console
			console.log('debug html', html);
			expect(html).toContain('data-mode="wide"');
			expect(html).not.toContain('data-width');
		});

		it('deseriliazes <div class="fabric-editor-breakout-mark" data-mode="wide" />', () => {
			const schema = makeSchema();
			const doc = fromHTML(
				'<div class="fabric-editor-breakout-mark" data-mode="wide"><pre><code></code></pre></div>',
				schema,
			);
			const mark = doc.firstChild!.marks[0];
			expect(mark.type.name).toEqual('breakout');
			expect(mark.attrs).toEqual({ mode: 'wide', width: null });
		});
	});

	describe('with optional width attribute defined', () => {
		it('serializes to the correct HTML when mode is wide and width is 1800', () => {
			const schema = makeSchema();
			const node = schema.nodes.codeBlock.create(
				{},
				[],
				[schema.marks.breakout.create({ mode: 'wide', width: 1800 })],
			);
			const html = toHTML(node, schema);
			// eslint-disable-next-line no-console
			console.log('debug html', html);
			expect(html).toContain('data-mode="wide"');
			expect(html).toContain('data-width="1800"');
		});

		it('deseriliazes <div class="fabric-editor-breakout-mark" data-mode="wide" data-width="1800" />', () => {
			const schema = makeSchema();
			const doc = fromHTML(
				'<div class="fabric-editor-breakout-mark" data-mode="wide" data-width="1800"><pre><code></code></pre></div>',
				schema,
			);
			const mark = doc.firstChild!.marks[0];
			expect(mark.type.name).toEqual('breakout');
			expect(mark.attrs.width).toEqual(1800);
			expect(mark.attrs.mode).toEqual('wide');
		});
	});
});

function makeSchema() {
	return createSchema({
		nodes: ['doc', 'paragraph', 'text', 'codeBlock'],
		marks: ['breakout'],
	});
}
