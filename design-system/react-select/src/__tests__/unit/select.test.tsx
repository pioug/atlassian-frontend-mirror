/* eslint-disable testing-library/prefer-user-event */
/* eslint-disable @repo/internal/react/boolean-prop-naming-convention */
/* eslint-disable testing-library/no-container,testing-library/no-node-access */
// @ts-nocheck
import React, { type KeyboardEvent } from 'react';

import { type EventType, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import cases from 'jest-in-case';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import { type AriaLiveMessages } from '../../accessibility';
import { type FilterOptionOption } from '../../filters';
import Select, { type FormatOptionLabelMeta } from '../../select';
import { type GroupBase } from '../../types';
import { noop } from '../../utils';

import {
	type GroupedOption,
	type Option,
	type OptionBooleanValue,
	type OptionNumberValue,
	OPTIONS,
	OPTIONS_ACCENTED,
	OPTIONS_BOOLEAN_VALUE,
	OPTIONS_DISABLED,
	OPTIONS_GROUPED,
	OPTIONS_NUMBER_VALUE,
} from './constants.mock';

const testId = 'react-select';

interface BasicProps {
	readonly classNamePrefix: string;
	readonly testId?: string;
	readonly onChange: () => void;
	readonly onInputChange: () => void;
	readonly onMenuClose: () => void;
	readonly onMenuOpen: () => void;
	readonly name: string;
	readonly options: readonly Option[];
	readonly inputValue: string;
	readonly value: null;
}

const BASIC_PROPS: BasicProps = {
	classNamePrefix: testId,
	testId: testId,
	onChange: jest.fn(),
	onInputChange: jest.fn(),
	onMenuClose: jest.fn(),
	onMenuOpen: jest.fn(),
	name: 'test-input-name',
	options: OPTIONS,
	inputValue: '',
	value: null,
};

test('instanceId prop > to have instanceId as id prefix for the select components', () => {
	render(<Select {...BASIC_PROPS} menuIsOpen instanceId={'custom-id'} />);
	expect(screen.getByTestId(`${testId}-select--input`).id).toContain('custom-id');
	screen.getAllByRole('option').forEach((opt) => {
		expect(opt.id).toContain('custom-id');
	});
});

test('hidden input field is not present if name is not passes', () => {
	let { container } = render(
		<Select
			onChange={noop}
			onInputChange={noop}
			onMenuOpen={noop}
			onMenuClose={noop}
			inputValue=""
			value={null}
			options={OPTIONS}
		/>,
	);
	expect(container.querySelector('input[type="hidden"]')).toBeNull();
});

test('hidden input field is present if name passes', () => {
	let { container } = render(
		<Select
			onChange={noop}
			onInputChange={noop}
			onMenuOpen={noop}
			onMenuClose={noop}
			inputValue=""
			value={null}
			name="test-input-name"
			options={OPTIONS}
		/>,
	);
	expect(container.querySelector('input[type="hidden"]')).toBeTruthy();
});

test('single select > passing multiple values > should select the first value', () => {
	const props = { ...BASIC_PROPS, value: [OPTIONS[0], OPTIONS[4]] };
	render(<Select {...props} />);

	expect(screen.getByTestId(`${testId}-select--control`)!).toHaveTextContent('0');
});

test('isRtl boolean prop sets direction: rtl on container', () => {
	render(<Select {...BASIC_PROPS} value={[OPTIONS[0]]} isRtl isClearable />);
	expect(screen.getByTestId(`${testId}-select--container`)).toHaveStyle('direction: rtl');
});

test('isOptionSelected() prop > single select > mark value as isSelected if isOptionSelected returns true for the option', () => {
	// Select all but option with label '1'
	let isOptionSelected = jest.fn((option) => option.label !== '1');
	render(
		<Select
			{...BASIC_PROPS}
			classNamePrefix={testId}
			isOptionSelected={isOptionSelected}
			menuIsOpen
		/>,
	);
	let options = screen.getAllByRole('option');

	// Option label 0 to be selected
	expect(options[0]).toHaveClass('react-select__option--is-selected');
	// Option label 1 to be not selected
	expect(options[1]).not.toHaveClass('react-select__option--is-selected');
});

test('isOptionSelected() prop > multi select > to not show the selected options in Menu for multiSelect', () => {
	// Select all but option with label '1'
	let isOptionSelected = jest.fn((option) => option.label !== '1');
	render(<Select {...BASIC_PROPS} isMulti isOptionSelected={isOptionSelected} menuIsOpen />);

	expect(screen.getAllByRole('option')!).toHaveLength(1);
	expect(screen.getByRole('option')!).toHaveTextContent('1');
});

cases(
	'formatOptionLabel',
	({ props, valueComponentSelector, expectedOptions }) => {
		render(<Select {...props} />);
		let value = screen.getByTestId(valueComponentSelector);
		expect(value!).toHaveTextContent(expectedOptions);
	},
	{
		'single select > should format label of options according to text returned by formatOptionLabel':
			{
				props: {
					...BASIC_PROPS,
					formatOptionLabel: (
						{ label, value }: Option,
						{ context }: FormatOptionLabelMeta<Option>,
					) => `${label} ${value} ${context}`,
					value: OPTIONS[0],
				},
				valueComponentSelector: `${testId}-select--value-container`,
				expectedOptions: '0 zero value',
			},
		'multi select > should format label of options according to text returned by formatOptionLabel':
			{
				props: {
					...BASIC_PROPS,
					formatOptionLabel: (
						{ label, value }: Option,
						{ context }: FormatOptionLabelMeta<Option>,
					) => `${label} ${value} ${context}`,
					isMulti: true,
					value: OPTIONS[0],
				},
				valueComponentSelector: `${testId}-select--multivalue-0`,
				expectedOptions: '0 zero value',
			},
	},
);

cases(
	'name prop',
	({ expectedName, props }) => {
		let { container } = render(<Select {...props} />);
		let input = container.querySelector<HTMLInputElement>('input[type=hidden]');

		expect(input!.name).toBe(expectedName);
	},
	{
		'single select > should assign the given name': {
			props: { ...BASIC_PROPS, name: 'form-field-single-select' },
			expectedName: 'form-field-single-select',
		},
		'multi select > should assign the given name': {
			props: {
				...BASIC_PROPS,
				name: 'form-field-multi-select',
				isMulti: true,
				value: OPTIONS[2],
			},
			expectedName: 'form-field-multi-select',
		},
	},
);

cases(
	'menuIsOpen prop',
	({ props = BASIC_PROPS }) => {
		let { rerender } = render(<Select {...props} />);
		expect(screen.queryByTestId(`${testId}-select--listbox-container`)).not.toBeInTheDocument();

		rerender(<Select {...props} menuIsOpen />);
		expect(screen.getByTestId(`${testId}-select--listbox-container`)).toBeInTheDocument();

		rerender(<Select {...props} />);
		expect(screen.queryByTestId(`${testId}-select--listbox-container`)).not.toBeInTheDocument();
	},
	{
		'single select > should show menu if menuIsOpen is true and hide menu if menuIsOpen prop is false':
			{},
		'multi select > should show menu if menuIsOpen is true and hide menu if menuIsOpen prop is false':
			{
				props: {
					...BASIC_PROPS,
					isMulti: true,
				},
			},
	},
);

cases(
	'filterOption() prop - default filter behavior',
	({ props, searchString, expectResultsLength }) => {
		let { rerender } = render(<Select {...props} />);
		rerender(<Select {...props} inputValue={searchString} />);
		expect(screen.getAllByRole('option')).toHaveLength(expectResultsLength);
	},
	{
		'single select > should match accented char': {
			props: {
				...BASIC_PROPS,
				menuIsOpen: true,
				options: OPTIONS_ACCENTED,
			},
			searchString: 'ecole', // should match "école"
			expectResultsLength: 1,
		},
		'single select > should ignore accented char in query': {
			props: {
				...BASIC_PROPS,
				menuIsOpen: true,
				options: OPTIONS_ACCENTED,
			},
			searchString: 'schoöl', // should match "school"
			expectResultsLength: 1,
		},
	},
);

cases(
	'filterOption() prop - should filter only if function returns truthy for value',
	({ props, searchString, expectResultsLength }) => {
		let { rerender } = render(<Select {...props} />);
		rerender(<Select {...props} inputValue={searchString} />);
		expect(screen.getAllByRole('option')).toHaveLength(expectResultsLength);
	},
	{
		'single select > should filter all options as per searchString': {
			props: {
				...BASIC_PROPS,
				filterOption: (value: FilterOptionOption<Option>, search: string) =>
					value.value.indexOf(search) > -1,
				menuIsOpen: true,
				value: OPTIONS[0],
			},
			searchString: 'o',
			expectResultsLength: 5,
		},
		'multi select > should filter all options other that options in value of select': {
			props: {
				...BASIC_PROPS,
				filterOption: (value: FilterOptionOption<Option>, search: string) =>
					value.value.indexOf(search) > -1,
				isMulti: true,
				menuIsOpen: true,
				value: OPTIONS[0],
			},
			searchString: 'o',
			expectResultsLength: 4,
		},
	},
);

cases(
	'filterOption prop is null',
	({ props, searchString, expectResultsLength }) => {
		let { rerender } = render(<Select {...props} />);
		rerender(<Select {...props} inputValue={searchString} />);
		expect(screen.getAllByRole('option')).toHaveLength(expectResultsLength);
	},
	{
		'single select > should show all the options': {
			props: {
				...BASIC_PROPS,
				filterOption: null,
				menuIsOpen: true,
				value: OPTIONS[0],
			},
			searchString: 'o',
			expectResultsLength: 17,
		},
		'multi select > should show all the options other than selected options': {
			props: {
				...BASIC_PROPS,
				filterOption: null,
				isMulti: true,
				menuIsOpen: true,
				value: OPTIONS[0],
			},
			searchString: 'o',
			expectResultsLength: 16,
		},
	},
);

cases(
	'no option found on search based on filterOption prop',
	({ props, searchString }) => {
		let { rerender } = render(<Select {...props} />);
		rerender(<Select {...props} inputValue={searchString} />);
		expect(screen.getByText('No options')).toBeInTheDocument();
	},
	{
		'single Select > should show NoOptionsMessage': {
			props: {
				...BASIC_PROPS,
				filterOption: (value: FilterOptionOption<Option>, search: string) =>
					value.value.indexOf(search) > -1,
				menuIsOpen: true,
			},
			searchString: 'some text not in options',
		},
		'multi select > should show NoOptionsMessage': {
			props: {
				...BASIC_PROPS,
				filterOption: (value: FilterOptionOption<Option>, search: string) =>
					value.value.indexOf(search) > -1,
				menuIsOpen: true,
			},
			searchString: 'some text not in options',
		},
	},
);

cases(
	'noOptionsMessage() function prop',
	({ props, expectNoOptionsMessage, searchString }) => {
		let { rerender } = render(<Select {...props} />);
		rerender(<Select {...props} inputValue={searchString} />);
		expect(screen.getByText(expectNoOptionsMessage)).toBeInTheDocument();
	},
	{
		'single Select > should show NoOptionsMessage returned from noOptionsMessage function prop': {
			props: {
				...BASIC_PROPS,
				filterOption: (value: FilterOptionOption<Option>, search: string) =>
					value.value.indexOf(search) > -1,
				menuIsOpen: true,
				noOptionsMessage: () => 'this is custom no option message for single select',
			},
			expectNoOptionsMessage: 'this is custom no option message for single select',
			searchString: 'some text not in options',
		},
		'multi select > should show NoOptionsMessage returned from noOptionsMessage function prop': {
			props: {
				...BASIC_PROPS,
				filterOption: (value: FilterOptionOption<Option>, search: string) =>
					value.value.indexOf(search) > -1,
				menuIsOpen: true,
				noOptionsMessage: () => 'this is custom no option message for multi select',
			},
			expectNoOptionsMessage: 'this is custom no option message for multi select',
			searchString: 'some text not in options',
		},
	},
);

cases(
	'value prop',
	({ props, expectedValue }) => {
		let value;
		render(
			<Select<Option | OptionNumberValue, boolean>
				{...props}
				components={{
					Control: ({ getValue }) => {
						value = getValue();
						return null;
					},
				}}
			/>,
		);
		expect(value).toEqual(expectedValue);
	},
	{
		'single select > should set it as initial value': {
			props: {
				...BASIC_PROPS,
				value: OPTIONS[2],
			},
			expectedValue: [{ label: '2', value: 'two' }],
		},
		'single select > with option values as number > should set it as initial value': {
			props: {
				...BASIC_PROPS,
				value: OPTIONS_NUMBER_VALUE[2],
			},
			expectedValue: [{ label: '2', value: 2 }],
		},
		'multi select > should set it as initial value': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
				value: OPTIONS[1],
			},
			expectedValue: [{ label: '1', value: 'one' }],
		},
		'multi select > with option values as number > should set it as initial value': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
				value: OPTIONS_NUMBER_VALUE[1],
			},
			expectedValue: [{ label: '1', value: 1 }],
		},
	},
);

