/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

import WikiMarkupTransformer from '../../../index';

describe('JIRA wiki markup - blockquote', () => {
	const testCases: Array<[string, string]> = [
		['[CS-607] should not need a whitespace', 'bq.this is a blockquote node'],
		['Blockquote', '{quote}This is a great quote!{quote}'],
		['Blockquote with nested codeblock', "bq.{code:javascript}pls don't put code in quotes{code}"],
		[
			'Blockquote macro with nested codeblock',
			"{quote}{code:javascript}pls don't put code in quotes{code}{quote}",
		],
		['Blockquote with nested mediaSingle', 'bq.!abc-1|width=200,height=183,alt="Hello world"!'],
		[
			'Blockquote macro with nested mediaSingle',
			'{quote}!abc-1|width=200,height=183,alt="Hello world"!{quote}',
		],
		['Blockquote with nested mediaGroup', 'bq.[^file1.txt] [^file2.txt]{quote}'],
		['Blockquote macro with nested mediaGroup', '{quote}[^file1.txt] [^file2.txt]{quote}'],
	];

	for (const [testCaseDescription, markup] of testCases) {
		it(testCaseDescription, () => {
			const transformer = new WikiMarkupTransformer();
			expect(transformer.parse(markup)).toMatchSnapshot();
		});
	}
});
