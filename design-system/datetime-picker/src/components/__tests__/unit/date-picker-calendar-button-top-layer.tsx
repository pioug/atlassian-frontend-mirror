import React, { useState } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import DatePicker from '../../date-picker';

function DatePickerWithOpenState({
	onOpenChange,
	isInitiallyOpen = false,
}: {
	onOpenChange: (isOpen: boolean) => void;
	isInitiallyOpen?: boolean;
}): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(isInitiallyOpen);
	return (
		<DatePicker
			label="Date"
			shouldShowCalendarButton
			openCalendarLabel="open calendar"
			isOpen={isOpen}
			selectProps={{
				onMenuOpen: () => {
					setIsOpen(true);
					onOpenChange(true);
				},
				onMenuClose: () => {
					setIsOpen(false);
					onOpenChange(false);
				},
			}}
		/>
	);
}

describe('DatePicker calendar button with the top layer', () => {
	beforeEach(() => {
		passGate('platform-dst-top-layer');
	});

	it('calls onMenuOpen and onMenuClose outside a state update', async () => {
		const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
		const onOpenChange = jest.fn();
		const { container } = render(<DatePickerWithOpenState onOpenChange={onOpenChange} />);
		const calendarButton = screen.getByRole('button', { name: /open calendar/ });

		await userEvent.click(calendarButton);
		await userEvent.click(calendarButton);

		expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
		const updateWhileRenderingErrors = consoleError.mock.calls.filter((call) =>
			String(call[0]).includes('Cannot update a component'),
		);
		expect(updateWhileRenderingErrors).toHaveLength(0);
		consoleError.mockRestore();
		await expect(container).toBeAccessible();
	});

	it('closes a controlled calendar that opened from its isOpen prop on the first press', async () => {
		const onOpenChange = jest.fn();
		render(<DatePickerWithOpenState onOpenChange={onOpenChange} isInitiallyOpen />);
		const calendarButton = screen.getByRole('button', { name: /open calendar/ });

		await userEvent.click(calendarButton);

		expect(onOpenChange.mock.calls).toEqual([[false]]);
	});
});
