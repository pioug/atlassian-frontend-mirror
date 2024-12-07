/* eslint-disable @repo/internal/fs/filename-pattern-match */
import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { token } from '@atlaskit/tokens';

import AtlaskitCheckboxSelect from '../../../CheckboxSelect';

const user = userEvent.setup();

const OPTIONS = [
	{ label: '0', value: 'zero' },
	{ label: '1', value: 'one' },
	{ label: '2', value: 'two' },
	{ label: '3', value: 'three' },
	{ label: '4', value: 'four' },
];

describe('Checkbox Select', () => {
	it('should render all checkbox options', () => {
		render(<AtlaskitCheckboxSelect menuIsOpen={true} options={OPTIONS} label="Options" />);

		expect(screen.getByText('1')).toBeInTheDocument();
		expect(screen.getByText('2')).toBeInTheDocument();
		expect(screen.getByText('3')).toBeInTheDocument();
		expect(screen.getByText('4')).toBeInTheDocument();
	});

	it('should show checkbox icon with every option', () => {
		render(<AtlaskitCheckboxSelect menuIsOpen={true} options={OPTIONS} label="Options" />);

		// one icon represents select dropdown trigger
		expect(screen.getAllByRole('presentation', { hidden: true })).toHaveLength(6);
	});

	it('should not hide option after selection and should render it in value container', async () => {
		render(<AtlaskitCheckboxSelect menuIsOpen={true} options={OPTIONS} label="Options" />);

		expect(screen.getByText('1')).toBeInTheDocument();

		await user.click(screen.getByText('1'));

		// displays selected checkbox in the value container and as an options
		expect(screen.getAllByText('1')).toHaveLength(2);
	});

	it('should not close menu after a checkbox is selected', async () => {
		render(<AtlaskitCheckboxSelect menuIsOpen={true} options={OPTIONS} label="Options" />);

		expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');

		await user.click(screen.getByText('1'));

		expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');
	});

	it('should mark option as selected on user click', async () => {
		render(<AtlaskitCheckboxSelect menuIsOpen={true} options={OPTIONS} label="Options" />);

		const checkboxToBeSelected = screen.getAllByRole('presentation', {
			hidden: true,
		})[1];

		// eslint-disable-next-line testing-library/no-node-access
		expect(checkboxToBeSelected.parentElement).toHaveStyle(`--icon-secondary-color: transparent`);

		await user.click(screen.getByText('0'));

		const selectedOption = screen.getAllByRole('presentation', {
			hidden: true,
		})[1];

		// eslint-disable-next-line testing-library/no-node-access
		expect(selectedOption.parentElement).toHaveStyle(
			`--icon-secondary-color: ${token('elevation.surface', '#FFFFFF')}`,
		);
	});

	it('should allow multi selection of checkboxes', async () => {
		render(<AtlaskitCheckboxSelect menuIsOpen={true} options={OPTIONS} label="Options" />);

		expect(screen.getAllByText('1')).toHaveLength(1);
		expect(screen.getAllByText('2')).toHaveLength(1);

		await user.click(screen.getByText('1'));
		await user.click(screen.getByText('2'));

		expect(screen.getAllByText('1')).toHaveLength(2);
		expect(screen.getAllByText('2')).toHaveLength(2);
	});
});
