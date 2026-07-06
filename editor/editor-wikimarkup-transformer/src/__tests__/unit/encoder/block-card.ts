/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import WikiMarkupTransformer from '../../../index';

import { doc, blockCard } from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup - BlockCard', () => {
	const transformer = new WikiMarkupTransformer();

	test('should convert blockcard node', () => {
		const node = doc(blockCard({ url: 'https://www.dropbox.com' })())(defaultSchema);
		expect(transformer.encode(node)).toMatchSnapshot();
	});
});
