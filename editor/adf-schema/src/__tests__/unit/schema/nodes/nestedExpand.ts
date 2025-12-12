import { toDOM, fromHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';
import { nestedExpand } from '../../../..';
import type { Schema, Node } from '@atlaskit/editor-prosemirror/model';
import {
	schema,
	doc,
	expand,
	nestedExpand as nestedExpandBuilder,
	p,
} from '@af/adf-test-helpers/src/adf-schema';

const findNestedExpand = (doc: Node, schema: Schema) => {
	let expand: Node | null = null;
	doc.nodesBetween(0, doc.nodeSize - 2, (node) => {
		if (!expand && node.type === schema.nodes.nestedExpand) {
			expand = node;
		}
	});

	return expand as Node | null;
};
const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema nestedExpand node`, () => {
	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec', () => {
		expect(nestedExpand).toStrictEqual({
			attrs: {
				__expanded: {
					default: true,
				},
				title: {
					default: '',
				},
				localId: {
					default: null,
				},
			},
			content:
				'(paragraph | heading | mediaSingle | mediaGroup | codeBlock | bulletList | orderedList | taskList | decisionList | rule | panel | blockquote | unsupportedBlock | extension)+',
			isolating: true,
			marks: 'unsupportedMark unsupportedNodeAttribute dataConsumer fragment',
			parseDOM: [
				{
					context: 'nestedExpand//',
					tag: '[data-node-type="nestedExpand"]',
					getAttrs: expect.anything(),
				},
				{
					ignore: true,
					tag: '[data-node-type="nestedExpand"] button',
				},
				{
					ignore: true,
					tag: '[data-node-type="expand"] button',
				},
				{
					tag: 'div[data-node-type="nestedExpand"]',
					getAttrs: expect.anything(),
				},
			],
			selectable: true,
			toDOM: expect.anything(),
		});
	});

	describe('parse html', () => {
		it('converts to PM node', () => {
			const doc = fromHTML('<div data-node-type="nestedExpand" />', schema);
			const node = findNestedExpand(doc, schema)!;
			expect(node.type.spec).toEqual(nestedExpand);
		});

		it('gets attributes from html', () => {
			const title = 'Homer Simpson';
			const doc = fromHTML(
				`
        <div
          data-node-type="nestedExpand"
          data-title="${title}"
        ><p>hello</p></div>
      `,
				schema,
			);

			const node = findNestedExpand(doc, schema)!;
			expect(node.attrs.title).toEqual(title);
		});
	});

	describe('encode html', () => {
		it('converts html data attributes to node attributes', () => {
			const title = 'Homer Simpson';
			const content = schema.nodes.paragraph.create(schema.text('hello'));
			const node = schema.nodes.nestedExpand.create({ title }, content);
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			const dom = toDOM(node, schema).firstChild as HTMLElement;

			expect(dom.getAttribute('data-node-type')).toEqual('nestedExpand');
			expect(dom.getAttribute('data-title')).toEqual(title);
		});

		it('encodes and decodes to the same node', () => {
			const { paragraph, nestedExpand, table, tableRow, tableCell } = schema.nodes;

			const title = 'Homer Simpson';
			const content = paragraph.create(schema.text('hello'));
			const node = nestedExpand.create({ title }, content);
			// We must create a table wrapper since nestedExpands are only allowed inside tables.
			const cell = tableCell.createChecked(undefined, node);
			const row = tableRow.createChecked(undefined, cell);
			// if you don't pass a localId it will get filled while parsing failing this test
			const tableWrapper = table.createChecked(
				{ localId: '66e1b0a6-140d-476f-baf9-4ff67f22ee0e' },
				row,
			);

			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			const dom = toDOM(tableWrapper, schema).firstChild as HTMLElement;
			const parsedNode = fromHTML(dom.outerHTML, schema).firstChild!;
			expect(parsedNode).toEqual(tableWrapper);
		});
	});

	describe('node nesting parsing', () => {
		// Not valid ADF, but we'll insert it after the nestedExpand in the paste logic
		it('should parse a nestedExpand inside a nestedExpand', () => {
			const docFromHTML = fromHTML(
				'<div data-node-type="nestedExpand" data-title="" data-expanded="true" data-pm-slice="0 0 []"><div data-node-type="nestedExpand" data-title="" data-expanded="true"><p></p></div></div>',
				schema,
			);
			expect(docFromHTML.toJSON()).toEqual(
				doc(expand({ title: '' })(nestedExpandBuilder({ title: '' })(p('')))).toJSON(),
			);
		});
	});
});
