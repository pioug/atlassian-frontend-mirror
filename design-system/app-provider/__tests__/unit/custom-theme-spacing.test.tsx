import React from 'react';

import { screen } from '@atlassian/testing-library/screen';
import { fireEvent, render } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import CustomThemeSpacingExample from '../../examples/custom-theme-spacing.wb.ap';

const originalResizeObserver = global.ResizeObserver;

function changeSlider(name: string, value: string) {
	// eslint-disable-next-line testing-library/prefer-user-event -- userEvent does not simulate native range input changes.
	fireEvent.change(screen.getByRole('slider', { name }), { target: { value } });
}

function spacingInputs() {
	// eslint-disable-next-line testing-library/no-node-access
	const wrapper = screen.getByTestId('gap-spacing-preview').closest('[data-theme-overrides-scope]');
	const scope = wrapper?.getAttribute('data-theme-overrides-scope');
	// eslint-disable-next-line testing-library/no-node-access
	return Array.from(document.head.querySelectorAll('style[data-theme-overrides]')).find((style) =>
		style.textContent?.includes(`[data-theme-overrides-scope="${scope}"]`),
	)?.textContent;
}

beforeEach(() => {
	global.ResizeObserver = jest.fn(() => ({
		observe: jest.fn(),
		unobserve: jest.fn(),
		disconnect: jest.fn(),
	})) as unknown as typeof ResizeObserver;
});

afterEach(() => {
	global.ResizeObserver = originalResizeObserver;
});

it('synchronizes the all-spacing toggle with the independent gap and inset toggles', async () => {
	const user = userEvent.setup();
	render(<CustomThemeSpacingExample />);
	const all = screen.getByRole('checkbox', { name: 'Show all spacing' });
	const gaps = screen.getByRole('checkbox', { name: 'Show gaps' });
	const insets = screen.getByRole('checkbox', { name: 'Show insets' });
	expect(all).not.toBeChecked();
	expect(gaps).not.toBeChecked();
	expect(insets).not.toBeChecked();
	await user.click(insets);
	expect(insets).toBeChecked();
	expect(gaps).not.toBeChecked();
	expect(all).toBePartiallyChecked();
	await user.click(all);
	expect(all).toBeChecked();
	expect(gaps).toBeChecked();
	expect(insets).toBeChecked();
	await user.click(gaps);
	expect(all).toBePartiallyChecked();
	expect(insets).toBeChecked();
	await user.click(gaps);
	expect(all).toBeChecked();
	await user.click(all);
	expect(all).not.toBeChecked();
	expect(gaps).not.toBeChecked();
	expect(insets).not.toBeChecked();
});

it('retains both spacing settings across tabs and resets each family independently', async () => {
	const user = userEvent.setup();
	render(<CustomThemeSpacingExample />);
	changeSlider('Gap scale', '2');
	expect(spacingInputs()).toContain('--ds-dynamic-space-gap-scale: 2;');
	expect(spacingInputs()).toContain('--ds-dynamic-space-inset-scale: 1;');

	await user.click(screen.getByRole('tab', { name: 'Insets' }));
	changeSlider('Inset scale', '3');
	expect(screen.getByRole('button', { name: 'space.inset.xxsmall: 4px' })).toBeVisible();
	expect(screen.getByRole('button', { name: 'space.inset.3xlarge: 144px' })).toBeVisible();
	expect(spacingInputs()).toContain('--ds-dynamic-space-inset-scale: 3;');
	expect(spacingInputs()).toContain('--ds-dynamic-space-gap-scale: 2;');

	await user.click(screen.getByRole('tab', { name: 'Gaps' }));
	expect(screen.getByRole('slider', { name: 'Gap scale' })).toHaveValue('2');
	await user.click(screen.getByRole('button', { name: 'Reset gaps' }));
	expect(spacingInputs()).toContain('--ds-dynamic-space-gap-scale: 1;');
	expect(spacingInputs()).toContain('--ds-dynamic-space-inset-scale: 3;');

	await user.click(screen.getByRole('tab', { name: 'Insets' }));
	expect(screen.getByRole('slider', { name: 'Inset scale' })).toHaveValue('3');
	await user.click(screen.getByRole('button', { name: 'Reset insets' }));
	expect(spacingInputs()).toContain('--ds-dynamic-space-inset-scale: 1;');
});

it('supports fractional inset presets without changing gap settings', async () => {
	const user = userEvent.setup();
	render(<CustomThemeSpacingExample />);
	changeSlider('Gap scale', '2');
	await user.click(screen.getByRole('tab', { name: 'Insets' }));
	await user.click(screen.getByRole('button', { name: /Fluid Fractional spacing/ }));
	expect(screen.getByRole('slider', { name: 'Inset scale' })).toHaveValue('1.25');
	expect(screen.getByRole('checkbox', { name: 'Round inset values' })).not.toBeChecked();
	expect(spacingInputs()).toContain('--ds-dynamic-space-inset-round: 0;');
	expect(screen.getByRole('group', { name: /Applied inset sizes:/ })).toHaveAccessibleName(
		expect.stringContaining('3xlarge 60px'),
	);

	await user.click(screen.getByRole('button', { name: /Default Original rhythm/ }));
	expect(screen.getByRole('button', { name: 'space.inset.large: 20px' })).toBeVisible();
	expect(screen.getByRole('button', { name: 'space.inset.xsmall: 8px' })).toBeVisible();
	expect(screen.getByRole('checkbox', { name: 'Round inset values' })).toBeChecked();
	expect(spacingInputs()).toContain('--ds-dynamic-space-gap-scale: 2;');
});