cases(
	'update the value prop',
	({
		props = { ...BASIC_PROPS, value: OPTIONS[1] },
		updateValueTo,
		expectedInitialValue,
		expectedUpdatedValue,
	}) => {
		let { container, rerender } = render(
			<Select<Option | OptionNumberValue, boolean> {...props} />,
		);
		expect(container.querySelector<HTMLInputElement>('input[type="hidden"]')!.value).toEqual(
			expectedInitialValue,
		);

		rerender(<Select<Option | OptionNumberValue, boolean> {...props} value={updateValueTo} />);

		expect(container.querySelector<HTMLInputElement>('input[type="hidden"]')!.value).toEqual(
			expectedUpdatedValue,
		);
	},
	{
		'single select > should update the value when prop is updated': {
			updateValueTo: OPTIONS[3],
			expectedInitialValue: 'one',
			expectedUpdatedValue: 'three',
		},
		'single select > value of options is number > should update the value when prop is updated': {
			props: {
				...BASIC_PROPS,
				options: OPTIONS_NUMBER_VALUE,
				value: OPTIONS_NUMBER_VALUE[2],
			},
			updateValueTo: OPTIONS_NUMBER_VALUE[3],
			expectedInitialValue: '2',
			expectedUpdatedValue: '3',
		},
		'multi select > should update the value when prop is updated': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
				value: OPTIONS[1],
			},
			updateValueTo: OPTIONS[3],
			expectedInitialValue: 'one',
			expectedUpdatedValue: 'three',
		},
		'multi select > value of options is number > should update the value when prop is updated': {
			props: {
				...BASIC_PROPS,
				delimiter: ',',
				isMulti: true,
				options: OPTIONS_NUMBER_VALUE,
				value: OPTIONS_NUMBER_VALUE[2],
			},
			updateValueTo: [OPTIONS_NUMBER_VALUE[3], OPTIONS_NUMBER_VALUE[2]],
			expectedInitialValue: '2',
			expectedUpdatedValue: '3,2',
		},
	},
);

cases(
	'calls onChange on selecting an option',
	({
		props = { ...BASIC_PROPS, menuIsOpen: true },
		event: [eventName, eventOptions],
		expectedSelectedOption,
		optionsSelected,
		focusedOption,
		expectedActionMetaOption,
	}) => {
		let onChangeSpy = jest.fn();
		props = { ...props, onChange: onChangeSpy };
		let { container } = render(
			<Select<Option | OptionNumberValue | OptionBooleanValue, boolean> {...props} />,
		);

		if (focusedOption) {
			focusOption(container, focusedOption, props.options);
		}

		let selectOption = screen.getByRole('option', { name: optionsSelected.label });

		fireEvent[eventName](selectOption!, eventOptions);
		expect(onChangeSpy).toHaveBeenCalledWith(expectedSelectedOption, {
			action: 'select-option',
			option: expectedActionMetaOption,
			name: BASIC_PROPS.name,
		});
	},
	{
		'single select > option is clicked > should call onChange() prop with selected option': {
			event: ['click' as const] as const,
			optionsSelected: { label: '2', value: 'two' },
			expectedSelectedOption: { label: '2', value: 'two' },
		},
		'single select > option with number value > option is clicked > should call onChange() prop with selected option':
			{
				props: {
					...BASIC_PROPS,
					menuIsOpen: true,
					options: OPTIONS_NUMBER_VALUE,
				},
				event: ['click' as const] as const,
				optionsSelected: { label: '0', value: 0 },
				expectedSelectedOption: { label: '0', value: 0 },
			},
		'single select > option with boolean value > option is clicked > should call onChange() prop with selected option':
			{
				props: {
					...BASIC_PROPS,
					menuIsOpen: true,
					options: OPTIONS_BOOLEAN_VALUE,
				},
				event: ['click' as const] as const,
				optionsSelected: { label: 'true', value: true },
				expectedSelectedOption: { label: 'true', value: true },
			},
		'single select > tab key is pressed while focusing option > should call onChange() prop with selected option':
			{
				event: ['keyDown' as const, { keyCode: 9, key: 'Tab' }] as const,
				optionsSelected: { label: '1', value: 'one' },
				focusedOption: { label: '1', value: 'one' },
				expectedSelectedOption: { label: '1', value: 'one' },
			},
		'single select > enter key is pressed while focusing option > should call onChange() prop with selected option':
			{
				event: ['keyDown' as const, { keyCode: 13, key: 'Enter' }] as const,
				optionsSelected: { label: '3', value: 'three' },
				focusedOption: { label: '3', value: 'three' },
				expectedSelectedOption: { label: '3', value: 'three' },
			},
		'single select > space key is pressed while focusing option > should call onChange() prop with selected option':
			{
				event: ['keyDown' as const, { keyCode: 32, key: ' ' }] as const,
				optionsSelected: { label: '1', value: 'one' },
				focusedOption: { label: '1', value: 'one' },
				expectedSelectedOption: { label: '1', value: 'one' },
			},
		'multi select > option is clicked > should call onChange() prop with selected option': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
				menuIsOpen: true,
				options: OPTIONS,
			},
			event: ['click' as const] as const,
			optionsSelected: { label: '2', value: 'two' },
			expectedSelectedOption: [{ label: '2', value: 'two' }],
			expectedActionMetaOption: { label: '2', value: 'two' },
		},
		'multi select > option with number value > option is clicked > should call onChange() prop with selected option':
			{
				props: {
					...BASIC_PROPS,
					isMulti: true,
					menuIsOpen: true,
					options: OPTIONS_NUMBER_VALUE,
				},
				event: ['click' as const] as const,
				optionsSelected: { label: '0', value: 0 },
				expectedSelectedOption: [{ label: '0', value: 0 }],
				expectedActionMetaOption: { label: '0', value: 0 },
			},
		'multi select > option with boolean value > option is clicked > should call onChange() prop with selected option':
			{
				props: {
					...BASIC_PROPS,
					isMulti: true,
					menuIsOpen: true,
					options: OPTIONS_BOOLEAN_VALUE,
				},
				event: ['click' as const] as const,
				optionsSelected: { label: 'true', value: true },
				expectedSelectedOption: [{ label: 'true', value: true }],
				expectedActionMetaOption: { label: 'true', value: true },
			},
		'multi select > tab key is pressed while focusing option > should call onChange() prop with selected option':
			{
				props: {
					...BASIC_PROPS,
					isMulti: true,
					menuIsOpen: true,
					options: OPTIONS,
				},
				event: ['keyDown' as const, { keyCode: 9, key: 'Tab' }] as const,
				menuIsOpen: true,
				optionsSelected: { label: '1', value: 'one' },
				focusedOption: { label: '1', value: 'one' },
				expectedSelectedOption: [{ label: '1', value: 'one' }],
				expectedActionMetaOption: { label: '1', value: 'one' },
			},
		'multi select > enter key is pressed while focusing option > should call onChange() prop with selected option':
			{
				props: {
					...BASIC_PROPS,
					isMulti: true,
					menuIsOpen: true,
					options: OPTIONS,
				},
				event: ['keyDown' as const, { keyCode: 13, key: 'Enter' }] as const,
				optionsSelected: { label: '3', value: 'three' },
				focusedOption: { label: '3', value: 'three' },
				expectedSelectedOption: [{ label: '3', value: 'three' }],
				expectedActionMetaOption: { label: '3', value: 'three' },
			},
		'multi select > space key is pressed while focusing option > should call onChange() prop with selected option':
			{
				props: {
					...BASIC_PROPS,
					isMulti: true,
					menuIsOpen: true,
					options: OPTIONS,
				},
				event: ['keyDown' as const, { keyCode: 32, key: ' ' }] as const,
				optionsSelected: { label: '1', value: 'one' },
				focusedOption: { label: '1', value: 'one' },
				expectedSelectedOption: [{ label: '1', value: 'one' }],
				expectedActionMetaOption: { label: '1', value: 'one' },
			},
	},
);

interface CallsOnChangeOnDeselectOptsProps extends Omit<BasicProps, 'options' | 'value'> {
	readonly options: readonly (Option | OptionNumberValue | OptionBooleanValue)[];
	readonly value:
		| readonly Option[]
		| readonly OptionNumberValue[]
		| readonly OptionBooleanValue[]
		| Option;
	readonly menuIsOpen?: boolean;
	readonly hideSelectedOptions?: boolean;
	readonly isMulti?: boolean;
}

interface CallsOnOnDeselectChangeOpts {
	readonly props: CallsOnChangeOnDeselectOptsProps;
	readonly event: readonly [EventType] | readonly [EventType, {}];
	readonly menuIsOpen?: boolean;
	readonly optionsSelected: Option | OptionNumberValue | OptionBooleanValue;
	readonly focusedOption?: Option | OptionNumberValue | OptionBooleanValue;
	readonly expectedSelectedOption:
		| readonly Option[]
		| readonly OptionNumberValue[]
		| readonly OptionBooleanValue[];
	readonly expectedMetaOption: Option | OptionNumberValue | OptionBooleanValue;
}

cases<CallsOnOnDeselectChangeOpts>(
	'calls onChange on de-selecting an option in multi select',
	({
		props,
		event: [eventName, eventOptions],
		expectedSelectedOption,
		expectedMetaOption,
		optionsSelected,
		focusedOption,
	}) => {
		let onChangeSpy = jest.fn();
		props = {
			...props,
			onChange: onChangeSpy,
			menuIsOpen: true,
			hideSelectedOptions: false,
			isMulti: true,
		};
		let { container } = render(
			<Select<Option | OptionNumberValue | OptionBooleanValue, boolean> {...props} />,
		);

		let selectOption = [...screen.getAllByRole('option')].find(
			(n) => n.textContent === optionsSelected.label,
		);
		if (focusedOption) {
			focusOption(container, focusedOption, props.options);
		}
		fireEvent[eventName](selectOption!, eventOptions);
		expect(onChangeSpy).toHaveBeenCalledWith(expectedSelectedOption, {
			action: 'deselect-option',
			option: expectedMetaOption,
			name: BASIC_PROPS.name,
		});
	},
	{
		'option is clicked > should call onChange() prop with correct selected options and meta': {
			props: {
				...BASIC_PROPS,
				options: OPTIONS,
				value: [{ label: '2', value: 'two' }],
			},
			event: ['click'],
			optionsSelected: { label: '2', value: 'two' },
			expectedSelectedOption: [],
			expectedMetaOption: { label: '2', value: 'two' },
		},
		'option with number value > option is clicked > should call onChange() prop with selected option':
			{
				props: {
					...BASIC_PROPS,
					options: OPTIONS_NUMBER_VALUE,
					value: [{ label: '0', value: 0 }],
				},
				event: ['click'],
				optionsSelected: { label: '0', value: 0 },
				expectedSelectedOption: [],
				expectedMetaOption: { label: '0', value: 0 },
			},
		'option with boolean value > option is clicked > should call onChange() prop with selected option':
			{
				props: {
					...BASIC_PROPS,
					options: OPTIONS_BOOLEAN_VALUE,
					value: [{ label: 'true', value: true }],
				},
				event: ['click'],
				optionsSelected: { label: 'true', value: true },
				expectedSelectedOption: [],
				expectedMetaOption: { label: 'true', value: true },
			},
		'tab key is pressed while focusing option > should call onChange() prop with selected option': {
			props: {
				...BASIC_PROPS,
				options: OPTIONS,
				value: [{ label: '1', value: 'one' }],
			},
			event: ['keyDown', { keyCode: 9, key: 'Tab' }],
			menuIsOpen: true,
			optionsSelected: { label: '1', value: 'one' },
			focusedOption: { label: '1', value: 'one' },
			expectedSelectedOption: [],
			expectedMetaOption: { label: '1', value: 'one' },
		},
		'enter key is pressed while focusing option > should call onChange() prop with selected option':
			{
				props: {
					...BASIC_PROPS,
					options: OPTIONS,
					value: { label: '3', value: 'three' },
				},
				event: ['keyDown', { keyCode: 13, key: 'Enter' }],
				optionsSelected: { label: '3', value: 'three' },
				focusedOption: { label: '3', value: 'three' },
				expectedSelectedOption: [],
				expectedMetaOption: { label: '3', value: 'three' },
			},
		'space key is pressed while focusing option > should call onChange() prop with selected option':
			{
				props: {
					...BASIC_PROPS,
					options: OPTIONS,
					value: [{ label: '1', value: 'one' }],
				},
				event: ['keyDown', { keyCode: 32, key: ' ' }],
				optionsSelected: { label: '1', value: 'one' },
				focusedOption: { label: '1', value: 'one' },
				expectedSelectedOption: [],
				expectedMetaOption: { label: '1', value: 'one' },
			},
	},
);

async function focusOption(
	container: HTMLElement,
	option: Option | OptionNumberValue | OptionBooleanValue,
	options: readonly (Option | OptionNumberValue | OptionBooleanValue)[],
) {
	let indexOfSelectedOption = options.findIndex((o) => o.value === option.value);

	for (let i = -1; i < indexOfSelectedOption; i++) {
		fireEvent.keyDown(screen.getByTestId(`${testId}-select--listbox-container`)!, {
			keyCode: 40,
			key: 'ArrowDown',
		});
	}
	expect(container.querySelector('.react-select__option--is-focused')!).toHaveTextContent(
		option.label,
	);
}

