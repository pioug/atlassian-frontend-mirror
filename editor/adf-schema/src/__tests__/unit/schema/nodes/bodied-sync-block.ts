import { fromHTML, toHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';
import { createSchema } from '../../../../schema/create-schema';
import { bodiedSyncBlock } from '../../../../schema/nodes/bodied-sync-block';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema bodiedSyncBlock node`, () => {
	const schema = makeSchema();
	it('should return correct node spec', () => {
		expect(bodiedSyncBlock).toStrictEqual({
			attrs: {
				localId: {
					default: '',
				},
				resourceId: {
					default: '',
				},
			},
			selectable: true,
			isolating: true,
			content:
				'(paragraph | blockCard | blockquote | bulletList | codeBlock | confluenceUnsupportedBlock | decisionList | embedCard | expand | heading | layoutSection | mediaGroup | mediaSingle | orderedList | panel | rule | table | taskList | unsupportedBlock)+',
			marks:
				'unsupportedMark unsupportedNodeAttribute alignment indentation breakout link fragment',
			parseDOM: [
				{
					getAttrs: expect.anything(),
					tag: 'div[data-bodied-sync-block]',
				},
			],
			toDOM: expect.anything(),
		});
	});

	describe('parse from html', () => {
		it('converts to bodiedSyncBlock node with resourceId', () => {
			const doc = fromHTML(
				'<div data-bodied-sync-block="" data-resource-id="abc123"><p>Content</p></div>',
				schema,
			);
			expect(doc.firstChild!.type.name).toEqual('bodiedSyncBlock');
			expect(doc.firstChild!.attrs['resourceId']).toEqual('abc123');
		});

		it('has localId attribute auto generated', () => {
			const doc = fromHTML(
				'<div data-bodied-sync-block="" data-resource-id="abc123"><p>Content</p></div>',
				schema,
			);
			expect(doc.firstChild!.attrs['localId']).toHaveLength(36); // UUID v4 length
		});

		it('generates localId when data-local-id is not provided', () => {
			const doc = fromHTML(
				'<div data-bodied-sync-block="" data-resource-id="abc123"><p>Content</p></div>',
				schema,
			);
			// localId should be generated (non-empty) when not provided
			expect(doc.firstChild!.attrs['localId']).toBeTruthy();
		});

		it('uses provided localId when data-local-id is present', () => {
			const doc = fromHTML(
				'<div data-bodied-sync-block="" data-resource-id="abc123" data-local-id="local123"><p>Content</p></div>',
				schema,
			);
			expect(doc.firstChild!.attrs['localId']).toEqual('local123');
		});

		it('fails to parse bodiedSyncBlock node if resourceId is missing', () => {
			const doc = fromHTML('<div><p>Content</p></div>', schema);
			// Should not create a bodiedSyncBlock node
			expect(doc.firstChild && doc.firstChild.type.name).not.toEqual('bodiedSyncBlock');
		});

		it('has resourceId attribute as empty string by default', () => {
			const doc = fromHTML('<div data-bodied-sync-block=""><p>Content</p></div>', schema);
			// Should create a bodiedSyncBlock node with empty resourceId
			expect(doc.firstChild && doc.firstChild.attrs && doc.firstChild.attrs['resourceId']).toBe('');
		});

		it('fails to parse bodiedSyncBlock node from invalid HTML', () => {
			const doc = fromHTML(
				'<span data-bodied-sync-block="true" data-resource-id="abc123"><p>Content</p></span>',
				schema,
			);
			// Should not create a bodiedSyncBlock node from a span
			expect(doc.firstChild && doc.firstChild.type.name).not.toEqual('bodiedSyncBlock');
		});

		it('parses content correctly', () => {
			const doc = fromHTML(
				'<div data-bodied-sync-block="" data-resource-id="abc123"><p>Test content</p></div>',
				schema,
			);
			expect(doc.firstChild!.childCount).toBeGreaterThan(0);
			expect(doc.firstChild!.firstChild!.type.name).toEqual('paragraph');
		});
	});

	describe('convert to HTML', () => {
		it('converts to div tag', () => {
			const node = schema.nodes.bodiedSyncBlock.create(
				{
					resourceId: 'abc123',
				},
				[schema.nodes.paragraph.create({}, [schema.text('Test content')])],
			);
			expect(toHTML(node, schema)).toContain('<div');
		});

		it('sets data-resource-id attribute', () => {
			const node = schema.nodes.bodiedSyncBlock.create(
				{
					resourceId: 'abc123',
				},
				[schema.nodes.paragraph.create({}, [schema.text('Test content')])],
			);
			expect(toHTML(node, schema)).toContain('data-resource-id="abc123"');
		});

		it('sets data-bodied-sync-block attribute', () => {
			const node = schema.nodes.bodiedSyncBlock.create(
				{
					resourceId: 'abc123',
				},
				[schema.nodes.paragraph.create({}, [schema.text('Test content')])],
			);
			expect(toHTML(node, schema)).toContain('data-bodied-sync-block=""');
		});

		it('includes content in output', () => {
			const node = schema.nodes.bodiedSyncBlock.create(
				{
					resourceId: 'abc123',
				},
				[schema.nodes.paragraph.create({}, [schema.text('Test content')])],
			);
			const html = toHTML(node, schema);
			expect(html).toContain('Test content');
		});
	});
});

function makeSchema() {
	return createSchema({
		nodes: ['doc', 'paragraph', 'text', 'syncBlock', 'bodiedSyncBlock', 'unsupportedInline'],
		marks: ['unsupportedMark', 'unsupportedNodeAttribute', 'breakout'],
	});
}
