import React from 'react';

import { render } from '@testing-library/react';

import { ModeSwitcher, type ModeSwitcherProps } from './index';

describe('ModeSwitcher', () => {
	const setup = (propsOverride: Partial<ModeSwitcherProps> = {}) => {
		const mockOnModeChange = jest.fn();
		const component = render(
			<ModeSwitcher
				options={[
					{ label: 'Basic', value: 'basic' },
					{ label: 'JQL', value: 'jql' },
					{ label: 'Something', value: 'smth' },
				]}
				onOptionValueChange={mockOnModeChange}
				{...propsOverride}
			/>,
		);

		return { ...component, mockOnModeChange };
	};

	it('should render all options', () => {
		const { getByTestId } = setup();
		expect(getByTestId('mode-toggle-basic').textContent).toBe('Basic');
		expect(getByTestId('mode-toggle-jql').textContent).toBe('JQL');
		expect(getByTestId('mode-toggle-smth').textContent).toBe('Something');
	});

	it('renders with the first mode checked', () => {
		const { getByTestId } = setup();

		expect(getByTestId('mode-toggle-basic').querySelector('input')).toBeChecked();
	});

	it('should render initially selected mode', () => {
		const { getByTestId } = setup({ selectedOptionValue: 'jql' });

		expect(getByTestId('mode-toggle-jql').querySelector('input')).toBeChecked();
	});

	it('calls the mode change handler with the targeted mode', () => {
		const { getByTestId, mockOnModeChange } = setup();

		getByTestId('mode-toggle-smth').click();

		expect(mockOnModeChange).toHaveBeenCalledWith('smth');
	});

	it('disables the input as expected', () => {
		const { getByTestId, mockOnModeChange } = setup({ isDisabled: true });

		const jqlInput = getByTestId('mode-toggle-jql');
		jqlInput.click();

		expect(jqlInput.querySelector('input')).toBeDisabled();
		expect(mockOnModeChange).not.toHaveBeenCalled();
	});

	it('should not fail when options are not provided', () => {
		const { queryByTestId } = setup({ options: [] });
		expect(queryByTestId('mode-toggle-container')).not.toBeInTheDocument();
	});
});
