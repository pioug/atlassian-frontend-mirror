import { createSchema } from '../../../../schema/create-schema';
import { toHTML, fromHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { annotation } from '../../../..';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema confluence-inline-comment mark`, () => {
	let schema: Schema;
	beforeEach(() => {
		schema = makeSchema();
	});

	// The mark spec will be generated from ADF DSL
	// this test would detect any changes if this mark is updated from ADF DSL
	it('should return correct mark spec', () => {
		expect(annotation).toStrictEqual({
			attrs: {
				annotationType: {
					default: 'inlineComment',
				},
				id: {
					default: '',
				},
			},
			excludes: '',
			group: 'annotation',
			inclusive: true,
			parseDOM: [
				{
					getAttrs: expect.anything(),
					mark: 'annotation',
					tag: 'span[data-mark-type="annotation"]',
				},
			],
			toDOM: expect.anything(),
		});
	});

	it('serializes to the correct HTML', () => {
		const node = schema.text('foo', [
			schema.marks.annotation.create({
				id: 'hash-ref-goes-here',
			}),
		]);

		const html = toHTML(node, schema);
		expect(html).toContain('data-id="hash-ref-goes-here"');
		expect(html).toContain('data-mark-type="annotation"');
		expect(html).toContain('data-mark-annotation-type="inlineComment"');
	});

	it('parses annotation correctly from html', () => {
		const doc = fromHTML(
			`<p><span data-mark-type="annotation" data-mark-annotation-type="inlineComment" data-id="comment-id" >annotated text</span></p>`,
			schema,
		);
		const annotationNode = doc.firstChild!.firstChild!;
		expect(annotationNode.marks).toHaveLength(1);
		expect(annotationNode.marks[0].type.name).toBe('annotation');
		expect(annotationNode.marks[0].attrs).toEqual({
			id: 'comment-id',
			annotationType: 'inlineComment',
		});
	});

	it('parses annotation correctly for media and mediaInline', () => {
		const doc = fromHTML(
			`<span data-mark-type="annotation" data-mark-annotation-type="inlineComment" data-id="comment-id"><div data-node-type="media" data-type="file" data-id="dummy-id"></div></span>`,
			schema,
		);

		const inlineDoc = fromHTML(
			`<span data-mark-type="annotation" data-mark-annotation-type="inlineComment" data-id="comment-id"><span data-node-type="mediaInline" data-type="image" data-id="dummy-id"></span></span>`,
			schema,
		);

		const mediaNode = doc.firstChild!.firstChild!;
		const mediaInlineNode = inlineDoc.firstChild!.firstChild!;

		expect(mediaNode.marks).toHaveLength(1);
		expect(mediaInlineNode.marks).toHaveLength(1);

		expect(mediaNode.marks[0].type.name).toBe('annotation');
		expect(mediaInlineNode.marks[0].type.name).toBe('annotation');

		expect(mediaNode.marks[0].attrs).toEqual({
			id: 'comment-id',
			annotationType: 'inlineComment',
		});
		expect(mediaInlineNode.marks[0].attrs).toEqual({
			id: 'comment-id',
			annotationType: 'inlineComment',
		});
	});
});

function makeSchema() {
	return createSchema({
		nodes: ['doc', 'paragraph', 'text', 'mediaInline', 'mediaSingle', 'media', 'caption'],
		marks: ['annotation'],
	});
}
