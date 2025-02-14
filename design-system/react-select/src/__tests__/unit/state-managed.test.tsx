/* eslint-disable testing-library/no-container,testing-library/no-node-access */
//@ts-nocheck
import React from 'react';

import { type EventType, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import cases from 'jest-in-case';

import Select from '../../index';

import { type Option, OPTIONS } from './constants.mock';

const testId = 'react-select';

function openMenu() {
	expect(screen.queryByTestId(`${testId}-select--listbox-container`)).not.toBeInTheDocument();

	toggleMenuOpen();

	expect(screen.getByTestId(`${testId}-select--listbox-container`)).toBeInTheDocument();
}

function toggleMenuOpen() {
	fireEvent.mouseDown(screen.getByTestId(`${testId}-select--dropdown-indicator`)!, { button: 0 });
}

function closeMenu() {
	expect(screen.getByTestId(`${testId}-select--listbox-container`)).toBeInTheDocument();

	toggleMenuOpen();
	expect(screen.queryByTestId(`${testId}-select--listbox-container`)).not.toBeInTheDocument();
}

interface BasicProps {
	readonly testId?: string;
	readonly onChange: () => void;
	readonly onInputChange: () => void;
	readonly onMenuClose: () => void;
	readonly onMenuOpen: () => void;
	readonly name: string;
	readonly options: readonly Option[];
}

const BASIC_PROPS: BasicProps = {
	testId,
	onChange: jest.fn(),
	onInputChange: jest.fn(),
	onMenuClose: jest.fn(),
	onMenuOpen: jest.fn(),
	name: 'test-input-name',
	options: OPTIONS,
};

test('passes down the className prop', () => {
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
	const { container } = render(<Select className={'react-select'} {...BASIC_PROPS} />);
	expect(container.querySelector('.react-select')).toBeTruthy();
});

cases(
	'click on dropdown indicator',
	({ props }) => {
		render(<Select {...props} />);
		// Menu not open by default
		expect(screen.queryByTestId(`${testId}-select--listbox-container`)).not.toBeInTheDocument();
		openMenu();
		closeMenu();
	},
	{
		'single select > should toggle Menu': { props: BASIC_PROPS },
		'multi select > should toggle Menu': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
			},
		},
	},
);

test('If menuIsOpen prop is passed Menu should not close on clicking Dropdown Indicator', () => {
	render(<Select menuIsOpen {...BASIC_PROPS} />);
	expect(screen.getByTestId(`${testId}-select--listbox-container`)).toBeInTheDocument();

	toggleMenuOpen();
	expect(screen.getByTestId(`${testId}-select--listbox-container`)).toBeInTheDocument();
});

test('defaultMenuIsOpen prop > should open by menu default and clicking on Dropdown Indicator should toggle menu', () => {
	render(<Select defaultMenuIsOpen {...BASIC_PROPS} />);
	expect(screen.getByTestId(`${testId}-select--listbox-container`)).toBeInTheDocument();

	toggleMenuOpen();
	expect(screen.queryByTestId(`${testId}-select--listbox-container`)).not.toBeInTheDocument();
});

test('Menu is controllable by menuIsOpen prop', () => {
	const { rerender } = render(<Select {...BASIC_PROPS} />);
	expect(screen.queryByTestId(`${testId}-select--listbox-container`)).not.toBeInTheDocument();

	rerender(<Select menuIsOpen {...BASIC_PROPS} />);
	expect(screen.getByTestId(`${testId}-select--listbox-container`)).toBeInTheDocument();

	rerender(<Select menuIsOpen={false} {...BASIC_PROPS} />);
	expect(screen.queryByTestId(`${testId}-select--listbox-container`)).not.toBeInTheDocument();
});

interface MenuToOpenByDefaultOptsProps extends Partial<BasicProps> {
	readonly isMulti?: boolean;
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	readonly menuIsOpen?: boolean;
}

interface MenuToOpenByDefaultOpts {
	readonly props?: MenuToOpenByDefaultOptsProps;
}

