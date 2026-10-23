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
	const preview = screen.getByTestId('gap-spacing-preview');
	const originalGap = preview.style.getPropertyValue('--ds-space-gap-xxlarge');
	const originalInset = preview.style.getPropertyValue('--ds-space-inset-xxlarge');

	changeSlider('Gap scale', '2');
	const changedGap = preview.style.getPropertyValue('--ds-space-gap-xxlarge');
	expect(changedGap).not.toBe(originalGap);
	expect(preview.style.getPropertyValue('--ds-space-inset-xxlarge')).toBe(originalInset);

	await user.click(screen.getByRole('tab', { name: 'Insets' }));
	changeSlider('Inset scale', '3');
	expect(screen.getByRole('slider', { name: 'xxsmall' })).toHaveValue('4');
	expect(screen.getByRole('slider', { name: 'xxlarge' })).toHaveValue('96');
	const changedInset = preview.style.getPropertyValue('--ds-space-inset-xxlarge');
	expect(changedInset).not.toBe(originalInset);
	expect(preview.style.getPropertyValue('--ds-space-gap-xxlarge')).toBe(changedGap);

	await user.click(screen.getByRole('tab', { name: 'Gaps' }));
	expect(screen.getByRole('slider', { name: 'Gap scale' })).toHaveValue('2');
	await user.click(screen.getByRole('button', { name: 'Reset gaps' }));
	expect(preview.style.getPropertyValue('--ds-space-gap-xxlarge')).toBe(originalGap);
	expect(preview.style.getPropertyValue('--ds-space-inset-xxlarge')).toBe(changedInset);

	await user.click(screen.getByRole('tab', { name: 'Insets' }));
	expect(screen.getByRole('slider', { name: 'Inset scale' })).toHaveValue('3');
	await user.click(screen.getByRole('button', { name: 'Reset insets' }));
	expect(preview.style.getPropertyValue('--ds-space-inset-xxlarge')).toBe(originalInset);
});

it('supports fractional inset overrides and clears them when an inset preset is selected', async () => {
	const user = userEvent.setup();
	render(<CustomThemeSpacingExample />);
	changeSlider('large', '17');
	const preview = screen.getByTestId('gap-spacing-preview');
	const gapOverride = preview.style.getPropertyValue('--ds-space-gap-large');

	await user.click(screen.getByRole('tab', { name: 'Insets' }));
	await user.click(screen.getByRole('checkbox', { name: 'Round inset values' }));
	changeSlider('large', '41.25');
	changeSlider('xsmall', '9.5');
	expect(screen.getByRole('slider', { name: 'large' })).toHaveValue('41.25');
	expect(screen.getByRole('slider', { name: 'xsmall' })).toHaveValue('9.5');
	expect(screen.getByRole('img', { name: /Applied inset sizes:/ })).toHaveAccessibleName(
		expect.stringContaining('large 41.25px'),
	);

	await user.click(screen.getByRole('button', { name: /Default Original rhythm/ }));
	expect(screen.getByRole('slider', { name: 'large' })).toHaveValue('20');
	expect(screen.getByRole('slider', { name: 'xsmall' })).toHaveValue('8');
	expect(screen.getByRole('checkbox', { name: 'Round inset values' })).toBeChecked();
	expect(preview.style.getPropertyValue('--ds-space-gap-large')).toBe(gapOverride);
});

it('links general controls in both directions while retaining each family’s token sizes', async () => {
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
	expect(screen.getByRole('slider', { name: 'xxsmall' })).toHaveValue('4');
	expect(screen.getByRole('slider', { name: 'xxlarge' })).toHaveValue('48');

	await user.click(screen.getByRole('tab', { name: 'Insets' }));
	expect(screen.getByRole('slider', { name: 'Inset scale' })).toHaveValue('2');
	expect(screen.getByRole('slider', { name: 'Scale uniformity' })).toHaveValue('1');
	expect(screen.getByRole('slider', { name: 'Curve strength' })).toHaveValue('2');
	expect(screen.getByRole('slider', { name: 'xxsmall' })).toHaveValue('8');
	expect(screen.getByRole('slider', { name: 'xxlarge' })).toHaveValue('64');
	expect(screen.getByRole('checkbox', { name: 'Round inset values' })).not.toBeChecked();
	changeSlider('Inset scale', '1.25');
	await user.click(screen.getByRole('tab', { name: 'Gaps' }));
	expect(screen.getByRole('slider', { name: 'Gap scale' })).toHaveValue('1.25');
	expect(screen.getByRole('slider', { name: 'xxlarge' })).toHaveValue('30');
});

