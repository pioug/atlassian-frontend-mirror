/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import WikiMarkupTransformer from '../../../index';

import { doc, decisionList, decisionItem } from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup - Decision', () => {
	const transformer = new WikiMarkupTransformer();

	test('should convert decision list into bullet list', () => {
		const node = doc(
			decisionList({ localId: '16e05a75-f66c-4f26-bd52-7e6cb7b49464' })(
				decisionItem({
					localId: '0e87110e-aa58-411a-964b-883942b118cc',
					state: 'DECIDED',
				})('this is an decision'),
				decisionItem({
					localId: '0e87110e-aa58-411a-964b-883942b118cc',
					state: 'DECIDED',
				})('this is an another decision'),
			),
		)(defaultSchema);
		expect(transformer.encode(node)).toMatchSnapshot();
	});
});
