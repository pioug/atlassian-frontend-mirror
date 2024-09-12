import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
	blockquote,
	caption,
	code_block,
	doc,
	expand,
	media,
	mediaGroup,
	mediaSingle,
	nestedExpand,
	p,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { fg } from '@atlaskit/platform-feature-flags';

import { JSONTransformer } from '../../index';
import type { JSONDocNode } from '../../index';

jest.mock('@atlaskit/platform-feature-flags');

describe('JSONTransformer - Nested content', () => {
	const createEditor = createEditorFactory();
	const transformer = new JSONTransformer();

	describe('encode', () => {
		const toJSON = (node: PMNode) => transformer.encode(node);

		it('should encode a document with nestedExpand nested in expand', () => {
			(fg as jest.Mock).mockImplementation(
				(name) => name === 'platform_editor_nested_expand_in_expand_adf_change',
			);
			const document = doc(
				expand({
					title: 'Parent expand title',
					__expanded: true,
				})(
					nestedExpand({
						title: 'Nested expand title',
						__expanded: true,
					})(p('Nested expand content')),
				),
			);
			const { editorView } = createEditor({
				doc: document,
				editorProps: {
					allowExpand: true,
					featureFlags: {
						'nested-expand-in-expand-ex': true,
					},
				},
			});

			expect(toJSON(editorView.state.doc)).toEqual({
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'expand',
						attrs: {
							title: 'Parent expand title',
						},
						content: [
							{
								type: 'nestedExpand',
								attrs: {
									title: 'Nested expand title',
								},
								content: [
									{
										type: 'paragraph',
										content: [
											{
												type: 'text',
												text: 'Nested expand content',
											},
										],
									},
								],
							},
						],
					},
				],
			});
		});

		it('should encode a document with codeblock nested in quote', () => {
			(fg as jest.Mock).mockImplementation(
				(name) => name === 'platform_editor_nest_in_quotes_adf_change',
			);
			const document = doc(blockquote(code_block()('This is a codeblock in a blockquote.')));
			const { editorView } = createEditor({
				doc: document,
				editorProps: {
					featureFlags: {
						'nest-media-and-codeblock-in-quote': true,
					},
				},
			});

			expect(toJSON(editorView.state.doc)).toEqual({
				type: 'doc',
				content: [
					{
						type: 'blockquote',
						content: [
							{
								type: 'codeBlock',
								attrs: {},
								content: [
									{
										text: 'This is a codeblock in a blockquote.',
										type: 'text',
									},
								],
							},
						],
					},
				],
				version: 1,
			});
		});

		it('should encode a document with mediaSingle nested in quote', () => {
			(fg as jest.Mock).mockImplementation(
				(name) => name === 'platform_editor_nest_in_quotes_adf_change',
			);
			const document = doc(
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
			);
			const { editorView } = createEditor({
				doc: document,
				editorProps: {
					media: {
						allowMediaSingle: true,
						allowCaptions: true,
					},
					featureFlags: {
						'nest-media-and-codeblock-in-quote': true,
					},
				},
			});

			expect(toJSON(editorView.state.doc)).toEqual({
				type: 'doc',
				content: [
					{
						type: 'blockquote',
						content: [
							{
								type: 'mediaSingle',
								attrs: {
									layout: 'center',
									width: 354,
								},
								content: [
									{
										type: 'media',
										attrs: {
											width: 1024,
											alt: '6b6a0fdc-3aba-41e5-9ccb-dade3165804a.png',
											id: '397edf6e-2d0f-4d78-a855-4158fcc594e7',
											collection: 'contentId-4113639891',
											type: 'file',
											height: 1024,
										},
									},
									{
										type: 'caption',
										content: [
											{
												text: 'Caption on media in quote',
												type: 'text',
											},
										],
									},
								],
							},
						],
					},
				],
				version: 1,
			});
		});

		it('should encode a document with mediaGroup nested in quote', () => {
			(fg as jest.Mock).mockImplementation(
				(name) => name === 'platform_editor_nest_in_quotes_adf_change',
			);
			const document = doc(
				blockquote(
					mediaGroup(
						media({
							id: 'a9dfeb96-18aa-4eca-8c95-c7c19be33650',
							collection: 'contentId-4113639891',
							type: 'file',
						})(),
					),
				),
			);
			const { editorView } = createEditor({
				doc: document,
				editorProps: {
					media: {
						allowMediaGroup: true,
					},
					featureFlags: {
						'nest-media-and-codeblock-in-quote': true,
					},
				},
			});

			expect(toJSON(editorView.state.doc)).toEqual({
				type: 'doc',
				content: [
					{
						type: 'blockquote',
						content: [
							{
								type: 'mediaGroup',
								content: [
									{
										type: 'media',
										attrs: {
											id: 'a9dfeb96-18aa-4eca-8c95-c7c19be33650',
											collection: 'contentId-4113639891',
											type: 'file',
										},
									},
								],
							},
						],
					},
				],
				version: 1,
			});
		});
	});

	describe('parse', () => {
		const parseJSON = (node: JSONDocNode) => transformer.parse(node);

		it('should parse a document with nestedExpand nested in expand', () => {
			const adf: JSONDocNode = {
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'expand',
						attrs: {
							title: 'Parent expand title',
						},
						content: [
							{
								type: 'nestedExpand',
								attrs: {
									title: 'Nested expand title',
								},
								content: [
									{
										type: 'paragraph',
										content: [
											{
												type: 'text',
												text: 'Nested expand content',
											},
										],
									},
								],
							},
						],
					},
				],
			};

			expect(parseJSON(adf)).toEqualDocument(
				doc(
					expand({
						title: 'Parent expand title',
						__expanded: true,
					})(
						nestedExpand({
							title: 'Nested expand title',
							__expanded: true,
						})(p('Nested expand content')),
					),
				),
			);
		});

		it('should parse a document with codeblock nested in quote', () => {
			const adf: JSONDocNode = {
				type: 'doc',
				content: [
					{
						type: 'blockquote',
						content: [
							{
								type: 'codeBlock',
								content: [
									{
										text: 'This is a codeblock in a blockquote.',
										type: 'text',
									},
								],
							},
						],
					},
				],
				version: 1,
			};

			expect(parseJSON(adf)).toEqualDocument(
				doc(blockquote(code_block()('This is a codeblock in a blockquote.'))),
			);
		});

		it('should parse a document with mediaSingle nested in quote', () => {
			const adf: JSONDocNode = {
				type: 'doc',
				content: [
					{
						type: 'blockquote',
						content: [
							{
								type: 'mediaSingle',
								attrs: {
									layout: 'center',
									width: 354,
									widthType: 'pixel',
								},
								content: [
									{
										type: 'media',
										attrs: {
											width: 1024,
											alt: '6b6a0fdc-3aba-41e5-9ccb-dade3165804a.png',
											id: '397edf6e-2d0f-4d78-a855-4158fcc594e7',
											collection: 'contentId-4113639891',
											type: 'file',
											height: 1024,
										},
									},
									{
										type: 'caption',
										content: [
											{
												text: 'Caption on media in quote',
												type: 'text',
											},
										],
									},
								],
							},
						],
					},
				],
				version: 1,
			};

			expect(parseJSON(adf)).toEqualDocument(
				doc(
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
				),
			);
		});

		it('should parse a document with mediaGroup nested in quote', () => {
			const adf: JSONDocNode = {
				type: 'doc',
				content: [
					{
						type: 'blockquote',
						content: [
							{
								type: 'mediaGroup',
								content: [
									{
										type: 'media',
										attrs: {
											id: 'a9dfeb96-18aa-4eca-8c95-c7c19be33650',
											collection: 'contentId-4113639891',
											type: 'file',
										},
									},
								],
							},
						],
					},
				],
				version: 1,
			};

			expect(parseJSON(adf)).toEqualDocument(
				doc(
					blockquote(
						mediaGroup(
							media({
								id: 'a9dfeb96-18aa-4eca-8c95-c7c19be33650',
								collection: 'contentId-4113639891',
								type: 'file',
							})(),
						),
					),
				),
			);
		});
	});
});
