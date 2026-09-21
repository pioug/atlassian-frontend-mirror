import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import TimePicker from '../../time-picker';

const topLayerStates = [false, true] as const;

describe.each(topLayerStates)('TimePicker public behaviour (top layer: %s)', (topLayerEnabled) => {
	beforeEach(() => {
		(topLayerEnabled ? passGate : failGate)('platform-dst-top-layer');
	});

	it('uses default and controlled values, selection, clearing, and form values', async () => {
		const user = userEvent.setup();
		const onChange = jest.fn();
		const { rerender } = render(
			<form data-testid="time-form">
				<TimePicker
					defaultValue="10:00"
					label="Appointment time"
					name="time"
					onChange={onChange}
					testId="time"
					times={['10:00', '10:15']}
				/>
			</form>,
		);
		expect(new FormData(screen.getByTestId('time-form')).get('time')).toBe('10:00');
		await user.click(screen.getByRole('combobox', { name: 'Appointment time' }));
		await user.click(screen.getByRole('option', { name: '10:15 AM' }));
		expect(onChange).toHaveBeenLastCalledWith('10:15', expect.anything());
		await user.click(screen.getByRole('button', { name: /clear/i }));
		expect(new FormData(screen.getByTestId('time-form')).get('time')).toBe('');

		rerender(<TimePicker label="Appointment time" testId="time" value="10:30" />);
		expect(screen.getByTestId('time--input')).toHaveValue('10:30');
	});

	it('uses editable parsers, including seconds, and rejects invalid input', async () => {
		const user = userEvent.setup();
		const onChange = jest.fn();
		const { rerender } = render(
			<TimePicker
				label="Appointment time"
				onChange={onChange}
				parseInputValue={() => new Date('1970-01-01T23:22:33')}
				testId="time"
				timeFormat="hh:mm:ss a"
				timeIsEditable
			/>,
		);
		await user.type(screen.getByRole('combobox', { name: 'Appointment time' }), 'custom');
		await user.keyboard('{Enter}');
		expect(onChange).toHaveBeenLastCalledWith('23:22:33', expect.anything());

		onChange.mockClear();
		rerender(
			<TimePicker
				label="Appointment time"
				onChange={onChange}
				parseInputValue={() => {
					throw new Error('Invalid time');
				}}
				testId="time"
				timeIsEditable
			/>,
		);
		await user.type(screen.getByRole('combobox', { name: 'Appointment time' }), 'invalid');
		await user.keyboard('{Enter}');
		expect(onChange).not.toHaveBeenCalled();
	});

	it('covers open state, callbacks, locale, and display format', async () => {
		const user = userEvent.setup();
		const onFocus = jest.fn();
		const { rerender } = render(
			<TimePicker
				defaultIsOpen
				label="Appointment time"
				selectProps={{ onFocus }}
				testId="time"
				times={['10:00']}
				value="15:30"
			/>,
		);
		expect(screen.getAllByRole('listbox').length).toBeGreaterThan(0);
		rerender(
			<TimePicker
				isOpen={false}
				label="Appointment time"
				testId="time"
				times={['10:00']}
				value="15:30"
			/>,
		);
		expect(screen.getAllByRole('listbox').length).toBeGreaterThan(0);
		rerender(
			<TimePicker
				label="Appointment time"
				locale="en-GB"
				selectProps={{ onFocus }}
				testId="time"
				value="15:30"
			/>,
		);
		expect(screen.getByTestId('time--container')).toHaveTextContent('15:30');
		await user.click(screen.getByRole('combobox', { name: 'Appointment time' }));
		expect(onFocus).toHaveBeenCalled();
		rerender(
			<TimePicker label="Appointment time" testId="time" timeFormat="HH:mm" value="15:30" />,
		);
		expect(screen.getByTestId('time--container')).toHaveTextContent('15:30');
	});

	it('calls selectProps.onMenuOpen when its menu opens', async () => {
		const user = userEvent.setup();
		const onMenuOpen = jest.fn();
		render(
			<TimePicker
				label="Appointment time"
				selectProps={{ onMenuOpen }}
				testId="time"
				times={['10:00']}
			/>,
		);

		await user.click(screen.getByRole('combobox', { name: 'Appointment time' }));

		expect(onMenuOpen).toHaveBeenCalledTimes(1);
	});
});
