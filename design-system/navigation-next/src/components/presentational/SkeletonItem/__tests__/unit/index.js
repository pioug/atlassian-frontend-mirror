import React from 'react';

import { mount } from 'enzyme';

import SkeletonItem from '../../index';

describe('SkeletonItem', () => {
  it('should render the skeleton based on the using `container` as default theme context', () => {
    const wrapper = mount(<SkeletonItem />);

    expect(wrapper.find('SkeletonItem').props().theme.context).toBe(
      'container',
    );
  });

  it('should toggle before styles based on `hasBefore` prop', () => {
    const wrapper = mount(<SkeletonItem hasBefore />);

    expect(wrapper.find('div').length).toBe(3);

    wrapper.setProps({ hasBefore: false });

    expect(wrapper.find('div').length).toBe(2);
  });
});
