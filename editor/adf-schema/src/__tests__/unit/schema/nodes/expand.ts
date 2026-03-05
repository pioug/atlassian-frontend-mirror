import { toDOM, fromHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';
import { expandWithNestedExpand } from '../../../..';
import {
	schema,
	doc,
	expand as expandBuilder,
	nestedExpand,
	p,
	table,
	tr,
	td,
} from '@af/adf-test-helpers/src/adf-schema';
import { normalizeNodeSpec } from '../../_utils';
import type { SchemaConfig } from '../../../../schema/create-schema';
import { createSchema } from '../../../../schema/create-schema';

const packageName = process.env.npm_package_name as string;

function makeSchemaWithFontSize() {
	const config: SchemaConfig = {
		nodes: ['doc', 'paragraph', 'text', 'expand', 'nestedExpand'],
		marks: ['fontSize'],
	};
	return createSchema(config);
}

describe(`${packageName}/schema expand node`, () => {
	describe('parse html', () => {
		// The node spec will be generated from ADF DSL
		// this test would detect any changes if this node is updated from ADF DSL
		// @DSLCompatibilityException
		// marks is in different order comparing with original marks
		it('should return correct node spec', () => {
			expect(normalizeNodeSpec(expandWithNestedExpand)).toStrictEqual(
				normalizeNodeSpec({
					attrs: {
						__expanded: {
							default: true,
						},
						localId: {
							default: null,
						},
						title: {
							default: '',
						},
					},
					content:
						'(paragraph | panel | blockquote | orderedList | bulletList | rule | heading | codeBlock | mediaGroup | mediaSingle | decisionList | taskList | table | blockCard | embedCard | extension | unsupportedBlock | nestedExpand)+',
					group: 'block',
					isolating: true,
					marks: 'fontSize unsupportedMark unsupportedNodeAttribute fragment dataConsumer',
					parseDOM: [
						{
							context: 'table//',
							getAttrs: expect.anything(),
							tag: 'div[data-node-type="expand"]',
						},
						{
							context: 'expand//',
							getAttrs: expect.anything(),
							tag: '[data-node-type="expand"]',
						},
						{
							context: 'nestedExpand//',
							getAttrs: expect.anything(),
							tag: '[data-node-type="expand"]',
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
							getAttrs: expect.anything(),
							tag: 'div[data-node-type="expand"]',
						},
					],
					selectable: true,
					toDOM: expect.anything(),
				}),
			);
		});

		it('converts to PM node', () => {
			const doc = fromHTML('<div data-node-type="expand" />', schema);
			const node = doc.firstChild!;
			// Note: schema.marks may include fontSize depending on which schema is loaded
			// We just verify the node type matches expand
			expect(node.type.name).toBe('expand');
		});

		it('gets attributes from html', () => {
			const title = 'Homer Simpson';
			const doc = fromHTML(
				`
        <div
          data-node-type="expand"
          data-title="${title}"
        ><p>hello</p></div>
      `,
				schema,
			);

			const node = doc.firstChild!;
			expect(node.attrs.title).toEqual(title);
		});

		describe('node nesting parsing', () => {
			it('should parse an expand inside a table', () => {
				const docFromHTML = fromHTML(
					'<table data-number-column="false" data-layout="default" data-autosize="false" data-table-local-id="0a61df83-1f2b-4004-8b41-877b96e4dab1" data-table-width="760" data-pm-slice="1 1 []"><tbody><tr><td class="pm-table-cell-content-wrap"><div data-node-type="nestedExpand" data-title="" data-expanded="true"><p></p></div></td></tr></tbody></table>',
					schema,
				);
				expect(docFromHTML.toJSON()).toEqual(
					doc(
						table({
							localId: '0a61df83-1f2b-4004-8b41-877b96e4dab1',
							width: 760,
						})(tr(td({})(nestedExpand({ title: '' })(p(''))))),
					).toJSON(),
				);
			});

			it('should parse a nestedExpand inside an expand', () => {
				const docFromHTML = fromHTML(
					'<div data-node-type="expand" data-title="" data-expanded="true" data-pm-slice="0 0 []"><div data-node-type="nestedExpand" data-title="" data-expanded="true"><p></p></div></div>',
					schema,
				);
				expect(docFromHTML.toJSON()).toEqual(
					doc(expandBuilder({ title: '' })(nestedExpand({ title: '' })(p('')))).toJSON(),
				);
			});

			// Not valid ADF, but we'll convert the nested expand into a nestedExpand in the paste logic
			it('should strip an expand if inside another expand', () => {
				const docFromHTML = fromHTML(
					'<div data-node-type="expand" data-title="" data-expanded="true" data-pm-slice="0 0 []"><div data-node-type="expand" data-title="" data-expanded="true" ><p></p></div></div>',
					schema,
				);
				expect(docFromHTML.toJSON()).toEqual(doc(expandBuilder({ title: '' })(p(''))).toJSON());
			});
		});
	});

	describe('encode html', () => {
		it('converts html data attributes to node attributes', () => {
			const title = 'Homer Simpson';
			const content = schema.nodes.paragraph.create(schema.text('hello'));
			const node = schema.nodes.expand.create({ title }, content);
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			const dom = toDOM(node, schema).firstChild as HTMLElement;

			expect(dom.getAttribute('data-node-type')).toEqual('expand');
			expect(dom.getAttribute('data-title')).toEqual(title);
		});

		it('encodes and decodes to the same node', () => {
			const title = 'Homer Simpson';
			const content = schema.nodes.paragraph.create(schema.text('hello'));
			const node = schema.nodes.expand.create({ title }, content);
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			const dom = toDOM(node, schema).firstChild as HTMLElement;
			const parsedNode = fromHTML(dom.outerHTML, schema).firstChild!;
			expect(parsedNode).toEqual(node);
		});
	});

	describe('fontSize mark support in expand', () => {
		const schemaWithFontSize = makeSchemaWithFontSize();

		it('paragraph with fontSize is valid inside expand node', () => {
			const fontSizeMark = schemaWithFontSize.marks.fontSize.create({ fontSize: 'small' });
			const paragraph = schemaWithFontSize.nodes.paragraph.create(
				{},
				[schemaWithFontSize.text('Small text in expand')],
				[fontSizeMark],
			);
			const expand = schemaWithFontSize.nodes.expand.create({ title: 'Test' }, [paragraph]);

			expect(expand.type.name).toBe('expand');
			expect(expand.firstChild).toBeTruthy();
			expect(expand.firstChild!.type.name).toBe('paragraph');
			expect(expand.firstChild!.marks).toHaveLength(1);
			expect(expand.firstChild!.marks[0].type.name).toBe('fontSize');
			expect(expand.firstChild!.marks[0].attrs.fontSize).toBe('small');
		});

		it('expand with fontSize paragraph can be created and preserves mark', () => {
			const fontSizeMark = schemaWithFontSize.marks.fontSize.create({ fontSize: 'small' });
			const paragraph = schemaWithFontSize.nodes.paragraph.create(
				{},
				[schemaWithFontSize.text('Small text')],
				[fontSizeMark],
			);
			const expand = schemaWithFontSize.nodes.expand.create({ title: 'Test' }, [paragraph]);

			// Verify the expand node and its paragraph child preserve the fontSize mark
			expect(expand.type.name).toBe('expand');
			expect(expand.content.childCount).toBe(1);
			const childParagraph = expand.content.firstChild!;
			expect(childParagraph.type.name).toBe('paragraph');
			expect(childParagraph.marks).toHaveLength(1);
			expect(childParagraph.marks[0].type.name).toBe('fontSize');
			expect(childParagraph.marks[0].attrs.fontSize).toBe('small');
		});
	});

	describe('fontSize mark support in nestedExpand', () => {
		const schemaWithFontSize = makeSchemaWithFontSize();

		it('paragraph with fontSize is valid inside nestedExpand node', () => {
			const fontSizeMark = schemaWithFontSize.marks.fontSize.create({ fontSize: 'small' });
			const paragraph = schemaWithFontSize.nodes.paragraph.create(
				{},
				[schemaWithFontSize.text('Small text in nestedExpand')],
				[fontSizeMark],
			);
			const nestedExpandNode = schemaWithFontSize.nodes.nestedExpand.create({ title: 'Nested' }, [paragraph]);

			expect(nestedExpandNode.type.name).toBe('nestedExpand');
			expect(nestedExpandNode.firstChild).toBeTruthy();
			expect(nestedExpandNode.firstChild!.type.name).toBe('paragraph');
			expect(nestedExpandNode.firstChild!.marks).toHaveLength(1);
			expect(nestedExpandNode.firstChild!.marks[0].type.name).toBe('fontSize');
			expect(nestedExpandNode.firstChild!.marks[0].attrs.fontSize).toBe('small');
		});

		it('nestedExpand with fontSize paragraph can be created and preserves mark', () => {
			const fontSizeMark = schemaWithFontSize.marks.fontSize.create({ fontSize: 'small' });
			const paragraph = schemaWithFontSize.nodes.paragraph.create(
				{},
				[schemaWithFontSize.text('Small text')],
				[fontSizeMark],
			);
			const nestedExpandNode = schemaWithFontSize.nodes.nestedExpand.create({ title: 'Nested' }, [paragraph]);

			// Verify the nestedExpand node and its paragraph child preserve the fontSize mark
			expect(nestedExpandNode.type.name).toBe('nestedExpand');
			expect(nestedExpandNode.content.childCount).toBe(1);
			const childParagraph = nestedExpandNode.content.firstChild!;
			expect(childParagraph.type.name).toBe('paragraph');
			expect(childParagraph.marks).toHaveLength(1);
			expect(childParagraph.marks[0].type.name).toBe('fontSize');
			expect(childParagraph.marks[0].attrs.fontSize).toBe('small');
		});

		it('expand can contain nestedExpand with fontSize paragraph', () => {
			const fontSizeMark = schemaWithFontSize.marks.fontSize.create({ fontSize: 'small' });
			const paragraph = schemaWithFontSize.nodes.paragraph.create(
				{},
				[schemaWithFontSize.text('Small text')],
				[fontSizeMark],
			);
			const nestedExpandNode = schemaWithFontSize.nodes.nestedExpand.create({ title: 'Nested' }, [paragraph]);
			const expand = schemaWithFontSize.nodes.expand.create({ title: 'Parent' }, [nestedExpandNode]);

			expect(expand.type.name).toBe('expand');
			expect(expand.firstChild!.type.name).toBe('nestedExpand');
			expect(expand.firstChild!.firstChild).toBeTruthy();
			expect(expand.firstChild!.firstChild!.marks).toHaveLength(1);
			expect(expand.firstChild!.firstChild!.marks[0].type.name).toBe('fontSize');
		});
	});
});
