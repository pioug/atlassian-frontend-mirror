import React from 'react';

import { shallow } from 'enzyme';

import { Description, Header } from '../../common';
import Thankyou from '../../Thankyou';

describe('Thankyou page', () => {
  const defaultProps = {
    messages: {
      title: 'a',
      description: 'b',
    },
    canClose: true,
    canOptOut: true,
    onClose: jest.fn(),
    onOptOut: jest.fn(),
  };

  it('should render a header', () => {
    const wrapper = shallow(<Thankyou {...defaultProps} />);
    expect(wrapper.find(Header).exists()).toBe(true);
  });

  it('should render a description', () => {
    const props = defaultProps;
    const wrapper = shallow(<Thankyou {...props} />);
    const desc = wrapper.find(Description);
    expect(desc.exists()).toBe(true);
    expect(desc.children().first().text()).toEqual(props.messages.description);
  });
});
