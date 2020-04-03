import { shallow, mount } from 'enzyme';
import React from 'react';

import ProgressTrackerLink from '../..';
import { Link } from '../../styled';
import { Stage } from '../../../types';

const item: Stage = {
  id: 'visited-1',
  label: 'Visited Step',
  percentageComplete: 100,
  status: 'visited',
  href: '#',
  onClick: jest.fn(),
};

describe('ak-progress-tracker/progress-tracker-link', () => {
  it('should render the component', () => {
    const wrapper = mount(<ProgressTrackerLink item={item} />);
    expect(wrapper.length).toBeGreaterThan(0);
    const progressTrackerLink = wrapper.find(Link);
    expect(progressTrackerLink).toHaveLength(1);
    expect(progressTrackerLink.props()).toMatchObject({
      children: item.label,
      href: item.href,
      onClick: item.onClick,
    });
  });

  it('clicking visited link should trigger onClick', () => {
    const wrapper = shallow(<ProgressTrackerLink item={item} />);
    wrapper.find(Link).simulate('click');
    expect(item.onClick).toBeCalled();
  });
});
