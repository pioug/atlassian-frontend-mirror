/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

import WikiMarkupTransformer from '../../../index';

describe('JIRA wiki markup - Block Card', () => {
	const testCases: Array<[string, string]> = [
		[
			'should create Block Card between lines of text',
			`line 1 
      [http://...|http://...|smart-card]
      line 2 `,
		],
		[
			'should create Block Card for old representation between lines of text',
			`line 1 
      [http://...|http://...|block-link]
      line 2 `,
		],
		[
			'should create embedCard (it is a block node so all content should move to other lines',
			`hello [http://...|http://...|smart-embed] world!`,
		],
		['should create embedCard inside table', `|[http://...|http://...|smart-embed]|`],
		[
			'should create Block Card with nothing else in the document',
			`[http://...|http://...|smart-card]`,
		],
		[
			'should create Block Card with whitespace on the same line',
			` [http://...|http://...|smart-card] 
      [http://...|http://...|smart-card]`,
		],
		[
			'should create Block Card if preceded and followed by text', // This will result in the text being moved to another line
			`
      abc [http://...|http://...|smart-card] def
      `,
		],
		['should create Block Cards in table', `|[http://...|http://...|smart-card]|`],
		[
			'should create Block Cards in panel', // Block ends up outside of the panel in adf
			`|{panel:bgColor=#deebff}test [http://...|http://...|smart-card] test{panel}|`,
		],
		[
			'should recover existing Block Cards',
			`|{adf:display=block}
      {"type":"blockCard","attrs":{"url":"https://aolrich-automation.atlassian.net/browse/SOF-1"}}
      {adf}|{adf:display=block}
      {"type":"blockCard","attrs":{"url":"https://aolrich-automation.atlassian.net/browse/SOF-1"}}
      {adf}|
      [https://aolrich-automation.atlassian.net/browse/SOF-1|https://aolrich-automation.atlassian.net/browse/SOF-1|smart-card]`,
		],
	];

	for (const [testCaseDescription, markup] of testCases) {
		it(testCaseDescription, () => {
			const transformer = new WikiMarkupTransformer();
			expect(transformer.parse(markup)).toMatchSnapshot();
		});
	}
});