cases(
	'hitting escape on select option',
	({ props, event: [eventName, eventOptions], focusedOption, optionsSelected }) => {
		let onChangeSpy = jest.fn();
		let { container } = render(
			<Select
				{...props}
				onChange={onChangeSpy}
				onInputChange={jest.fn()}
				onMenuClose={jest.fn()}
			/>,
		);
		const user = userEvent.setup();

		let selectOption = screen.getByRole('option', { name: optionsSelected.label });
		focusOption(container, focusedOption, props.options);

		user[eventName](selectOption!, eventOptions);
		expect(onChangeSpy).not.toHaveBeenCalled();
	},
	{
		'single select > should not call onChange prop': {
			props: {
				...BASIC_PROPS,
				menuIsOpen: true,
			},
			optionsSelected: { label: '1', value: 'one' },
			focusedOption: { label: '1', value: 'one' },
			event: ['type', '{esc}'] as const,
		},
		'multi select > should not call onChange prop': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
				menuIsOpen: true,
			},
			optionsSelected: { label: '1', value: 'one' },
			focusedOption: { label: '1', value: 'one' },
			event: ['type', '{esc}'] as const,
		},
	},
);

cases(
	'click to open select',
	async ({ props = BASIC_PROPS, expectedToFocus }) => {
		let { container, rerender } = render(
			<Select
				{...props}
				onMenuOpen={() => {
					rerender(<Select {...props} menuIsOpen onMenuOpen={noop} />);
				}}
			/>,
		);

		const user = userEvent.setup();
		await user.click(screen.getByTestId(`${testId}-select--dropdown-indicator`)!);
		expect(container.querySelector('.react-select__option--is-focused')!).toHaveTextContent(
			expectedToFocus.label,
		);
	},
	{
		'single select > should focus the first option': {
			expectedToFocus: { label: '0', value: 'zero' },
		},
		'multi select > should focus the first option': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
			},
			expectedToFocus: { label: '0', value: 'zero' },
		},
	},
);

test('clicking when focused does not open select when openMenuOnClick=false', async () => {
	let spy = jest.fn();
	render(<Select {...BASIC_PROPS} openMenuOnClick={false} onMenuOpen={spy} />);

	// this will get updated on input click, though click on input is not bubbling up to control component
	const user = userEvent.setup();
	await user.click(screen.getByTestId(`${testId}-select--input`)!);
	expect(spy).not.toHaveBeenCalled();
});

cases(
	'focus on options > keyboard interaction with Menu',
	({ props, selectedOption, nextFocusOption, keyEvent = [] }) => {
		let { container } = render(<Select {...props} />);

		let indexOfSelectedOption = props.options.indexOf(selectedOption);
		const user = userEvent.setup();

		for (let i = -1; i < indexOfSelectedOption; i++) {
			fireEvent.keyDown(screen.getByTestId(`${testId}-select--listbox-container`)!, {
				keyCode: 40,
				key: 'ArrowDown',
			});
		}

		expect(container.querySelector('.react-select__option--is-focused')!).toHaveTextContent(
			selectedOption.label,
		);

		for (let event of keyEvent) {
			fireEvent.keyDown(screen.getByTestId(`${testId}-select--listbox-container`)!, event);
		}

		expect(container.querySelector('.react-select__option--is-focused')!).toHaveTextContent(
			nextFocusOption.label,
		);
	},
	{
		'single select > ArrowDown key on first option should focus second option': {
			props: {
				...BASIC_PROPS,
				menuIsOpen: true,
			},
			keyEvent: [{ keyCode: 40, key: 'ArrowDown' }],
			selectedOption: OPTIONS[0],
			nextFocusOption: OPTIONS[1],
		},
		'single select > ArrowDown key on last option should focus first option': {
			props: {
				...BASIC_PROPS,
				menuIsOpen: true,
				options: OPTIONS,
			},
			keyEvent: [{ keyCode: 40, key: 'ArrowDown' }],
			selectedOption: OPTIONS[OPTIONS.length - 1],
			nextFocusOption: OPTIONS[0],
		},
		'single select > ArrowUp key on first option should focus last option': {
			props: {
				...BASIC_PROPS,
				menuIsOpen: true,
				options: OPTIONS,
			},
			keyEvent: [{ keyCode: 38, key: 'ArrowUp' }],
			selectedOption: OPTIONS[0],
			nextFocusOption: OPTIONS[OPTIONS.length - 1],
		},
		'single select > ArrowUp key on last option should focus second last option': {
			props: {
				...BASIC_PROPS,
				menuIsOpen: true,
				options: OPTIONS,
			},
			keyEvent: [{ keyCode: 38, key: 'ArrowUp' }],
			selectedOption: OPTIONS[OPTIONS.length - 1],
			nextFocusOption: OPTIONS[OPTIONS.length - 2],
		},
		'single select > disabled options should be focusable': {
			props: {
				...BASIC_PROPS,
				menuIsOpen: true,
				options: OPTIONS_DISABLED,
			},
			keyEvent: [{ keyCode: 40, key: 'ArrowDown' }],
			selectedOption: OPTIONS_DISABLED[0],
			nextFocusOption: OPTIONS_DISABLED[1],
		},
		'single select > PageDown key takes us to next page with default page size of 5': {
			props: {
				...BASIC_PROPS,
				menuIsOpen: true,
				options: OPTIONS,
			},
			keyEvent: [{ keyCode: 34, key: 'PageDown' }],
			selectedOption: OPTIONS[0],
			nextFocusOption: OPTIONS[5],
		},
		'single select > PageDown key takes us to next page with custom pageSize 7': {
			props: {
				...BASIC_PROPS,
				menuIsOpen: true,
				pageSize: 7,
				options: OPTIONS,
			},
			keyEvent: [{ keyCode: 34, key: 'PageDown' }],
			selectedOption: OPTIONS[0],
			nextFocusOption: OPTIONS[7],
		},
		'single select > PageDown key takes to the last option is options below is less then page size':
			{
				props: {
					...BASIC_PROPS,
					menuIsOpen: true,
					options: OPTIONS,
				},
				keyEvent: [{ keyCode: 34, key: 'PageDown' }],
				selectedOption: OPTIONS[OPTIONS.length - 3],
				nextFocusOption: OPTIONS[OPTIONS.length - 1],
			},
		'single select > PageUp key takes us to previous page with default page size of 5': {
			props: {
				...BASIC_PROPS,
				menuIsOpen: true,
				options: OPTIONS,
			},
			keyEvent: [{ keyCode: 33, key: 'PageUp' }],
			selectedOption: OPTIONS[6],
			nextFocusOption: OPTIONS[1],
		},
		'single select > PageUp key takes us to previous page with custom pageSize of 7': {
			props: {
				...BASIC_PROPS,
				menuIsOpen: true,
				pageSize: 7,
				options: OPTIONS,
			},
			keyEvent: [{ keyCode: 33, key: 'PageUp' }],
			selectedOption: OPTIONS[9],
			nextFocusOption: OPTIONS[2],
		},
		'single select > PageUp key takes us to first option - (previous options < pageSize)': {
			props: {
				...BASIC_PROPS,
				menuIsOpen: true,
				options: OPTIONS,
			},
			keyEvent: [{ keyCode: 33, key: 'PageUp' }],
			selectedOption: OPTIONS[1],
			nextFocusOption: OPTIONS[0],
		},
		'single select > Home key takes up to the first option': {
			props: {
				...BASIC_PROPS,
				menuIsOpen: true,
				options: OPTIONS,
			},
			keyEvent: [{ keyCode: 36, key: 'Home' }],
			selectedOption: OPTIONS[OPTIONS.length - 3],
			nextFocusOption: OPTIONS[0],
		},
		'single select > End key takes down to the last option': {
			props: {
				...BASIC_PROPS,
				menuIsOpen: true,
				options: OPTIONS,
			},
			keyEvent: [{ keyCode: 35, key: 'End' }],
			selectedOption: OPTIONS[2],
			nextFocusOption: OPTIONS[OPTIONS.length - 1],
		},
		'multi select > ArrowDown key on first option should focus second option': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
				menuIsOpen: true,
				options: OPTIONS,
			},
			keyEvent: [{ keyCode: 40, key: 'ArrowDown' }],
			selectedOption: OPTIONS[0],
			nextFocusOption: OPTIONS[1],
		},
		'multi select > ArrowDown key on last option should focus first option': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
				menuIsOpen: true,
				options: OPTIONS,
			},
			keyEvent: [{ keyCode: 40, key: 'ArrowDown' }],
			selectedOption: OPTIONS[OPTIONS.length - 1],
			nextFocusOption: OPTIONS[0],
		},
		'multi select > ArrowUp key on first option should focus last option': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
				menuIsOpen: true,
				options: OPTIONS,
			},
			keyEvent: [{ keyCode: 38, key: 'ArrowUp' }],
			selectedOption: OPTIONS[0],
			nextFocusOption: OPTIONS[OPTIONS.length - 1],
		},
		'multi select > ArrowUp key on last option should focus second last option': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
				menuIsOpen: true,
				options: OPTIONS,
			},
			keyEvent: [{ keyCode: 38, key: 'ArrowUp' }],
			selectedOption: OPTIONS[OPTIONS.length - 1],
			nextFocusOption: OPTIONS[OPTIONS.length - 2],
		},
		'multi select > PageDown key takes us to next page with default page size of 5': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
				menuIsOpen: true,
				options: OPTIONS,
			},
			keyEvent: [{ keyCode: 34, key: 'PageDown' }],
			selectedOption: OPTIONS[0],
			nextFocusOption: OPTIONS[5],
		},
		'multi select > PageDown key takes us to next page with custom pageSize of 8': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
				menuIsOpen: true,
				pageSize: 8,
				options: OPTIONS,
			},
			keyEvent: [{ keyCode: 34, key: 'PageDown' }],
			selectedOption: OPTIONS[0],
			nextFocusOption: OPTIONS[8],
		},
		'multi select > PageDown key takes to the last option is options below is less then page size':
			{
				props: {
					...BASIC_PROPS,
					isMulti: true,
					menuIsOpen: true,
					options: OPTIONS,
				},
				keyEvent: [{ keyCode: 34, key: 'PageDown' }],
				selectedOption: OPTIONS[OPTIONS.length - 3],
				nextFocusOption: OPTIONS[OPTIONS.length - 1],
			},
		'multi select > PageUp key takes us to previous page with default page size of 5': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
				menuIsOpen: true,
				options: OPTIONS,
			},
			keyEvent: [{ keyCode: 33, key: 'PageUp' }],
			selectedOption: OPTIONS[6],
			nextFocusOption: OPTIONS[1],
		},
		'multi select > PageUp key takes us to previous page with default page size of 9': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
				menuIsOpen: true,
				pageSize: 9,
				options: OPTIONS,
			},
			keyEvent: [{ keyCode: 33, key: 'PageUp' }],
			selectedOption: OPTIONS[10],
			nextFocusOption: OPTIONS[1],
		},
		'multi select > PageUp key takes us to first option - previous options < pageSize': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
				menuIsOpen: true,
				options: OPTIONS,
			},
			keyEvent: [{ keyCode: 33, key: 'PageUp' }],
			selectedOption: OPTIONS[1],
			nextFocusOption: OPTIONS[0],
		},
		'multi select > Home key takes up to the first option': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
				menuIsOpen: true,
				options: OPTIONS,
			},
			keyEvent: [{ keyCode: 36, key: 'Home' }],
			selectedOption: OPTIONS[OPTIONS.length - 3],
			nextFocusOption: OPTIONS[0],
		},
		'multi select > End key takes down to the last option': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
				menuIsOpen: true,
				options: OPTIONS,
			},
			keyEvent: [{ keyCode: 35, key: 'End' }],
			selectedOption: OPTIONS[2],
			nextFocusOption: OPTIONS[OPTIONS.length - 1],
		},
	},
);

// TODO: Cover more scenario
cases(
	'hitting escape with inputValue in select',
	async ({ props }) => {
		let spy = jest.fn();
		render(<Select {...props} onInputChange={spy} onMenuClose={jest.fn()} />);

		screen.getByTestId(`${testId}-select--input`).focus();
		const user = userEvent.setup();
		await user.keyboard('[Escape]');
		expect(spy).toHaveBeenCalledWith('', {
			action: 'menu-close',
			prevInputValue: 'test',
		});
	},
	{
		'single select > should call onInputChange prop with empty string as inputValue': {
			props: {
				...BASIC_PROPS,
				inputValue: 'test',
				menuIsOpen: true,
				value: OPTIONS[0],
			},
		},
		'multi select > should call onInputChange prop with empty string as inputValue': {
			props: {
				...BASIC_PROPS,
				inputValue: 'test',
				isMulti: true,
				menuIsOpen: true,
				value: OPTIONS[0],
			},
		},
	},
);

cases(
	'Clicking dropdown indicator on select with closed menu with primary button on mouse',
	async ({ props = BASIC_PROPS }) => {
		let onMenuOpenSpy = jest.fn();
		props = { ...props, onMenuOpen: onMenuOpenSpy };
		render(<Select {...props} />);
		// Menu is closed
		expect(screen.queryByTestId(`${testId}-select--listbox-container`)).not.toBeInTheDocument();
		const user = userEvent.setup();
		await user.click(screen.getByTestId(`${testId}-select--dropdown-indicator`)!);
		expect(onMenuOpenSpy).toHaveBeenCalled();
	},
	{
		'single select > should call onMenuOpen prop when select is opened and onMenuClose prop when select is closed':
			{},
		'multi select > should call onMenuOpen prop when select is opened and onMenuClose prop when select is closed':
			{
				props: {
					...BASIC_PROPS,
					isMulti: true,
				},
			},
	},
);

