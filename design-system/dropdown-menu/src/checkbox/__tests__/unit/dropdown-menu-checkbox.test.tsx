import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import DropdownMenu, { DropdownItemCheckbox, DropdownItemCheckboxGroup } from '../../../index';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('DropdownMenu with checkbox as item', () => {
	describe('checkbox', () => {
		it('render checkbox on the dropdown menu', () => {
			render(
				<DropdownMenu trigger="Select cities">
					<DropdownItemCheckboxGroup id="cities">
						<DropdownItemCheckbox id="sydney">Sydney</DropdownItemCheckbox>
						<DropdownItemCheckbox id="melbourne">Melbourne</DropdownItemCheckbox>
					</DropdownItemCheckboxGroup>
				</DropdownMenu>,
			);

			const trigger = screen.getByText('Select cities');
			fireEvent.click(trigger);

			expect(screen.getByText('Sydney')).toBeInTheDocument();
			expect(screen.getByText('Melbourne')).toBeInTheDocument();
		});

		it('click to check checkbox on the dropdown menu', async () => {
			render(
				<DropdownMenu trigger="Select cities">
					<DropdownItemCheckboxGroup id="cities">
						<DropdownItemCheckbox id="sydney">Sydney</DropdownItemCheckbox>
						<DropdownItemCheckbox id="melbourne">Melbourne</DropdownItemCheckbox>
					</DropdownItemCheckboxGroup>
				</DropdownMenu>,
			);

			const trigger = screen.getByText('Select cities');

			fireEvent.click(trigger);

			expect(screen.getByText('Sydney')).toBeInTheDocument();
			expect(screen.getByText('Melbourne')).toBeInTheDocument();

			let checkboxes = ((await screen.findAllByRole('menuitemcheckbox')) || []).map((x) =>
				x.getAttribute('aria-checked'),
			);
			expect(checkboxes).toEqual(['false', 'false']);

			const melbourne = screen.getByText('Melbourne');
			fireEvent.click(melbourne);

			checkboxes = ((await screen.findAllByRole('menuitemcheckbox')) || []).map((x) =>
				x.getAttribute('aria-checked'),
			);
			expect(checkboxes).toEqual(['false', 'true']);
		});

		it('click to check multiple checkboxes on the dropdown menu', async () => {
			render(
				<DropdownMenu trigger="Select cities">
					<DropdownItemCheckboxGroup id="cities">
						<DropdownItemCheckbox id="sydney">Sydney</DropdownItemCheckbox>
						<DropdownItemCheckbox id="melbourne">Melbourne</DropdownItemCheckbox>
					</DropdownItemCheckboxGroup>
				</DropdownMenu>,
			);

			const trigger = screen.getByText('Select cities');

			fireEvent.click(trigger);

			expect(screen.getByText('Sydney')).toBeInTheDocument();
			expect(screen.getByText('Melbourne')).toBeInTheDocument();

			let checkboxes = ((await screen.findAllByRole('menuitemcheckbox')) || []).map((x) =>
				x.getAttribute('aria-checked'),
			);
			expect(checkboxes).toEqual(['false', 'false']);

			const sydney = screen.getByText('Sydney');
			const melbourne = screen.getByText('Melbourne');

			fireEvent.click(sydney);

			fireEvent.click(melbourne);

			checkboxes = ((await screen.findAllByRole('menuitemcheckbox')) || []).map((x) =>
				x.getAttribute('aria-checked'),
			);
			expect(checkboxes).toEqual(['true', 'true']);
		});

		it('uncheck checkbox on the dropdown menu', async () => {
			render(
				<DropdownMenu trigger="Select cities">
					<DropdownItemCheckboxGroup id="cities">
						<DropdownItemCheckbox id="sydney" defaultSelected>
							Sydney
						</DropdownItemCheckbox>
						<DropdownItemCheckbox id="melbourne">Melbourne</DropdownItemCheckbox>
					</DropdownItemCheckboxGroup>
				</DropdownMenu>,
			);

			const trigger = screen.getByText('Select cities');

			fireEvent.click(trigger);

			expect(screen.getByText('Sydney')).toBeInTheDocument();
			expect(screen.getByText('Melbourne')).toBeInTheDocument();

			let checkboxes = ((await screen.findAllByRole('menuitemcheckbox')) || []).map((x) =>
				x.getAttribute('aria-checked'),
			);
			expect(checkboxes).toEqual(['true', 'false']);

			const sydney = screen.getByText('Sydney');
			fireEvent.click(sydney);

			checkboxes = ((await screen.findAllByRole('menuitemcheckbox')) || []).map((x) =>
				x.getAttribute('aria-checked'),
			);
			expect(checkboxes).toEqual(['false', 'false']);
		});

		it('reopen dropdown menu the selection should be persisted', async () => {
			render(
				<DropdownMenu trigger="Select cities">
					<DropdownItemCheckboxGroup id="cities">
						<DropdownItemCheckbox id="sydney" defaultSelected>
							Sydney
						</DropdownItemCheckbox>
						<DropdownItemCheckbox id="melbourne">Melbourne</DropdownItemCheckbox>
					</DropdownItemCheckboxGroup>
				</DropdownMenu>,
			);

			const trigger = screen.getByText('Select cities');

			fireEvent.click(trigger);

			expect(screen.getByText('Sydney')).toBeInTheDocument();
			expect(screen.getByText('Melbourne')).toBeInTheDocument();

			let checkboxes = ((await screen.findAllByRole('menuitemcheckbox')) || []).map((x) =>
				x.getAttribute('aria-checked'),
			);
			expect(checkboxes).toEqual(['true', 'false']);

			const sydney = screen.getByText('Sydney');
			fireEvent.click(sydney);

			checkboxes = ((await screen.findAllByRole('menuitemcheckbox')) || []).map((x) =>
				x.getAttribute('aria-checked'),
			);
			expect(checkboxes).toEqual(['false', 'false']);

			// close the dropdown menu
			fireEvent.click(trigger);

			expect(screen.queryByText('Sydney')).not.toBeInTheDocument();
			expect(screen.queryByText('Melbourne')).not.toBeInTheDocument();

			// click to reopen the dropdown menu
			fireEvent.click(trigger);

			checkboxes = ((await screen.findAllByRole('menuitemcheckbox')) || []).map((x) =>
				x.getAttribute('aria-checked'),
			);
			expect(checkboxes).toEqual(['false', 'false']);
		});
	});
});
