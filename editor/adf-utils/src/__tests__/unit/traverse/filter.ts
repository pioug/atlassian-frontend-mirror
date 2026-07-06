/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

import { filter } from '../../../traverse/filter';
import emojisDoc from './__fixtures__/multiple-emojis.json';
import marksDoc from './__fixtures__/marks.json';

describe('Traverse#filter', () => {
	it('should return all matched elements', () => {
		expect(filter(emojisDoc, (node) => node.type === 'emoji')).toMatchSnapshot();
	});

	it('should return all matched elements that are satisfying predicate', () => {
		expect(
			filter(emojisDoc, (node) => node.type === 'emoji' && node.attrs!.text.startsWith(':')),
		).toMatchSnapshot();
	});

	it('should return all nodes with links', () => {
		expect(
			filter(marksDoc, (node) => (node.marks || []).some((m) => m.type === 'link')),
		).toMatchSnapshot();
	});
});
