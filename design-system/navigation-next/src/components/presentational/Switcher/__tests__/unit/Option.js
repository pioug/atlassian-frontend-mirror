import React from 'react';

import { mount, shallow } from 'enzyme';

import Avatar from '@atlaskit/avatar';
import { components } from '@atlaskit/select';

import Option from '../../Option';

describe('Option', () => {
  let baseProps;

  beforeEach(() => {
    baseProps = {
      innerRef: React.createRef(),
      data: {
        text: 'hello world',
      },
      innerProps: {
        'aria-selected': false,
        innerRef: React.createRef(),
        id: 'id',
        onClick: () => {},
        onMouseMove: () => {},
        onMouseOver: () => {},
        role: 'role',
        tabIndex: 0,
      },
      isFocused: false,
      isSelected: false,
      getStyles: () => {},
      theme: {},
      cx: () => {},
    };
  });

  it('should render correctly', () => {
    const data = {
      text: 'text',
      subText: 'subText',
      avatar: '/url-to-avatar',
    };
    expect(shallow(<Option {...baseProps} data={data} />)).toMatchSnapshot();
  });

  it('should pass expected props to wrapper div', () => {
    const wrapper = mount(<Option {...baseProps} />);
    delete baseProps.innerProps.innerRef;
    expect(wrapper.childAt(0)).toHaveProperty('ref');
    expect(wrapper.childAt(0).props()).toEqual(
      expect.objectContaining(baseProps.innerProps),
    );
  });

  it('should render <components.Option />', () => {
    const wrapper = mount(<Option {...baseProps} />);
    expect(wrapper.find(components.Option)).toHaveLength(1);
    expect(wrapper.find(components.Option).props()).toEqual(
      expect.objectContaining(wrapper.props()),
    );
  });

  it('should render <Avatar /> if avatar prop is present', () => {
    const data = {
      text: 'hello world',
      avatar: '/url-to-avatar',
    };
    const wrapper = mount(<Option {...baseProps} data={data} />);
    expect(wrapper.find(Avatar)).toHaveLength(1);
    expect(wrapper.find(Avatar).props()).toEqual({
      borderColor: 'transparent',
      src: '/url-to-avatar',
      appearance: 'square',
    });
  });

  it('should always render text prop', () => {
    const data = { text: 'atlassian' };
    const wrapper = mount(<Option {...baseProps} data={data} />);
    expect(wrapper.text()).toEqual('atlassian');
  });

  it('should render subText prop if present', () => {
    const data = { text: 'atlassian', subText: 'sydney' };
    const wrapper = mount(<Option {...baseProps} data={data} />);
    expect(wrapper.text()).toEqual('atlassiansydney');
  });
});
