import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import DatePicker from '../../date-picker';

const topLayerStates = [false, true] as const;

const setTopLayer = (enabled: boolean) => {
	(enabled ? passGate : failGate)('platform-dst-top-layer');
};

describe.each(topLayerStates)('public picker behaviour (top layer: %s)', (topLayerEnabled) => {
	beforeEach(() => {
		setTopLayer(topLayerEnabled);
	});

	it('keeps controlled DatePicker values in sync, submits them, and reports clearing', async () => {
		const user = userEvent.setup();
		const onChange = jest.fn();
		const { rerender } = render(
			<form data-testid="date-form">
				<DatePicker
					label="Appointment date"
					name="date"
					onChange={onChange}
					testId="date"
					value="2018-06-08"
				/>
			</form>,
		);

		expect(new FormData(screen.getByTestId('date-form')).get('date')).toBe('2018-06-08');

		rerender(
			<form data-testid="date-form">
				<DatePicker
					label="Appointment date"
					name="date"
					onChange={onChange}
					testId="date"
					value="2018-06-09"
				/>
			</form>,
		);
		expect(new FormData(screen.getByTestId('date-form')).get('date')).toBe('2018-06-09');

		await user.click(screen.getByRole('button', { name: /clear/i }));
		expect(onChange).toHaveBeenLastCalledWith('', expect.anything());
	});

	it('commits complete DatePicker input and retains the latest parsed date for partial and invalid commits', () => {
		const onChange = jest.fn();
		render(<DatePicker label="Appointment date" onChange={onChange} testId="date" />);
		const input = screen.getByRole('combobox', { name: 'Appointment date' });

		fireEvent.input(input, { target: { value: '6/8/2018' } });
		fireEvent.keyDown(input, { key: 'Enter' });
		expect(onChange).toHaveBeenLastCalledWith('2018-06-08', expect.anything());

		onChange.mockClear();
		fireEvent.input(input, { target: { value: '6/8' } });
		fireEvent.keyDown(input, { key: 'Enter' });
		expect(onChange).toHaveBeenLastCalledWith('2017-06-08', expect.anything());
		fireEvent.input(input, { target: { value: 'not a date' } });
		fireEvent.keyDown(input, { key: 'Enter' });
		expect(onChange).toHaveBeenLastCalledWith('2017-06-08', expect.anything());
	});

	it('uses DatePicker custom parsing and keeps disabled calendar dates unavailable', async () => {
		const user = userEvent.setup();
		const onChange = jest.fn();
		render(
			<DatePicker
				defaultValue="2018-06-08"
				disabled={['2018-06-09']}
				label="Appointment date"
				onChange={onChange}
				parseInputValue={() => new Date('2018-06-10')}
				testId="date"
			/>,
		);

		const input = screen.getByRole('combobox', { name: 'Appointment date' });
		fireEvent.input(input, { target: { value: 'monday' } });
		fireEvent.keyDown(input, { key: 'Enter' });
		expect(onChange).toHaveBeenLastCalledWith('2018-06-10', expect.anything());

		await user.click(screen.getByTestId('date--container'));
		const disabledDay = screen.getByRole('button', { name: /9, Saturday June 2018/ });
		expect(disabledDay).toHaveAttribute('aria-disabled', 'true');
	});

	it('applies DatePicker filters independently from minimum and maximum dates', async () => {
		const user = userEvent.setup();
		const onChange = jest.fn();
		render(
			<DatePicker
				defaultValue="2018-06-08"
				disabledDateFilter={(date) => date === '2018-06-09'}
				label="Appointment date"
				maxDate="2018-06-10"
				minDate="2018-06-08"
				onChange={onChange}
				testId="date"
			/>,
		);

		await user.click(screen.getByTestId('date--container'));
		expect(screen.getByRole('button', { name: /7, Thursday June 2018/ })).toHaveAttribute(
			'aria-disabled',
			'true',
		);
		const filteredDay = screen.getByRole('button', { name: /9, Saturday June 2018/ });
		expect(filteredDay).toHaveAttribute('aria-disabled', 'true');
		await user.click(filteredDay);
		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByRole('button', { name: /11, Monday June 2018/ })).toHaveAttribute(
			'aria-disabled',
			'true',
		);
	});

	it('renders DatePicker default values and public display formatting', () => {
		const { rerender } = render(
			<form data-testid="date-form">
				<DatePicker
					dateFormat="DD/MM/YYYY"
					defaultValue="2018-06-08"
					label="Appointment date"
					name="date"
					testId="date"
				/>
			</form>,
		);
		expect(new FormData(screen.getByTestId('date-form')).get('date')).toBe('2018-06-08');
		expect(screen.getByTestId('date--container')).toHaveTextContent('08/06/2018');

		rerender(
			<DatePicker
				formatDisplayLabel={() => 'Appointment day'}
				label="Appointment date"
				testId="date"
				value="2018-06-08"
			/>,
		);
		expect(screen.getByTestId('date--container')).toHaveTextContent('Appointment day');
	});

	it('honours DatePicker default and controlled open state and menu callbacks', async () => {
		const user = userEvent.setup();
		const onMenuOpen = jest.fn();
		const onMenuClose = jest.fn();
		const { rerender } = render(
			<DatePicker
				label="Appointment date"
				selectProps={{ onMenuClose, onMenuOpen }}
				shouldShowCalendarButton
				testId="date"
			/>,
		);

		expect(screen.queryByRole('grid')).not.toBeInTheDocument();
		await user.click(screen.getByRole('button', { name: /open calendar/i }));
		expect(onMenuOpen).toHaveBeenCalledTimes(1);
		expect(screen.getByRole('grid')).toBeVisible();
		await user.click(screen.getByRole('button', { name: /open calendar/i }));
		expect(onMenuClose).toHaveBeenCalledTimes(1);
		rerender(<DatePicker isOpen={false} label="Appointment date" testId="date" />);
		expect(screen.queryByRole('grid')).not.toBeInTheDocument();
		rerender(<DatePicker isOpen label="Appointment date" testId="date" />);
		expect(screen.getByRole('grid')).toBeVisible();
	});
});

describe('top-layer unsupported Select options', () => {
	beforeEach(() => {
		setTopLayer(true);
	});

	it.each([{ menuRenderMode: 'inline' }, { components: { MenuPortal: () => null } }])(
		'throws for %p',
		(selectProps) => {
			expect(() =>
				render(<DatePicker label="Appointment date" selectProps={selectProps} />),
			).toThrow(
				'DatePicker does not support selectProps.menuRenderMode="inline" or selectProps.components.MenuPortal when platform-dst-top-layer is enabled.',
			);
		},
	);
});
