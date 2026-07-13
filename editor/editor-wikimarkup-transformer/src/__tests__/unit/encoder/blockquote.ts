/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import WikiMarkupTransformer from '../../../index';

import {
	blockquote,
	doc,
	code_block,
	mediaSingle,
	mediaGroup,
	media,
	caption,
} from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup - BlockQuote', () => {
	const transformer = new WikiMarkupTransformer();

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
