import React from 'react';
import { shallow } from 'enzyme';
import { TickBox } from '../tickBox';
import TickIcon from '@atlaskit/icon/core/check-mark';
import { TickBoxWrapper } from '../tickBoxWrapper';

describe('TickBox', () => {
	it('should render TickBox properly', () => {
		const tickBox = shallow(<TickBox selected />);
		const wrapper = tickBox.find(TickBoxWrapper);
		expect(wrapper).toHaveLength(1);
		expect(wrapper.prop('selected')).toBe(true);
		expect(tickBox.find(TickIcon)).toHaveLength(1);
	});
});
