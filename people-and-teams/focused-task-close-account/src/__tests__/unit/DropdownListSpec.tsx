/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

import React from 'react';
import { shallow } from 'enzyme';
import { DropdownList } from '../../components/DropdownList';
import Button from '@atlaskit/button';

const accessibleSites = ['hello.atlassian.net', 'acme.atlassian.net', 'test.atlassian.net'];

const defaultProps = {
	accessibleSites,
};

const render = (props = {}) => shallow(<DropdownList {...defaultProps} {...props} />);

describe('Dropdown list button', () => {
	test('renders sites list', () => {
		const wrapper = render();
		expect(wrapper).toMatchSnapshot();
	});

	test('renders sites list with expand button for more than 3 sites', () => {
		const sites = [
			'hello.atlassian.net',
			'acme.atlassian.net',
			'test.atlassian.net',
			'bitflix.atlassian.net',
		];
		expect(
			render({
				accessibleSites: sites,
			}),
		).toMatchSnapshot();
	});

	test('renders sites list with collapse button for more than 3 sites after been expanded', () => {
		const sites = [
			'hello.atlassian.net',
			'acme.atlassian.net',
			'test.atlassian.net',
			'bitflix.atlassian.net',
		];
		const wrapper = render({
			accessibleSites: sites,
		});
		const expandButton = wrapper.find(Button);
		expandButton.simulate('click');
		wrapper.update();

		expect(wrapper).toMatchSnapshot();
	});

	test('renders sites list with expand button for more than 3 sites after been collapsed', () => {
		const sites = [
			'hello.atlassian.net',
			'acme.atlassian.net',
			'test.atlassian.net',
			'bitflix.atlassian.net',
		];
		const wrapper = render({
			accessibleSites: sites,
		});
		const expandButton = wrapper.find(Button);
		expandButton.simulate('click');
		wrapper.update();

		const collapseButton = wrapper.find(Button);
		collapseButton.simulate('click');
		wrapper.update();

		expect(wrapper).toMatchSnapshot();
	});
});
