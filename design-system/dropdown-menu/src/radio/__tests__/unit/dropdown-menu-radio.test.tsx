import React from 'react';

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import DropdownMenu from '../../../dropdown-menu';
import DropdownItemRadio from '../../dropdown-item-radio';
import DropdownItemRadioGroup from '../../dropdown-item-radio-group';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('DropdownMenu with RadioGroup and Radio', () => {
	it('should render defaultSelected item as checked', async () => {
		render(
			<DropdownMenu trigger="Choices" testId="lite-mode-ddm">
				<DropdownItemRadioGroup id="cities" title="Some cities">
					<DropdownItemRadio id="sydney">Sydney</DropdownItemRadio>
					<DropdownItemRadio id="melbourne" defaultSelected>
						Melbourne
					</DropdownItemRadio>
				</DropdownItemRadioGroup>
			</DropdownMenu>,
		);

		const trigger = await screen.findByText('Choices');
		await userEvent.click(trigger);

		let radios = ((await screen.findAllByRole('menuitemradio')) || []).map((x) =>
			x.getAttribute('aria-checked'),
		);

		expect(radios).toEqual(['false', 'true']);
	});

	it('should be able to select a radio by click', async () => {
		render(
			<DropdownMenu trigger="Choices" testId="lite-mode-ddm">
				<DropdownItemRadioGroup id="cities" title="Some cities">
					<DropdownItemRadio id="sydney">Sydney</DropdownItemRadio>
					<DropdownItemRadio id="melbourne" defaultSelected>
						Melbourne
					</DropdownItemRadio>
				</DropdownItemRadioGroup>
			</DropdownMenu>,
		);

		const trigger = await screen.findByText('Choices');
		await userEvent.click(trigger);

		let radios = ((await screen.findAllByRole('menuitemradio')) || []).map((x) =>
			x.getAttribute('aria-checked'),
		);

		expect(radios).toEqual(['false', 'true']);

		const sydney = await screen.findByText('Sydney');
		await userEvent.click(sydney);

		radios = ((await screen.findAllByRole('menuitemradio')) || []).map((x) =>
			x.getAttribute('aria-checked'),
		);

		expect(radios).toEqual(['true', 'false']);
	});

	it('does not add a redundant description to radio items', async () => {
		render(
			<DropdownMenu trigger="Choices" testId="lite-mode-ddm">
				<DropdownItemRadioGroup id="cities" title="Some cities">
					<DropdownItemRadio id="sydney">Sydney</DropdownItemRadio>
					<DropdownItemRadio id="melbourne" defaultSelected>
						Melbourne
					</DropdownItemRadio>
				</DropdownItemRadioGroup>
			</DropdownMenu>,
		);

		await userEvent.click(await screen.findByText('Choices'));

		const sydney = screen.getByRole('menuitemradio', { name: 'Sydney' });
		const melbourne = screen.getByRole('menuitemradio', { name: 'Melbourne' });
		expect(sydney).not.toHaveAttribute('aria-describedby');
		expect(melbourne).not.toHaveAttribute('aria-describedby');
		expect(sydney).not.toHaveAccessibleDescription();
		expect(melbourne).not.toHaveAccessibleDescription();
		expect(screen.queryByText(/radio button (true|false)/)).not.toBeInTheDocument();
	});

	it('should not allow role of radio on DropdownItemRadio menu items', async () => {
		render(
			<DropdownMenu trigger="Choices" testId="lite-mode-ddm">
				<DropdownItemRadioGroup id="cities" title="Some cities">
					<DropdownItemRadio id="sydney">Sydney</DropdownItemRadio>
					<DropdownItemRadio id="melbourne" defaultSelected>
						Melbourne
					</DropdownItemRadio>
				</DropdownItemRadioGroup>
			</DropdownMenu>,
		);

		const trigger = await screen.findByText('Choices');
		await userEvent.click(trigger);

		expect(screen.getAllByRole('menuitemradio').length).toBeGreaterThan(0);
		expect(screen.queryByRole('radio')).not.toBeInTheDocument();
	});
});
