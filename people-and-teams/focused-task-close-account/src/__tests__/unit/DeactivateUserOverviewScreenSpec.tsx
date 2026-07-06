/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

import React from 'react';
import { shallow } from 'enzyme';
import { DeactivateUserOverviewScreen } from '../../components/DeactivateUserOverviewScreen';
import { catherineHirons } from '../../mocks/users';
import accessibleSites from '../../mocks/accessibleSites';
import { type DeactivateUserOverviewScreenProps } from '../../components/DeactivateUserOverviewScreen/types';

const defaultProps: Partial<DeactivateUserOverviewScreenProps> = {
	accessibleSites,
	isCurrentUser: false,
	user: catherineHirons,
};

const render = (props = {}) =>
	shallow(<DeactivateUserOverviewScreen {...defaultProps} {...props} />);

test('DeactivateUserOverviewScreen', () => {
	expect(render()).toMatchSnapshot();
});

describe('accessibleSites display', () => {
	test('text displayed is different when no accessibleSites prop is passed', () => {
		expect(
			render({
				accessibleSites: [],
			}),
		).toMatchSnapshot();
	});

	test('text displayed is different when no accessibleSites prop is passed for current user', () => {
		expect(
			render({
				accessibleSites: [],
				isCurrentUser: true,
			}),
		).toMatchSnapshot();
	});
});
