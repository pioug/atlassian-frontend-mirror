import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

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
		fireEvent.click(trigger);

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
		fireEvent.click(trigger);

		let radios = ((await screen.findAllByRole('menuitemradio')) || []).map((x) =>
			x.getAttribute('aria-checked'),
		);

		expect(radios).toEqual(['false', 'true']);

		const sydney = await screen.findByText('Sydney');
		fireEvent.click(sydney);

		radios = ((await screen.findAllByRole('menuitemradio')) || []).map((x) =>
			x.getAttribute('aria-checked'),
		);

		expect(radios).toEqual(['true', 'false']);
	});
});
