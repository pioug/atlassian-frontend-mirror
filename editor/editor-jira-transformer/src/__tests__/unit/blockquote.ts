import {
	doc,
	p,
	blockquote,
	code_block,
	mediaSingle,
	media,
	mediaGroup,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { checkParse, checkParseEncodeRoundTrips } from './_test-helpers';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';

describe('JIRATransformer', () => {
	describe('blockquote', () => {
		checkParseEncodeRoundTrips(
			'simple content',
			defaultSchema,
			'<blockquote><p>content</p></blockquote>',
			doc(blockquote(p('content'))),
		);

		checkParse('empty node', defaultSchema, ['<blockquote></blockquote>'], doc(blockquote(p(''))));

		checkParseEncodeRoundTrips(
			'no content',
			defaultSchema,
			'<blockquote><p></p></blockquote>',
			doc(blockquote(p(''))),
		);

		// Blockquote wih nested codeblock
		checkParse(
			'blockquote with nested codeblock',
			defaultSchema,
			[
				'<blockquote><div class="code panel"><div class="codeContent panelContent"><pre class="code-esperanto">Mia kusenveturilo estas plena je angiloj</pre></div></div></blockquote>',
			],
			doc(
				blockquote(
					code_block({ language: 'esperanto' })('Mia kusenveturilo estas plena je angiloj'),
				),
			),
		);
		checkParseEncodeRoundTrips(
			'blockquote with nested codeblock - round trip',
			defaultSchema,
			'<blockquote><div class="code panel"><div class="codeContent panelContent"><pre class="code-esperanto">Mia kusenveturilo estas plena je angiloj</pre></div></div></blockquote>',
			doc(
				blockquote(
					code_block({ language: 'esperanto' })('Mia kusenveturilo estas plena je angiloj'),
				),
			),
		);

		// Blockquote wih nested media single
		checkParse(
			'blockquote wih nested media single',
			defaultSchema,
			[
				'<blockquote><p class="mediaSingle"><span class="image-wrap"><a><jira-attachment-thumbnail><img alt="foo.png" src="HOST/file/42/image?token=TOKEN&client=CLIENT_ID&collection=MediaServicesSample&width=200&height=200&mode=fit" data-attachment-type="thumbnail" data-attachment-name="foo.png" data-width="200" data-height="200" data-media-services-type="file" data-media-services-id="42" data-media-services-collection="MediaServicesSample"></jira-attachment-thumbnail></a></span></p></blockquote>',
			],
			doc(
				blockquote(
					mediaSingle({ layout: 'center' })(
						media({
							id: '42',
							type: 'file',
							collection: 'MediaServicesSample',
							width: 200,
							height: 200,
							__fileName: 'foo.png',
							__displayType: 'thumbnail',
						})(),
					),
				),
			),
		);
		checkParseEncodeRoundTrips(
			'blockquote wih nested media single - round trip',
			defaultSchema,
			'<blockquote><p class="mediaSingle"><span class="image-wrap"><a><jira-attachment-thumbnail><img alt="foo.png" src="HOST/file/42/image?token=TOKEN&client=CLIENT_ID&collection=&width=200&height=200&mode=fit" data-attachment-type="thumbnail" data-attachment-name="foo.png" data-width="200" data-height="200" data-media-services-type="file" data-media-services-id="42"></jira-attachment-thumbnail></a></span></p></blockquote>',
			doc(
				blockquote(
					mediaSingle({ layout: 'center' })(
						media({
							id: '42',
							type: 'file',
							collection: '',
							width: 200,
							height: 200,
							__fileName: 'foo.png',
							__displayType: 'thumbnail',
						})(),
					),
				),
			),
			{},
			{
				viewContext: {
					baseUrl: 'HOST',
					clientId: 'CLIENT_ID',
					token: 'TOKEN',
					collection: '',
				},
			},
		);

		// Blockquote wih nested media group
		checkParse(
			'blockquote wih nested media group',
			defaultSchema,
			[
				'<blockquote><p class="mediaGroup"><span class="image-wrap"><a><jira-attachment-thumbnail><img alt="foo.png" src="HOST/file/42/image?token=TOKEN&client=CLIENT_ID&collection=&width=200&height=200&mode=fit" data-attachment-type="thumbnail" data-attachment-name="foo.png" data-media-services-type="file" data-media-services-id="42"></jira-attachment-thumbnail></a></span></p></blockquote>',
			],
			doc(
				blockquote(
					mediaGroup(
						media({
							id: '42',
							type: 'file',
							collection: '',
							__fileName: 'foo.png',
							__displayType: 'thumbnail',
						})(),
					),
				),
			),
		);
		checkParseEncodeRoundTrips(
			'blockquote wih nested media group - round trip',
			defaultSchema,
			'<blockquote><p class="mediaGroup"><span class="nobr"><a data-attachment-type="file" data-attachment-name="foo.pdf" data-media-services-type="file" data-media-services-id="42">foo.pdf</a></span></p></blockquote>',
			doc(
				blockquote(
					mediaGroup(
						media({
							id: '42',
							type: 'file',
							collection: '',
							__fileName: 'foo.pdf',
							__displayType: 'file',
						})(),
					),
				),
			),
		);
	});
});
