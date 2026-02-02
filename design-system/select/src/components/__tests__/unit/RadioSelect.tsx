/* eslint-disable @repo/internal/fs/filename-pattern-match */
import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AtlaskitRadioSelect from '../../../radio-select';

const user = userEvent.setup();

const OPTIONS = [
	{ label: '0', value: 'zero' },
	{ label: '1', value: 'one' },
	{ label: '2', value: 'two' },
	{ label: '3', value: 'three' },
	{ label: '4', value: 'four' },
];

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Radio Select', () => {
	it('should load radio icons with options', () => {
		render(<AtlaskitRadioSelect menuIsOpen options={OPTIONS} label="Options" />);

		expect(screen.getByText('1')).toBeInTheDocument();
		expect(screen.getByText('2')).toBeInTheDocument();
		expect(screen.getByText('3')).toBeInTheDocument();
		expect(screen.getByText('4')).toBeInTheDocument();
		// one icon represents select dropdown trigger
		expect(screen.getAllByRole('presentation', { hidden: true })).toHaveLength(6);
	});

	it('should not close menu after an option is selected', async () => {
		render(<AtlaskitRadioSelect menuIsOpen={true} options={OPTIONS} label="Options" />);

		expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');

		await user.click(screen.getByText('1'));

		expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');
	});

	it('should mark option as selected on user click', async () => {
		render(<AtlaskitRadioSelect menuIsOpen={true} options={OPTIONS} label="Options" />);

		const opt0 = screen.getByRole('option', { name: '0' });
		const opt1 = screen.getByRole('option', { name: '1' });
		expect(opt0).toHaveAttribute('aria-selected', 'false');
		expect(opt1).toHaveAttribute('aria-selected', 'false');
		await user.click(opt0);
		expect(opt0).toHaveAttribute('aria-selected', 'true');
		expect(opt1).toHaveAttribute('aria-selected', 'false');
		await user.click(opt1);
		expect(opt0).toHaveAttribute('aria-selected', 'false');
		expect(opt1).toHaveAttribute('aria-selected', 'true');
	});

	it('should not allow to select multiple options', async () => {
		render(<AtlaskitRadioSelect menuIsOpen options={OPTIONS} label="Options" />);

		expect(screen.getAllByText('1')).toHaveLength(1);
		expect(screen.getAllByText('2')).toHaveLength(1);

		await user.click(screen.getByText('1'));
		await user.click(screen.getByText('2'));

		expect(screen.getAllByText('1')).toHaveLength(1);
		expect(screen.getAllByText('2')).toHaveLength(2);
	});
});
