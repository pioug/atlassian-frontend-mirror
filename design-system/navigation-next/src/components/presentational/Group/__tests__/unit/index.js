import React from 'react';

import { mount } from 'enzyme';

import Group from '../../index';

describe('Group', () => {
  it('should not render content if children is not valid', () => {
    const props = { children: undefined, hasSeparator: false, heading: null };
    const wrapper = mount(<Group {...props} />);
    expect(wrapper.html()).toEqual(null);
  });

  it('should render group heading if heading is passed', () => {
    const props = {
      children: <span>children</span>,
      hasSeparator: true,
      heading: 'Heading',
    };
    const wrapper = mount(<Group {...props} />);
    expect(wrapper.find('GroupHeading').text()).toEqual('Heading');
  });

  it('should NOT render group heading if heading is not valid', () => {
    const props = {
      children: <span>children</span>,
      hasSeparator: true,
      heading: null,
    };
    const wrapper = mount(<Group {...props} />);
    expect(wrapper.find('GroupHeading').length).toEqual(0);
  });

  it('should add group separator if hasSeparator prop is true', () => {
    const props = {
      children: <span>children</span>,
      hasSeparator: true,
      heading: 'Heading',
    };
    const wrapper = mount(<Group {...props} />);
    expect(wrapper.find('Separator').length).toEqual(1);
  });

  it('should NOT add group separator if hasSeparator prop is true', () => {
    const props = {
      children: <span>children</span>,
      hasSeparator: false,
      heading: 'Heading',
    };
    const wrapper = mount(<Group {...props} />);
    expect(wrapper.find('Separator').length).toEqual(0);
  });
});