cases(
	'Clicking dropdown indicator on select with open menu with primary button on mouse',
	async ({ props = BASIC_PROPS }) => {
		let onMenuCloseSpy = jest.fn();
		props = { ...props, onMenuClose: onMenuCloseSpy };
		render(<Select {...props} menuIsOpen />);
		// Menu is open
		expect(screen.getByTestId(`${testId}-select--listbox-container`)).toBeInTheDocument();
		const user = userEvent.setup();
		await user.click(screen.getByTestId(`${testId}-select--dropdown-indicator`)!);
		expect(onMenuCloseSpy).toHaveBeenCalled();
	},
	{
		'single select > should call onMenuOpen prop when select is opened and onMenuClose prop when select is closed':
			{},
		'multi select > should call onMenuOpen prop when select is opened and onMenuClose prop when select is closed':
			{
				props: {
					...BASIC_PROPS,
					isMulti: true,
				},
			},
	},
);

interface ClickingEnterOptsProps extends BasicProps {
	readonly menuIsOpen?: boolean;
}

interface ClickingEnterOpts {
	readonly props: ClickingEnterOptsProps;
	readonly expectedValue: boolean;
}

cases<ClickingEnterOpts>(
	'Clicking Enter on a focused select',
	async ({ props, expectedValue }) => {
		let event!: KeyboardEvent<HTMLDivElement>;
		render(
			// eslint-disable-next-line jsx-a11y/no-static-element-interactions
			<div
				onKeyDown={(_event) => {
					event = _event;
					event.persist();
				}}
			>
				<Select {...props} />
			</div>,
		);
		const user = userEvent.setup();
		screen.getByTestId(`${testId}-select--input`).focus();

		if (props.menuIsOpen) {
			await user.keyboard('[ArrowDown]');
		}
		await user.keyboard('[Enter]');
		expect(event.defaultPrevented).toBe(expectedValue);
	},
	{
		'while menuIsOpen && focusedOption && !isComposing  > should invoke event.preventDefault': {
			props: {
				...BASIC_PROPS,
				menuIsOpen: true,
			},
			expectedValue: true,
		},
		'while !menuIsOpen > should not invoke event.preventDefault': {
			props: {
				...BASIC_PROPS,
			},
			expectedValue: false,
		},
	},
);

// QUESTION: Is this test right? I tried right clicking on the dropdown indicator in a browser and the select opened but this test says it shouldn't?
cases(
	'clicking on select using secondary button on mouse',
	({ props = BASIC_PROPS }) => {
		let onMenuOpenSpy = jest.fn();
		let onMenuCloseSpy = jest.fn();
		let { rerender } = render(
			<Select {...props} onMenuClose={onMenuCloseSpy} onMenuOpen={onMenuOpenSpy} />,
		);
		let downButton = screen.getByTestId(`${testId}-select--dropdown-indicator`);

		// does not open menu if menu is closed
		fireEvent.mouseDown(downButton!, { button: 1 });
		expect(onMenuOpenSpy).not.toHaveBeenCalled();

		// does not close menu if menu is opened
		rerender(
			<Select {...props} menuIsOpen onMenuClose={onMenuCloseSpy} onMenuOpen={onMenuOpenSpy} />,
		);
		fireEvent.mouseDown(downButton!, { button: 1 });
		expect(onMenuCloseSpy).not.toHaveBeenCalled();
	},
	{
		'single select > secondary click is ignored > should not call onMenuOpen and onMenuClose prop':
			{
				skip: true,
			},
		'multi select > secondary click is ignored > should not call onMenuOpen and onMenuClose prop': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
			},
			skip: true,
		},
	},
);

interface RequiredOnInputOpts {
	readonly props?: BasicProps;
	readonly isMulti?: boolean;
}

cases<RequiredOnInputOpts>(
	'required on input is not there by default',
	({ props = BASIC_PROPS }) => {
		render(<Select {...props} onInputChange={jest.fn()} />);
		let input = screen.getByTestId<HTMLInputElement>(`${testId}-select--input`);
		expect(input!.required).toBe(false);
	},
	{
		'single select > should not have required attribute': {},
		'multi select > should not have required attribute': { isMulti: true },
	},
);

cases(
	'value of hidden input control',
	({ props, expectedValue }) => {
		let { container } = render(
			<Select<Option | OptionNumberValue | OptionBooleanValue, boolean> {...props} />,
		);
		let hiddenInput = container.querySelector<HTMLInputElement>('input[type="hidden"]');
		expect(hiddenInput!.value).toEqual(expectedValue);
	},
	{
		'single select > should set value of input as value prop': {
			props: {
				...BASIC_PROPS,
				value: OPTIONS[3],
			},
			expectedValue: 'three',
		},
		'single select > options with number values > should set value of input as value prop': {
			props: {
				...BASIC_PROPS,
				options: OPTIONS_NUMBER_VALUE,
				value: OPTIONS_NUMBER_VALUE[3],
			},
			expectedValue: '3',
		},
		'single select > options with boolean values > should set value of input as value prop': {
			props: {
				...BASIC_PROPS,
				options: OPTIONS_BOOLEAN_VALUE,
				value: OPTIONS_BOOLEAN_VALUE[1],
			},
			expectedValue: 'false',
		},
		'multi select > should set value of input as value prop': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
				value: OPTIONS[3],
			},
			expectedValue: 'three',
		},
		'multi select > with delimiter prop > should set value of input as value prop': {
			props: {
				...BASIC_PROPS,
				delimiter: ', ',
				isMulti: true,
				value: [OPTIONS[3], OPTIONS[5]],
			},
			expectedValue: 'three, five',
		},
		'multi select > options with number values > should set value of input as value prop': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
				options: OPTIONS_NUMBER_VALUE,
				value: OPTIONS_NUMBER_VALUE[3],
			},
			expectedValue: '3',
		},
		'multi select > with delimiter prop > options with number values > should set value of input as value prop':
			{
				props: {
					...BASIC_PROPS,
					delimiter: ', ',
					isMulti: true,
					options: OPTIONS_NUMBER_VALUE,
					value: [OPTIONS_NUMBER_VALUE[3], OPTIONS_NUMBER_VALUE[1]],
				},
				expectedValue: '3, 1',
			},
		'multi select > options with boolean values > should set value of input as value prop': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
				options: OPTIONS_BOOLEAN_VALUE,
				value: OPTIONS_BOOLEAN_VALUE[1],
			},
			expectedValue: 'false',
		},
		'multi select > with delimiter prop > options with boolean values > should set value of input as value prop':
			{
				props: {
					...BASIC_PROPS,
					delimiter: ', ',
					isMulti: true,
					options: OPTIONS_BOOLEAN_VALUE,
					value: [OPTIONS_BOOLEAN_VALUE[1], OPTIONS_BOOLEAN_VALUE[0]],
				},
				expectedValue: 'false, true',
			},
	},
);

cases(
	'isOptionDisabled() prop',
	({ props, expectedEnabledOption, expectedDisabledOption }) => {
		render(<Select {...props} />);

		const enabledOptionsValues = [...screen.getAllByRole('option')]
			.filter((n) => !n.classList.contains('react-select__option--is-disabled'))
			.map((option) => option.textContent);

		enabledOptionsValues.forEach((option) => {
			expect(expectedDisabledOption.indexOf(option!)).toBe(-1);
		});

		const disabledOptionsValues = [...screen.getAllByRole('option')]
			.filter((n) => n.classList.contains('react-select__option--is-disabled'))
			.map((option) => option.textContent);

		disabledOptionsValues.forEach((option) => {
			expect(expectedEnabledOption.indexOf(option!)).toBe(-1);
		});
	},
	{
		'single select > should add isDisabled as true prop only to options that are disabled': {
			props: {
				...BASIC_PROPS,
				menuIsOpen: true,
				isOptionDisabled: (option: Option) =>
					['zero', 'two', 'five', 'ten'].indexOf(option.value) > -1,
			},
			expectedEnabledOption: ['1', '3', '11'],
			expectedDisabledOption: ['0', '2', '5'],
		},
		'multi select > should add isDisabled as true prop only to options that are disabled': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
				menuIsOpen: true,
				isOptionDisabled: (option: Option) =>
					['zero', 'two', 'five', 'ten'].indexOf(option.value) > -1,
			},
			expectedEnabledOption: ['1', '3', '11'],
			expectedDisabledOption: ['0', '2', '5'],
		},
	},
);

cases(
	'isDisabled prop',
	({ props }) => {
		render(<Select {...props} />);

		let control = screen.getByTestId(`${testId}-select--control`);
		expect(control!).toHaveClass('react-select__control--is-disabled');

		let input = screen.getByTestId<HTMLInputElement>(`${testId}-select--input`);
		expect(input!.disabled).toBeTruthy();
	},
	{
		'single select > should add isDisabled prop to select components': {
			props: {
				...BASIC_PROPS,
				isDisabled: true,
			},
		},
		'multi select > should add isDisabled prop to select components': {
			props: {
				...BASIC_PROPS,
				isDisabled: true,
				isMulti: true,
			},
		},
	},
);

test('hitting Enter on option should not call onChange if the event comes from IME', () => {
	let spy = jest.fn();
	render(
		<Select
			testId={testId}
			menuIsOpen
			onChange={spy}
			onInputChange={jest.fn()}
			onMenuClose={jest.fn()}
			onMenuOpen={jest.fn()}
			options={OPTIONS}
			tabSelectsValue={false}
			inputValue=""
			value={null}
		/>,
	);

	let selectOption = screen.getByRole('option', { name: '0' });
	let menu = screen.getByTestId(`${testId}-select--listbox-container`);
	const user = userEvent.setup();
	user.type(menu!, '{ArrowDown}');
	user.type(menu!, '{ArrowDown}');

	user.type(selectOption!, '{Enter}');

	expect(spy).not.toHaveBeenCalled();
});

test('hitting tab on option should not call onChange if tabSelectsValue is false', () => {
	let spy = jest.fn();
	render(
		<Select
			testId={testId}
			menuIsOpen
			onChange={spy}
			onInputChange={jest.fn()}
			onMenuClose={jest.fn()}
			onMenuOpen={jest.fn()}
			options={OPTIONS}
			tabSelectsValue={false}
			inputValue=""
			value={null}
		/>,
	);

	let selectOption = screen.getByRole('option', { name: '0' });
	let menu = screen.getByTestId(`${testId}-select--listbox-container`);
	const user = userEvent.setup();
	user.type(menu!, '{ArrowDown}');
	user.type(menu!, '{ArrowDown}');

	user.type(selectOption!, '{Tab}');
	expect(spy).not.toHaveBeenCalled();
});

test('multi select > to not show selected value in options', async () => {
	let onInputChangeSpy = jest.fn();
	let onMenuCloseSpy = jest.fn();
	let { rerender } = render(
		<Select
			{...BASIC_PROPS}
			isMulti
			menuIsOpen
			onInputChange={onInputChangeSpy}
			onMenuClose={onMenuCloseSpy}
		/>,
	);

	let availableOptions = [...screen.getAllByRole('option')].map((option) => option.textContent);
	expect(availableOptions.indexOf('0') > -1).toBeTruthy();

	rerender(
		<Select
			{...BASIC_PROPS}
			isMulti
			menuIsOpen
			onInputChange={onInputChangeSpy}
			onMenuClose={onMenuCloseSpy}
			value={OPTIONS[0]}
		/>,
	);
	const user = userEvent.setup();
	// Re-open Menu
	await user.click(screen.getByTestId(`${testId}-select--dropdown-indicator`)!);
	availableOptions = [...screen.getAllByRole('option')].map((option) => option.textContent);

	expect(availableOptions.indexOf('0') > -1).toBeFalsy();
});

test('multi select > to not hide the selected options from the menu if hideSelectedOptions is false', async () => {
	render(
		<Select
			hideSelectedOptions={false}
			isMulti
			menuIsOpen
			onChange={jest.fn()}
			onInputChange={jest.fn()}
			onMenuClose={jest.fn()}
			onMenuOpen={jest.fn()}
			options={OPTIONS}
			inputValue=""
			value={null}
		/>,
	);
	const user = userEvent.setup();
	expect(screen.getByRole('option', { name: '0' })).toBeInTheDocument();
	expect(screen.getByRole('option', { name: '1' })).toBeInTheDocument();

	await user.click(screen.getByRole('option', { name: '0' }));

	expect(screen.getByRole('option', { name: '0' })).toBeInTheDocument();
	expect(screen.getByRole('option', { name: '1' })).toBeInTheDocument();
});

test('multi select > call onChange with all values but last selected value and remove event on hitting backspace', async () => {
	let onChangeSpy = jest.fn();
	render(
		<Select
			{...BASIC_PROPS}
			isMulti
			onChange={onChangeSpy}
			value={[OPTIONS[0], OPTIONS[1], OPTIONS[2]]}
		/>,
	);
	expect(screen.getByTestId(`${testId}-select--control`)!).toHaveTextContent('012');

	const user = userEvent.setup();
	await user.type(screen.getByTestId(`${testId}-select--control`)!, '{Backspace}');
	expect(onChangeSpy).toHaveBeenCalledWith(
		[
			{ label: '0', value: 'zero' },
			{ label: '1', value: 'one' },
		],
		{
			action: 'pop-value',
			removedValue: { label: '2', value: 'two' },
			name: BASIC_PROPS.name,
		},
	);
});

