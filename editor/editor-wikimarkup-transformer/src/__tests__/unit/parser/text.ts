/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

import WikiMarkupTransformer from '../../../index';

describe('JIRA wiki markup - Text', () => {
	const testCases: Array<[string, string]> = [
		['should render empty paragraph if no content', ''],
		['should render simple text as a paragraph', 'foo bar'],
		[
			'should ignore leading spaces on each line',
			`      foo
             bar`,
		],
		['should treat ignored keyword as plantext', '{ foobar'],
		["should treat \\ as a charater if it's not applied with any keyword", '\\foobar'],
		['should respect \\\\ as a line break', 'foo \\\\ bar'],
		['should respect \\ as a line break', 'foo \\\\ bar'],
		[
			'should replace four dashes with a ruler + ignore four dashes in a line of text',
			`This is a text with ---- in it
----
This is a text`,
		],
		['leading triple dashes is not list', `--- This is not a list`],
		['leading double dashes is not list', `-- This is not a list`],
		[
			'multiple - should be rendered as plain text',
			'------------- ---------------- ------------------',
		],
		['[EX-500] should handle escape correctly', '\\* \\m'],
		['[ADFS-725] should strip null chars', 'Hello \0 World!'],
		[
			'[ESS-2539] shoudld create new paragraph after two consecutive new lines',
			'line 1 \r\n\r\n line 2',
		],
		[
			'[ESS-2539] shoudld keep text after multiple force line breaks in same paragraph',
			'line1\\\\\r\n\\\\\r\n\\\\line2',
		],
	];

	for (const [testCaseDescription, markup] of testCases) {
		it(testCaseDescription, () => {
			const transformer = new WikiMarkupTransformer();
			expect(transformer.parse(markup)).toMatchSnapshot();
		});
	}
});
