import React from 'react';

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import DropdownMenu, { DropdownItemRadio, DropdownItemRadioGroup } from '../../../index';

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

	it('should have accessible description on Radio Items', async () => {
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

		expect(screen.getByRole('menuitemradio', { name: 'Sydney' })).toHaveAccessibleDescription();
		expect(screen.getByRole('menuitemradio', { name: 'Melbourne' })).toHaveAccessibleDescription();
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
