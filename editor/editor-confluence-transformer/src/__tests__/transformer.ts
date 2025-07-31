import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { ConfluenceTransformer } from '..';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';

import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import {
	doc,
	blockquote,
	code_block,
	mediaGroup,
	mediaSingle,
	media,
	caption,
} from '@atlaskit/editor-test-helpers/doc-builder';

const transformer = new JSONTransformer();
const toJSON = (node: PMNode) => transformer.encode(node);

describe('Confluence Transformer', () => {
	const confluenceTransformer = new ConfluenceTransformer(defaultSchema);

	describe('encode', () => {
		it('should encode a document with a codeblock nested in a blockquote', () => {
			const pmDoc = doc(
				blockquote(
					code_block({ language: 'esperanto' })('Mia kusenveturilo estas plena je angiloj'),
				),
			)(defaultSchema);

			expect(confluenceTransformer.encode(pmDoc)).toEqual(
				'<blockquote><ac:structured-macro ac:name="code" ac:schema-version="1"><ac:parameter ac:name="language">esperanto</ac:parameter><ac:plain-text-body><![CDATA[Mia kusenveturilo estas plena je angiloj]]></ac:plain-text-body></ac:structured-macro></blockquote>',
			);
		});

		it('should encode a document with a media single nested in a blockquote', () => {
			const pmDoc = doc(
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

			expect(confluenceTransformer.encode(pmDoc)).toEqual(
				'<blockquote><fab:media-single layout="center"><fab:media media-id="397edf6e-2d0f-4d78-a855-4158fcc594e7" media-type="file" media-collection="contentId-4113639891" width="1024" height="1024"/><fab:adf><![CDATA[{"type":"caption","attrs":{"localId":null},"content":[{"type":"text","text":"Caption on media in quote"}]}]]></fab:adf></fab:media-single></blockquote>',
			);
		});

		it('should encode a document with a media group nested in a blockquote', () => {
			const pmDoc = doc(
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

			expect(confluenceTransformer.encode(pmDoc)).toEqual(
				'<blockquote><fab:media-group><fab:media media-id="a9dfeb96-18aa-4eca-8c95-c7c19be33650" media-type="file" media-collection="contentId-4113639891"/></fab:media-group></blockquote>',
			);
		});
	});

	describe('parse', () => {
		it('should create a standard empty adf for empty Confluence', () => {
			const standardEmptyAdf: JSONDocNode = {
				type: 'doc',
				version: 1,
				content: [],
			};

			expect(toJSON(confluenceTransformer.parse('<p />'))).toEqual(standardEmptyAdf);
		});

		describe('should parse jira issue node', () => {
			it('should be parsed as text', () => {
				const html =
					'<ac:structured-macro ac:name="JIRA"><ac:parameter ac:name="key">testKey123</ac:parameter></ac:structured-macro>';
				const expectedADF: JSONDocNode = {
					type: 'doc',
					version: 1,
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'testKey123',
								},
							],
						},
					],
				};

				expect(toJSON(confluenceTransformer.parse(html))).toEqual(expectedADF);
			});
		});

		describe('should parse background color', () => {
			const html = '<p><span style="background-color: #ffff00">Highlighted text</span></p>';

			it('should be parsed as text', () => {
				const expectedADF: JSONDocNode = {
					type: 'doc',
					version: 1,
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'Highlighted text',
									marks: [{ type: 'backgroundColor', attrs: { color: '#ffff00' } }],
								},
							],
						},
					],
				};

				expect(toJSON(confluenceTransformer.parse(html))).toEqual(expectedADF);
			});
		});

		it('should parse a document with a codeblock nested in a blockquote', () => {
			const cxhtmlDoc =
				'<blockquote><ac:structured-macro ac:name="code" ac:schema-version="1"><ac:parameter ac:name="language">esperanto</ac:parameter><ac:plain-text-body><![CDATA[Mia kusenveturilo estas plena je angiloj]]></ac:plain-text-body></ac:structured-macro></blockquote>';
			const pmDoc = doc(
				blockquote(
					code_block({ language: 'esperanto' })('Mia kusenveturilo estas plena je angiloj'),
				),
			)(defaultSchema);

			expect(confluenceTransformer.parse(cxhtmlDoc).toJSON()).toEqual(pmDoc.toJSON());
		});

		it('should parse a document with a media single nested in a blockquote', () => {
			const cxhtmlDoc =
				'<blockquote><fab:media-single layout="center"><fab:media media-id="397edf6e-2d0f-4d78-a855-4158fcc594e7" media-type="file" media-collection="contentId-4113639891" width="1024" height="1024"/></fab:media-single></blockquote>';
			// Captions on media aren't supported by this transformer, width and alt text neither
			const pmDoc = doc(
				blockquote(
					mediaSingle({
						layout: 'center',
					})(
						media({
							width: 1024,
							id: '397edf6e-2d0f-4d78-a855-4158fcc594e7',
							collection: 'contentId-4113639891',
							type: 'file',
							height: 1024,
						})(),
					),
				),
			)(defaultSchema);

			expect(confluenceTransformer.parse(cxhtmlDoc).toJSON()).toEqual(pmDoc.toJSON());
		});

		it('should parse a document with a media group nested in a blockquote', () => {
			const cxhtmlDoc =
				'<blockquote><fab:media-group><fab:media media-id="a9dfeb96-18aa-4eca-8c95-c7c19be33650" media-type="file" media-collection="contentId-4113639891"/></fab:media-group></blockquote>';
			const pmDoc = doc(
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

			expect(confluenceTransformer.parse(cxhtmlDoc).toJSON()).toEqual(pmDoc.toJSON());
		});
	});
});
