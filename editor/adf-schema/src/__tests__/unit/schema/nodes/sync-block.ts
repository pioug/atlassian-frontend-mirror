import { fromHTML, toHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';
import { createSchema } from '../../../../schema/create-schema';
import { syncBlock } from '../../../../schema/nodes/sync-block';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema syncBlock node`, () => {
	const schema = makeSchema();
	it('should return correct node spec', () => {
		expect(syncBlock).toStrictEqual({
			attrs: {
				localId: {
					default: '',
				},
				resourceId: {
					default: '',
				},
			},
			selectable: true,
			parseDOM: [
				{
					getAttrs: expect.anything(),
					tag: 'div[data-sync-block]',
				},
			],
			toDOM: expect.anything(),
		});
	});

	describe('parse from html', () => {
		it('converts to syncBlock node with resourceId', () => {
			const doc = fromHTML('<div data-sync-block="" data-resource-id="abc123" />', schema);
			expect(doc.firstChild!.type.name).toEqual('syncBlock');
			expect(doc.firstChild!.attrs['resourceId']).toEqual('abc123');
		});

		it('has localId attribute auto generated', () => {
			const doc = fromHTML('<div data-sync-block="" data-resource-id="abc123" />', schema);
			expect(doc.firstChild!.attrs['localId']).toHaveLength(36); // UUID v4 length
		});

		it('fails to parse syncBlock node if resourceId is missing', () => {
			const doc = fromHTML('<div></div>', schema);
			// Should not create a syncBlock node
			expect(doc.firstChild && doc.firstChild.type.name).not.toEqual('syncBlock');
		});

		it('has resourceId attribute as empty string by default', () => {
			const doc = fromHTML('<div data-sync-block="" />', schema);
			// Should not create a syncBlock node with empty resourceId
			expect(doc.firstChild && doc.firstChild.attrs && doc.firstChild.attrs['resourceId']).toBe('');
		});

		it('fails to parse syncBlock node from invalid HTML', () => {
			const doc = fromHTML(
				'<span data-sync-block="true" data-resource-id="abc123"></span>',
				schema,
			);
			// Should not create a syncBlock node from a span
			expect(doc.firstChild && doc.firstChild.type.name).not.toEqual('syncBlock');
		});
	});

	describe('convert to HTML', () => {
		it('converts to div tag', () => {
			const node = schema.nodes.syncBlock.create({
				resourceId: 'abc123',
				content: [],
			});
			expect(toHTML(node, schema)).toContain('<div');
		});

		it('sets data-resource-id attribute', () => {
			const node = schema.nodes.syncBlock.create({ resourceId: 'abc123' });
			expect(toHTML(node, schema)).toContain('data-resource-id="abc123"');
		});
	});
});

function makeSchema() {
	return createSchema({
		nodes: ['doc', 'paragraph', 'text', 'syncBlock', 'bodiedSyncBlock', 'unsupportedInline'],
		marks: ['unsupportedMark', 'unsupportedNodeAttribute', 'breakout'],
	});
}
