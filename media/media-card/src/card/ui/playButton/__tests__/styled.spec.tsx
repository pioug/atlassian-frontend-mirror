import React from 'react';
import { mount } from 'enzyme';
import { playButtonClassName, bkgClassName } from '../styles';
import { PlayButtonWrapper } from '../playButtonWrapper';
import { PlayButtonBackground } from '../playButtonBackground';

describe('Styled PlayButton', () => {
	it('should render Wrapper properly with a className', () => {
		const wrapper = mount(<PlayButtonWrapper />);
		expect(wrapper.find(`div.${playButtonClassName}`)).toHaveLength(1);
	});

	it('should render background properly with a className', () => {
		const wrapper = mount(<PlayButtonBackground />);
		expect(wrapper.find(`div.${bkgClassName}`)).toHaveLength(1);
	});
});
