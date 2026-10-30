import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import DropdownMenu from '../../../dropdown-menu';
import DropdownItemCheckbox from '../../dropdown-item-checkbox';
import DropdownItemCheckboxGroup from '../../dropdown-item-checkbox-group';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('DropdownMenu with checkbox as item', () => {
	describe('checkbox', () => {
		it('conveys controlled selection without aria-current', () => {
			const { rerender } = render(
				<DropdownItemCheckbox id="pages" isSelected>
					Pages
				</DropdownItemCheckbox>,
			);

			const checkbox = screen.getByRole('menuitemcheckbox', { name: 'Pages' });
			expect(checkbox).toBeChecked();
			expect(checkbox).not.toHaveAttribute('aria-current');

			rerender(
				<DropdownItemCheckbox id="pages" isSelected={false}>
					Pages
				</DropdownItemCheckbox>,
			);
			expect(checkbox).not.toBeChecked();
			expect(checkbox).not.toHaveAttribute('aria-current');
		});

		it('updates aria-checked without adding aria-current when toggled', async () => {
			render(
				<DropdownMenu trigger="Content">
					<DropdownItemCheckboxGroup id="content">
						<DropdownItemCheckbox id="pages">Pages</DropdownItemCheckbox>
					</DropdownItemCheckboxGroup>
				</DropdownMenu>,
			);
			await userEvent.click(screen.getByRole('button', { name: 'Content' }));

			const checkbox = screen.getByRole('menuitemcheckbox', { name: 'Pages' });
			expect(checkbox).not.toBeChecked();
			expect(checkbox).not.toHaveAttribute('aria-current');

			await userEvent.click(checkbox);
			expect(checkbox).toBeChecked();
			expect(checkbox).not.toHaveAttribute('aria-current');

			await userEvent.click(checkbox);
			expect(checkbox).not.toBeChecked();
			expect(checkbox).not.toHaveAttribute('aria-current');
		});

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

			// The top-layer menu stays mounted until its exit animation ends.
			await waitFor(() => expect(screen.queryByText('Sydney')).not.toBeInTheDocument());
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
