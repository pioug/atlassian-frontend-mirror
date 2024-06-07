import React from 'react';
import { mount } from 'enzyme';
import DecisionItem from '../../../components/DecisionItem';

describe('<DecisionItem/>', () => {
	it('should render children', () => {
		const component = mount(
			<DecisionItem>
				Hello <b>world</b>
			</DecisionItem>,
		);

		expect(component.find('b').length).toBe(1);
		expect(component.find('div[data-component="content"]').text()).toBe('Hello world');
	});

	it('should render callback with ref', () => {
		let contentRef: HTMLElement | null = null;
		const handleContentRef = (ref: HTMLElement | null) => (contentRef = ref);
		const component = mount(
			<DecisionItem contentRef={handleContentRef}>
				Hello <b>world</b>
			</DecisionItem>,
		);
		expect(component.find('b').length).toBe(1);
		expect(contentRef).not.toBe(null);
		expect(contentRef!.textContent).toBe('Hello world');
	});

	describe('showPlaceholder', () => {
		it('shoud render placeholder if decision is empty', () => {
			const component = mount(<DecisionItem showPlaceholder={true} placeholder="cheese" />);
			expect(component.find('span[data-component="placeholder"]').length).toEqual(1);
		});

		it('should not render placeholder if decision is not empty', () => {
			const component = mount(
				<DecisionItem showPlaceholder={true} placeholder="cheese">
					Hello <b>world</b>
				</DecisionItem>,
			);
			expect(component.find('span[data-component="placeholder"]').length).toEqual(0);
		});
	});
});
