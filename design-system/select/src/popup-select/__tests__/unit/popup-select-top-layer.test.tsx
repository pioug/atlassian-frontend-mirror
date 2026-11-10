import React from 'react';

import { skipA11yAudit } from '@af/accessibility-testing/skip-a11y-audit';
import { Text } from '@atlaskit/primitives/compiled/text';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { render, waitFor } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import { type MenuProps, type OptionsType, type OptionType } from '../../../types';
import { PopupSelect, type PopupSelectProps } from '../../popup-select';
import { getLegacyOffset } from '../../popup-select-top-layer';

const OPTIONS: OptionsType = [
	{ label: 'Adelaide', value: 'adelaide' },
	{ label: 'Brisbane', value: 'brisbane' },
];

const renderPopupSelect = (props: Partial<PopupSelectProps<OptionType>> = {}) =>
	render(
		<PopupSelect
			options={OPTIONS}
			testId="popup-select"
			label="Cities"
			target={({ isOpen: _isOpen, ...triggerProps }) => (
				<button type="button" {...triggerProps}>
					Choose
				</button>
			)}
			{...props}
		/>,
	);

describe('PopupSelect top-layer', () => {
	beforeEach(() => {
		skipA11yAudit();
		passGate('platform-dst-top-layer');
	});

	describe('aria-controls', () => {
		// The popover host is in the DOM only while the popup is open.
		it('is set on the trigger only while the popup is open', async () => {
			const user = userEvent.setup();
			renderPopupSelect();
			const trigger = screen.getByRole('button', { name: 'Choose' });

			expect(trigger).not.toHaveAttribute('aria-controls');

			await user.click(trigger);
			const popup = await screen.findByTestId('popup-select--content');
			expect(popup.id).not.toBe('');
			expect(trigger).toHaveAttribute('aria-controls', popup.id);

			await user.click(trigger);
			await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
			expect(trigger).not.toHaveAttribute('aria-controls');
		});
	});

	describe('popperProps.modifiers', () => {
		it('opens with a popper v1 modifiers object', async () => {
			const user = userEvent.setup();
			renderPopupSelect({
				popperProps: {
					// @ts-expect-error -- Popper v1 shape, which some consumers still pass.
					modifiers: { offset: { offset: '-10 5' } },
				},
			});

			await user.click(screen.getByRole('button', { name: 'Choose' }));

			expect(await screen.findByTestId('popup-select--menu')).toBeInTheDocument();
		});
	});

	describe('components.Menu', () => {
		// The top-layer popup renders the Select in inline mode, which keeps a consumer `Menu`.
		it('renders a consumer Menu', async () => {
			const user = userEvent.setup();
			const Menu = ({ children, innerRef, innerProps }: MenuProps<OptionType, boolean>) => (
				<div ref={innerRef} {...innerProps}>
					<Text as="p">Custom menu header</Text>
					{children}
				</div>
			);
			renderPopupSelect({ components: { Menu } });

			await user.click(screen.getByRole('button', { name: 'Choose' }));

			expect(await screen.findByText('Custom menu header')).toBeInTheDocument();
			// MenuList owns the listbox ID, so the Menu around it does not repeat it.
			expect(screen.getByRole('listbox').id).not.toBe('');
			expect(screen.getByTestId('popup-select-select--listbox-container')).not.toHaveAttribute(
				'id',
			);
		});
	});
});

// Legacy spreads `popperProps` over its defaults, so any consumer `modifiers` value replaces the
// default `[0, 8]` offset.
describe('getLegacyOffset', () => {
	it.each<[string, unknown, [number, number]]>([
		['no modifiers', undefined, [0, 8]],
		['an offset modifier', [{ name: 'offset', options: { offset: [4, 12] } }], [4, 12]],
		['no offset modifier', [{ name: 'flip', enabled: false }], [0, 0]],
		['a popper v1 modifiers object', { offset: { offset: '-10 5' } }, [0, 0]],
	])('matches the legacy offset for %s', (_name, modifiers, offset) => {
		expect(getLegacyOffset({ modifiers })).toEqual(offset);
	});
});
