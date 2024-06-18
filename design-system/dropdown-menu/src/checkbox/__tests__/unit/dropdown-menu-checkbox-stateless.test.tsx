import React, { useState } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import __noop from '@atlaskit/ds-lib/noop';

import DropdownMenu, { DropdownItemCheckbox, DropdownItemCheckboxGroup } from '../../../index';

const DropdownCheckboxStateless = () => {
	const [selected, setSelected] = useState<string[]>([]);

	const selectOption = (option: string) => {
		if (selected.includes(option)) {
			setSelected(selected.filter((x) => x !== option));
		} else {
			setSelected([...selected, option]);
		}
	};
	return (
		<DropdownMenu trigger="Select cities" onOpenChange={__noop} testId="lite-mode-ddm">
			<DropdownItemCheckboxGroup id="cities" title="Some cities">
				<DropdownItemCheckbox
					id="sydney"
					isSelected={selected.includes('sydney')}
					onClick={() => {
						selectOption('sydney');
					}}
				>
					Sydney
				</DropdownItemCheckbox>
				<DropdownItemCheckbox
					id="melbourne"
					isSelected={selected.includes('melbourne')}
					onClick={() => {
						selectOption('melbourne');
					}}
				>
					Melbourne
				</DropdownItemCheckbox>
			</DropdownItemCheckboxGroup>
		</DropdownMenu>
	);
};

describe('DropdownMenu with checkbox as item', () => {
	describe('checkbox stateless', () => {
		it('select item by click', async () => {
			render(<DropdownCheckboxStateless />);

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
	});
});
