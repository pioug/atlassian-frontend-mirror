import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { mount } from 'enzyme';

import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';

import DecisionIcon from '@atlaskit/icon/core/decision';
import { DecisionItem } from '../../../';

describe('<DecisionItem/>', () => {
	it('should render children', () => {
		const component = mount(
			<IntlProvider locale="en">
				<DecisionItem>
					Hello <b>world</b>
				</DecisionItem>
			</IntlProvider>,
		);

		expect(component.find('b').length).toBe(1);
		expect(component.find('div[data-component="content"]').text()).toBe('Hello world');
	});

	it('should render callback with ref', () => {
		let contentRef: HTMLElement | null = null;
		const handleContentRef = (ref: HTMLElement | null) => (contentRef = ref);
		const component = mount(
			<IntlProvider locale="en">
				<DecisionItem contentRef={handleContentRef}>
					Hello <b>world</b>
				</DecisionItem>
			</IntlProvider>,
		);
		expect(component.find('b').length).toBe(1);
		expect(contentRef).not.toBe(null);
		expect(contentRef!.textContent).toBe('Hello world');
	});

	describe('showPlaceholder', () => {
		it('shoud render placeholder if decision is empty', () => {
			const component = mount(
				<IntlProvider locale="en">
					<DecisionItem showPlaceholder={true} placeholder="cheese" />
				</IntlProvider>,
			);
			expect(component.find('span[data-component="placeholder"]').length).toEqual(1);
		});

		it('should not render placeholder if decision is not empty', () => {
			const component = mount(
				<IntlProvider locale="en">
					<DecisionItem showPlaceholder={true} placeholder="cheese">
						Hello <b>world</b>
					</DecisionItem>
				</IntlProvider>,
			);
			expect(component.find('span[data-component="placeholder"]').length).toEqual(0);
		});
	});

	eeTest.describe('editor_a11y_decision_aria_label', 'Image labels').variant(true, () => {
		it('should render aria-label as Undefined decision when the placeholder is showing', () => {
			const component = mount(
				<IntlProvider locale="en">
					<DecisionItem showPlaceholder={true} placeholder="cheese"></DecisionItem>
				</IntlProvider>,
			);
			expect(component.find('span[data-component="placeholder"]').length).toEqual(1);
			expect(component.find(DecisionIcon).prop('label')).toEqual('Undefined decision');
			expect(component.find(DecisionIcon).prop('label')).not.toEqual('Decision');
		});

		it('should render aria-label as Decision when the placeholder is not showing', () => {
			const component = mount(
				<IntlProvider locale="en">
					<DecisionItem showPlaceholder={true} placeholder="cheese">
						Hello <b>world</b>
					</DecisionItem>
				</IntlProvider>,
			);
			expect(component.find('span[data-component="placeholder"]').length).toEqual(0);
			expect(component.find(DecisionIcon).prop('label')).toEqual('Decision');
			expect(component.find(DecisionIcon).prop('label')).not.toEqual('Undefined decision');
		});
	});
});
