import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import WikiMarkupTransformer from '../../../index';

import {
	blockquote,
	doc,
	hardBreak,
	p,
	ul,
	li,
	code_block,
	mediaSingle,
	mediaGroup,
	media,
	caption,
} from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup - BlockQuote', () => {
	const transformer = new WikiMarkupTransformer();

	test('should convert blockquote node', () => {
		const node = doc(
			blockquote(
				p('This is a blockquote'),
				p('and it can only contain paragraphs'),
				p('a lot paragraphs'),
			),
		)(defaultSchema);
		expect(transformer.encode(node)).toMatchSnapshot();
	});

	test('should convert blockquote node with a single paragraph with hardbreak', () => {
		const node = doc(
			blockquote(
				p(
					'This is a blockquote',
					hardBreak(),
					'with a single paragraph',
					hardBreak(),
					'and hardbreaks',
				),
			),
		)(defaultSchema);
		expect(transformer.encode(node)).toMatchSnapshot();
	});

	test('should convert list inside a blockquote', () => {
		const node = doc(blockquote(ul(li(p('item 1')), li(p('item 2')))))(defaultSchema);
		expect(transformer.encode(node)).toMatchSnapshot();
	});

	test('should convert a blockquote with a nested codeblock', () => {
		const node = doc(
			blockquote(code_block({ language: 'esperanto' })('Mia kusenveturilo estas plena je angiloj')),
		)(defaultSchema);
		expect(transformer.encode(node)).toMatchInlineSnapshot(
			`"{quote}{noformat}Mia kusenveturilo estas plena je angiloj{noformat}{quote}"`,
		);
	});

	test('should convert a blockquote with a nested single media', () => {
		const node = doc(
			blockquote(
				mediaSingle({
					layout: 'center',
					width: 354,
					widthType: 'pixel',
				})(
					media({
						width: 1024,
						alt: '6b6a0fdc-3aba-41e5-9ccb-dade3165804a.png',
						id: '397edf6e-2d0f-4d78-a855-4158fcc594e7',
						collection: 'contentId-4113639891',
						type: 'file',
						height: 1024,
					})(),
					caption('Caption on media in quote'),
				),
			),
		)(defaultSchema);
		expect(transformer.encode(node)).toMatchInlineSnapshot(`
		"{quote}!397edf6e-2d0f-4d78-a855-4158fcc594e7|width=354%,alt="6b6a0fdc-3aba-41e5-9ccb-dade3165804a.png"!
		Caption on media in quote{quote}"
	`);
	});

	test('should convert a blockquote with a nested group media', () => {
		const node = doc(
			blockquote(
				mediaGroup(
					media({
						id: 'a9dfeb96-18aa-4eca-8c95-c7c19be33650',
						collection: 'contentId-4113639891',
						type: 'file',
					})(),
				),
			),
		)(defaultSchema);
		expect(transformer.encode(node)).toMatchInlineSnapshot(
			`"{quote}!a9dfeb96-18aa-4eca-8c95-c7c19be33650|thumbnail!{quote}"`,
		);
	});
});