test('should not call onChange on hitting backspace when backspaceRemovesValue is false', async () => {
	let onChangeSpy = jest.fn();
	render(<Select {...BASIC_PROPS} backspaceRemovesValue={false} onChange={onChangeSpy} />);
	const user = userEvent.setup();
	await user.type(screen.getByTestId(`${testId}-select--control`)!, '{Backspace}');
	expect(onChangeSpy).not.toHaveBeenCalled();
});

test('should not call onChange on hitting backspace even when backspaceRemovesValue is true if isClearable is false', async () => {
	let onChangeSpy = jest.fn();
	render(
		<Select {...BASIC_PROPS} backspaceRemovesValue isClearable={false} onChange={onChangeSpy} />,
	);
	const user = userEvent.setup();
	await user.type(screen.getByTestId(`${testId}-select--control`)!, '{Backspace}');
	expect(onChangeSpy).not.toHaveBeenCalled();
});

test('should call onChange with `null` on hitting backspace when backspaceRemovesValue is true and isMulti is false', async () => {
	let onChangeSpy = jest.fn();
	render(
		<Select
			{...BASIC_PROPS}
			backspaceRemovesValue
			isClearable
			isMulti={false}
			onChange={onChangeSpy}
		/>,
	);
	const user = userEvent.setup();
	await user.type(screen.getByTestId(`${testId}-select--control`)!, '{Backspace}');
	expect(onChangeSpy).toHaveBeenCalledWith(null, {
		action: 'clear',
		name: 'test-input-name',
		removedValues: [],
	});
});

test('should call onChange with an array on hitting backspace when backspaceRemovesValue is true and isMulti is true', async () => {
	let onChangeSpy = jest.fn();
	render(
		<Select {...BASIC_PROPS} backspaceRemovesValue isClearable isMulti onChange={onChangeSpy} />,
	);
	const user = userEvent.setup();
	await user.type(screen.getByTestId(`${testId}-select--control`)!, '{Backspace}');
	expect(onChangeSpy).toHaveBeenCalledWith([], {
		action: 'pop-value',
		name: 'test-input-name',
		removedValue: undefined,
	});
});

test('multi select > clicking on X next to option will call onChange with all options other that the clicked option', async () => {
	let onChangeSpy = jest.fn();
	let { container } = render(
		<Select
			{...BASIC_PROPS}
			isMulti
			onChange={onChangeSpy}
			value={[OPTIONS[0], OPTIONS[2], OPTIONS[4]]}
		/>,
	);
	const user = userEvent.setup();
	// there are 3 values in select
	expect(container.querySelectorAll('.react-select__multi-value').length).toBe(3);

	const selectValueElement = [...container.querySelectorAll('.react-select__multi-value')].find(
		(multiValue) => multiValue.textContent === '4',
	);
	await user.click(selectValueElement!.querySelector('div.react-select__multi-value__remove')!);

	expect(onChangeSpy).toHaveBeenCalledWith(
		[
			{ label: '0', value: 'zero' },
			{ label: '2', value: 'two' },
		],
		{
			action: 'remove-value',
			removedValue: { label: '4', value: 'four' },
			name: BASIC_PROPS.name,
		},
	);
});

cases(
	'accessibility > aria-activedescendant for basic options',
	async (props: BasicProps) => {
		const renderProps = {
			...props,
			instanceId: 1000,
			value: BASIC_PROPS.options[2],
			menuIsOpen: true,
			hideSelectedOptions: false,
		};

		const { rerender } = render(<Select {...renderProps} />);
		const user = userEvent.setup();

		// aria-activedescendant should be set if menu is open initially and selected options are not hidden
		expect(screen.getByTestId(`${testId}-select--input`)!).toHaveAttribute(
			'aria-activedescendant',
			'react-select-1000-option-2',
		);

		screen.getByTestId(`${testId}-select--input`)!.focus();
		await user.keyboard('[ArrowDown]');

		expect(screen.getByTestId(`${testId}-select--input`)!).toHaveAttribute(
			'aria-activedescendant',
			'react-select-1000-option-3',
		);

		await user.keyboard('[ArrowUp]');

		expect(screen.getByTestId(`${testId}-select--input`)!).toHaveAttribute(
			'aria-activedescendant',
			'react-select-1000-option-2',
		);

		await user.keyboard('[Home]');

		expect(screen.getByTestId(`${testId}-select--input`)!).toHaveAttribute(
			'aria-activedescendant',
			'react-select-1000-option-0',
		);

		await user.keyboard('[End]');

		expect(screen.getByTestId(`${testId}-select--input`)!).toHaveAttribute(
			'aria-activedescendant',
			'react-select-1000-option-16',
		);

		rerender(<Select {...renderProps} menuIsOpen={false} />);

		expect(screen.getByTestId(`${testId}-select--input`)).not.toHaveAttribute(
			'aria-activedescendant',
		);

		// searching should update activedescendant
		rerender(<Select {...renderProps} isSearchable />);

		const setInputValue = (val: string) => {
			rerender(<Select {...renderProps} inputValue={val} />);
		};

		setInputValue('four');

		expect(screen.getByTestId(`${testId}-select--input`)!).toHaveAttribute(
			'aria-activedescendant',
			'react-select-1000-option-4',
		);

		setInputValue('fourt');

		expect(screen.getByTestId(`${testId}-select--input`)!).toHaveAttribute(
			'aria-activedescendant',
			'react-select-1000-option-14',
		);

		setInputValue('fourt1');

		expect(screen.getByTestId(`${testId}-select--input`)!).not.toHaveAttribute(
			'aria-activedescendant',
		);
	},
	{
		'single select > should update aria-activedescendant as per focused option': {
			...BASIC_PROPS,
		},
		'multi select > should update aria-activedescendant as per focused option': {
			...BASIC_PROPS,
			isMulti: true,
		},
	},
);

cases(
	'accessibility > aria-activedescendant for grouped options',
	async (props: BasicProps) => {
		const renderProps = {
			...props,
			instanceId: 1000,
			options: OPTIONS_GROUPED,
			value: OPTIONS_GROUPED[0].options[2],
			menuIsOpen: true,
			hideSelectedOptions: false,
		};

		let { rerender } = render(
			<Select<OptionNumberValue | OptionBooleanValue, false, GroupedOption> {...renderProps} />,
		);

		const user = userEvent.setup();

		// aria-activedescendant should be set if menu is open initially and selected options are not hidden
		expect(screen.getByTestId(`${testId}-select--input`)!).toHaveAttribute(
			'aria-activedescendant',
			'react-select-1000-option-0-2',
		);

		screen.getByTestId(`${testId}-select--input`)!.focus();
		await user.keyboard('[ArrowDown]');

		expect(screen.getByTestId(`${testId}-select--input`)!).toHaveAttribute(
			'aria-activedescendant',
			'react-select-1000-option-0-3',
		);

		await user.keyboard('[ArrowUp]');

		expect(screen.getByTestId(`${testId}-select--input`)!).toHaveAttribute(
			'aria-activedescendant',
			'react-select-1000-option-0-2',
		);

		await user.keyboard('[Home]');

		expect(screen.getByTestId(`${testId}-select--input`)!).toHaveAttribute(
			'aria-activedescendant',
			'react-select-1000-option-0-0',
		);

		await user.keyboard('[End]');

		expect(screen.getByTestId(`${testId}-select--input`)!).toHaveAttribute(
			'aria-activedescendant',
			'react-select-1000-option-1-1',
		);

		rerender(<Select {...renderProps} menuIsOpen={false} />);

		expect(screen.getByTestId(`${testId}-select--input`)!).not.toHaveAttribute(
			'aria-activedescendant',
		);

		// searching should update activedescendant
		rerender(<Select {...renderProps} isSearchable />);

		const setInputValue = (val: string) => {
			rerender(<Select {...renderProps} inputValue={val} />);
		};

		setInputValue('1');

		expect(screen.getByTestId(`${testId}-select--input`)!).toHaveAttribute(
			'aria-activedescendant',
			'react-select-1000-option-0-1',
		);

		setInputValue('10');

		expect(screen.getByTestId(`${testId}-select--input`)!).toHaveAttribute(
			'aria-activedescendant',
			'react-select-1000-option-0-10',
		);

		setInputValue('102');

		expect(screen.getByTestId(`${testId}-select--input`)!).not.toHaveAttribute(
			'aria-activedescendant',
		);
	},
	{
		'single select > should update aria-activedescendant as per focused option': {
			...BASIC_PROPS,
		},
		'multi select > should update aria-activedescendant as per focused option': {
			...BASIC_PROPS,
			isMulti: true,
		},
	},
);

test('accessibility > aria-activedescendant should not exist if hideSelectedOptions=true', () => {
	render(
		<Select {...BASIC_PROPS} instanceId="1000" value={BASIC_PROPS.options[2]} isMulti menuIsOpen />,
	);

	expect(screen.getByTestId(`${testId}-select--input`)!).not.toHaveAttribute(
		'aria-activedescendant',
	);
});

cases(
	'accessibility > passes through aria-errormessage prop',
	({ props = { ...BASIC_PROPS, 'aria-errormessage': 'error-message' } }) => {
		render(<Select {...props} />);
		expect(screen.getByTestId(`${testId}-select--input`)!).toHaveAttribute(
			'aria-errormessage',
			'error-message',
		);
	},
	{
		'single select > should pass aria-errormessage prop down to input': {},
		'multi select > should pass aria-errormessage prop down to input': {
			props: {
				...BASIC_PROPS,
				'aria-errormessage': 'error-message',
				isMulti: true,
			},
		},
	},
);

cases(
	'accessibility > passes through aria-labelledby prop',
	({ props = { ...BASIC_PROPS, labelId: 'testing' } }) => {
		render(<Select {...props} />);
		expect(screen.getByTestId(`${testId}-select--input`)!).toHaveAttribute(
			'aria-labelledby',
			'testing',
		);
	},
	{
		'single select > should pass aria-labelledby prop down to input': {},
		'multi select > should pass aria-labelledby prop down to input': {
			props: {
				...BASIC_PROPS,
				labelId: 'testing',
				isMulti: true,
			},
		},
	},
);

cases(
	'accessibility > passes through labelId (aria-labelledby) prop',
	({ props = { ...BASIC_PROPS, labelId: 'testing' } }) => {
		render(<Select {...props} />);
		expect(screen.getByTestId(`${testId}-select--input`)!).toHaveAttribute(
			'aria-labelledby',
			'testing',
		);
	},
	{
		'single select > should pass labelId (aria-labelledby) prop down to input': {},
		'multi select > should pass labelId (aria-labelledby) prop down to input': {
			props: {
				...BASIC_PROPS,
				labelId: 'testing',
				isMulti: true,
			},
		},
	},
);

cases(
	'accessibility > passes through descriptionId (aria-describedby) prop',
	({ props = { ...BASIC_PROPS, descriptionId: 'testing' } }) => {
		render(<Select {...props} />);
		expect(screen.getByTestId(`${testId}-select--input`)!).toHaveAttribute(
			'aria-describedby',
			expect.stringContaining('testing'),
		);
	},
	{
		'single select > should pass descriptionId (aria-describedby) prop down to input': {},
		'multi select > should pass descriptionId (aria-describedby) prop down to input': {
			props: {
				...BASIC_PROPS,
				descriptionId: 'testing',
				isMulti: true,
			},
		},
	},
);

cases(
	'accessibility > passes through isRequired (aria-required) prop',
	({ props = { ...BASIC_PROPS, isRequired: true } }) => {
		render(<Select {...props} />);
		expect(screen.getByTestId(`${testId}-select--input`)!).toBeRequired();
	},
	{
		'single select > should pass isRequired (aria-required) prop down to input': {},
		'multi select > should pass isRequired (aria-required) prop down to input': {
			props: {
				...BASIC_PROPS,
				isRequired: true,
				isMulti: true,
			},
		},
	},
);

cases(
	'accessibility > passes through aria-invalid prop',
	({ props = { ...BASIC_PROPS, isInvalid: true } }) => {
		render(<Select {...props} />);
		expect(screen.getByTestId(`${testId}-select--input`)!).toHaveAttribute('aria-invalid', 'true');
	},
	{
		'single select > should pass aria-invalid prop down to input': {},
		'multi select > should pass aria-invalid prop down to input': {
			props: {
				...BASIC_PROPS,
				isInvalid: true,
				isMulti: true,
			},
		},
	},
);

cases(
	'accessibility > passes through aria-invalid prop',
	({ props = { ...BASIC_PROPS, isInvalid: true } }) => {
		render(<Select {...props} />);
		expect(screen.getByTestId(`${testId}-select--input`)!).toHaveAttribute('aria-invalid', 'true');
	},
	{
		'single select > should pass aria-invalid prop down to input': {},
		'multi select > should pass aria-invalid prop down to input': {
			props: {
				...BASIC_PROPS,
				isInvalid: true,
				isMulti: true,
			},
		},
	},
);

cases(
	'accessibility > passes through isInvalid (aria-invalid) prop',
	({ props = { ...BASIC_PROPS, isInvalid: true } }) => {
		render(<Select {...props} />);

		expect(screen.getByTestId(`${testId}-select--input`)!).toBeInvalid();
	},
	{
		'single select > should pass isInvalid (aria-invalid) prop down to input': {},
		'multi select > should pass isInvalid (aria-invalid) prop down to input': {
			props: {
				...BASIC_PROPS,
				isInvalid: true,
				isMulti: true,
			},
		},
	},
);

