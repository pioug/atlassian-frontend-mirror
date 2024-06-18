import React, { useState } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import __noop from '@atlaskit/ds-lib/noop';

import DropdownMenu, { DropdownItemRadio, DropdownItemRadioGroup } from '../../../index';

const DropdownMenuWithRadio = () => {
	const [selected, setSelected] = useState('');
	return (
		<DropdownMenu trigger="Choices" onOpenChange={__noop} testId="lite-mode-ddm">
			<DropdownItemRadioGroup id="oversea-cities" title="Oversea cities">
				<DropdownItemRadio
					id="london"
					isSelected={selected === 'london'}
					onClick={() => setSelected('london')}
				>
					London
				</DropdownItemRadio>
				<DropdownItemRadio
					id="berlin"
					isSelected={selected === 'berlin'}
					onClick={() => setSelected('berlin')}
				>
					Berlin
				</DropdownItemRadio>
			</DropdownItemRadioGroup>
		</DropdownMenu>
	);
};

describe('DropdownMenu with RadioGroup and Radio', () => {
	describe('radio', () => {
		it('should render radio as initially unchecked', async () => {
			render(<DropdownMenuWithRadio />);

			const trigger = await screen.findByText('Choices');
			fireEvent.click(trigger);

			let radios = ((await screen.findAllByRole('menuitemradio')) || []).map((x) =>
				x.getAttribute('aria-checked'),
			);

			expect(radios).toEqual(['false', 'false']);
		});

		it('should toggle the radio when click', async () => {
			render(<DropdownMenuWithRadio />);

			const trigger = await screen.findByText('Choices');
			fireEvent.click(trigger);

			let radios = ((await screen.findAllByRole('menuitemradio')) || []).map((x) =>
				x.getAttribute('aria-checked'),
			);

			expect(radios).toEqual(['false', 'false']);

			const london = await screen.findByText('London');

			fireEvent.click(london);

			radios = ((await screen.findAllByRole('menuitemradio')) || []).map((x) =>
				x.getAttribute('aria-checked'),
			);

			expect(radios).toEqual(['true', 'false']);
		});
	});
});
