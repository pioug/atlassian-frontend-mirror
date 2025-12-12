import { toDOM, fromHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';
import { date } from '../../../..';

import { schema } from '@af/adf-test-helpers/src/adf-schema';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema date node`, () => {
	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec', () => {
		expect(date).toStrictEqual({
			attrs: {
				timestamp: {
					default: '',
				},
				localId: {
					default: null,
				},
			},
			group: 'inline',
			inline: true,
			parseDOM: [
				{
					getAttrs: expect.anything(),
					tag: 'span[data-node-type="date"]',
				},
			],
			selectable: true,
			toDOM: expect.anything(),
		});
	});

	describe('parse html', () => {
		it('converts to date PM node', () => {
			const doc = fromHTML('<span data-node-type="date" />', schema);
			const node = doc.firstChild!.firstChild!;
			expect(node.type.spec).toEqual(date);
		});

		it('gets attributes from html', () => {
			const timestamp = '1515639075805';
			const doc = fromHTML(
				`
        <span
          data-node-type="date"
          data-timestamp="${timestamp}"
        />
      `,
				schema,
			);
			const node = doc.firstChild!.firstChild!;
			expect(node.attrs.timestamp).toEqual(timestamp);
		});
	});

	describe('encode html', () => {
		it('converts html data attributes to node attributes', () => {
			const attrs = { timestamp: '1515639075805' };
			// extension node can contain no content
			const node = schema.nodes.date.create(attrs);
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			const dom = toDOM(node, schema).firstChild! as HTMLElement;
			expect(dom.getAttribute('data-node-type')).toEqual('date');
			expect(dom.getAttribute('data-timestamp')).toEqual(attrs.timestamp);
		});

		it('encodes and decodes to the same node', () => {
			const attrs = { timestamp: '1515639075805' };
			const node = schema.nodes.date.create(attrs);
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			const dom = toDOM(node, schema).firstChild as HTMLElement;
			const parsedNode = fromHTML(dom.outerHTML, schema).firstChild!.firstChild!;
			expect(parsedNode).toEqual(node);
		});
	});
});
