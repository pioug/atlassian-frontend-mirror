import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { adf2wiki, wiki2adf } from '../_test-helpers';
import WikiMarkupTransformer from '../../../index';

import {
	blockquote,
	doc,
	hardBreak,
	p,
	table,
	tr,
	td,
	ul,
	li,
	code_block,
	mediaSingle,
	media,
	mediaGroup,
} from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup => ADF Round-trip - BlockQuote', () => {
	test('should convert blockquote node', () => {
		adf2wiki(
			doc(
				blockquote(
					p('This is a blockquote'),
					p('and it can only contain paragraphs'),
					p('a lot paragraphs'),
				),
			)(defaultSchema),
		);
	});

	test('should convert blockquote node with a single paragraph with hardbreak', () => {
		adf2wiki(
			doc(
				blockquote(
					p(
						'This is a blockquote',
						hardBreak(),
						'with a single paragraph',
						hardBreak(),
						'and hardbreaks',
					),
				),
			)(defaultSchema),
		);
	});

	test('should convert blockquote with lists properly', () => {
		adf2wiki(doc(blockquote(ul(li(p('item 1')), li(p('item 2')))))(defaultSchema));
	});

	test('should convert blockquote with lists nested in a table properly', () => {
		adf2wiki(
			doc(table()(tr(td()(blockquote(ul(li(p('item 1')), li(p('item 2'))))))))(defaultSchema),
		);
	});

	test('should convert blockquote with nested codeblock', () => {
		adf2wiki(
			doc(blockquote(code_block({ language: 'javascript' })('const i = 0;')))(defaultSchema),
		);
	});

	test('should convert blockquote with nested mediaSingle', () => {
		adf2wiki(
			doc(
				blockquote(
					mediaSingle()(
						media({
							id: 'abc-1',
							type: 'file',
							collection: '',
							alt: 'Hello world',
							width: 200,
							height: 183,
						})(),
					),
				),
			)(defaultSchema),
		);
	});

	// Media groups get converted to media single on round-tripping through wikimarkup, they also move to the default centering and sizes
	test('should convert blockquote with nested mediaGroup', () => {
		const pmDoc = doc(
			blockquote(
				mediaGroup(
					media({ id: 'file1.txt', type: 'file', collection: '' })(),
					media({ id: 'file2.txt', type: 'file', collection: '' })(),
				),
			),
		)(defaultSchema);
		const expectedDoc = doc(
			blockquote(
				mediaSingle()(
					media({
						id: 'file1.txt',
						type: 'file',
						collection: '',
						alt: '',
						width: 200,
						height: 183,
					})(),
				),
				mediaSingle()(
					media({
						id: 'file2.txt',
						type: 'file',
						collection: '',
						alt: '',
						width: 200,
						height: 183,
					})(),
				),
			),
		)(defaultSchema);

		const transformer = new WikiMarkupTransformer();
		const wiki = transformer.encode(pmDoc);
		const adf = transformer.parse(wiki).toJSON();
		expect(adf).toEqual(expectedDoc.toJSON());
	});
});

describe('WikiMarkup => ADF => WikiMarkup Round-trip - Blockquote', () => {
	test('should convert blockquote with lists nested in a table properly', () => {
		wiki2adf(
			`|{quote}* list item 1\n* list item 2\n\n# Numbered list 1\n# Numbered list 2{quote}|`,
		);
	});

	test('should convert blockquote with nested codeblock', () => {
		wiki2adf(`{quote}{code:javascript}const i = 0;{code}{quote}`);
	});

	test('should convert blockquote with nested mediaSingle', () => {
		wiki2adf(`{quote}!abc-1|width=200,height=183,alt="Hello world"!{quote}`);
	});

	// Media groups get converted to media single, they also move to the default centering and sizes
	test('should convert blockquote with nested mediaGroup', () => {
		const wikiDoc = `{quote}[^file1.txt] [^file2.txt]{quote}`;
		const expectedWiki = `{quote}!file1.txt|thumbnail!
!file2.txt|thumbnail!{quote}`;

		const transformer = new WikiMarkupTransformer();
		const adf = transformer.parse(wikiDoc);
		const roundtripped = transformer.encode(adf);
		expect(roundtripped).toEqual(expectedWiki);

		const wikiDocBq = `bq.[^file1.txt] [^file2.txt]`;
		const expectedWikiBq = `{quote}!file1.txt|thumbnail!
!file2.txt|thumbnail!{quote}`;

		const adfBq = transformer.parse(wikiDocBq);
		const roundtrippedBq = transformer.encode(adfBq);
		expect(roundtrippedBq).toEqual(expectedWikiBq);
	});
});