cases(
	'accessibility > passes through aria-label prop',
	({ props = { ...BASIC_PROPS, label: 'testing' } }) => {
		render(<Select {...props} />);
		expect(screen.getByTestId(`${testId}-select--input`)!).toHaveAttribute('aria-label', 'testing');
	},
	{
		'single select > should pass aria-labelledby prop down to input': {},
		'multi select > should pass aria-labelledby prop down to input': {
			props: {
				...BASIC_PROPS,
				label: 'testing',
				isMulti: true,
			},
		},
	},
);

cases(
	'accessibility > passes through label (aria-label) prop',
	({ props = { ...BASIC_PROPS, label: 'testing' } }) => {
		render(<Select {...props} />);
		expect(screen.getByTestId(`${testId}-select--input`)!).toHaveAttribute('aria-label', 'testing');
	},
	{
		'single select > should pass label (aria-label) prop down to input': {},
		'multi select > should pass label (aria-label) prop down to input': {
			props: {
				...BASIC_PROPS,
				label: 'testing',
				isMulti: true,
			},
		},
	},
);

cases(
	'accessibility > options have aria-selected',
	({ props = { ...BASIC_PROPS } }) => {
		render(<Select {...props} menuIsOpen />);

		screen.getAllByRole('option').forEach((option) => {
			expect(option).toHaveAttribute('aria-selected', 'false');
		});
	},
	{
		'single select > should have aria-selected on options': {},
		'multi select > should have aria-selected on options': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
			},
		},
	},
);

describe('accessibility > options set aria-disabled properly', () => {
	ffTest(
		'design_system_select-a11y-improvement',
		() => {
			render(<Select {...BASIC_PROPS} menuIsOpen options={OPTIONS_DISABLED} />);

			expect(screen.getByRole('option', { name: '0' })).not.toHaveAttribute('aria-disabled');
			expect(screen.getByRole('option', { name: '1' })).toHaveAttribute('aria-disabled');
		},
		() => {
			render(<Select {...BASIC_PROPS} menuIsOpen options={OPTIONS_DISABLED} />);

			screen.getAllByRole('option').forEach((option) => {
				expect(option).toHaveAttribute('aria-disabled');
			});
			expect(screen.getByRole('option', { name: '0' })).toHaveAttribute('aria-disabled', 'false');
			expect(screen.getByRole('option', { name: '1' })).toHaveAttribute('aria-disabled', 'true');
		},
	);
});

describe('accessibility > to show the number of options available in A11yText when the menu is Open', () => {
	ffTest(
		'design_system_select-a11y-improvement',
		() => {
			let { rerender } = render(<Select {...BASIC_PROPS} inputValue={''} menuIsOpen />);

			let setInputValue = (val: string) => {
				rerender(<Select {...BASIC_PROPS} menuIsOpen inputValue={val} />);
			};

			screen.getByTestId(`${testId}-select--input`)!.focus();

			expect(screen.getByRole('status')!).not.toHaveTextContent();

			setInputValue('0');
			expect(screen.getByRole('status')!).not.toHaveTextContent();

			setInputValue('10');
			expect(screen.getByRole('status')!).not.toHaveTextContent();

			setInputValue('100');
			expect(screen.getByRole('status')!).not.toHaveTextContent();
		},
		async () => {
			let { container, rerender } = render(<Select {...BASIC_PROPS} inputValue={''} menuIsOpen />);

			let setInputValue = (val: string) => {
				rerender(<Select {...BASIC_PROPS} menuIsOpen inputValue={val} />);
			};

			const liveRegionResultsId = '#aria-results';
			const user = userEvent.setup();
			await user.click(screen.getByTestId(`${testId}-select--input`)!);

			expect(container.querySelector(liveRegionResultsId)!).toHaveTextContent(
				/17 results available/,
			);

			setInputValue('0');
			expect(container.querySelector(liveRegionResultsId)!).toHaveTextContent(
				/2 results available/,
			);

			setInputValue('10');
			expect(container.querySelector(liveRegionResultsId)!).toHaveTextContent(/1 result available/);

			setInputValue('100');
			expect(container.querySelector(liveRegionResultsId)!).toHaveTextContent(
				/0 results available/,
			);
		},
	);
});

describe('accessibility > interacting with disabled options shows correct A11yText', () => {
	ffTest(
		'design_system_select-a11y-improvement',
		async () => {
			render(<Select {...BASIC_PROPS} options={OPTIONS_DISABLED} inputValue={''} menuIsOpen />);

			screen.getByTestId(`${testId}-select--input`)!.focus();

			// navigate to disabled option
			let menu = screen.getByTestId(`${testId}-select--listbox-container`);
			const user = userEvent.setup();
			await user.type(menu!, '{ArrowDown}{ArrowDown}');

			await user.type(menu!, '{Enter}');

			expect(screen.getByRole('status')!).not.toHaveTextContent();
		},
		async () => {
			let { container } = render(
				<Select {...BASIC_PROPS} options={OPTIONS_DISABLED} inputValue={''} menuIsOpen />,
			);
			const liveRegionEventId = '#aria-selection';
			screen.getByTestId(`${testId}-select--input`)!.focus();

			// navigate to disabled option
			let menu = screen.getByTestId(`${testId}-select--listbox-container`);
			const user = userEvent.setup();
			await user.type(menu!, '{ArrowDown}{ArrowDown}');

			await user.type(menu!, '{Enter}');

			expect(container.querySelector(liveRegionEventId)!).toHaveTextContent(
				/option 1 is disabled\. Select another option\./,
			);
		},
	);
});

describe('accessibility > interacting with multi values options shows correct A11yText', () => {
	ffTest(
		'design_system_select-a11y-improvement',
		async () => {
			let renderProps = {
				...BASIC_PROPS,
				options: OPTIONS_DISABLED,
				isMulti: true,
				value: [OPTIONS_DISABLED[0], OPTIONS_DISABLED[1]],
				hideSelectedOptions: false,
			};

			let { rerender } = render(<Select {...renderProps} />);

			let openMenu = () => {
				rerender(<Select {...renderProps} menuIsOpen />);
			};

			const user = userEvent.setup();

			screen.getByTestId(`${testId}-select--input`)!.focus();

			expect(screen.getByRole('status')!).not.toHaveTextContent();

			await user.keyboard('[ArrowLeft]');
			expect(screen.getByRole('status')!).not.toHaveTextContent();
			expect(screen.getByRole('status')!).not.toHaveTextContent();

			await user.keyboard('[ArrowLeft]');
			expect(screen.getByRole('status')!).not.toHaveTextContent();
			expect(screen.getByRole('status')!).not.toHaveTextContent();

			openMenu();

			expect(screen.getByRole('status')!).not.toHaveTextContent();
		},
		async () => {
			let renderProps = {
				...BASIC_PROPS,
				options: OPTIONS_DISABLED,
				isMulti: true,
				value: [OPTIONS_DISABLED[0], OPTIONS_DISABLED[1]],
				hideSelectedOptions: false,
			};

			let { container, rerender } = render(<Select {...renderProps} />);

			let openMenu = () => {
				rerender(<Select {...renderProps} menuIsOpen />);
			};

			const liveRegionGuidanceId = '#aria-guidance';
			const liveRegionFocusedId = '#aria-focused';
			let input = screen.getByTestId(`${testId}-select--input`)!;
			const user = userEvent.setup();

			await user.click(input);

			expect(container.querySelector(liveRegionGuidanceId)!).toHaveTextContent(
				'Select is focused ,type to refine list, press Down to open the menu, press left to focus selected values',
			);

			await user.keyboard('[ArrowLeft]');
			expect(container.querySelector(liveRegionFocusedId)!).toHaveTextContent(
				'value 1 focused, (2 of 2).',
			);
			expect(container.querySelector(liveRegionGuidanceId)!).toHaveTextContent(
				/Use left and right to toggle between focused values, press Backspace to remove the currently focused value/,
			);

			await user.keyboard('[ArrowLeft]');
			expect(container.querySelector(liveRegionFocusedId)!).toHaveTextContent(
				'value 0 focused, (1 of 2).',
			);
			expect(container.querySelector(liveRegionGuidanceId)!).toHaveTextContent(
				/Use left and right to toggle between focused values, press Backspace to remove the currently focused value/,
			);

			openMenu();

			// user will be notified if option is disabled by screen reader because of correct aria-attributes, so this message will be announce only once after menu opens
			expect(container.querySelector(liveRegionGuidanceId)!).toHaveTextContent(
				/Use Up and Down to choose options, press Enter to select the currently focused option, press Escape to exit the menu, press Tab to select the option and exit the menu\./,
			);
		},
	);
});

test('accessibility > screenReaderStatus function prop > to pass custom text to A11yText', async () => {
	const screenReaderStatus = ({ count }: { count: number }) =>
		`There are ${count} options available`;

	const liveRegionResultsId = '#aria-results';
	let { container, rerender } = render(
		<Select {...BASIC_PROPS} inputValue={''} screenReaderStatus={screenReaderStatus} menuIsOpen />,
	);

	let setInputValue = (val: string) => {
		rerender(
			<Select
				{...BASIC_PROPS}
				screenReaderStatus={screenReaderStatus}
				menuIsOpen
				inputValue={val}
			/>,
		);
	};

	const user = userEvent.setup();
	await user.click(screen.getByTestId(`${testId}-select--input`)!);

	expect(container.querySelector(liveRegionResultsId)!).toHaveTextContent(
		/There are 17 options available/,
	);

	setInputValue('0');
	expect(container.querySelector(liveRegionResultsId)!).toHaveTextContent(
		/There are 2 options available/,
	);

	setInputValue('10');
	expect(container.querySelector(liveRegionResultsId)!).toHaveTextContent(
		/There are 1 options available/,
	);

	setInputValue('100');
	expect(container.querySelector(liveRegionResultsId)!).toHaveTextContent(
		/There are 0 options available/,
	);
});

test('accessibility > A11yTexts can be provided through ariaLiveMessages prop', () => {
	const ariaLiveMessages: AriaLiveMessages<Option, boolean, GroupBase<Option>> = {
		onChange: (props) => {
			const { action, isDisabled, label } = props;
			if (action === 'select-option' && !isDisabled) {
				return `CUSTOM: option ${label} is selected.`;
			}
			return '';
		},
	};

	let { container } = render(
		<Select
			{...BASIC_PROPS}
			ariaLiveMessages={ariaLiveMessages}
			options={OPTIONS}
			inputValue={''}
			menuIsOpen
		/>,
	);
	const liveRegionEventId = '#aria-selection';

	expect(container.querySelector(liveRegionEventId)!).toBeNull();
	fireEvent.focus(screen.getByTestId(`${testId}-select--input`)!);

	let menu = screen.getByTestId(`${testId}-select--listbox-container`)!;
	fireEvent.keyDown(menu, { keyCode: 40, key: 'ArrowDown' });
	fireEvent.keyDown(menu, {
		keyCode: 13,
		key: 'Enter',
	});

	expect(container.querySelector(liveRegionEventId)!).toHaveTextContent(
		/CUSTOM: option 0 is selected\./,
	);
});

describe('accessibility > announces already selected values when focused', () => {
	ffTest(
		'design_system_select-a11y-improvement',
		() => {
			render(<Select {...BASIC_PROPS} options={OPTIONS} value={OPTIONS[0]} />);

			screen.getByTestId(`${testId}-select--input`)!.focus();

			expect(screen.getByRole('status')!).not.toHaveTextContent();
		},
		async () => {
			let { container } = render(<Select {...BASIC_PROPS} options={OPTIONS} value={OPTIONS[0]} />);
			const liveRegionSelectionId = '#aria-selection';
			const liveRegionContextId = '#aria-guidance';

			// the live region should not be mounted yet
			expect(container.querySelector(liveRegionSelectionId)!).toBeNull();

			const user = userEvent.setup();
			await user.click(screen.getByTestId(`${testId}-select--input`)!);

			expect(container.querySelector(liveRegionContextId)!).toHaveTextContent(
				'Select is focused ,type to refine list, press Down to open the menu,',
			);
			expect(container.querySelector(liveRegionSelectionId)!).toHaveTextContent(
				/option 0, selected\./,
			);
		},
	);
});

describe('accessibility > announces cleared values', () => {
	ffTest(
		'design_system_select-a11y-improvement',
		async () => {
			render(<Select {...BASIC_PROPS} options={OPTIONS} value={OPTIONS[0]} isClearable />);
			/**
			 * announce deselected value
			 */
			screen.getByTestId(`${testId}-select--input`)!.focus();
			const user = userEvent.setup();
			await user.click(screen.getByTestId(`${testId}-select--clear-indicator`)!);
			expect(screen.getByRole('status')!).toHaveTextContent(
				/All selected options have been cleared\./,
			);
		},
		async () => {
			let { container } = render(
				<Select {...BASIC_PROPS} options={OPTIONS} value={OPTIONS[0]} isClearable />,
			);
			const liveRegionSelectionId = '#aria-selection';
			/**
			 * announce deselected value
			 */
			screen.getByTestId(`${testId}-select--input`)!.focus();
			const user = userEvent.setup();
			await user.click(screen.getByTestId(`${testId}-select--clear-indicator`)!);
			expect(container.querySelector(liveRegionSelectionId)!).toHaveTextContent(
				/All selected options have been cleared\./,
			);
		},
	);
});

