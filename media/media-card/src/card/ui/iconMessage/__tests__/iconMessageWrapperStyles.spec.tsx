import React from 'react';
import { mount } from 'enzyme';

import { IconMessageWrapper } from '../iconMessageWrapper';

describe('Icon message wrapper styles', () => {
	const iconMessageWrapperId = 'div#iconMessageWrapper';
	it('should render animations if animated is true', () => {
		const component = mount(<IconMessageWrapper animated={true} />);

		const wrapper = component.find(iconMessageWrapperId);
		const styles = getComputedStyle(wrapper.getDOMNode());

		expect(styles.getPropertyValue('animation-iteration-count')).toBe('infinite');
	});

	it('should render font-size if reducedFont is true', () => {
		const component = mount(<IconMessageWrapper reducedFont={true} />);

		const wrapper = component.find(iconMessageWrapperId);
		const styles = getComputedStyle(wrapper.getDOMNode());

		expect(styles.getPropertyValue('font-weight')).toBe('var(--ds-font-weight-medium, 500)');
	});
});
