import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
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

const createTimePicker = (props: TimePickerBaseProps = {}) => (
	<TimePicker label="Time" testId="test" {...props} />
);

describe('TimePicker', () => {
	beforeEach(() => {
		(CreatableSelect as unknown as jest.Mock).mockImplementation((props) => {
			const options: OptionsType = props.options || [];

			return (
				<>
					<button
						type="button"
						// @ts-ignore hack to pass data from tests
						onClick={(event) => props.onCreateOption(event.target.value)}
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

	it('should render the time in a custom timeFormat', () => {
		render(createTimePicker({ value: '12:00', timeFormat: 'HH--mm--SSS' }));

		const container = screen.getByTestId('test--container');

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

	it('should call custom parseInputValue - AM', () => {
		const onChangeSpy = jest.fn();
		render(
			createTimePicker({
				timeIsEditable: true,
				onChange: onChangeSpy,
				parseInputValue: () => new Date('1970-01-02 01:15:00'),
			}),
		);

		const createButton = screen.getByRole('button', {
			name: 'Create Item',
		});
		fireEvent.click(createButton, {
			target: {
				value: 'asdf', // our custom parseInputValue ignores this
			},
		});

		expect(onChangeSpy).toHaveBeenCalledWith('01:15');
	});

	it('should call default parseInputValue', () => {
		const onChangeSpy = jest.fn();
		render(createTimePicker({ timeIsEditable: true, onChange: onChangeSpy }));

		const createButton = screen.getByRole('button', {
			name: 'Create Item',
		});
		fireEvent.click(createButton, {
			target: {
				value: '01:30',
			},
		});

		expect(onChangeSpy).toHaveBeenCalledWith('01:30');
	});

	it('should return AM time with default parseInputValue', () => {
		const onChangeSpy = jest.fn();
		render(createTimePicker({ timeIsEditable: true, onChange: onChangeSpy }));

		const createButton = screen.getByRole('button', {
			name: 'Create Item',
		});
		fireEvent.click(createButton, {
			target: {
				value: '01:44am',
			},
		});

		expect(onChangeSpy).toHaveBeenCalledWith('01:44');
	});

	it('should return PM time with default parseInputValue', () => {
		const onChangeSpy = jest.fn();
		render(createTimePicker({ timeIsEditable: true, onChange: onChangeSpy }));

		const createButton = screen.getByRole('button', {
			name: 'Create Item',
		});
		fireEvent.click(createButton, {
			target: {
				value: '3:32pm',
			},
		});

		expect(onChangeSpy).toHaveBeenCalledWith('15:32');
	});

	it('should correctly parseInputValue with default timeFormat', () => {
		const onChangeSpy = jest.fn();
		const onParseInputValueSpy = jest.fn().mockReturnValue(moment('3:32pm', 'h:mma').toDate());
		render(
			createTimePicker({
				timeIsEditable: true,
				onChange: onChangeSpy,
				parseInputValue: onParseInputValueSpy,
			}),
		);

		const createButton = screen.getByRole('button', {
			name: 'Create Item',
		});
		fireEvent.click(createButton, {
			target: {
				value: '3:32pm',
			},
		});

		expect(onParseInputValueSpy).toHaveBeenCalledWith('3:32pm', 'h:mma');
		expect(onChangeSpy).toHaveBeenCalledWith('15:32');
	});

	it('should return PM time with default parseInputValue and custom timeFormat', () => {
		const onChangeSpy = jest.fn();
		render(
			createTimePicker({
				timeIsEditable: true,
				onChange: onChangeSpy,
				timeFormat: 'hh:mm:ss a',
			}),
		);
		const createButton = screen.getByRole('button', {
			name: 'Create Item',
		});

		fireEvent.click(createButton, {
			target: { value: '11:22:33 pm' },
		});

		expect(onChangeSpy).toHaveBeenCalledWith('23:22:33');
	});

	it('should correctly parseInputValue with custom timeFormat', () => {
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

		const createButton = screen.getByRole('button', {
			name: 'Create Item',
		});
		fireEvent.click(createButton, {
			target: { value: '3:32pm' },
		});

		expect(onParseInputValueSpy).toHaveBeenCalledWith('3:32pm', 'HH--mm:A');
		expect(onChangeSpy).toHaveBeenCalledWith('15:32');
	});

	it('should clear the value if the backspace key is pressed', () => {
		const onChangeSpy = jest.fn();
		render(createTimePicker({ value: '15:32', onChange: onChangeSpy }));

		const selectInput = screen.getByDisplayValue('');
		fireEvent.keyDown(selectInput, { key: 'Backspace', keyCode: 8 });

		expect(onChangeSpy).toHaveBeenCalledWith('', expect.any(Object));
	});

	it('should clear the value if the delete key is pressed', () => {
		const onChangeSpy = jest.fn();
		render(createTimePicker({ value: '15:32', onChange: onChangeSpy }));

		const selectInput = screen.getByDisplayValue('');
		fireEvent.keyDown(selectInput, { key: 'Delete', keyCode: 46 });

		expect(onChangeSpy).toHaveBeenCalledWith('', expect.any(Object));
	});

	it('should clear the value if the clear button is pressed and the menu should stay closed', () => {
		const onChangeSpy = jest.fn();
		render(createTimePicker({ value: '15:32', onChange: onChangeSpy }));
		const clearButton = screen.getByRole('button', { name: /clear/i });
		if (!clearButton) {
			throw new Error('Expected button to be non-null');
		}

		fireEvent.mouseOver(clearButton);
		fireEvent.mouseMove(clearButton);
		fireEvent.mouseDown(clearButton);

		expect(onChangeSpy).toHaveBeenCalledWith('', expect.any(Object));
		expect(screen.queryByTestId(`test--popper--container`)).not.toBeInTheDocument();
	});

	it('should clear the value and leave the menu open if the clear button is pressed while menu is open', () => {
		const onChangeSpy = jest.fn();
		const testId = 'test';

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

		fireEvent.mouseOver(clearButton);
		fireEvent.mouseMove(clearButton);
		fireEvent.mouseDown(clearButton);

		expect(onChangeSpy).toHaveBeenCalledWith('', expect.any(Object));
		expect(screen.getByTestId('test--popper--container')).toBeInTheDocument();
	});

	it('should never apply an ID to the hidden input', () => {
		const id = 'test';
		const allImplementations = [createTimePicker(), createTimePicker({ id: id })];

		allImplementations.forEach((jsx) => {
			const { unmount } = render(jsx);

			const hiddenInput = screen.getByTestId(`test--input`);

			expect(hiddenInput).toHaveAttribute('type', 'hidden');
			expect(hiddenInput).not.toHaveAttribute('id');

			unmount();
		});
	});

	it('should add aria-label when label prop is supplied', () => {
		render(createTimePicker());

		const input = screen.getByRole('combobox');
		expect(input).toHaveAttribute('aria-label', 'Time');
	});

	it('should add aria-describedby when prop is supplied', () => {
		const describedBy = 'description';
		render(createTimePicker({ 'aria-describedby': describedBy }));

		const input = screen.getByRole('combobox');
		expect(input).toHaveAttribute('aria-describedby', expect.stringContaining(describedBy));
	});
});