describe('accessibility > multivalue', () => {
	const orginalNavigator = window.navigator;
	Object.defineProperty(
		window.navigator,
		'userAgentData',
		((value) => ({
			get() {
				return value;
			},
			set(v) {
				value = v;
			},
			//@ts-ignore we need to override platform to macOS to test aria-live messages
		}))(window.navigator.userAgentData),
	);

	// NOTE: Using role="application" is not to be taken lightly. Always use extreme caution and be sure to test across all browser/AT combinations.
	test('Value container should not have role="application" when values are added', () => {
		global.navigator.userAgentData = { platform: 'macOS' };
		const { rerender } = render(<Select {...BASIC_PROPS} isMulti />);
		expect(screen.getByTestId(`${testId}-select--value-container`)).not.toHaveAttribute(
			'role',
			'application',
		);

		rerender(<Select {...BASIC_PROPS} isMulti value={OPTIONS[0]} />);
		expect(screen.getByTestId(`${testId}-select--value-container`)).not.toHaveAttribute(
			'role',
			'application',
		);
		global.navigator = orginalNavigator;
	});

	test('Value container should have role="application" when values are added on Windows', () => {
		global.navigator.userAgentData = { platform: 'Windows' };
		const { rerender } = render(<Select {...BASIC_PROPS} isMulti />);
		expect(screen.getByTestId(`${testId}-select--value-container`)).not.toHaveAttribute(
			'role',
			'application',
		);

		rerender(<Select {...BASIC_PROPS} isMulti value={OPTIONS[0]} />);
		expect(screen.getByTestId(`${testId}-select--value-container`)).toHaveAttribute(
			'role',
			'application',
		);
		global.navigator = orginalNavigator;
	});
});

test('closeMenuOnSelect prop > when passed as false it should not call onMenuClose on selecting option', async () => {
	let onMenuCloseSpy = jest.fn();
	const user = userEvent.setup();
	render(
		<Select
			{...BASIC_PROPS}
			onMenuClose={onMenuCloseSpy}
			menuIsOpen
			closeMenuOnSelect={false}
			blurInputOnSelect={false}
		/>,
	);
	await user.click(screen.getByRole('option', { name: '0' })!);
	expect(onMenuCloseSpy).not.toHaveBeenCalled();
});

cases(
	'autoFocus',
	({ props = { ...BASIC_PROPS, autoFocus: true } }) => {
		render(<Select {...props} />);
		expect(screen.getByTestId(`${testId}-select--input`)).toHaveFocus();
	},
	{
		'single select > should focus select on mount': {},
		'multi select > should focus select on mount': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
				autoFocus: true,
			},
		},
	},
);

cases(
	'onFocus prop with autoFocus',
	({ props = { ...BASIC_PROPS, autoFocus: true } }) => {
		let onFocusSpy = jest.fn();
		render(<Select {...props} onFocus={onFocusSpy} />);
		expect(screen.getByTestId(`${testId}-select--input`)).toHaveFocus();
		expect(onFocusSpy).toHaveBeenCalledTimes(1);
	},
	{
		'single select > should call auto focus only once when select is autoFocus': {
			props: {
				...BASIC_PROPS,
				autoFocus: true,
			},
		},
		'multi select > should call auto focus only once when select is autoFocus': {
			props: {
				...BASIC_PROPS,
				autoFocus: true,
				isMulti: true,
			},
		},
	},
);

cases(
	'onFocus prop is called on on focus of input',
	({ props = { ...BASIC_PROPS } }) => {
		let onFocusSpy = jest.fn();
		render(<Select {...props} onFocus={onFocusSpy} />);
		screen.getByTestId(`${testId}-select--input`)!.focus();
		expect(onFocusSpy).toHaveBeenCalledTimes(1);
	},
	{
		'single select > should call onFocus handler on focus on input': {},
		'multi select > should call onFocus handler on focus on input': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
			},
		},
	},
);

cases(
	'onBlur prop',
	async ({ props = { ...BASIC_PROPS } }) => {
		let onBlurSpy = jest.fn();
		render(
			<Select {...props} onBlur={onBlurSpy} onInputChange={jest.fn()} onMenuClose={jest.fn()} />,
		);
		screen.getByTestId(`${testId}-select--input`)!.focus();
		const user = userEvent.setup();
		await user.tab();

		expect(onBlurSpy).toHaveBeenCalledTimes(1);
	},
	{
		'single select > should call onBlur handler on blur on input': {},
		'multi select > should call onBlur handler on blur on input': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
			},
		},
	},
);

test('onInputChange() function prop to be called on blur', async () => {
	let onInputChangeSpy = jest.fn();
	render(
		<Select
			{...BASIC_PROPS}
			onBlur={jest.fn()}
			onInputChange={onInputChangeSpy}
			onMenuClose={jest.fn()}
		/>,
	);
	screen.getByTestId(`${testId}-select--input`)!.focus();
	const user = userEvent.setup();
	await user.tab();
	// Once by blur and other time by menu-close
	expect(onInputChangeSpy).toHaveBeenCalledTimes(2);
});

test('onMenuClose() function prop to be called on blur', async () => {
	let onMenuCloseSpy = jest.fn();
	render(
		<Select
			{...BASIC_PROPS}
			onBlur={jest.fn()}
			onInputChange={jest.fn()}
			onMenuClose={onMenuCloseSpy}
		/>,
	);
	screen.getByTestId(`${testId}-select--input`)!.focus();
	const user = userEvent.setup();
	await user.tab();
	expect(onMenuCloseSpy).toHaveBeenCalledTimes(1);
});

cases(
	'placeholder',
	({ props, expectPlaceholder = 'Select...' }) => {
		render(<Select {...props} />);
		expect(screen.getByTestId(`${testId}-select--control`)!).toHaveTextContent(expectPlaceholder);
	},
	{
		'single select > should display default placeholder "Select..."': {
			props: BASIC_PROPS,
		},
		'single select > should display provided string placeholder': {
			props: {
				...BASIC_PROPS,
				placeholder: 'single Select...',
			},
			expectPlaceholder: 'single Select...',
		},
		'single select > should display provided node placeholder': {
			props: {
				...BASIC_PROPS,
				placeholder: <span>single Select...</span>,
			},
			expectPlaceholder: 'single Select...',
		},
		'multi select > should display default placeholder "Select..."': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
			},
		},
		'multi select > should display provided placeholder': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
				placeholder: 'multi Select...',
			},
			expectPlaceholder: 'multi Select...',
		},
	},
);

cases(
	'display placeholder once value is removed',
	({ props }) => {
		let { rerender } = render(<Select {...props} />);
		expect(screen.queryByTestId(`${testId}-select--placeholder`)).not.toBeInTheDocument();
		rerender(<Select {...props} value={null} />);
		expect(screen.getByTestId(`${testId}-select--placeholder`)).toBeInTheDocument();
	},
	{
		'single select > should display placeholder once the value is removed from select': {
			props: {
				...BASIC_PROPS,
				value: OPTIONS[0],
			},
		},
		'multi select > should display placeholder once the value is removed from select': {
			props: {
				...BASIC_PROPS,
				value: OPTIONS[0],
			},
		},
	},
);

// skipping this test as it does not work with jsdom.reconfigure. Need to rewrite this test.
// https://hello.jira.atlassian.cloud/browse/UTEST-2000
test.skip('sets inputMode="none" when isSearchable is false', () => {
	render(
		<Select
			classNamePrefix="react-select"
			options={OPTIONS}
			isSearchable={false}
			onChange={noop}
			onInputChange={noop}
			onMenuOpen={noop}
			onMenuClose={noop}
			inputValue=""
			value={null}
		/>,
	);
	let input = screen.getByTestId<HTMLInputElement>(`${testId}-select--input`);
	expect(input!.inputMode).toBe('none');
	expect(window.getComputedStyle(input!).getPropertyValue('caret-color')).toEqual('transparent');
});

cases(
	'clicking on disabled option',
	async ({ props = BASIC_PROPS, optionsSelected }) => {
		let onChangeSpy = jest.fn();
		const user = userEvent.setup();
		props = { ...props, onChange: onChangeSpy };
		render(<Select {...props} menuIsOpen />);
		let selectOption = [...screen.getAllByRole('option')].find(
			(n) => n.textContent === optionsSelected,
		);
		await user.click(selectOption!);
		expect(onChangeSpy).not.toHaveBeenCalled();
	},
	{
		'single select > should not select the disabled option': {
			props: {
				...BASIC_PROPS,
				options: [
					{ label: 'option 1', value: 'opt1' },
					{ label: 'option 2', value: 'opt2', isDisabled: true },
				],
			},
			optionsSelected: 'option 2',
		},
		'multi select > should not select the disabled option': {
			props: {
				...BASIC_PROPS,
				options: [
					{ label: 'option 1', value: 'opt1' },
					{ label: 'option 2', value: 'opt2', isDisabled: true },
				],
			},
			optionsSelected: 'option 2',
		},
	},
);

cases(
	'pressing enter on disabled option',
	async ({ props = BASIC_PROPS, optionsSelected }) => {
		let onChangeSpy = jest.fn();
		props = { ...props, onChange: onChangeSpy };
		render(<Select {...props} menuIsOpen />);
		let selectOption = [...screen.getAllByRole('option')].find(
			(n) => n.textContent === optionsSelected,
		);
		const user = userEvent.setup();
		await user.type(selectOption!, '{Enter}');
		expect(onChangeSpy).not.toHaveBeenCalled();
	},
	{
		'single select > should not select the disabled option': {
			props: {
				...BASIC_PROPS,
				options: [
					{ label: 'option 1', value: 'opt1' },
					{ label: 'option 2', value: 'opt2', isDisabled: true },
				],
			},
			optionsSelected: 'option 2',
		},
		'multi select > should not select the disabled option': {
			props: {
				...BASIC_PROPS,
				options: [
					{ label: 'option 1', value: 'opt1' },
					{ label: 'option 2', value: 'opt2', isDisabled: true },
				],
			},
			optionsSelected: 'option 2',
		},
	},
);

test('does not select anything when a disabled option is the only item in the list after a search', async () => {
	let onChangeSpy = jest.fn();
	const options = [{ label: 'opt', value: 'opt1', isDisabled: true }, ...OPTIONS];
	const props = { ...BASIC_PROPS, onChange: onChangeSpy, options };
	let { rerender } = render(<Select {...props} menuIsOpen inputValue="" />);
	rerender(<Select {...props} menuIsOpen inputValue="opt" />);

	const user = userEvent.setup();
	await user.type(screen.getByTestId(`${testId}-select--listbox-container`), '{Enter}');

	expect(onChangeSpy).not.toHaveBeenCalled();
	// Menu is still open
	expect(screen.getByRole('option', { name: 'opt' })).toBeInTheDocument();
});

test('render custom Input Component', () => {
	const InputComponent = () => <div data-testid="my-input-component" />;
	render(<Select {...BASIC_PROPS} components={{ Input: InputComponent }} />);

	expect(screen.queryByTestId(`${testId}-select--input`)).not.toBeInTheDocument();
	expect(screen.getByTestId('my-input-component')).toBeInTheDocument();
});

test('render custom Menu Component', () => {
	const MenuComponent = () => <div data-testid="my-menu-component" />;
	render(<Select {...BASIC_PROPS} menuIsOpen components={{ Menu: MenuComponent }} />);

	expect(screen.queryByTestId(`${testId}-select--listbox-container`)).not.toBeInTheDocument();
	expect(screen.getByTestId('my-menu-component')).toBeInTheDocument();
});

test('render custom Option Component', () => {
	const OptionComponent = () => <div data-testid="my-option-component" />;
	let { container } = render(
		<Select {...BASIC_PROPS} components={{ Option: OptionComponent }} menuIsOpen />,
	);

	expect(container.querySelector('.react-select__option')).not.toBeInTheDocument();
	// eslint-disable-next-line jest-dom/prefer-in-document
	expect(screen.getAllByTestId('my-option-component')).toBeTruthy();
});

cases(
	'isClearable is false',
	({ props = BASIC_PROPS }) => {
		render(<Select {...props} />);
		expect(screen.queryByTestId(`${testId}-select--clear-indicator`)).not.toBeInTheDocument();
	},
	{
		'single select > should not show the X (clear) button': {
			props: {
				...BASIC_PROPS,
				isClearable: false,
				value: OPTIONS[0],
			},
		},
		'multi select > should not show X (clear) button': {
			...BASIC_PROPS,
			isMulti: true,
			isClearable: false,
			value: [OPTIONS[0]],
		},
	},
);

test('clear select by clicking on clear button > should not call onMenuOpen', async () => {
	let onChangeSpy = jest.fn();
	let props = { ...BASIC_PROPS, onChange: onChangeSpy };
	let { container } = render(<Select {...props} isMulti value={[OPTIONS[0]]} />);

	expect(container.querySelectorAll('.react-select__multi-value').length).toBe(1);
	const user = userEvent.setup();
	await user.click(screen.getByTestId(`${testId}-select--clear-indicator`)!);
	expect(onChangeSpy).toBeCalledWith([], {
		action: 'clear',
		name: BASIC_PROPS.name,
		removedValues: [{ label: '0', value: 'zero' }],
	});
});

