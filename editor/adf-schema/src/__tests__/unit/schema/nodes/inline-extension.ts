import { toDOM, fromHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';
import { inlineExtension } from '../../../..';
import { schema } from '@af/adf-test-helpers/src/adf-schema';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema inlineExtension node`, () => {
	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec', () => {
		expect(inlineExtension).toStrictEqual({
			attrs: {
				extensionKey: {
					default: '',
				},
				extensionType: {
					default: '',
				},
				localId: {
					default: null,
				},
				parameters: {
					default: null,
				},
				text: {
					default: null,
				},
			},
			group: 'inline',
			inline: true,
			parseDOM: [
				{
					getAttrs: expect.anything(),
					tag: 'span[data-extension-type]',
				},
			],
			selectable: true,
			toDOM: expect.anything(),
		});
	});

	describe('parse html', () => {
		it('converts to inlineExtension PM node', () => {
			const doc = fromHTML(
				'<span data-extension-type="com.atlassian.confluence.macro" data-extension-key="status" />',
				schema,
			);
			const node = doc.firstChild!.firstChild!;
			expect(node.type.spec).toEqual(inlineExtension);
		});

		it('gets attributes from html', () => {
			const extensionType = 'com.atlassian.confluence.macro';
			const extensionKey = 'status';
			const parameters = { color: 'yellow', text: 'In progress' };

			const doc = fromHTML(
				`
        <span
          data-extension-type="${extensionType}"
          data-extension-key="${extensionKey}"
          data-parameters='${JSON.stringify(parameters)}'
        />
      `,
				schema,
			);

			const node = doc.firstChild!.firstChild!;
			expect(node.attrs.extensionType).toEqual(extensionType);
			expect(node.attrs.extensionKey).toEqual(extensionKey);
			expect(node.attrs.parameters).toEqual(parameters);
		});
	});

	describe('encode html', () => {
		it('converts html data attributes to node attributes', () => {
			const attrs = {
				extensionType: 'com.atlassian.confluence.macro',
				extensionKey: 'status',
				parameters: {
					macroparams: { color: 'green', text: 'Decided' },
				},
			};
			const dom = // eslint-disable-next-line @atlaskit/editor/no-as-casting
				toDOM(schema.nodes.inlineExtension.create(attrs), schema).firstChild as HTMLElement;

			expect(dom.getAttribute('data-extension-type')).toEqual(attrs.extensionType);
			expect(dom.getAttribute('data-extension-key')).toEqual(attrs.extensionKey);
			expect(dom.getAttribute('data-parameters')).toEqual(JSON.stringify(attrs.parameters));
		});

		it('encodes and decodes to the same node', () => {
			const attrs = {
				extensionType: 'com.atlassian.confluence.macro',
				extensionKey: 'status',
				parameters: {
					macroparams: { color: 'red', text: 'At risk' },
				},
			};
			const node = schema.nodes.inlineExtension.create(attrs);
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			const dom = toDOM(node, schema).firstChild as HTMLElement;
			const parsedNode = fromHTML(dom.outerHTML, schema).firstChild!.firstChild!;
			expect(parsedNode).toEqual(node);
		});
	});
});
