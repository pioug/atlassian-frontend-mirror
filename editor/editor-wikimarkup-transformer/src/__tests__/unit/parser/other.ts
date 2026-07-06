/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

import WikiMarkupTransformer from '../../../index';

describe('JIRA wiki markup - Other', () => {
	const testCases: Array<[string, string]> = [
		[
			'should begin with hardBreak if it begins with a new line',
			`
foo`,
		],
		[
			'should process second empty line as a new paragraph',
			`foo


bar`,
		],
		['should be ok with empty line wiki', '\n'],
	];

	for (const [testCaseDescription, markup] of testCases) {
		it(testCaseDescription, () => {
			const transformer = new WikiMarkupTransformer();
			expect(transformer.parse(markup)).toMatchSnapshot();
		});
	}
});
