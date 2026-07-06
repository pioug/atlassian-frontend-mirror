/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import WikiMarkupTransformer from '../../../index';

import { doc, emoji, p } from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup - Emoji', () => {
	const transformer = new WikiMarkupTransformer();

	test('should convert emoji node', () => {
		const node = doc(p('Hello ', emoji({ id: '1f603', shortName: ':smiley:', text: '😃' })()))(
			defaultSchema,
		);
		expect(transformer.encode(node)).toMatchSnapshot();
	});

	test('should convert custom emoji node', () => {
		const node = doc(
			p('Hello ', emoji({ id: '1234567890', shortName: ':partying_face:', text: '😃' })()),
		)(defaultSchema);
		expect(transformer.encode(node)).toMatchSnapshot();
	});
});
