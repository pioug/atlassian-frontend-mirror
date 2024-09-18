import React from 'react';
import { shallow, mount } from 'enzyme';
import WarningIcon from '@atlaskit/icon/core/migration/warning--editor-warning';
import { UnhandledErrorCard } from '..';

describe('<UnhandledErrorCard />', () => {
	it('should render icon with the right size', () => {
		const component = shallow(
			<UnhandledErrorCard dimensions={{ width: '50px', height: '50px' }} />,
		);

		expect(component.find(WarningIcon).props().LEGACY_size).toBe('medium');
	});

	it('should fire onClick event when clicked', () => {
		const spy = jest.fn();
		const component = mount(
			<UnhandledErrorCard onClick={spy} dimensions={{ width: '50px', height: '50px' }} />,
		);
		component.find('div').simulate('click');
		expect(spy).toBeCalledTimes(1);
	});

	it('should render correct dimension when dimension is in string', () => {
		const component = mount(<UnhandledErrorCard dimensions={{ width: '50px', height: '50px' }} />);
		const styles = getComputedStyle(component.getDOMNode());

		expect(styles.getPropertyValue('width')).toBe('50px');
		expect(styles.getPropertyValue('height')).toBe('50px');
	});

	it('should render correct dimension when dimension is in string without px', () => {
		const component = mount(<UnhandledErrorCard dimensions={{ width: '50', height: '50' }} />);

		const styles = getComputedStyle(component.getDOMNode());

		expect(styles.getPropertyValue('width')).toBe('50px');
		expect(styles.getPropertyValue('height')).toBe('50px');
	});

	it('should render correct dimension when dimension is in number', () => {
		const component = mount(<UnhandledErrorCard dimensions={{ width: 100, height: 100 }} />);
		const styles = getComputedStyle(component.getDOMNode());

		expect(styles.getPropertyValue('width')).toBe('100px');
		expect(styles.getPropertyValue('height')).toBe('100px');
	});

	it('should render default dimension when dimension does not contain a valid number', () => {
		const component = mount(<UnhandledErrorCard dimensions={{ width: 'abcd', height: 'efg' }} />);
		const styles = getComputedStyle(component.getDOMNode());

		expect(styles.getPropertyValue('width')).toBe('156px');
		expect(styles.getPropertyValue('height')).toBe('125px');
	});

	it('should show text when width is larger than 240px', () => {
		const component = mount(<UnhandledErrorCard dimensions={{ width: 500, height: 300 }} />);
		const text = component.find('p');
		const styles = getComputedStyle(text.getDOMNode());

		expect(styles.getPropertyValue('display')).toBe('block');
	});

	it('should hide text when width is smaller than 240px', () => {
		const component = mount(<UnhandledErrorCard dimensions={{ width: 200, height: 300 }} />);
		const text = component.find('p');
		const styles = getComputedStyle(text.getDOMNode());

		expect(styles.getPropertyValue('display')).toBe('none');
	});

	it('should hide text when height is smaller than 90px', () => {
		const component = mount(<UnhandledErrorCard dimensions={{ width: 400, height: 80 }} />);
		const text = component.find('p');
		const styles = getComputedStyle(text.getDOMNode());

		expect(styles.getPropertyValue('display')).toBe('none');
	});

	it('should hide text when width is in percentage', () => {
		const component = mount(<UnhandledErrorCard dimensions={{ width: '100%', height: 300 }} />);
		const text = component.find('p');
		const styles = getComputedStyle(text.getDOMNode());

		expect(styles.getPropertyValue('display')).toBe('none');
	});

	it('should hide text when height is in percentage', () => {
		const component = mount(<UnhandledErrorCard dimensions={{ width: 300, height: '100%' }} />);
		const text = component.find('p');
		const styles = getComputedStyle(text.getDOMNode());

		expect(styles.getPropertyValue('display')).toBe('none');
	});
});
