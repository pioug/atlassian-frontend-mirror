/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

import WikiMarkupTransformer from '../../..';
import type { Context } from '../../../interfaces';

describe('WikiMarkup => ADF Formatters - citation', () => {
	test('[CS-491] should detect mention in the following pattern', () => {
		const wiki = 'Hi [~qm:78032763-2feb-4f5b-88c0-99b50613d53a],';

		const context: Context = {
			conversion: {
				mentionConversion: {
					'qm:78032763-2feb-4f5b-88c0-99b50613d53a': '78032763-2feb-4f5b-88c0-99b50613d53a',
				},
			},
		};
		const transformer = new WikiMarkupTransformer();
		expect(transformer.parse(wiki, context)).toMatchSnapshot();
	});

	test('should convert mention with context case-insensitively', () => {
		const wiki = 'Hi [~aCCouNtid:AAAAAA],';

		const context: Context = {
			conversion: {
				mentionConversion: {
					'accOunTid:aaaaaa': 'aAaAaA',
				},
			},
		};
		const transformer = new WikiMarkupTransformer();
		expect(transformer.parse(wiki, context)).toMatchSnapshot();
	});

	test('Should convert mention without context', () => {
		const wiki = 'Hi [~accountid:78032763-2feb-4f5b-88c0-99b50613d53a],';

		const transformer = new WikiMarkupTransformer();
		expect(transformer.parse(wiki)).toMatchSnapshot();
	});

	test('[CS-1896] Should convert empty mention to plaintext', () => {
		const wiki = 'Hi [~accountid:], your text is so plain, almost as plain as [~]';

		const transformer = new WikiMarkupTransformer();
		expect(transformer.parse(wiki)).toMatchSnapshot();
	});
});
