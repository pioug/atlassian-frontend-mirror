/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

import { map } from '../../../traverse/map';
import mentionsDoc from './__fixtures__/mentions.json';

describe('Traverse#map', () => {
	it('should return an array of all nodes', () => {
		expect(map(mentionsDoc, (node) => node)).toMatchSnapshot();
	});

	it('should return an array of results of a callback applied to every node', () => {
		expect(
			map(mentionsDoc, (node) => node.type === 'mention' && node.attrs!.text).filter(
				(name) => !!name,
			),
		).toEqual(['@Oscar Wallhult', '@mention', '@unknown', '@here', '@all']);
	});

	it('should be called with every node in a document if type is not specified', () => {
		expect(map(mentionsDoc, (node) => node.type)).toEqual([
			'doc',
			'paragraph',
			'text',
			'mention',
			'text',
			'paragraph',
			'text',
			'mention',
			'text',
			'mention',
			'paragraph',
			'text',
			'mention',
			'text',
			'mention',
		]);
	});
});
