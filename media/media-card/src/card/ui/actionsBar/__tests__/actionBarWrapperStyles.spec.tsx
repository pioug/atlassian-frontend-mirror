import React from 'react';
import { mount } from 'enzyme';

import { ActionsBarWrapper } from '../actionsBarWrapper';

describe('Actions Bar Styles', () => {
	const actionsBarWrapperId = 'div#actionsBarWrapper';
	it('Opacity should be 0 if Action Bar is not fixed', () => {
		const component = mount(<ActionsBarWrapper />);

		const wrapper = component.find(actionsBarWrapperId);
		const styles = getComputedStyle(wrapper.getDOMNode());

		expect(styles.getPropertyValue('opacity')).toBe('0');
	});

	it('Opactiy should be 1 if Action Bar is fixed', () => {
		const component = mount(<ActionsBarWrapper isFixed={true} />);

		const wrapper = component.find(actionsBarWrapperId);
		const styles = getComputedStyle(wrapper.getDOMNode());

		expect(styles.getPropertyValue('opacity')).toBe('1');
	});
});
