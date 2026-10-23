import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import cases from 'jest-in-case';
import moment from 'moment';

import CreatableSelect from '@atlaskit/select/creatable-select';
import type { OptionsType } from '@atlaskit/select/types';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { type TimePickerBaseProps } from '../../../types';
import TimePicker from '../../time-picker';

jest.mock('@atlaskit/select/creatable-select', () => ({
	...jest.requireActual('@atlaskit/select/creatable-select'),
	__esModule: true,
	default: jest.fn(),
}));

const testId = 'test';

const createTimePicker = (props: TimePickerBaseProps = {}) => (
	<TimePicker label="Time" testId={testId} {...props} />
);

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('TimePicker', () => {
	const getInput = () => screen.getByRole('combobox');
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
	const enableLocaleAwareTimeParsing = () => {
		passGate('platform-dst-locale-aware-time-parsing');
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

		it('should normalise locale underscores in the `lang` attribute', () => {
			render(createTimePicker({ locale: 'en_GB', value: timeValue }));

			const value = screen.getByText(timeValue);

			expect(value).toHaveAttribute('lang', expect.stringContaining('en-GB'));
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

		it('should accept 24-hour and English day-period input when editable input uses a 24-hour locale', async () => {
			enableLocaleAwareTimeParsing();
			const user = userEvent.setup();
			const onChangeSpy = jest.fn();
			render(
				createTimePicker({
					locale: 'en-GB',
					onChange: onChangeSpy,
					timeIsEditable: true,
				}),
			);

			await selectCustomTime('15:32', user);
			expect(onChangeSpy).toHaveBeenLastCalledWith('15:32', expect.anything());

			await selectCustomTime('3:32pm', user);
			expect(onChangeSpy).toHaveBeenLastCalledWith('15:32', expect.anything());
		});

		it('should parse a localized day period when editable input uses a 12-hour locale', async () => {
			enableLocaleAwareTimeParsing();
			const user = userEvent.setup();
			const onChangeSpy = jest.fn();
			render(
				createTimePicker({
					locale: 'ko-KR',
					onChange: onChangeSpy,
					timeIsEditable: true,
				}),
			);

			await selectCustomTime('오후 3:32', user);

			expect(onChangeSpy).toHaveBeenLastCalledWith('15:32', expect.anything());

			await selectCustomTime('3:32pm', user);
			expect(onChangeSpy).toHaveBeenLastCalledWith('15:32', expect.anything());
		});

		it('should parse localized digits when editable input uses a 24-hour locale', async () => {
			enableLocaleAwareTimeParsing();
			const user = userEvent.setup();
			const onChangeSpy = jest.fn();
			render(
				createTimePicker({
					locale: 'fa-IR',
					onChange: onChangeSpy,
					timeIsEditable: true,
				}),
			);

			await selectCustomTime('۱۵:۳۲', user);

			expect(onChangeSpy).toHaveBeenLastCalledWith('15:32', expect.anything());
		});

		cases(
			'should parse representative locale time variations',
			async ({ locale, input, output }: { locale: string; input: string; output: string }) => {
				enableLocaleAwareTimeParsing();
				const user = userEvent.setup();
				const onChangeSpy = jest.fn();
				render(createTimePicker({ locale, onChange: onChangeSpy, timeIsEditable: true }));

				await selectCustomTime(input, user);

				expect(onChangeSpy).toHaveBeenLastCalledWith(output, expect.anything());
			},
			[
				{ locale: 'en-US', input: '3:32 PM', output: '15:32' },
				{ locale: 'en-GB', input: '15:32', output: '15:32' },
				{ locale: 'ko-KR', input: '오후 3:32', output: '15:32' },
				{ locale: 'ja-JP', input: '15:32', output: '15:32' },
				{ locale: 'fa-IR', input: '۱۵:۳۲', output: '15:32' },
				{ locale: 'ar-EG', input: '٣:٣٢ م', output: '15:32' },
			],
		);

		cases(
			'should fall through to legacy parsing when no localized day period is present',
			async ({
				input,
				output,
				timeFormat,
			}: {
				input: string;
				output: string;
				timeFormat?: string;
			}) => {
				enableLocaleAwareTimeParsing();
				const user = userEvent.setup();
				const onChangeSpy = jest.fn();
				render(
					createTimePicker({
						locale: 'ko-KR',
						onChange: onChangeSpy,
						timeFormat,
						timeIsEditable: true,
					}),
				);

				await selectCustomTime(input, user);

				expect(onChangeSpy).toHaveBeenLastCalledWith(output, expect.anything());
			},
			[
				{ input: '15:32', output: '15:32' },
				{ input: '3:32', output: '03:32' },
				{ input: '3:32pm', output: '15:32' },
				{ input: '13045', output: '01:30:45', timeFormat: 'HH:mm:ss' },
				{ input: '123456', output: '12:34:56', timeFormat: 'HH:mm:ss' },
			],
		);

		cases(
			'should retain legacy editable time input forms',
			async ({
				input,
				output,
				timeFormat,
			}: {
				input: string;
				output: string;
				timeFormat?: string;
			}) => {
				enableLocaleAwareTimeParsing();
				const user = userEvent.setup();
				const onChangeSpy = jest.fn();
				render(
					createTimePicker({
						onChange: onChangeSpy,
						timeFormat,
						timeIsEditable: true,
					}),
				);

				await selectCustomTime(input, user);

				expect(onChangeSpy).toHaveBeenCalledWith(output, expect.anything());
			},
			[
				{ input: '1', output: '01:00' },
				{ input: '01', output: '01:00' },
				{ input: '1:30', output: '01:30' },
				{ input: '130', output: '01:30' },
				{ input: '1330', output: '13:30' },
				{ input: '1:30:45', output: '01:30:45', timeFormat: 'HH:mm:ss' },
				{ input: '13045', output: '01:30:45', timeFormat: 'HH:mm:ss' },
				{ input: '123456', output: '12:34:56', timeFormat: 'HH:mm:ss' },
				{ input: '1.30pm', output: '13:30' },
				{ input: '1:30 p M', output: '13:30' },
				{ input: '24:00', output: '00:00' },
			],
		);

		it('should retain the selected value when editable input is invalid', async () => {
			enableLocaleAwareTimeParsing();
			const user = userEvent.setup();
			const onChangeSpy = jest.fn();
			render(
				createTimePicker({
					defaultValue: '15:30',
					onChange: onChangeSpy,
					timeIsEditable: true,
				}),
			);

			await selectCustomTime('not a time', user);

			expect(screen.getByTestId(`${testId}--input`)).toHaveValue('15:30');
			expect(onChangeSpy).not.toHaveBeenCalled();
		});
	});

	it('should be required when prop is passed', () => {
		render(createTimePicker({ isRequired: true }));

		expect(getInput()).toBeRequired();
	});

	it('should not be required when prop is passed', () => {
		render(createTimePicker({ isRequired: false }));

		expect(getInput()).not.toBeRequired();
	});

	it('should be invalid when prop is passed', () => {
		render(createTimePicker({ isInvalid: true }));

		expect(getInput()).toBeInvalid();
	});

	it('should not be invalid when prop is passed', () => {
		render(createTimePicker({ isInvalid: false }));

		expect(getInput()).toBeValid();
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

	describe('Time button', () => {
		it('should render a labelled button to open the time picker', () => {
			render(createTimePicker({ shouldShowTimeButton: true }));

			expect(screen.getByRole('button', { name: 'Time, Open time picker' })).toBeVisible();
		});

		it('should not render the time button when the prop is not provided', () => {
			render(createTimePicker());

			expect(screen.queryByRole('button', { name: /Open time picker/ })).not.toBeInTheDocument();
		});

		it('should not open the menu when the input is focused with the keyboard', async () => {
			const user = userEvent.setup();
			render(createTimePicker({ shouldShowTimeButton: true }));

			await user.tab();

			expect(getInput()).toHaveFocus();
			expect(queryMenu()).not.toBeInTheDocument();
		});

		it('should open the menu when the time button is clicked', async () => {
			const user = userEvent.setup();
			render(createTimePicker({ shouldShowTimeButton: true }));

			const timeButton = screen.getByTestId(`${testId}--open-time-button`);
			await user.click(timeButton);

			expect(queryMenu()).toBeVisible();
			expect(timeButton).toHaveFocus();
		});

		it.each([false, true])(
			'should call the menu callback once in Strict Mode when defaultIsOpen is %s',
			async (defaultIsOpen) => {
				const user = userEvent.setup();
				const onMenuOpen = jest.fn();
				const onMenuClose = jest.fn();
				render(
					<React.StrictMode>
						{createTimePicker({
							shouldShowTimeButton: true,
							defaultIsOpen,
							selectProps: { onMenuOpen, onMenuClose },
						})}
					</React.StrictMode>,
				);

				await user.click(screen.getByTestId(`${testId}--open-time-button`));

				expect(onMenuOpen).toHaveBeenCalledTimes(defaultIsOpen ? 0 : 1);
				expect(onMenuClose).toHaveBeenCalledTimes(defaultIsOpen ? 1 : 0);
				if (defaultIsOpen) {
					expect(queryMenu()).not.toBeInTheDocument();
				} else {
					expect(queryMenu()).toBeVisible();
				}
			},
		);

		it('should open the menu when the time button is activated with the keyboard', async () => {
			const user = userEvent.setup();
			render(createTimePicker({ shouldShowTimeButton: true }));

			await user.tab();
			await user.tab();
			await user.keyboard('{Enter}');

			expect(queryMenu()).toBeVisible();
			expect(getInput()).toHaveFocus();
		});

		it('should move focus to the input when the time button is activated with space', async () => {
			const user = userEvent.setup();
			render(createTimePicker({ shouldShowTimeButton: true }));

			await user.tab();
			await user.tab();
			await user.keyboard(' ');

			expect(queryMenu()).toBeVisible();
			expect(getInput()).toHaveFocus();
		});

		it('should open the menu when the user types in the input', async () => {
			const user = userEvent.setup();
			render(createTimePicker({ shouldShowTimeButton: true }));

			await user.tab();
			await user.keyboard('1');

			expect(queryMenu()).toBeVisible();
		});
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

	describe('Placeholder', () => {
		const defaultPlaceholder = '1:00 PM';

		it('should show default placeholder if none provided', () => {
			render(createTimePicker());

			const input = getInput();
			expect(input).toHaveValue('');
			expect(screen.getByText(defaultPlaceholder)).toBeInTheDocument();
		});

		it('should show a placeholder if provided', () => {
			const placeholder = 'placeholder';
			render(createTimePicker({ placeholder }));

			const input = getInput();
			expect(input).toHaveValue('');
			expect(screen.getByText(placeholder)).toBeInTheDocument();
		});
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

	describe('Clearing the input', () => {
		it('should not show the clear button if a value is not present', () => {
			render(createTimePicker());
			const clearButton = screen.queryByRole('button', { name: /clear/i });
			expect(clearButton).not.toBeInTheDocument();
		});

		it('should show the clear button if a value is present', () => {
			render(createTimePicker({ value: '15:32' }));
			const clearButton = screen.getByRole('button', { name: /clear/i });
			expect(clearButton).toBeInTheDocument();
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

		const input = getInput();
		expect(input).toHaveAttribute('aria-label', label);
	});

	it('should add aria-describedby when prop is supplied', () => {
		const describedBy = 'description';
		render(createTimePicker({ 'aria-describedby': describedBy }));

		const input = getInput();
		expect(input).toHaveAttribute('aria-describedby', expect.stringContaining(describedBy));
	});

	it('should add time to accessible description when `aria-describedby` is not provided', () => {
		const defaultValue = '15:30';
		render(createTimePicker({ defaultValue }));

		const input = getInput();
		expect(input).toHaveAccessibleDescription(expect.stringContaining('3:30'));
	});
});