cases<MenuToOpenByDefaultOpts>(
	'Menu to open by default if menuIsOpen prop is true',
	async ({ props }) => {
		props = { ...BASIC_PROPS, ...props, menuIsOpen: true };
		render(<Select {...props} />);
		expect(screen.getByTestId(`${testId}-select--listbox-container`)).toBeInTheDocument();
		const user = userEvent.setup();

		await user.click(screen.getByTestId(`${testId}-select--dropdown-indicator`)!);

		expect(screen.getByTestId(`${testId}-select--listbox-container`)).toBeInTheDocument();
	},
	{
		'single select > should keep Menu open by default if true is passed for menuIsOpen prop': {},
		'multi select > should keep Menu open by default if true is passed for menuIsOpen prop': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
				menuIsOpen: true,
			},
		},
	},
);

test('multi select > selecting multiple values', async () => {
	const user = userEvent.setup();
	render(<Select {...BASIC_PROPS} isMulti />);

	openMenu();
	await user.type(screen.getByTestId(`${testId}-select--listbox-container`)!, '{enter}');
	expect(screen.getByTestId(`${testId}-select--control`)!).toHaveTextContent('0');

	openMenu();
	await user.type(screen.getByTestId(`${testId}-select--listbox-container`)!, '{enter}');
	expect(screen.getByTestId(`${testId}-select--control`)!).toHaveTextContent('01');
});

test('defaultInputValue prop > should update the inputValue on change of input if defaultInputValue prop is provided', async () => {
	const props = { ...BASIC_PROPS, defaultInputValue: '0' };
	const user = userEvent.setup();
	render(<Select {...props} />);
	let input = screen.getByTestId(`${testId}-select--input`);

	expect(input!.value).toBe('0');
	await user.type(input!, 'A');
	expect(input!.value).toBe('0A');
});

test('inputValue prop > should not update the inputValue when on change of input if inputValue prop is provided', async () => {
	const props = { ...BASIC_PROPS, inputValue: '0' };
	const user = userEvent.setup();
	render(<Select {...props} />);
	let input = screen.getByTestId(`${testId}-select--input`);
	expect(input!.value).toBe('0');
	await user.type(input!, 'A');
	expect(input!.value).toBe('0');
});

test('defaultValue prop > should update the value on selecting option', async () => {
	const props = { ...BASIC_PROPS, defaultValue: [OPTIONS[0]] };
	const user = userEvent.setup();
	let { container } = render(<Select {...props} menuIsOpen />);
	expect(container.querySelector<HTMLInputElement>('input[type="hidden"]')!.value).toBe('zero');
	await user.click(screen.getByTestId(`${testId}-select--option-1`));
	expect(container.querySelector<HTMLInputElement>('input[type="hidden"]')!.value).toBe('one');
});

test('value prop > should not update the value on selecting option', async () => {
	const props = { ...BASIC_PROPS, value: [OPTIONS[0]] };
	const user = userEvent.setup();
	let { container } = render(<Select {...props} menuIsOpen />);
	expect(container.querySelector<HTMLInputElement>('input[type="hidden"]')!.value).toBe('zero');
	await user.click(screen.getByTestId(`${testId}-select--option-1`));
	expect(container.querySelector<HTMLInputElement>('input[type="hidden"]')!.value).toBe('zero');
});

cases(
	'Integration tests > selecting an option > mouse interaction',
	async ({
		props = { ...BASIC_PROPS },
		event: [eventName, eventArgs],
		selectOption,
		expectSelectedOption,
	}) => {
		let { container } = render(<Select {...props} />);
		let toSelectOption = screen.getByRole('option', { name: selectOption.label });
		const user = userEvent.setup();

		await user[eventName](toSelectOption, eventArgs);
		expect(container.querySelector<HTMLInputElement>('input[type="hidden"]')!.value).toBe(
			expectSelectedOption,
		);
	},
	{
		'single select > clicking on an option > should select the clicked option': {
			props: {
				...BASIC_PROPS,
				menuIsOpen: true,
			},
			event: ['click' as const, { button: 0 }] as const,
			selectOption: OPTIONS[2],
			expectSelectedOption: 'two',
		},
		'multi select > clicking on an option > should select the clicked option': {
			props: {
				...BASIC_PROPS,
				delimiter: ', ',
				isMulti: true,
				menuIsOpen: true,
			},
			event: ['click' as const, { button: 0 }] as const,
			selectOption: OPTIONS[2],
			expectSelectedOption: 'two',
		},
	},
);

