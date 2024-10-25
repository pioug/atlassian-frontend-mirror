import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import cases from 'jest-in-case';
import moment from 'moment';

import { CreatableSelect, type OptionsType } from '@atlaskit/select';

import { type TimePickerBaseProps } from '../../../types';
import TimePicker from '../../time-picker';

jest.mock('@atlaskit/select', () => {
	const actual = jest.requireActual('@atlaskit/select');

	return {
		__esModule: true,
		...actual,
		CreatableSelect: jest.fn(),
	};
});

const testId = 'test';

const createTimePicker = (props: TimePickerBaseProps = {}) => (
	<TimePicker label="Time" testId={testId} {...props} />
);

describe('TimePicker', () => {
	const queryMenu = () => screen.queryByTestId(`${testId}--popper--container`);
	/**
	 * This is necessary for entering values in the mock time picker above. Why we
	 * use this mock and not the real deal is beyond me at this point. I would
	 * love to remove that as well.
	 *
	 * @param value New time value.
	 * @param user A `userEvent.setup()` object.
	 */
	const selectCustomTime = async (value: string, user: UserEvent) => {
		const createButton = screen.getByRole('button', {
			name: 'Create Item',
		}) as HTMLButtonElement;

		createButton.value = value;
		await user.click(createButton);
	};

	beforeEach(() => {
		(CreatableSelect as unknown as jest.Mock).mockImplementation((props) => {
			const options: OptionsType = props.options || [];

			return (
				<>
					<button
						type="button"
						onClick={(event) => props.onCreateOption((event.target as HTMLButtonElement).value)}
					>
						Create Item
					</button>
					<label htmlFor="options">Options</label>
					<select
						value={props.value}
						onChange={(event) => props.onChange(event.target, 'select-option')}
						onFocus={props.onFocus}
						onBlur={props.onBlur}
						data-testid={props.testId}
						id="options"
					>
						{options.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</>
			);
		});
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('locale', () => {
		const time = new Date('2000-01-01T15:30:00.000');
		const hour = time.getHours();
		const minute = time.getMinutes();
		const timeValue = `${hour}:${minute}`;

		it('should apply `lang` attribute to inner input field', () => {
			const lang = 'en-GB';

			render(createTimePicker({ locale: lang, value: timeValue }));

			const value = screen.getByText(timeValue);

			expect(value).toHaveAttribute('lang', expect.stringContaining(lang));
		});

		cases(
			'should format time using provided locale',
			({ locale, result }: { locale: string; result: string }) => {
				render(createTimePicker({ locale: locale, value: timeValue }));

				expect(screen.getByText(result)).toBeInTheDocument();
			},
			[
				{ locale: 'en-GB', result: `${hour}:${minute}` },
				{ locale: 'id', result: `${hour}.${minute}` },
			],
		);
	});

	it('should be required when prop is passed', () => {
		render(createTimePicker({ isRequired: true }));

		const getInput = () => screen.getByRole('combobox');
		expect(getInput()).toBeRequired();
	});

	it('should have an empty value if none is provided', () => {
		render(createTimePicker());

		const input = screen.getByTestId(`${testId}--input`);
		expect(input).toHaveValue('');
	});

	it('should use provided value', () => {
		render(createTimePicker({ value: '11:30 AM' }));

		const input = screen.getByTestId(`${testId}--input`);
		expect(input).toHaveValue('11:30 AM');
	});

	it('should use provided default value', () => {
		render(createTimePicker({ defaultValue: '11:30 AM' }));

		const input = screen.getByTestId(`${testId}--input`);
		expect(input).toHaveValue('11:30 AM');
	});

	it('should handle a controlled value', () => {
		const { rerender } = render(createTimePicker({ value: '11:30 AM' }));
		let input = screen.getByTestId(`${testId}--input`);
		expect(input).toHaveValue('11:30 AM');

		rerender(createTimePicker({ value: '12:30 AM' }));
		input = screen.getByTestId(`${testId}--input`);
		expect(input).toHaveValue('12:30 AM');
	});

	it('should start closed if isOpen is not provided', () => {
		render(createTimePicker());

		const menu = queryMenu();
		expect(menu).not.toBeInTheDocument();
	});

	it('should have menu open if isOpen is set to true', () => {
		render(createTimePicker({ isOpen: true }));

		const menu = queryMenu();
		expect(menu).toBeInTheDocument();
	});

	it('should use provided defaultIsOpen', () => {
		render(createTimePicker({ defaultIsOpen: true }));

		const menu = queryMenu();
		expect(menu).toBeInTheDocument();
	});

	it('should handle a controlled isOpen', () => {
		const { rerender } = render(createTimePicker({ isOpen: false }));
		let menu = queryMenu();
		expect(menu).not.toBeInTheDocument();

		rerender(createTimePicker({ isOpen: true }));
		menu = queryMenu();
		expect(menu).toBeInTheDocument();
	});

	it('should render the time in a custom timeFormat', () => {
		render(createTimePicker({ value: '12:00', timeFormat: 'HH--mm--SSS' }));

		const container = screen.getByTestId(`${testId}--container`);

		expect(container).toHaveTextContent('12--00--000');
	});

	it('should render a customized display label', () => {
		render(
			createTimePicker({
				value: '12:00',
				formatDisplayLabel: (time: string) => (time === '12:00' ? 'midday' : time),
			}),
		);

		const label = screen.queryByText('midday');
		expect(label).toBeInTheDocument();
	});

	it('should call custom parseInputValue - AM', async () => {
		const user = userEvent.setup();
		const onChangeSpy = jest.fn();
		render(
			createTimePicker({
				timeIsEditable: true,
				onChange: onChangeSpy,
				parseInputValue: () => new Date('1970-01-02 01:15:00'),
			}),
		);

		await selectCustomTime('asdf', user);

		expect(onChangeSpy).toHaveBeenCalledTimes(1);
		expect(onChangeSpy.mock.calls[0][0]).toBe('01:15');
	});

	it('should call default parseInputValue', async () => {
		const user = userEvent.setup();
		const onChangeSpy = jest.fn();
		render(createTimePicker({ timeIsEditable: true, onChange: onChangeSpy }));

		await selectCustomTime('01:30', user);

		expect(onChangeSpy).toHaveBeenCalledTimes(1);
		expect(onChangeSpy.mock.calls[0][0]).toBe('01:30');
	});

	it('should return AM time with default parseInputValue', async () => {
		const user = userEvent.setup();
		const onChangeSpy = jest.fn();
		render(createTimePicker({ timeIsEditable: true, onChange: onChangeSpy }));

		await selectCustomTime('01:44am', user);

		expect(onChangeSpy.mock.calls[0][0]).toBe('01:44');
	});

	it('should return PM time with default parseInputValue', async () => {
		const user = userEvent.setup();
		const onChangeSpy = jest.fn();
		render(createTimePicker({ timeIsEditable: true, onChange: onChangeSpy }));

		await selectCustomTime('03:32pm', user);

		expect(onChangeSpy.mock.calls[0][0]).toBe('15:32');
	});

	it('should correctly parseInputValue with default timeFormat', async () => {
		const user = userEvent.setup();
		const onChangeSpy = jest.fn();
		const onParseInputValueSpy = jest.fn().mockReturnValue(moment('3:32pm', 'h:mma').toDate());
		render(
			createTimePicker({
				timeIsEditable: true,
				onChange: onChangeSpy,
				parseInputValue: onParseInputValueSpy,
			}),
		);

		await selectCustomTime('3:32pm', user);

		expect(onParseInputValueSpy).toHaveBeenCalledWith('3:32pm', 'h:mma');
		expect(onChangeSpy.mock.calls[0][0]).toBe('15:32');
	});

	it('should return PM time with default parseInputValue and custom timeFormat', async () => {
		const user = userEvent.setup();
		const onChangeSpy = jest.fn();
		render(
			createTimePicker({
				timeIsEditable: true,
				onChange: onChangeSpy,
				timeFormat: 'hh:mm:ss a',
			}),
		);

		await selectCustomTime('11:22:33 pm', user);

		expect(onChangeSpy.mock.calls[0][0]).toBe('23:22:33');
	});

	it('should correctly parseInputValue with custom timeFormat', async () => {
		const user = userEvent.setup();
		const onChangeSpy = jest.fn();
		const onParseInputValueSpy = jest.fn().mockReturnValue(moment('3:32pm', 'h:mma').toDate());
		render(
			createTimePicker({
				timeIsEditable: true,
				onChange: onChangeSpy,
				parseInputValue: onParseInputValueSpy,
				timeFormat: 'HH--mm:A',
			}),
		);

		await selectCustomTime('3:32pm', user);

		expect(onParseInputValueSpy).toHaveBeenCalledWith('3:32pm', 'HH--mm:A');
		expect(onChangeSpy.mock.calls[0][0]).toBe('15:32');
	});

	it('should clear the value if the backspace key is pressed', async () => {
		const user = userEvent.setup();
		const onChangeSpy = jest.fn();
		render(createTimePicker({ value: '15:32', onChange: onChangeSpy }));

		const selectInput = screen.getByDisplayValue('');
		await user.type(selectInput, '{Backspace}');

		expect(onChangeSpy).toHaveBeenCalledWith('', expect.any(Object));
	});

	it('should clear the value if the delete key is pressed', async () => {
		const user = userEvent.setup();
		const onChangeSpy = jest.fn();
		render(createTimePicker({ value: '15:32', onChange: onChangeSpy }));

		const selectInput = screen.getByDisplayValue('');
		await user.type(selectInput, '{Delete}');

		expect(onChangeSpy).toHaveBeenCalledWith('', expect.any(Object));
	});

	it('should clear the value if the clear button is pressed and the menu should stay closed', async () => {
		const user = userEvent.setup();
		const onChangeSpy = jest.fn();
		render(createTimePicker({ value: '15:32', onChange: onChangeSpy }));
		const clearButton = screen.getByRole('button', { name: /clear/i });
		if (!clearButton) {
			throw new Error('Expected button to be non-null');
		}

		await user.click(clearButton);

		expect(onChangeSpy).toHaveBeenCalledWith('', expect.any(Object));
		expect(screen.queryByTestId(`${testId}--popper--container`)).not.toBeInTheDocument();
	});

	it('should clear the value and leave the menu open if the clear button is pressed while menu is open', async () => {
		const user = userEvent.setup();
		const onChangeSpy = jest.fn();

		render(
			createTimePicker({
				value: '15:32',
				onChange: onChangeSpy,
				defaultIsOpen: true,
				selectProps: { testId: testId },
			}),
		);

		const clearButton = screen.getByRole('button', { name: /clear/i });
		if (!clearButton) {
			throw new Error('Expected button to be non-null');
		}

		await user.click(clearButton);

		expect(onChangeSpy).toHaveBeenCalledWith('', expect.any(Object));
		expect(screen.getByTestId(`${testId}--popper--container`)).toBeInTheDocument();
	});

	it('should render the custom clear label', () => {
		const timePickerLabel = 'test time';
		const clearControlLabel = `Clear ${timePickerLabel}`;
		const onChangeSpy = jest.fn();

		render(
			createTimePicker({
				value: '15:32',
				onChange: onChangeSpy,
				defaultIsOpen: true,
				selectProps: { testId: testId },
				label: timePickerLabel,
				clearControlLabel,
			}),
		);

		expect(screen.getByRole('button', { name: clearControlLabel })).toBeInTheDocument();
	});

	it('should never apply an ID to the hidden input', () => {
		const id = 'test';
		const allImplementations = [createTimePicker(), createTimePicker({ id: id })];

		allImplementations.forEach((jsx) => {
			const { unmount } = render(jsx);

			const hiddenInput = screen.getByTestId(`${testId}--input`);

			expect(hiddenInput).toHaveAttribute('type', 'hidden');
			expect(hiddenInput).not.toHaveAttribute('id');

			unmount();
		});
	});

	it('should add aria-label when label prop is supplied', () => {
		const label = 'label';
		render(createTimePicker({ label }));

		const input = screen.getByRole('combobox');
		expect(input).toHaveAttribute('aria-label', label);
	});

	it('should add aria-describedby when prop is supplied', () => {
		const describedBy = 'description';
		render(createTimePicker({ 'aria-describedby': describedBy }));

		const input = screen.getByRole('combobox');
		expect(input).toHaveAttribute('aria-describedby', expect.stringContaining(describedBy));
	});
});
