import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { FilterPopupSelect, type FilterPopupSelectProps } from '../index';

const defaultProps: FilterPopupSelectProps = {
	buttonLabel: 'Filter',
	filterName: 'test-filter',
	isDisabled: false,
	menuListProps: {
		filterName: 'test-filter',
		isLoading: false,
	},
	onInputChange: jest.fn(),
	onSelectionChange: jest.fn(),
	options: [
		{ label: 'Option 1', value: 'option1', optionType: 'iconLabel', icon: '' },
		{ label: 'Option 2', value: 'option2', optionType: 'iconLabel', icon: '' },
	],
	searchPlaceholder: 'Search...',
	selectedOptions: [],
	shouldShowFooter: false,
	showHydrating: false,
	showLoading: false,
	status: 'resolved',
};

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

const renderFilterPopupSelect = (props: Partial<FilterPopupSelectProps> = {}) => {
	return render(
		<IntlProvider locale="en">
			<FilterPopupSelect {...defaultProps} {...props} />
		</IntlProvider>,
	);
};

describe('FilterPopupSelect', () => {
	ffTest.on(
		'platform_navx_sllv_dropdown_escape_and_focus_fix',
		'shouldPreventEscapePropagation when feature flag is on',
		() => {
			it('should pass shouldPreventEscapePropagation as true to PopupSelect', async () => {
				const user = userEvent.setup();

				renderFilterPopupSelect();

				// Open the popup
				const trigger = screen.getByTestId('test-filter-trigger--button');
				await user.click(trigger);

				// Verify the popup is open
				expect(screen.getByTestId('test-filter-popup-select--menu')).toBeInTheDocument();

				// Dispatch Escape key event
				const escapeKeyDownEvent = new KeyboardEvent('keydown', {
					key: 'Escape',
					bubbles: true,
				});

				const stopPropagationSpy = jest.spyOn(escapeKeyDownEvent, 'stopPropagation');

				window.dispatchEvent(escapeKeyDownEvent);

				expect(stopPropagationSpy).toHaveBeenCalled();
			});
		},
	);

	ffTest.off(
		'platform_navx_sllv_dropdown_escape_and_focus_fix',
		'shouldPreventEscapePropagation when feature flag is off',
		() => {
			it('should pass shouldPreventEscapePropagation as false to PopupSelect', async () => {
				const user = userEvent.setup();

				renderFilterPopupSelect();

				// Open the popup
				const trigger = screen.getByTestId('test-filter-trigger--button');
				await user.click(trigger);

				// Verify the popup is open
				expect(screen.getByTestId('test-filter-popup-select--menu')).toBeInTheDocument();

				// Dispatch Escape key event
				const escapeKeyDownEvent = new KeyboardEvent('keydown', {
					key: 'Escape',
					bubbles: true,
				});

				const stopPropagationSpy = jest.spyOn(escapeKeyDownEvent, 'stopPropagation');

				window.dispatchEvent(escapeKeyDownEvent);

				expect(stopPropagationSpy).not.toHaveBeenCalled();
			});
		},
	);
});
