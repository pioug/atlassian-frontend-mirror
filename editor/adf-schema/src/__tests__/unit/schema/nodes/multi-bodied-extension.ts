import { schema, toDOM, fromHTML, toContext } from '@af/adf-test-helpers/src/adf-schema';
import { multiBodiedExtension, extensionFrame as extensionFrameSpec } from '../../../..';
import {
	doc,
	multiBodiedExtension as multiBodiedExt,
	extensionFrame,
	p,
} from '@af/adf-test-helpers/src/doc-builder';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema multiBodiedExtension node`, () => {
	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec for multiBodiedExtension', () => {
		expect(multiBodiedExtension).toStrictEqual({
			attrs: {
				extensionKey: {
					default: '',
				},
				extensionType: {
					default: '',
				},
				layout: {
					default: 'default',
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
			content: 'extensionFrame+',
			definingAsContext: true,
			group: 'blockRootOnly',
			marks: 'unsupportedNodeAttribute unsupportedMark',
			parseDOM: [
				{
					context: 'multiBodiedExtension//',
					skip: true,
					tag: '[data-node-type="multi-bodied-extension"]',
				},
				{
					getAttrs: expect.anything(),
					tag: '[data-node-type="multi-bodied-extension"]',
				},
			],
			selectable: true,
			toDOM: expect.anything(),
		});
	});

	it('should return correct node spec for extensionFrame', () => {
		expect(extensionFrameSpec).toStrictEqual({
			content:
				'(paragraph | panel | blockquote | orderedList | bulletList | rule | heading | codeBlock | mediaGroup | mediaSingle | decisionList | taskList | table | extension | bodiedExtension | unsupportedBlock | blockCard | embedCard)+',
			isolating: true,
			marks: 'dataConsumer fragment unsupportedMark unsupportedNodeAttribute',
			definingAsContext: false,
			definingForContent: true,
			selectable: false,
			attrs: {},
			parseDOM: [
				{
					context: 'extensionFrame//',
					tag: 'div[data-extension-frame]',
					skip: true,
				},
				{
					tag: 'div[data-extension-frame]',
				},
			],
			toDOM: expect.anything(),
		});
	});

	describe('parse html', () => {
		it('converts to extension PM node', () => {
			const doc = fromHTML(
				`
        <div data-node-type="multi-bodied-extension" data-layout="default">
        <div data-extension-frame="true">
        <p></p>
        </div>
        </div>
        `,
				schema,
			);
			const node = doc.firstChild!;
			expect(node.type.spec).toEqual(multiBodiedExtension);
		});

		it('gets attributes from html', () => {
			const extensionType = 'com.atlassian.confluence.macro.core';
			const extensionKey = 'superMacro';
			const parameters = { macroparams: { super: true } };

			const doc = fromHTML(
				`
          <div
            data-node-type="multi-bodied-extension"
            data-extension-type="${extensionType}"
            data-extension-key="${extensionKey}"
            data-parameters='${JSON.stringify(parameters)}'
          ><p>hello</p></div>
        `,
				schema,
			);
			const node = doc.firstChild!;
			expect(node.attrs.extensionType).toEqual(extensionType);
			expect(node.attrs.extensionKey).toEqual(extensionKey);
			expect(node.attrs.parameters).toEqual(parameters);
		});

		it('should not parse extension when pasted inside extension', () => {
			const document = doc(
				multiBodiedExt({ extensionKey: '', extensionType: '' })(extensionFrame()(p(''))),
			);
			const context = toContext(document, schema);
			const pmDoc = fromHTML('<div data-node-type="multi-bodied-extension" />', schema, {
				context,
			});
			const node = pmDoc.firstChild!;
			expect(node.type.name).toEqual('paragraph');
		});
	});

	describe('encode html', () => {
		it('converts html data attributes to node attributes', () => {
			const attrs = {
				extensionType: 'com.atlassian.confluence.macro',
				extensionKey: 'superMacro',
				parameters: { macroparams: { super: true } },
			};
			const content = schema.nodes.paragraph.create(schema.text('hello'));
			const node = schema.nodes.multiBodiedExtension.create(attrs, content);
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			const dom = toDOM(node, schema).firstChild as HTMLElement;

			expect(dom.getAttribute('data-node-type')).toEqual('multi-bodied-extension');
			expect(dom.getAttribute('data-extension-type')).toEqual(attrs.extensionType);
			expect(dom.getAttribute('data-extension-key')).toEqual(attrs.extensionKey);
			expect(dom.getAttribute('data-parameters')).toEqual(JSON.stringify(attrs.parameters));
		});

		it('encodes and decodes to the same node', () => {
			const attrs = {
				extensionType: 'com.atlassian.confluence.macro',
				extensionKey: 'superMacro',
				parameters: { macroparams: { super: true } },
			};
			const content = schema.nodes.paragraph.create(schema.text('hello'));
			const extensionFrameNode = schema.nodes.extensionFrame.create(attrs, content);
			const node = schema.nodes.multiBodiedExtension.create(attrs, extensionFrameNode);
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			const dom = toDOM(node, schema).firstChild as HTMLElement;
			const parsedNode = fromHTML(dom.outerHTML, schema).firstChild!;
			expect(parsedNode).toEqual(node);
		});
	});
});