test('clearing select using clear button to not call onMenuOpen or onMenuClose', () => {
	let onMenuCloseSpy = jest.fn();
	let onMenuOpenSpy = jest.fn();
	let props = {
		...BASIC_PROPS,
		onMenuClose: onMenuCloseSpy,
		onMenuOpen: onMenuOpenSpy,
	};
	let { container } = render(<Select {...props} isMulti value={[OPTIONS[0]]} />);
	expect(container.querySelectorAll('.react-select__multi-value').length).toBe(1);
	const user = userEvent.setup();
	user.click(screen.getByTestId(`${testId}-select--clear-indicator`)!);
	expect(onMenuOpenSpy).not.toHaveBeenCalled();
	expect(onMenuCloseSpy).not.toHaveBeenCalled();
});

test('multi select >  calls onChange when option is selected and isSearchable is false', async () => {
	let onChangeSpy = jest.fn();
	let props = { ...BASIC_PROPS, onChange: onChangeSpy };
	let { container } = render(
		<Select {...props} isMulti menuIsOpen delimiter="," isSearchable={false} />,
	);
	const user = userEvent.setup();
	await user.click(container.querySelector('.react-select__option')!);
	const selectedOption = { label: '0', value: 'zero' };
	expect(onChangeSpy).toHaveBeenCalledWith([selectedOption], {
		action: 'select-option',
		option: selectedOption,
		name: BASIC_PROPS.name,
	});
});

test('getOptionLabel() prop > to format the option label', () => {
	const getOptionLabel = (option: Option) => `This a custom option ${option.label} label`;
	render(<Select {...BASIC_PROPS} menuIsOpen getOptionLabel={getOptionLabel} />);
	expect(screen.getByRole('option', { name: 'This a custom option 0 label' })).toBeInTheDocument();
});

test('formatGroupLabel function prop > to format Group label', () => {
	const formatGroupLabel = (group: Group) => `This is custom ${group.label} header`;
	interface GroupOption {
		readonly value: number;
		readonly label: string;
	}
	interface Group {
		readonly label: string;
		readonly options: readonly GroupOption[];
	}
	const options = [
		{
			label: 'group 1',
			options: [
				{ value: 1, label: '1' },
				{ value: 2, label: '2' },
			],
		},
	];
	render(
		<Select<GroupOption, false, Group>
			testId={testId}
			options={options}
			menuIsOpen
			formatGroupLabel={formatGroupLabel}
			onChange={noop}
			onInputChange={noop}
			onMenuOpen={noop}
			onMenuClose={noop}
			inputValue=""
			value={null}
		/>,
	);
	expect(screen.getByTestId(`${testId}-select--group-0-heading`)!).toHaveTextContent(
		'This is custom group 1 header',
	);
});

test('to only render groups with at least one match when filtering', () => {
	const options = [
		{
			label: 'group 1',
			options: [
				{ value: 1, label: '1' },
				{ value: 2, label: '2' },
			],
		},
		{
			label: 'group 2',
			options: [
				{ value: 3, label: '3' },
				{ value: 4, label: '4' },
			],
		},
	];
	const { container } = render(
		<Select
			classNamePrefix="react-select"
			options={options}
			menuIsOpen
			inputValue="1"
			onChange={noop}
			onInputChange={noop}
			onMenuOpen={noop}
			onMenuClose={noop}
			value={null}
		/>,
	);

	expect(container.querySelectorAll('.react-select__group').length).toBe(1);
	expect(
		container.querySelector('.react-select__group')!.querySelectorAll('.react-select__option')
			.length,
	).toBe(1);
});

test('not render any groups when there is not a single match when filtering', () => {
	const options = [
		{
			label: 'group 1',
			options: [
				{ value: 1, label: '1' },
				{ value: 2, label: '2' },
			],
		},
		{
			label: 'group 2',
			options: [
				{ value: 3, label: '3' },
				{ value: 4, label: '4' },
			],
		},
	];
	const { container } = render(
		<Select
			classNamePrefix="react-select"
			options={options}
			menuIsOpen
			inputValue="5"
			onChange={noop}
			onInputChange={noop}
			onMenuOpen={noop}
			onMenuClose={noop}
			value={null}
		/>,
	);

	expect(container.querySelectorAll('.react-select__group').length).toBe(0);
});

test('multi select > have default value delimiter seperated', () => {
	let { container } = render(
		<Select {...BASIC_PROPS} delimiter={';'} isMulti value={[OPTIONS[0], OPTIONS[1]]} />,
	);
	expect(container.querySelector<HTMLInputElement>('input[type="hidden"]')!.value).toBe('zero;one');
});

test('multi select > with multi character delimiter', () => {
	let { container } = render(
		<Select {...BASIC_PROPS} delimiter={'===&==='} isMulti value={[OPTIONS[0], OPTIONS[1]]} />,
	);
	expect(container.querySelector<HTMLInputElement>('input[type="hidden"]')!.value).toBe(
		'zero===&===one',
	);
});

test('multi select > described as having multiple selections available', () => {
	render(<Select {...BASIC_PROPS} isMulti />);
	expect(screen.getByText(/, multiple selections available,/)).toBeInTheDocument();
	expect(screen.getByTestId(`${testId}-select--input`)).toHaveAttribute(
		'aria-describedby',
		expect.stringContaining('-multi-message'),
	);
});

test('hitting spacebar should select option if isSearchable is false', async () => {
	let onChangeSpy = jest.fn();
	let props = { ...BASIC_PROPS, onChange: onChangeSpy };
	render(<Select {...props} isSearchable menuIsOpen />);
	// focus the first option
	const user = userEvent.setup();

	await user.click(screen.getByTestId(`${testId}-select--listbox-container`));
	await user.keyboard('[ArrowDown][Space]');
	expect(onChangeSpy).toHaveBeenCalledWith(
		{ label: '0', value: 'zero' },
		{ action: 'select-option', name: BASIC_PROPS.name },
	);
});

test('hitting escape does not call onChange if menu is Open', async () => {
	let onChangeSpy = jest.fn();
	let props = { ...BASIC_PROPS, onChange: onChangeSpy };
	render(<Select {...props} menuIsOpen escapeClearsValue isClearable />);

	// focus the first option
	const user = userEvent.setup();

	await user.click(screen.getByTestId(`${testId}-select--input`));
	await user.keyboard('[ArrowDown]');
	expect(onChangeSpy).not.toHaveBeenCalled();
});

test('multi select > removes the selected option from the menu options when isSearchable is false', () => {
	let { rerender } = render(
		<Select {...BASIC_PROPS} delimiter="," isMulti isSearchable={false} menuIsOpen />,
	);
	expect(screen.getAllByRole('option').length).toBe(17);
	rerender(
		<Select
			{...BASIC_PROPS}
			delimiter=","
			isMulti
			isSearchable={false}
			menuIsOpen
			value={OPTIONS[0]}
		/>,
	);
	// expect '0' to not be options
	expect(
		screen.queryByRole('option', {
			name: '0',
		}),
	).not.toBeInTheDocument();
	expect(screen.getAllByRole('option').length).toBe(16);
});

test('hitting ArrowUp key on closed select should focus last element', async () => {
	let { container } = render(<Select {...BASIC_PROPS} menuIsOpen />);

	const user = userEvent.setup();

	await user.click(screen.getByTestId(`${testId}-select--input`));
	await user.keyboard('[ArrowUp]');

	expect(container.querySelector('.react-select__option--is-focused')!).toHaveTextContent('16');
});

test('close menu on hitting escape and clear input value if menu is open even if escapeClearsValue and isClearable are true', async () => {
	let onMenuCloseSpy = jest.fn();
	let onInputChangeSpy = jest.fn();
	let props = {
		...BASIC_PROPS,
		onInputChange: onInputChangeSpy,
		onMenuClose: onMenuCloseSpy,
		value: OPTIONS[0],
	};
	render(<Select {...props} menuIsOpen escapeClearsValue isClearable />);
	const user = userEvent.setup();

	await user.click(screen.getByTestId(`${testId}-select--input`));
	await user.keyboard('[Escape]');
	expect(screen.getByTestId(`${testId}-select--value-container`)!).toHaveTextContent('0');

	expect(onMenuCloseSpy).toHaveBeenCalled();
	// once by onMenuClose and other is direct
	expect(onInputChangeSpy).toHaveBeenCalledTimes(2);
	expect(onInputChangeSpy).toHaveBeenCalledWith('', {
		action: 'menu-close',
		prevInputValue: '',
	});
	expect(onInputChangeSpy).toHaveBeenLastCalledWith('', {
		action: 'menu-close',
		prevInputValue: '',
	});
});

test('to not clear value when hitting escape if escapeClearsValue is false (default) and isClearable is false', async () => {
	let onChangeSpy = jest.fn();
	let props = { ...BASIC_PROPS, onChange: onChangeSpy, value: OPTIONS[0] };
	render(<Select {...props} escapeClearsValue isClearable={false} />);

	const user = userEvent.setup();

	await user.click(screen.getByTestId(`${testId}-select--input`));
	await user.keyboard('[Escape]');
	expect(onChangeSpy).not.toHaveBeenCalled();
});

test('to not clear value when hitting escape if escapeClearsValue is true and isClearable is false', async () => {
	let onChangeSpy = jest.fn();
	let props = { ...BASIC_PROPS, onChange: onChangeSpy, value: OPTIONS[0] };
	render(<Select {...props} escapeClearsValue isClearable={false} />);

	const user = userEvent.setup();

	await user.click(screen.getByTestId(`${testId}-select--input`));
	await user.keyboard('[Escape]');
	expect(onChangeSpy).not.toHaveBeenCalled();
});

test('to not clear value when hitting escape if escapeClearsValue is false (default) and isClearable is true', async () => {
	let onChangeSpy = jest.fn();
	let props = { ...BASIC_PROPS, onChange: onChangeSpy, value: OPTIONS[0] };
	render(<Select {...props} isClearable />);

	const user = userEvent.setup();

	await user.click(screen.getByTestId(`${testId}-select--input`));
	await user.keyboard('[Escape]');
	expect(onChangeSpy).not.toHaveBeenCalled();
});

test('to clear value when hitting escape if escapeClearsValue and isClearable are true', async () => {
	let onInputChangeSpy = jest.fn();
	let props = { ...BASIC_PROPS, onChange: onInputChangeSpy, value: OPTIONS[0] };
	render(<Select {...props} isClearable escapeClearsValue />);
	const user = userEvent.setup();

	await user.click(screen.getByTestId(`${testId}-select--input`));
	await user.keyboard('[Escape]');

	expect(onInputChangeSpy).toHaveBeenCalledWith(null, {
		action: 'clear',
		name: BASIC_PROPS.name,
		removedValues: [{ label: '0', value: 'zero' }],
	});
});

test('hitting spacebar should not select option if isSearchable is true (default)', async () => {
	let onChangeSpy = jest.fn();
	let props = { ...BASIC_PROPS, onChange: onChangeSpy };
	render(<Select {...props} menuIsOpen />);
	const user = userEvent.setup();
	// Open Menu
	await user.type(screen.getByTestId(`${testId}-select--container`), `{Space}`);
	expect(onChangeSpy).not.toHaveBeenCalled();
});

cases(
	'`required` prop',
	({ props = BASIC_PROPS }) => {
		const components = (value: Option | null | undefined = null) => (
			<form id="formTest">
				<Select {...props} required value={value} />
			</form>
		);

		const { container, rerender } = render(components());

		expect(container.querySelector<HTMLFormElement>('#formTest')?.checkValidity()).toEqual(false);
		rerender(components(props.options[0]));
		expect(container.querySelector<HTMLFormElement>('#formTest')?.checkValidity()).toEqual(true);
	},
	{
		'single select > should validate with value': {
			props: {
				...BASIC_PROPS,
			},
		},
		'single select (isSearchable is false) > should validate with value': {
			props: {
				...BASIC_PROPS,
				isSearchable: false,
			},
		},
		'multi select > should validate with value': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
			},
		},
	},
);

cases(
	'`isRequired` prop',
	({ props = BASIC_PROPS }) => {
		const components = (value: Option | null | undefined = null) => (
			<form id="formTest">
				<Select {...props} isRequired value={value} />
			</form>
		);

		const { container, rerender } = render(components());

		expect(container.querySelector<HTMLFormElement>('#formTest')?.checkValidity()).toEqual(false);
		rerender(components(props.options[0]));
		expect(container.querySelector<HTMLFormElement>('#formTest')?.checkValidity()).toEqual(true);
	},
	{
		'single select > should validate with value': {
			props: {
				...BASIC_PROPS,
			},
			skip: true,
		},
		'single select (isSearchable is false) > should validate with value': {
			props: {
				...BASIC_PROPS,
				isSearchable: false,
			},
			skip: true,
		},
		'multi select > should validate with value': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
			},
			skip: true,
		},
	},
);

test('UNSAFE_is_experimental_generic', () => {
	render(<Select {...BASIC_PROPS} menuIsOpen UNSAFE_is_experimental_generic />);

	const input = screen.getByTestId(`${testId}-select--input`);
	expect(input).toHaveAttribute('aria-haspopup', 'dialog');
	expect(input).not.toHaveAttribute('aria-haspopup', 'true');

	const dialog = screen.getByTestId(`${testId}-select--listbox`);
	expect(dialog).not.toHaveAttribute('aria-multiselectable');
	expect(dialog).toHaveAttribute('role', 'dialog');
	expect(dialog).not.toHaveAttribute('role', 'listbox');

	const list = within(dialog).getByRole('list');
	expect(within(list).queryAllByRole('listitem')).toHaveLength(OPTIONS.length);
	expect(within(list).queryAllByRole('option')).toHaveLength(0);
});
