/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

import { shallow } from 'enzyme';
import React from 'react';
import { type MentionDescription } from '../../../../types';
import MentionDescriptionByline from '../../../../components/MentionDescriptionByline';
import { userMention, teamMention } from './_commonData';

const shallowRender = (mention: MentionDescription) =>
	shallow(<MentionDescriptionByline mention={mention} />);

describe('Mention Description Byline', () => {
	it('should render User Mention description if a user is provided', () => {
		const component = shallowRender(userMention);
		expect(component).toMatchSnapshot();
	});

	it('should render Team Mention description if a team is provided', () => {
		const component = shallowRender(teamMention);
		expect(component).toMatchSnapshot();
	});
});
