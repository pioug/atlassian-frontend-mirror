import React from 'react';

import { IntlProvider } from 'react-intl';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { within } from '@atlassian/testing-library/within';

import ColorPalette from '../ColorPalette';

const palette = [
	{ border: 'transparent', label: 'Bold blue', value: '#0055CC' },
	{ border: 'transparent', label: 'Bold teal', value: '#206A83' },
	{ border: 'transparent', label: 'Bold green', value: '#216E4E' },
];

const renderPalette = () =>
	render(
		<IntlProvider locale="en">
			<h2 id="text-color-label">Text color</h2>
			<ColorPalette
				ariaLabelledBy="text-color-label"
				cols={2}
				onClick={() => {}}
				selectedColor={null}
				paletteOptions={{ palette }}
			/>
		</IntlProvider>,
	);

describe('ColorPalette radio group semantics', () => {
	it('exposes all swatches as one radio group named by the palette label', async () => {
		passGate('platform_editor_a11y_color_palette_radiogroup');

		renderPalette();

		const radioGroup = screen.getByRole('radiogroup', { name: 'Text color' });
		// Colors are laid out over multiple rows, but they are a single choice
		expect(within(radioGroup).getAllByRole('radio')).toHaveLength(palette.length);
		expect(screen.getAllByRole('radiogroup')).toHaveLength(1);
		await expect(document.body).toBeAccessible();
	});

	it('keeps a radio group per row when the gate is off', () => {
		failGate('platform_editor_a11y_color_palette_radiogroup');

		renderPalette();

		expect(screen.getAllByRole('radiogroup')).toHaveLength(2);
		expect(screen.queryByRole('radiogroup', { name: 'Text color' })).not.toBeInTheDocument();
	});
});
