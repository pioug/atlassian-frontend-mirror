import React from 'react';
import { shallow } from 'enzyme';

import Presence from '../../Presence';

const PRESENCE_TYPES = ['busy', 'focus', 'offline', 'online'];

describe('Avatar, Presence', () => {
  it('should render children if provided', () => {
    const wrapper = shallow(
      <Presence presence={PRESENCE_TYPES[0]}>
        <span className="child" />
      </Presence>,
    );
    expect(wrapper.find(Presence).length).toBe(0);
    expect(wrapper.find('span').length).toBe(1);
    expect(wrapper.find('span').hasClass('child')).toBe(true);
  });
});
