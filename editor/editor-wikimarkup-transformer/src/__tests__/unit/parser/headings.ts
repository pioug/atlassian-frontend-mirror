/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

import WikiMarkupTransformer from '../../../index';

describe('JIRA wiki markup - headings', () => {
	const testCases: Array<[string, string]> = [
		[
			'should convert string with heading in it',
			`
This is a string.
h1. Boom! this is a heading with *bold* text in it
      `,
		],
		['should allow heading inside panel', '{panel}h1. heading{panel}'],
		['should treat h7 as usual text inside macro', '{panel}h7. heading{panel}'],
		[
			'[CS-310] should ignore heading text when fails to create a heading',
			'h1. {panel}nothing{panel}',
		],
		['[CS-572] should not need a whitespace', 'h1.this is a heading node'],
	];

	for (const [testCaseDescription, markup] of testCases) {
		it(testCaseDescription, () => {
			const transformer = new WikiMarkupTransformer();
			expect(transformer.parse(markup)).toMatchSnapshot();
		});
	}
});