interface KeyboardInteractionOptsProps extends BasicProps {
	readonly isMulti?: boolean;
}

interface KeyboardInteractionOpts {
	readonly props?: KeyboardInteractionOptsProps;
	readonly eventsToSimulate: readonly [EventType, {}][];
	readonly expectedSelectedOption: string;
}

cases<KeyboardInteractionOpts>(
	'Integration tests > selection an option > keyboard interaction',
	async ({ props = { ...BASIC_PROPS }, eventsToSimulate, expectedSelectedOption }) => {
		let { container } = render(<Select {...props} />);
		const user = userEvent.setup();
		openMenu();
		eventsToSimulate.map(([eventName, eventArgs]) => {
			user[eventName](screen.getByTestId(`${testId}-select--listbox-container`)!, eventArgs);
		});
		await user.type(screen.getByTestId(`${testId}-select--listbox-container`)!, '{enter}');
		expect(container.querySelector<HTMLInputElement>('input[type="hidden"]')!.value).toBe(
			expectedSelectedOption,
		);
	},
	{
		'single select > open select and hit enter > should select first option': {
			eventsToSimulate: [],
			expectedSelectedOption: OPTIONS[0].value,
		},
		'single select > (open select -> 3 x ArrowDown -> Enter) > should select the forth option in the select':
			{
				eventsToSimulate: [
					['type', '{ArrowDown}'],
					['type', '{ArrowDown}'],
					['type', '{ArrowDown}'],
				],
				expectedSelectedOption: OPTIONS[3].value,
			},
		'single select > (open select -> 2 x ArrowDown -> 2 x ArrowUp -> Enter) > should select the first option in the select':
			{
				eventsToSimulate: [
					['type', '{ArrowDown}'],
					['type', '{ArrowDown}'],
					['type', '{ArrowUp}'],
					['type', '{ArrowUp}'],
				],
				expectedSelectedOption: OPTIONS[0].value,
			},
		'single select > (open select -> 1 x ArrowUp -> Enter) > should select the last option in the select':
			{
				eventsToSimulate: [['type', '{ArrowUp}']],
				expectedSelectedOption: OPTIONS[OPTIONS.length - 1].value,
			},
		'single select > (open select -> 1 x PageDown -> Enter) > should select the first option on next page - default pageSize 5':
			{
				eventsToSimulate: [['type', '{PageDown}']],
				expectedSelectedOption: OPTIONS[5].value,
			},
		'single select > (open select -> 1 x PageDown -> 1 x ArrowDown -> 1 x PageUp -> Enter) > should select the second option - default pageSize 5':
			{
				eventsToSimulate: [
					['type', '{PageDown}'],
					['type', '{ArrowDown}'],
					['type', '{PageUp}'],
				],
				expectedSelectedOption: OPTIONS[1].value,
			},
		'single select > (open select -> End -> Enter) > should select the last option': {
			eventsToSimulate: [['type', '{End}']],
			expectedSelectedOption: OPTIONS[OPTIONS.length - 1].value,
		},
		'single select > (open select -> 3 x PageDown -> Home -> Enter) > should select the last option':
			{
				eventsToSimulate: [
					['type', '{PageDown}'],
					['type', '{PageDown}'],
					['type', '{PageDown}'],
					['type', '{Home}'],
				],
				expectedSelectedOption: OPTIONS[0].value,
			},
		'single select > cycle options > ( open select -> End -> ArrowDown -> Enter) > should select the first option':
			{
				eventsToSimulate: [['type', '{End}'], , ['type', '{ArrowDown}']],
				expectedSelectedOption: OPTIONS[0].value,
			},
		'single select > cycle options > (open select -> ArrowUp -> Enter) > should select the last option':
			{
				eventsToSimulate: [['type', '{ArrowUp}']],
				expectedSelectedOption: OPTIONS[OPTIONS.length - 1].value,
			},
		'multi select > open select and hit enter > should select first option': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
			},
			eventsToSimulate: [],
			expectedSelectedOption: OPTIONS[0].value,
		},
		'multi select > (open select -> 3 x ArrowDown -> Enter) > should select the forth option in the select':
			{
				props: {
					...BASIC_PROPS,
					isMulti: true,
				},
				eventsToSimulate: [
					['type', '{ArrowDown}'],
					['type', '{ArrowDown}'],
					['type', '{ArrowDown}'],
				],
				expectedSelectedOption: OPTIONS[3].value,
			},
		'multi select > (open select -> 2 x ArrowDown -> 2 x ArrowUp -> Enter) > should select the first option in the select':
			{
				props: {
					...BASIC_PROPS,
					isMulti: true,
				},
				eventsToSimulate: [
					['type', '{ArrowDown}'],
					['type', '{ArrowDown}'],
					['type', '{ArrowUp}'],
					['type', '{ArrowUp}'],
				],
				expectedSelectedOption: OPTIONS[0].value,
			},
		'multi select > (open select -> 1 x ArrowUp -> Enter) > should select the last option in the select':
			{
				props: {
					...BASIC_PROPS,
					isMulti: true,
				},
				eventsToSimulate: [['type', '{ArrowUp}']],
				expectedSelectedOption: OPTIONS[OPTIONS.length - 1].value,
			},
		'multi select > (open select -> 1 x PageDown -> Enter) > should select the first option on next page - default pageSize 5':
			{
				props: {
					...BASIC_PROPS,
					isMulti: true,
				},
				eventsToSimulate: [['type', '{PageDown}']],
				expectedSelectedOption: OPTIONS[5].value,
			},
		'multi select > (open select -> 1 x PageDown -> 1 x ArrowDown -> 1 x PageUp -> Enter) > should select the second option - default pageSize 5':
			{
				props: {
					...BASIC_PROPS,
					isMulti: true,
				},
				eventsToSimulate: [
					['type', '{PageDown}'],
					['type', '{ArrowDown}'],
					['type', '{PageUp}'],
				],
				expectedSelectedOption: OPTIONS[1].value,
			},
		'multi select > (open select -> End -> Enter) > should select the last option': {
			props: {
				...BASIC_PROPS,
				isMulti: true,
			},
			eventsToSimulate: [['type', '{End}']],
			expectedSelectedOption: OPTIONS[OPTIONS.length - 1].value,
		},
		'multi select > (open select -> 3 x PageDown -> Home -> Enter) > should select the last option':
			{
				props: {
					...BASIC_PROPS,
					isMulti: true,
				},
				eventsToSimulate: [
					['type', '{PageDown}'],
					['type', '{PageDown}'],
					['type', '{PageDown}'],
					['type', '{Home}'],
				],
				expectedSelectedOption: OPTIONS[0].value,
			},
		'multi select > cycle options > ( open select -> End -> ArrowDown -> Enter) > should select the first option':
			{
				props: {
					...BASIC_PROPS,
					isMulti: true,
				},
				eventsToSimulate: [['type', '{End}'], , ['type', '{ArrowDown}']],
				expectedSelectedOption: OPTIONS[0].value,
			},
		'multi select > cycle options > (open select -> ArrowUp -> Enter) > should select the last option':
			{
				props: {
					...BASIC_PROPS,
					isMulti: true,
				},
				eventsToSimulate: [['type', '{ArrowUp}']],
				expectedSelectedOption: OPTIONS[OPTIONS.length - 1].value,
			},
	},
);

test('`required` prop > should validate', async () => {
	const { container } = render(
		<form id="formTest">
			<Select {...BASIC_PROPS} menuIsOpen required />
		</form>,
	);
	const user = userEvent.setup();

	expect(container.querySelector<HTMLFormElement>('#formTest')?.checkValidity()).toEqual(false);

	let selectOption = screen.getByTestId(`${testId}-select--option-3`);

	await user.click(selectOption);

	expect(container.querySelector<HTMLFormElement>('#formTest')?.checkValidity()).toEqual(true);
});