it('links from the active tab while retaining individual sizes, then unlinks without resetting', async () => {
	const user = userEvent.setup();
	render(<CustomThemeSpacingExample />);
	changeSlider('Gap scale', '2');
	changeSlider('Curve strength', '2');
	changeSlider('xxlarge', '55');
	await user.click(screen.getByRole('tab', { name: 'Insets' }));
	changeSlider('Scale uniformity', '0.5');
	await user.click(screen.getByRole('checkbox', { name: 'Round inset values' }));
	changeSlider('xxlarge', '41.25');
	const link = screen.getByRole('checkbox', { name: 'Link gap and inset settings' });
	await user.click(link);
	expect(screen.getByRole('slider', { name: 'xxlarge' })).toHaveValue('41.25');
	await user.click(screen.getByRole('tab', { name: 'Gaps' }));
	expect(screen.getByRole('slider', { name: 'Gap scale' })).toHaveValue('1');
	expect(screen.getByRole('slider', { name: 'Curve strength' })).toHaveValue('1');
	expect(screen.getByRole('slider', { name: 'Scale uniformity' })).toHaveValue('0.5');
	expect(screen.getByRole('slider', { name: 'xxlarge' })).toHaveValue('55');
	expect(screen.getByRole('checkbox', { name: 'Round gap values' })).not.toBeChecked();
	const preview = screen.getByTestId('gap-spacing-preview');
	const insetValue = preview.style.getPropertyValue('--ds-space-inset-xxlarge');
	changeSlider('xxlarge', '50');
	expect(preview.style.getPropertyValue('--ds-space-inset-xxlarge')).toBe(insetValue);
	const beforeUnlink = preview.style.cssText;
	await user.click(link);
	expect(preview).toHaveStyle(beforeUnlink);
	changeSlider('Gap scale', '3');
	await user.click(screen.getByRole('tab', { name: 'Insets' }));
	expect(screen.getByRole('slider', { name: 'Inset scale' })).toHaveValue('1');
	expect(screen.getByRole('slider', { name: 'xxlarge' })).toHaveValue('41.25');
});

it('applies presets and reset to both families while linked, clearing individual overrides', async () => {
	const user = userEvent.setup();
	render(<CustomThemeSpacingExample />);
	const preview = screen.getByTestId('gap-spacing-preview');
	const defaults = preview.style.cssText;
	changeSlider('xxlarge', '55');
	await user.click(screen.getByRole('tab', { name: 'Insets' }));
	changeSlider('xxlarge', '66');
	await user.click(screen.getByRole('checkbox', { name: 'Link gap and inset settings' }));
	await user.click(screen.getByRole('button', { name: /Spacious Generous spacing/ }));
	expect(screen.getByRole('slider', { name: 'xxlarge' })).toHaveValue('64');
	await user.click(screen.getByRole('tab', { name: 'Gaps' }));
	expect(screen.getByRole('slider', { name: 'xxlarge' })).toHaveValue('48');
	expect(screen.getByRole('button', { name: /Spacious Generous spacing/ })).toHaveAttribute(
		'aria-pressed',
		'true',
	);
	await user.click(screen.getByRole('button', { name: 'Reset gaps and insets' }));
	expect(preview).toHaveStyle(defaults);
	expect(screen.getByRole('checkbox', { name: 'Link gap and inset settings' })).toBeChecked();
	expect(screen.getByRole('button', { name: /Default Original rhythm/ })).toHaveAttribute(
		'aria-pressed',
		'true',
	);
});
