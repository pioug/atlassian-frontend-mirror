import {
	fromHTML,
	toHTML,
	schema,
	doc,
	p,
	blockquote,
	ol,
	ul,
	code_block,
	mediaSingle,
	media,
	mediaGroup,
	nodeFactory,
} from '@af/adf-test-helpers/src/adf-schema';

import { blockquote as blockquoteNodeSpec, extendedBlockquote, uuid } from '../../../..';

const packageName = process.env.npm_package_name as string;
const LIST_LOCAL_ID = 'test-list-local-id';

const liWithLocalId = nodeFactory(schema.nodes.listItem, {
	localId: LIST_LOCAL_ID,
});

describe(`${packageName}/schema blockquote node`, () => {
	beforeAll(() => {
		uuid.setStatic(LIST_LOCAL_ID);
	});

	afterAll(() => {
		uuid.setStatic(false);
	});
	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec', () => {
		expect(blockquoteNodeSpec).toStrictEqual({
			content: '(paragraph | unsupportedBlock)+',
			defining: true,
			group: 'block',
			marks: 'unsupportedMark unsupportedNodeAttribute',
			parseDOM: [
				{
					tag: 'blockquote',
				},
			],
			selectable: true,
			toDOM: expect.anything(),
			attrs: {
				localId: {
					default: null,
				},
			},
		});

		expect(extendedBlockquote).toStrictEqual({
			content:
				'(paragraph | orderedList | bulletList | unsupportedBlock | codeBlock | mediaSingle | mediaGroup | extension)+',
			defining: true,
			group: 'block',
			marks: 'unsupportedMark unsupportedNodeAttribute dataConsumer fragment',
			parseDOM: [
				{
					tag: 'blockquote',
				},
			],
			selectable: true,
			toDOM: expect.anything(),
			attrs: {
				localId: {
					default: null,
				},
			},
		});
	});

	it('should be possible to create a blockquote with a paragraph', () => {
		const html = toHTML(
			schema.nodes.blockquote.create({}, schema.nodes.paragraph.create()),
			schema,
		);
		expect(html).toEqual('<blockquote><p></p></blockquote>');
	});

	it('should not be possible to have heading inside blockquote', () => {
		const docFromHTML = fromHTML('<blockquote><h2>text</h2></blockquote>', schema);
		expect(docFromHTML.toJSON()).toEqual(doc(blockquote(p('text'))).toJSON());
	});

	it('should be possible to have paragraph inside blockquote', () => {
		const docFromHTML = fromHTML('<blockquote><p>text</p></blockquote>', schema);
		expect(docFromHTML.toJSON()).toEqual(doc(blockquote(p('text'))).toJSON());
	});

	it('should be possible to have ordered list inside blockquote', () => {
		const docFromHTML = fromHTML('<blockquote><ol><li>text</li></ol></blockquote>', schema);
		expect(docFromHTML.toJSON()).toEqual(
			doc(blockquote(ol({ order: 1 })(liWithLocalId(p('text'))))).toJSON(),
		);
	});

	it('should be possible to have bullet list inside blockquote', () => {
		const docFromHTML = fromHTML('<blockquote><ul><li>text</li></ul></blockquote>', schema);
		expect(docFromHTML.toJSON()).toEqual(
			doc(blockquote(ul(liWithLocalId(p('text'))))).toJSON(),
		);
	});

	it('should be possible to have codeblock inside blockquote', () => {
		const docFromHTML = fromHTML(
			'<blockquote><pre><span>window.alert("hello");<span></pre></blockquote>',
			schema,
		);
		expect(docFromHTML.toJSON()).toEqual(
			doc(blockquote(code_block({})('window.alert("hello");'))).toJSON(),
		);
	});

	it('should be possible to have media single inside blockquote', () => {
		const docFromHTML = fromHTML(
			'<blockquote><div data-node-type="mediaSingle"/></blockquote>',
			schema,
		);
		expect(docFromHTML.toJSON()).toEqual(
			doc(blockquote(mediaSingle({})(media({ type: 'file', collection: '', id: '' })))).toJSON(),
		);
	});

	it('should be possible to have media group inside blockquote', () => {
		const docFromHTML = fromHTML(
			'<blockquote><div data-node-type="mediaGroup"/></blockquote>',
			schema,
		);
		expect(docFromHTML.toJSON()).toEqual(
			doc(blockquote(mediaGroup(media({ type: 'file', collection: '', id: '' })))).toJSON(),
		);
	});
});
