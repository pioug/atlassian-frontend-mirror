import React from 'react';
import { shallow } from 'enzyme';
import { playButtonClassName, bkgClassName } from '../styles';
import { PlayButtonWrapper } from '../playButtonWrapper';
import { PlayButtonBackground } from '../playButtonBackground';

describe('Styled PlayButton', () => {
  it('should render Wrapper properly with a className', () => {
    const wrapper = shallow(<PlayButtonWrapper />);
    expect(wrapper.hasClass(playButtonClassName)).toBe(true);
  });

  it('should render background properly with a className', () => {
    const wrapper = shallow(<PlayButtonBackground />);
    expect(wrapper.hasClass(bkgClassName)).toBe(true);
  });
});
