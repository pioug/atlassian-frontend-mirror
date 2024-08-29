import { MarkdownSerializer, marks, nodes } from '../../../serializer';
import {
	blockquote,
	code_block,
	doc,
	li,
	ol,
	p,
	ul,
	media,
	mediaSingle,
	mediaGroup,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { defaultSchema } from '@atlaskit/editor-test-helpers/schema';

const markdownSerializer = new MarkdownSerializer(nodes, marks);

describe('Serializer: List inside block-quote', () => {
	const mediaNode = (url: string = 'image.jpg') =>
		mediaSingle()(media({ url, type: 'external' })());

	describe('bullet list', () => {
		it('should nest an unordered list inside a blockquote', () => {
			expect(
				markdownSerializer.serialize(
					doc(blockquote(ul(li(p('item 1')), li(p('item 2')))))(defaultSchema),
				),
			).toEqual('> * item 1\n> * item 2\n> \n');
		});
		it('should support complex nested unordered list inside a blockquote', () => {
			expect(
				markdownSerializer.serialize(
					doc(blockquote(ul(li(p('level 1'), ul(li(p('level 1.1')), li(p('level 1.2')))))))(
						defaultSchema,
					),
				),
			).toEqual('> * level 1\n> \n>     * level 1.1\n>     * level 1.2\n>     \n> \n');
		});
		it('should support media inside an unorderedlist within a quote', () => {
			expect(
				markdownSerializer.serialize(doc(blockquote(ul(li(mediaNode()))))(defaultSchema)),
			).toEqual('> * ![](image.jpg)\n> \n');
		});
		it('should support codeblock inside an unorderedlist within a quote', () => {
			expect(
				markdownSerializer.serialize(doc(blockquote(ul(li(code_block()('foo')))))(defaultSchema)),
			).toEqual('> * ```\n>   foo\n>   ```\n> \n');
		});
	});

	describe('ordered list', () => {
		it('should support codeblock inside an orderedlist within a quote', () => {
			expect(
				markdownSerializer.serialize(
					doc(blockquote(ol({ order: 0 })(li(p('item 1')), li(p('item 2')))))(defaultSchema),
				),
			).toEqual('> 0. item 1\n> 1. item 2\n> \n');
		});
		it('should support complex nested ordered list inside a blockquote', () => {
			expect(
				markdownSerializer.serialize(
					doc(
						blockquote(
							ol({ order: 1 })(
								li(p('level 1'), ol({ order: 1 })(li(p('level 1.1')), li(p('level 1.2')))),
							),
						),
					)(defaultSchema),
				),
			).toEqual('> 1. level 1\n> \n>     1. level 1.1\n>     2. level 1.2\n>     \n> \n');
		});
		it('should support custom ordered list inside a blockquote', () => {
			expect(
				markdownSerializer.serialize(
					doc(blockquote(ol({ order: 6 })(li(p('six')), li(p('seven')), li(p('eight')))))(
						defaultSchema,
					),
				),
			).toEqual('> 6. six\n> 7. seven\n> 8. eight\n> \n');
		});
		it('should support media inside an orderedlist within a quote', () => {
			expect(
				markdownSerializer.serialize(
					doc(blockquote(ol({ order: 1 })(li(mediaNode()))))(defaultSchema),
				),
			).toEqual('> 1. ![](image.jpg)\n> \n');
		});
		it('should support codeblock inside an orderedlist within a quote', () => {
			expect(
				markdownSerializer.serialize(
					doc(blockquote(ol({ order: 1 })(li(code_block()('foo')))))(defaultSchema),
				),
			).toEqual('> 1. ```\n>   foo\n>   ```\n> \n');
		});
	});
});

describe('Serializer: Codeblock in blockquote', () => {
	it('should serialize a codeblock inside a blockquote', () => {
		expect(
			markdownSerializer.serialize(
				doc(
					blockquote(
						code_block({ language: 'esperanto' })('Mia kusenveturilo estas plena je angiloj'),
					),
				)(defaultSchema),
			),
		).toEqual('> ```esperanto\n> Mia kusenveturilo estas plena je angiloj\n> ```');
	});
});

describe('Serializer: Media in blockquote', () => {
	it('should serialize a media single inside a blockquote', () => {
		expect(
			markdownSerializer.serialize(
				doc(blockquote(mediaSingle()(media({ url: 'image.jpg', type: 'external' })())))(
					defaultSchema,
				),
			),
		).toEqual('> ![](image.jpg)\n');
	});

	it('should serialize a media group inside a blockquote', () => {
		expect(
			markdownSerializer.serialize(
				doc(
					blockquote(
						mediaGroup(
							media({ url: 'image1.jpg', type: 'external' })(),
							media({ url: 'image2.jpg', type: 'external' })(),
						),
					),
				)(defaultSchema),
			),
		).toEqual('> ![](image1.jpg)![](image2.jpg)');
	});
});
