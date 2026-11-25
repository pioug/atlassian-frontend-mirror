import React from 'react';

import { IntlProvider } from 'react-intl';

import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { userEvent } from '@atlassian/testing-library/user-event';
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
	it('propagate Tab when platform_editor_lovability_colors_a11y_fixes is enabled', () => {
		mockExpEnabled('platform_editor_lovability_colors_a11y_fixes');
		renderPalette();

		const event = new KeyboardEvent('keydown', {
			key: 'Tab',
			bubbles: true,
			cancelable: true,
		});
		screen.getByRole('radio', { name: 'Bold blue' }).dispatchEvent(event);
		expect(event.defaultPrevented).toBe(false);
	});

	it('prevents Tab when platform_editor_lovability_colors_a11y_fixes is disabled', () => {
		mockExpDisabled('platform_editor_lovability_colors_a11y_fixes');
		renderPalette();

		const event = new KeyboardEvent('keydown', {
			key: 'Tab',
			bubbles: true,
			cancelable: true,
		});
		screen.getByRole('radio', { name: 'Bold blue' }).dispatchEvent(event);
		expect(event.defaultPrevented).toBe(true);
	});

	it('exposes all swatches as one radio group named by the palette label', async () => {
		renderPalette();

		const radioGroup = screen.getByRole('radiogroup', { name: 'Text color' });
		// Colors are laid out over multiple rows, but they are a single choice
		expect(within(radioGroup).getAllByRole('radio')).toHaveLength(palette.length);
		expect(screen.getAllByRole('radiogroup')).toHaveLength(1);
		await expect(document.body).toBeAccessible();
	});

	it('navigates between swatches when a top-layer tooltip is rendered in the row', async () => {
		mockExpEnabled('platform_editor_lovability_colors_a11y_fixes');
		passGate('platform-dst-top-layer-tooltip');
		const user = userEvent.setup();
		renderPalette();

		const firstColor = screen.getByRole('radio', { name: 'Bold blue' });
		const secondColor = screen.getByRole('radio', { name: 'Bold teal' });
		const thirdColor = screen.getByRole('radio', { name: 'Bold green' });
		await user.tab();
		await user.hover(firstColor);
		await screen.findByRole('tooltip');

		await user.keyboard('{ArrowRight}');
		expect(secondColor).toHaveFocus();
		await user.keyboard('{ArrowRight}');
		expect(thirdColor).toHaveFocus();
		await user.keyboard('{ArrowLeft}');
		expect(secondColor).toHaveFocus();
	});

	it('preserves the original navigation when the experiment is disabled', async () => {
		mockExpDisabled('platform_editor_lovability_colors_a11y_fixes');
		passGate('platform-dst-top-layer-tooltip');
		const user = userEvent.setup();
		renderPalette();

		const firstColor = screen.getByRole('radio', { name: 'Bold blue' });
		await user.tab();
		await user.hover(firstColor);
		await screen.findByRole('tooltip');

		await user.keyboard('{ArrowRight}');
		expect(firstColor).toHaveFocus();
	});
});
