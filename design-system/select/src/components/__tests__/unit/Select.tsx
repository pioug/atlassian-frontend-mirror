/* eslint-disable @repo/internal/fs/filename-pattern-match */
import React from 'react';

import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import cases from 'jest-in-case';
import selectEvent from 'react-select-event';

import AtlaskitSelect from '../../../index';
interface Option {
	readonly label: string;
	readonly value: string;
}

const user = userEvent.setup();

const OPTIONS = [
	{ label: '0', value: 'zero' },
	{ label: '1', value: 'one' },
	{ label: '2', value: 'two' },
	{ label: '3', value: 'three' },
	{ label: '4', value: 'four' },
];

describe('Select', () => {
	// test cases for async select using Select
	cases(
		'async load options',
		async ({ props, expectOptionLength }: any) => {
			render(<AtlaskitSelect classNamePrefix="react-select" menuIsOpen {...props} />);

			await waitFor(() => {
				expect(screen.getAllByRole('option').length).toBe(expectOptionLength);
			});
		},
		{
			'with callback  > should resolve options with defaultOptions true': {
				props: {
					defaultOptions: true,
					loadOptions: (inputValue: string, callBack: (options: readonly Option[]) => void) =>
						callBack([OPTIONS[0]]),
				},
				expectOptionLength: 1,
			},
			'with promise  > should resolve options with defaultOptions true': {
				props: {
					defaultOptions: true,
					loadOptions: () => Promise.resolve([OPTIONS[0]]),
				},
				expectOptionLength: 1,
			},
			'with cacheOptions  > should resolve options with defaultOptions true': {
				props: {
					defaultOptions: true,
					cacheOptions: true,
					loadOptions: () => Promise.resolve(OPTIONS),
				},
				expectOptionLength: OPTIONS.length,
			},
		},
	);

	// temporarily skip this test as part of DST-2476 resolution
	it.skip('should load the animated component as default', () => {
		render(<AtlaskitSelect label="Options" />);

		expect(screen.getByText('Transition')).toBeInTheDocument();
	});

	it('should toggle the menu on dropdown indicator click', async () => {
		render(<AtlaskitSelect classNamePrefix="react-select" label="Options" />);

		// Menu closed by default
		expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');

		act(() => {
			selectEvent.openMenu(screen.getByText('Select...'));
		});

		// Menu to open
		expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');
	});

	describe('single value select', () => {
		it('should show the default AtlaskitSelected value', () => {
			render(<AtlaskitSelect options={OPTIONS} value={OPTIONS[0]} label="Options" />);

			// Hides options cause the menu is closed
			expect(screen.queryByText('1')).not.toBeInTheDocument();
			// Displays the provided value
			expect(screen.getByText('0')).toBeInTheDocument();
		});

		//default value is there, no placeholder, no passed aria == no aria describedby
		it('should have no id aria-describedby', () => {
			render(<AtlaskitSelect options={OPTIONS} value={OPTIONS[0]} label="Options" />);

			expect(screen.getByRole('combobox')).toHaveAttribute(
				'aria-describedby',
				expect.stringContaining('single-value'),
			);
		});

		//default value is there, no placeholder, yes passed aria == yes aria describedby --> passed aria
		it('should show passed id as aria-describedby', () => {
			render(
				<AtlaskitSelect
					options={OPTIONS}
					value={OPTIONS[0]}
					descriptionId="descriptive-id"
					label="Options"
				/>,
			);
			const element = screen.getByRole('combobox').getAttribute('aria-describedby');
			expect(element).toContain('descriptive-id');
			expect(element).toContain('single-value');
		});

		//default value is yes there, yes placeholder, yes passed aria == yes aria describedby --> passed aria
		it('should show passed id as aria-describedby with placeholder', () => {
			render(
				<AtlaskitSelect
					options={OPTIONS}
					value={OPTIONS[0]}
					placeholder="Placeholder"
					descriptionId="descriptive-id"
					label="Options"
				/>,
			);

			const element = screen.getByRole('combobox').getAttribute('aria-describedby');
			expect(element).toContain('descriptive-id');
			expect(element).toContain('single-value');
		});

		//default value is not there, yes placeholder, yes passed aria == yes aria describedby --> passed aria, placeholder
		it('should show placeholder id and passed id as aria-describedby', () => {
			render(
				<AtlaskitSelect
					options={OPTIONS}
					placeholder="Placeholder"
					descriptionId="descriptive-id"
					label="Options"
				/>,
			);

			const placeholder = screen.queryByText('Placeholder');
			expect(placeholder).toBeInTheDocument();
			const placeholderId = placeholder?.id;
			const element = screen.getByRole('combobox').getAttribute('aria-describedby');
			expect(element).toBe(`descriptive-id ${placeholderId}`);
		});

		//default value is not there, yes placeholder, no passed aria == yes aria describedby --> placeholder
		it('should show placeholder id as aria-describedby', () => {
			render(<AtlaskitSelect options={OPTIONS} placeholder="Placeholder" label="Options" />);

			const placeholder = screen.queryByText('Placeholder');
			expect(placeholder).toBeInTheDocument();
			const placeholderId = placeholder?.id;
			const element = screen.getByRole('combobox').getAttribute('aria-describedby');
			expect(element).toBe(placeholderId);
		});
	});

	it('should show placeholder id and passed aria-describedby as aria-describedby when isSearchable is false', () => {
		render(
			<AtlaskitSelect
				options={OPTIONS}
				placeholder="Placeholder"
				isSearchable={false}
				descriptionId="descriptionId"
				label="Options"
			/>,
		);

		const placeholder = screen.queryByText('Placeholder');
		expect(placeholder).toBeInTheDocument();
		const placeholderId = placeholder?.id;
		const element = screen.getByRole('combobox').getAttribute('aria-describedby');
		expect(element).toBe(`descriptionId ${placeholderId}`);
	});

	describe('multi value select', () => {
		it('should show the default AtlaskitSelected value', () => {
			render(
				<AtlaskitSelect
					options={OPTIONS}
					isMulti
					value={[OPTIONS[0], OPTIONS[3]]}
					label="Options"
				/>,
			);

			// Hides options cause the menu is closed
			expect(screen.queryByText('1')).not.toBeInTheDocument();
			// Displays the provided values
			expect(screen.getByText('0')).toBeInTheDocument();
			expect(screen.getByText('3')).toBeInTheDocument();
		});

		it('should show clear icons on selections plus clear icon for whole select', () => {
			render(
				<AtlaskitSelect
					classNamePrefix="react-select"
					defaultValue={OPTIONS.slice(3, 5)}
					options={OPTIONS}
					isMulti
					label="Options"
				/>,
			);

			const clearIcons = screen.getAllByTestId('show-clear-icon');

			expect(clearIcons.length).toBe(2);
		});

		it('disabled multiselect should not show clear icon on selections or select itself', () => {
			render(
				<AtlaskitSelect
					isDisabled
					classNamePrefix="react-select"
					defaultValue={OPTIONS.slice(3, 5)}
					options={OPTIONS}
					isMulti
					label="Options"
				/>,
			);

			const clearIcons = screen.getAllByTestId('hide-clear-icon');

			expect(clearIcons.length).toBe(2);
		});
	});

	it('should disable options if isDisabled prop is true', async () => {
		const { container } = render(
			<AtlaskitSelect
				isDisabled
				classNamePrefix="react-select"
				options={OPTIONS}
				isMulti
				label="Options"
			/>,
		);

		expect(screen.getByText('Select...')).toBeInTheDocument();

		// eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
		const selectControl = container.getElementsByClassName('react-select__control--is-disabled');

		expect(selectControl).toHaveLength(1);
		expect(selectControl[0]).toHaveStyle('pointer-events: none');
	});

	it('should not disable options if isDisabled prop is false', async () => {
		render(
			<AtlaskitSelect
				isDisabled={false}
				classNamePrefix="react-select"
				options={OPTIONS}
				isMulti
				label="Options"
			/>,
		);

		act(() => {
			selectEvent.openMenu(screen.getByText('Select...'));
		});

		expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');
		expect(screen.getByText('1')).toBeInTheDocument();
	});

	it('should display options with group inside menu', () => {
		const options = [
			{
				label: 'group',
				options: [
					{ value: 1, label: '1' },
					{ value: 2, label: '2' },
				],
			},
		];
		render(<AtlaskitSelect options={options} menuIsOpen label="Options" />);

		expect(screen.getByText('group')).toBeInTheDocument();
		expect(screen.getAllByText('group')).toHaveLength(1);

		// eslint-disable-next-line testing-library/no-node-access
		const optionContainers = screen.getByText('group').nextElementSibling;
		expect(optionContainers).toHaveTextContent('1');
		expect(optionContainers).toHaveTextContent('2');
	});

	it('should  render only groups with a match when filtering', async () => {
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
		render(<AtlaskitSelect options={options} menuIsOpen label="Options" />);

		await user.click(screen.getByRole('combobox'));
		await user.keyboard('1');

		expect(screen.getByRole('combobox')).toHaveValue('1');
		expect(screen.getByText('group 1')).toBeInTheDocument();
		expect(screen.getByText('1')).toBeInTheDocument();
		expect(screen.queryByText('2')).not.toBeInTheDocument();
		expect(screen.queryByText('group 2')).not.toBeInTheDocument();
	});

	it('should not render any groups when there is no match when filtering', async () => {
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
		render(<AtlaskitSelect options={options} menuIsOpen label="Options" />);

		await user.click(screen.getByRole('combobox'));
		await user.keyboard('5');

		expect(screen.getByRole('combobox')).toHaveValue('5');
		expect(screen.queryByText('group 1')).not.toBeInTheDocument();
		expect(screen.queryByText('group 2')).not.toBeInTheDocument();
	});

	it('should autoFocus on the AtlaskitSelect when autoFocus is set to true', async () => {
		// eslint-disable-next-line @atlassian/a11y/no-autofocus
		render(<AtlaskitSelect options={OPTIONS} autoFocus label="Options" />);

		await user.keyboard('5');

		expect(screen.getByRole('combobox')).toHaveValue('5');
	});

	it('should not autoFocus on the AtlaskitSelect when autoFocus is set to false', async () => {
		// eslint-disable-next-line @atlassian/a11y/no-autofocus
		render(<AtlaskitSelect options={OPTIONS} autoFocus={false} label="Options" />);

		await user.keyboard('5');

		expect(screen.getByRole('combobox')).toHaveValue('');
	});

	it('should pass the className down to react-select', () => {
		const customClass = 'custom-class-name';

		const { container } = render(
			<AtlaskitSelect
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className={customClass}
				label="Options"
			/>,
		);

		// eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
		const selectWrapper = container.getElementsByClassName('custom-class-name');

		expect(selectWrapper).toHaveLength(1);
	});

	it('should render a hidden form field when name prop is passed', () => {
		const { container } = render(<AtlaskitSelect name="test-name" label="Options" />);

		// eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
		const inputs = container.getElementsByTagName('input');

		expect(inputs).toHaveLength(2);
		expect(inputs[1]).toHaveValue('');
		expect(inputs[1]).toHaveAttribute('type', 'hidden');
	});

	/**
	 * FilterOption is getting called multiple for a change in inputValue.
	 */
	it.skip('should call filterOption when input of select is changed', async () => {
		const filterOptionSpy = jest.fn();
		render(<AtlaskitSelect options={OPTIONS} filterOption={filterOptionSpy} label="Options" />);

		await user.keyboard('5');
		await user.clear(screen.getByText('Select...'));
		await user.keyboard('1');

		expect(filterOptionSpy).toHaveBeenCalledTimes(2);
	});
});

