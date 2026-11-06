import React from 'react';

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { flushPopoverExit } from '@atlaskit/top-layer/testing/flush-popover-exit';
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

// Select returns focus when its top-layer menu closes with focus inside. DatePicker moves no focus.
describe('top-layer focus when the calendar closes', () => {
	beforeEach(() => {
		setTopLayer(true);
	});

	async function openCalendarFromButton(user: ReturnType<typeof userEvent.setup>) {
		const calendarButton = screen.getByRole('button', { name: /open calendar/i });
		act(() => calendarButton.focus());
		await user.keyboard('{Enter}');
		expect(screen.getByTestId('date--calendar--previous-year')).toHaveFocus();
		return calendarButton;
	}

	it('returns focus to the calendar button after a keyboard pick', async () => {
		const user = userEvent.setup();
		const onChange = jest.fn();
		render(
			<DatePicker
				defaultValue="2018-06-08"
				label="Appointment date"
				onChange={onChange}
				shouldShowCalendarButton
				testId="date"
			/>,
		);
		const calendarButton = await openCalendarFromButton(user);

		// Tab past the header buttons to the selected day, then move to the next day.
		await user.tab();
		await user.tab();
		await user.tab();
		await user.tab();
		await user.keyboard('{ArrowRight}');
		expect(screen.getByRole('button', { name: /9, Saturday June 2018/ })).toHaveFocus();
		await user.keyboard(' ');

		expect(onChange).toHaveBeenLastCalledWith('2018-06-09', expect.anything());
		expect(screen.queryByRole('grid')).not.toBeInTheDocument();
		expect(calendarButton).toHaveFocus();
		await expect(document.body).toBeAccessible();
	});

	it('returns focus to the calendar button on Escape from the calendar', async () => {
		const user = userEvent.setup();
		render(<DatePicker label="Appointment date" shouldShowCalendarButton testId="date" />);
		const calendarButton = await openCalendarFromButton(user);

		await user.keyboard('{Escape}');

		expect(screen.queryByRole('grid')).not.toBeInTheDocument();
		expect(calendarButton).toHaveFocus();
	});

	it.each(['a keyboard pick', 'Escape'])(
		'returns focus to the input after %s, without a calendar button, and does not reopen',
		async (closeAction) => {
			const user = userEvent.setup();
			const onChange = jest.fn();
			const onFocus = jest.fn();
			render(
				<DatePicker
					defaultValue="2018-06-08"
					label="Appointment date"
					onChange={onChange}
					onFocus={onFocus}
					selectProps={{ classNamePrefix: 'date' }}
					testId="date"
				/>,
			);
			const input = screen.getByRole('combobox', { name: 'Appointment date' });
			const control = screen.getByTestId('date-select--control');

			// With no calendar button, focus on the input opens the calendar.
			await user.tab();
			expect(input).toHaveFocus();
			expect(screen.getByRole('grid')).toBeVisible();
			// Move focus into the calendar on the selected day, then to the next day.
			await user.keyboard('{ArrowDown}');
			await user.keyboard('{ArrowRight}');
			expect(screen.getByRole('button', { name: /9, Saturday June 2018/ })).toHaveFocus();
			expect(control).not.toHaveClass('date__control--is-focused');
			onFocus.mockClear();
			await user.keyboard(closeAction === 'Escape' ? '{Escape}' : ' ');

			if (closeAction === 'Escape') {
				expect(onChange).not.toHaveBeenCalled();
			} else {
				expect(onChange).toHaveBeenLastCalledWith('2018-06-09', expect.anything());
			}
			expect(input).toHaveFocus();
			expect(screen.queryByRole('grid')).not.toBeInTheDocument();
			// React sees the return: Select shows its focused state and calls `onFocus`.
			expect(control).toHaveClass('date__control--is-focused');
			expect(onFocus).toHaveBeenCalledTimes(1);
		},
	);

	it('returns focus to the calendar button after a keyboard pick in StrictMode', async () => {
		const user = userEvent.setup();
		render(
			<React.StrictMode>
				<DatePicker
					defaultValue="2018-06-08"
					label="Appointment date"
					shouldShowCalendarButton
					testId="date"
				/>
			</React.StrictMode>,
		);
		const calendarButton = await openCalendarFromButton(user);

		// Tab past the header buttons to the selected day, then pick it.
		await user.tab();
		await user.tab();
		await user.tab();
		await user.tab();
		await user.keyboard(' ');

		expect(screen.queryByRole('grid')).not.toBeInTheDocument();
		expect(calendarButton).toHaveFocus();
	});

	it('does not reopen after a pick when the calendar reopened with focus in the picker', async () => {
		const user = userEvent.setup();
		render(
			<DatePicker defaultIsOpen defaultValue="2018-06-08" label="Appointment date" testId="date" />,
		);
		const input = screen.getByRole('combobox', { name: 'Appointment date' });

		// The calendar first opened with nothing focused. Close it, then open it from the input.
		await user.tab();
		await user.keyboard('{Escape}');
		expect(screen.queryByRole('grid')).not.toBeInTheDocument();
		await user.keyboard('{ArrowDown}');
		await user.keyboard('{ArrowRight}');
		expect(screen.getByRole('button', { name: /9, Saturday June 2018/ })).toHaveFocus();
		await user.keyboard(' ');

		expect(input).toHaveFocus();
		expect(screen.queryByRole('grid')).not.toBeInTheDocument();
	});

	// For example, Jira's date field sets `isOpen={false}` while its recur work form is open.
	it('shows the calendar again when an `isOpen={false}` prop that closed it is removed', async () => {
		const user = userEvent.setup();
		const props = {
			defaultValue: '2018-06-08',
			label: 'Appointment date',
			shouldShowCalendarButton: true,
			testId: 'date',
		};
		const { rerender } = render(<DatePicker {...props} />);
		const input = screen.getByRole('combobox', { name: 'Appointment date' });

		await user.click(input);
		await user.keyboard('{ArrowDown}');
		expect(screen.getByRole('button', { name: /8, Friday June 2018/ })).toHaveFocus();

		rerender(<DatePicker {...props} isOpen={false} />);
		await waitFor(() => expect(input).toHaveFocus());
		expect(screen.queryByRole('grid')).not.toBeInTheDocument();

		// The focus return did not change the open state, so the calendar shows again, as with the
		// gate off.
		rerender(<DatePicker {...props} />);
		expect(screen.getByRole('grid')).toBeVisible();
	});

	// Firefox moves focus to `<body>` as the calendar's popover hides, before focus returns.
	it('does not treat focus that falls to <body> as the calendar closes as leaving the field', async () => {
		const user = userEvent.setup();
		const onBlur = jest.fn();
		const props = {
			defaultValue: '2018-06-08',
			label: 'Appointment date',
			onBlur,
			shouldShowCalendarButton: true,
			testId: 'date',
		};
		const { rerender } = render(<DatePicker {...props} />);
		const input = screen.getByRole('combobox', { name: 'Appointment date' });
		await user.click(input);
		await user.keyboard('{ArrowDown}');
		const day = screen.getByRole('button', { name: /8, Friday June 2018/ });
		expect(day).toHaveFocus();

		rerender(<DatePicker {...props} isOpen={false} />);
		act(() => day.blur());
		await waitFor(() => expect(input).toHaveFocus());

		expect(onBlur).not.toHaveBeenCalled();
		rerender(<DatePicker {...props} />);
		expect(screen.getByRole('grid')).toBeVisible();
	});

	// For example, a Tab that the browser handles before the popover's `toggle` task.
	it.each(['Escape', 'an `isOpen={false}` prop'])(
		'treats a blur to an outside element as the calendar closes after %s as leaving the field',
		async (closeAction) => {
			const user = userEvent.setup();
			const onBlur = jest.fn();
			const props = {
				defaultValue: '2018-06-08',
				label: 'Appointment date',
				onBlur,
				shouldShowCalendarButton: true,
				testId: 'date',
			};
			const getUi = (isOpen?: boolean) => (
				<div>
					<DatePicker {...props} isOpen={isOpen} />
					<button type="button">Next field</button>
				</div>
			);
			const { rerender } = render(getUi());
			const input = screen.getByRole('combobox', { name: 'Appointment date' });
			const nextField = screen.getByRole('button', { name: 'Next field' });
			await user.click(input);
			await user.keyboard('{ArrowDown}');
			const day = screen.getByRole('button', { name: /8, Friday June 2018/ });
			expect(day).toHaveFocus();

			// Not `userEvent`: it waits for a task, and the popover's `toggle` task would run first.
			if (closeAction === 'Escape') {
				fireEvent.keyDown(day, { key: 'Escape' });
			} else {
				rerender(getUi(false));
			}
			act(() => nextField.focus());

			expect(onBlur).toHaveBeenCalledTimes(1);
			await flushPopoverExit();
			expect(screen.queryByRole('grid')).not.toBeInTheDocument();
			expect(nextField).toHaveFocus();
			// The picker state reset, so the calendar stays closed when the prop is removed.
			rerender(getUi());
			expect(screen.queryByRole('grid')).not.toBeInTheDocument();
		},
	);

	it('opens the calendar when focus comes back from nowhere after it left the picker', async () => {
		const user = userEvent.setup();
		render(<DatePicker defaultValue="2018-06-08" label="Appointment date" testId="date" />);
		const input = screen.getByRole('combobox', { name: 'Appointment date' });

		// The calendar opens with focus in the picker. Close it, then move focus out to `<body>`.
		await user.tab();
		await user.keyboard('{Escape}');
		act(() => input.blur());
		expect(document.body).toHaveFocus();
		act(() => input.focus());

		expect(screen.getByRole('grid')).toBeVisible();
	});

	// The calendar opened with nothing focused, so Select has no element to return focus to.
	it.each(['Tab', 'programmatic focus'])(
		'opens the calendar on a later %s after focus was lost with the calendar',
		async (focusAction) => {
			const user = userEvent.setup();
			render(
				<DatePicker
					defaultIsOpen
					defaultValue="2018-06-08"
					label="Appointment date"
					testId="date"
				/>,
			);
			const input = screen.getByRole('combobox', { name: 'Appointment date' });

			await user.tab();
			expect(input).toHaveFocus();
			await user.keyboard('{ArrowDown}');
			await user.keyboard('{ArrowRight}');
			await user.keyboard(' ');
			expect(screen.queryByRole('grid')).not.toBeInTheDocument();
			expect(document.body).toHaveFocus();

			if (focusAction === 'Tab') {
				await user.tab();
			} else {
				act(() => input.focus());
			}

			expect(input).toHaveFocus();
			expect(screen.getByRole('grid')).toBeVisible();
		},
	);

	it('opens the calendar on a later focus after app code moved focus elsewhere as it closed', async () => {
		const user = userEvent.setup();
		// Stands in for app code that moves focus in the same commit that closes the calendar.
		function FocusElsewhereOnMount() {
			React.useLayoutEffect(() => {
				screen.getByRole('button', { name: 'Elsewhere' }).focus();
			}, []);
			return null;
		}
		function App() {
			const [isPicked, setIsPicked] = React.useState(false);
			return (
				<div>
					<DatePicker
						defaultValue="2018-06-08"
						label="Appointment date"
						onChange={() => setIsPicked(true)}
						testId="date"
					/>
					<button type="button">Elsewhere</button>
					{isPicked ? <FocusElsewhereOnMount /> : null}
				</div>
			);
		}
		render(<App />);
		const input = screen.getByRole('combobox', { name: 'Appointment date' });
		await user.tab();
		await user.keyboard('{ArrowDown}');
		await user.keyboard('{ArrowRight}');
		await user.keyboard(' ');
		expect(screen.queryByRole('grid')).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Elsewhere' })).toHaveFocus();

		act(() => screen.getByRole('button', { name: 'Elsewhere' }).blur());
		act(() => input.focus());

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
