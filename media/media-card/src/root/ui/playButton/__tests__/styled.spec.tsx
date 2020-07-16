import React from 'react';
import { shallow } from 'enzyme';
import { Wrapper, playButtonClassName } from '../styled';

describe('Styled PlayButton', () => {
  it('should render Wrapper properly with a className', () => {
    const wrapper = shallow(<Wrapper />);
    expect(wrapper.hasClass(playButtonClassName)).toBe(true);
  });
});