it('links controls in both directions while retaining each family’s base token sizes', async () => {
	const user = userEvent.setup();
	render(<CustomThemeSpacingExample />);
	expect(screen.queryByRole('tab', { name: 'Both' })).not.toBeInTheDocument();
	const link = screen.getByRole('checkbox', { name: 'Link gap and inset settings' });
	expect(link).not.toBeChecked();
	changeSlider('Gap scale', '2');
	await user.click(link);
	changeSlider('Scale uniformity', '1');
	changeSlider('Curve strength', '2');
	await user.click(screen.getByRole('checkbox', { name: 'Round gap values' }));
	expect(screen.getByRole('button', { name: 'space.gap.xxsmall: 4px' })).toBeVisible();
	expect(screen.getByRole('button', { name: 'space.gap.xxlarge: 48px' })).toBeVisible();

	await user.click(screen.getByRole('tab', { name: 'Insets' }));
	expect(screen.getByRole('slider', { name: 'Inset scale' })).toHaveValue('2');
	expect(screen.getByRole('slider', { name: 'Scale uniformity' })).toHaveValue('1');
	expect(screen.getByRole('slider', { name: 'Curve strength' })).toHaveValue('2');
	expect(screen.getByRole('button', { name: 'space.inset.xxsmall: 8px' })).toBeVisible();
	expect(screen.getByRole('button', { name: 'space.inset.xxlarge: 64px' })).toBeVisible();
	expect(screen.getByRole('button', { name: 'space.inset.3xlarge: 96px' })).toBeVisible();
	expect(screen.getByRole('checkbox', { name: 'Round inset values' })).not.toBeChecked();
	changeSlider('Inset scale', '1.25');
	await user.click(screen.getByRole('tab', { name: 'Gaps' }));
	expect(screen.getByRole('slider', { name: 'Gap scale' })).toHaveValue('1.25');
	expect(screen.getByRole('button', { name: 'space.gap.xxlarge: 30px' })).toBeVisible();
});

it('links from the active tab and unlinks without resetting either family', async () => {
	const user = userEvent.setup();
	render(<CustomThemeSpacingExample />);
	changeSlider('Gap scale', '2');
	changeSlider('Curve strength', '2');
	await user.click(screen.getByRole('tab', { name: 'Insets' }));
	changeSlider('Inset scale', '1.5');
	changeSlider('Scale uniformity', '0.5');
	await user.click(screen.getByRole('checkbox', { name: 'Round inset values' }));
	const link = screen.getByRole('checkbox', { name: 'Link gap and inset settings' });
	await user.click(link);
	await user.click(screen.getByRole('tab', { name: 'Gaps' }));
	expect(screen.getByRole('slider', { name: 'Gap scale' })).toHaveValue('1.5');
	expect(screen.getByRole('slider', { name: 'Curve strength' })).toHaveValue('1');
	expect(screen.getByRole('slider', { name: 'Scale uniformity' })).toHaveValue('0.5');
	expect(screen.getByRole('checkbox', { name: 'Round gap values' })).not.toBeChecked();
	const beforeUnlink = spacingInputs();
	await user.click(link);
	expect(spacingInputs()).toBe(beforeUnlink);
	changeSlider('Gap scale', '3');
	await user.click(screen.getByRole('tab', { name: 'Insets' }));
	expect(screen.getByRole('slider', { name: 'Inset scale' })).toHaveValue('1.5');
	expect(spacingInputs()).toContain('--ds-dynamic-space-gap-scale: 3;');
	expect(spacingInputs()).toContain('--ds-dynamic-space-inset-scale: 1.5;');
});

it('applies presets and reset to both families while linked', async () => {
	const user = userEvent.setup();
	render(<CustomThemeSpacingExample />);
	const defaults = spacingInputs();
	changeSlider('Gap scale', '3');
	await user.click(screen.getByRole('tab', { name: 'Insets' }));
	changeSlider('Inset scale', '1.5');
	await user.click(screen.getByRole('checkbox', { name: 'Link gap and inset settings' }));
	await user.click(screen.getByRole('button', { name: /Spacious Generous spacing/ }));
	expect(screen.getByRole('button', { name: 'space.inset.3xlarge: 96px' })).toBeVisible();
	await user.click(screen.getByRole('tab', { name: 'Gaps' }));
	expect(screen.getByRole('button', { name: 'space.gap.xxlarge: 48px' })).toBeVisible();
	expect(screen.getByRole('button', { name: /Spacious Generous spacing/ })).toHaveAttribute(
		'aria-pressed',
		'true',
	);
	await user.click(screen.getByRole('button', { name: 'Reset gaps and insets' }));
	expect(spacingInputs()).toBe(defaults);
	expect(screen.getByRole('checkbox', { name: 'Link gap and inset settings' })).toBeChecked();
	expect(screen.getByRole('button', { name: /Default Original rhythm/ })).toHaveAttribute(
		'aria-pressed',
		'true',
	);
});
