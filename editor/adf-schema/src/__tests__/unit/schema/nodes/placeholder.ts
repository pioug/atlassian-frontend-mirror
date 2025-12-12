import { toDOM, fromHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';
import { placeholder } from '../../../..';
import { schema } from '@af/adf-test-helpers/src/adf-schema';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema placeholder node`, () => {
	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec', () => {
		expect(placeholder).toStrictEqual({
			attrs: {
				text: {
					default: '',
				},
				localId: {
					default: null,
				},
			},
			group: 'inline',
			inline: true,
			marks: '',
			parseDOM: [
				{
					getAttrs: expect.anything(),
					tag: 'span[data-placeholder]',
				},
			],
			selectable: false,
			toDOM: expect.anything(),
		});
	});

	describe('parse html', () => {
		it('converts to date PM node', () => {
			const doc = fromHTML('<span data-placeholder="Type something..." />', schema);
			const node = doc.firstChild!.firstChild!;
			expect(node.type.spec).toEqual(placeholder);
		});

		it('gets attributes from html', () => {
			const doc = fromHTML('<span data-placeholder="Type something..." />', schema);
			const node = doc.firstChild!.firstChild!;
			expect(node.attrs.text).toEqual('Type something...');
		});
	});

	describe('encode html', () => {
		it('converts html data attributes to node attributes', () => {
			const attrs = { text: 'Type something...' };
			// extension node can contain no content
			const node = schema.nodes.placeholder.createChecked(attrs);
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			const dom = toDOM(node, schema).firstChild! as HTMLElement;
			expect(dom.getAttribute('data-placeholder')).toEqual('Type something...');
		});

		it('encodes and decodes to the same node', () => {
			const attrs = { text: 'Type something...' };
			const node = schema.nodes.placeholder.createChecked(attrs);
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			const dom = toDOM(node, schema).firstChild as HTMLElement;
			const parsedNode = fromHTML(dom.outerHTML, schema).firstChild!.firstChild!;
			expect(parsedNode).toEqual(node);
		});
	});
});
