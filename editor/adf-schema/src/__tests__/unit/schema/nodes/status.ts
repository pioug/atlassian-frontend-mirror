import { toDOM, fromHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';
import { status } from '../../../..';
import { StatusLocalIdRegex } from '@af/adf-test-helpers/src/constants';
import { schema } from '@af/adf-test-helpers/src/adf-schema';
const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema status node`, () => {
	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec', () => {
		expect(status).toStrictEqual({
			attrs: {
				color: {
					default: '',
				},
				localId: {
					default: expect.anything(),
				},
				style: {
					default: '',
				},
				text: {
					default: '',
				},
			},
			group: 'inline',
			inline: true,
			parseDOM: [
				{
					getAttrs: expect.anything(),
					tag: 'span[data-node-type="status"]',
				},
			],
			selectable: true,
			toDOM: expect.anything(),
		});
	});

	describe('parse html', () => {
		it('converts to status PM node', () => {
			const doc = fromHTML('<span data-node-type="status" />', schema);
			const node = doc.firstChild!.firstChild!;
			expect(node.type.spec).toEqual(status);
		});

		it('gets attributes from html', () => {
			const color = 'blue';
			const localId = '6c5e5301-1311-42e2-aa80-1b7557140b3d';
			const style = 'bold';
			const doc = fromHTML(
				`
        <span
          data-node-type="status"
          data-color="${color}"
          data-local-id="${localId}"
          data-style="${style}"
        >
          In progress
        </span>
      `,
				schema,
			);
			const node = doc.firstChild!.firstChild!;
			expect(node.attrs).toMatchObject({
				text: 'In progress',
				color,
				localId: expect.stringMatching(StatusLocalIdRegex),
				style,
			});

			expect(node.attrs.localId).not.toEqual(localId);
		});

		it('gets attributes from html without optional ones', () => {
			const color = 'blue';
			const doc = fromHTML(
				`
        <span
          data-node-type="status"
          data-color="${color}"
        >
          In progress
        </span>
      `,
				schema,
			);
			const node = doc.firstChild!.firstChild!;

			expect(node.attrs).toMatchObject({
				text: 'In progress',
				color,
				localId: expect.stringMatching(StatusLocalIdRegex),
			});
		});
	});

	describe('encode html', () => {
		it('converts html status attributes to node attributes', () => {
			const attrs = {
				text: 'In progress',
				color: 'blue',
				localId: '3fba07fc-0458-449c-bba9-04d5555164ea',
				style: 'subtle',
			};
			const node = schema.nodes.status.create(attrs);
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			const dom = toDOM(node, schema).firstChild! as HTMLElement;
			expect(dom.getAttribute('data-node-type')).toEqual('status');
			expect(dom.textContent).toEqual(attrs.text);
			expect(dom.getAttribute('data-color')).toEqual(attrs.color);
			expect(dom.getAttribute('data-local-id')).toEqual(attrs.localId);
			expect(dom.getAttribute('data-style')).toEqual(attrs.style);
		});

		it('encodes and decodes to the same node', () => {
			const attrs = {
				text: 'In progress',
				color: 'blue',
				localId: '3fba07fc-0458-449c-bba9-04d5555164ea',
				style: 'bold',
			};
			const node = schema.nodes.status.create(attrs);
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			const dom = toDOM(node, schema).firstChild as HTMLElement;
			const parsedNode = fromHTML(dom.outerHTML, schema).firstChild!.firstChild!;

			expect(parsedNode.attrs).toMatchObject({
				text: 'In progress',
				color: 'blue',
				localId: expect.stringMatching(StatusLocalIdRegex),
				style: 'bold',
			});

			expect(parsedNode.attrs.localId).not.toEqual(attrs.localId);
		});

		it('converts html status attributes to node attributes without style', () => {
			const attrs = {
				text: 'In progress',
				color: 'blue',
				localId: '3fba07fc-0458-449c-bba9-04d5555164ea',
			};
			const node = schema.nodes.status.create(attrs);
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			const dom = toDOM(node, schema).firstChild! as HTMLElement;
			expect(dom.getAttribute('data-node-type')).toEqual('status');
			expect(dom.textContent).toEqual(attrs.text);
			expect(dom.getAttribute('data-color')).toEqual(attrs.color);
			expect(dom.getAttribute('data-local-id')).toEqual(attrs.localId);
			expect(dom.getAttribute('data-style')).toEqual('');
		});
	});
});