describe('Select input', () => {
	it('should respect explicit aria-described attribute value', () => {
		const errorId = 'error';

		render(<AtlaskitSelect options={OPTIONS} isInvalid descriptionId={errorId} label="Options" />);

		screen.getByRole('combobox').focus();
		screen.getByRole('combobox').blur();

		expect(screen.getByRole('combobox')).toHaveAttribute(
			'aria-describedby',
			expect.stringContaining(`${errorId}`),
		);
	});

	it('should respect explicit aria-describedby when there is components prop', () => {
		const labelId = 'label-1';

		render(
			<AtlaskitSelect
				options={OPTIONS}
				descriptionId={labelId}
				isSearchable={true} // To bypass the componentDidMount solution
				components={{
					DropdownIndicator: null,
				}}
				label="Options"
			/>,
		);

		expect(screen.getByRole('combobox')).toHaveAttribute(
			'aria-describedby',
			expect.stringContaining(labelId),
		);
	});

	it('should respect dynamically updated explicit aria-describedby', async () => {
		const label = 'label-1';
		const newLabel = 'newLabel-2';

		const { rerender } = render(
			<AtlaskitSelect
				options={OPTIONS}
				descriptionId={label}
				value={OPTIONS[0]}
				isSearchable={true} // To bypass the componentDidMount solution
				components={{
					DropdownIndicator: null,
				}}
				label="Options"
			/>,
		);

		const input = screen.getByRole('combobox');
		expect(input).toHaveAttribute('aria-describedby', expect.stringContaining(`${label}`));
		expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('single-value'));

		rerender(
			<AtlaskitSelect
				options={OPTIONS}
				descriptionId={newLabel}
				value={OPTIONS[0]}
				isSearchable={true} // To bypass the componentDidMount solution
				components={{
					DropdownIndicator: null,
				}}
				label="Options"
			/>,
		);

		// It shouldn't contain the old aria-describedby
		expect(input).toHaveAttribute('aria-describedby', expect.stringContaining(`${newLabel}`));
		expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('single-value'));
	});

	it("should respect dynamically updated explicit aria-describedby when the placeholder's ID is passed to aria-describedby", () => {
		const label = 'label-1';
		const newLabel = 'newLabel-2';

		const { rerender } = render(
			<AtlaskitSelect
				options={OPTIONS}
				descriptionId={label}
				value={OPTIONS[0]}
				isSearchable={true} // To bypass the componentDidMount solution
				components={{
					DropdownIndicator: null,
				}}
				label="Options"
			/>,
		);

		const input = screen.getByRole('combobox');
		expect(input).toHaveAttribute('aria-describedby', expect.stringContaining(`${label}`));
		expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('single-value'));

		rerender(
			<AtlaskitSelect
				options={OPTIONS}
				descriptionId={newLabel}
				value={null} // Clear the value so that react-select adds the placeholder aria-describedby
				isSearchable={true} // To bypass the componentDidMount solution
				components={{
					DropdownIndicator: null,
				}}
				label="Options"
			/>,
		);

		expect(input).toHaveAttribute('aria-describedby', expect.stringContaining(`${newLabel}`));
		expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('placeholder'));
	});
});

it('UNSAFE_is_experimental_generic should pass down and replace semantics', async () => {
	const testId = 'select';

	render(
		<AtlaskitSelect menuIsOpen options={OPTIONS} testId={testId} UNSAFE_is_experimental_generic />,
	);

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
