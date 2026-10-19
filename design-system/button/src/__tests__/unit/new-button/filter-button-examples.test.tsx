import React from 'react';

import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import FilterButtonDefaultExample from '../../../../examples/constellation/new-button/filter-button/filter-button-default';
import FilterButtonDropdownExample from '../../../../examples/constellation/new-button/filter-button/filter-button-dropdown';
import FilterButtonStatesExample from '../../../../examples/constellation/new-button/filter-button/filter-button-states';

describe('Filter button documentation examples', () => {
	it.each([false, true])('renders accessible count examples with Finesse=%s', async (enabled) => {
		enabled ? passGate('platform-dst-tokens-finesse') : failGate('platform-dst-tokens-finesse');
		const { container } = render(<FilterButtonDefaultExample />);

		for (const name of ['Filter 8', 'Filter 0', 'Filter 99+', 'Filter']) {
			expect(screen.getByRole('button', { name })).toBeVisible();
		}
		await expect(container).toBeAccessible();
	});

	it.each([false, true])(
		'starts selected and toggles its count with Finesse=%s',
		async (enabled) => {
			enabled ? passGate('platform-dst-tokens-finesse') : failGate('platform-dst-tokens-finesse');
			const user = userEvent.setup();
			const { container } = render(<FilterButtonStatesExample />);
			const toggle = screen.getByRole('button', { name: 'Assigned to me 1' });

			expect(toggle).toHaveAttribute('aria-pressed', 'true');
			await user.click(toggle);
			expect(toggle).toHaveAccessibleName('Assigned to me 0');
			expect(toggle).toHaveAttribute('aria-pressed', 'false');
			expect(toggle).toHaveFocus();
			await user.keyboard(' ');
			expect(toggle).toHaveAccessibleName('Assigned to me 1');
			expect(toggle).toHaveAttribute('aria-pressed', 'true');
			await expect(container).toBeAccessible();
		},
	);

	it.each([false, true])(
		'preserves legacy menu trigger behavior with Finesse=%s',
		async (enabled) => {
			enabled ? passGate('platform-dst-tokens-finesse') : failGate('platform-dst-tokens-finesse');
			// Native Popover focus restoration needs browser coverage; jsdom doesn't implement it.
			failGate('platform-dst-top-layer');
			const user = userEvent.setup();
			const { container } = render(<FilterButtonDropdownExample />);
			const trigger = screen.getByRole('button', { name: 'Filter' });

			await user.click(trigger);
			expect(trigger).toHaveAttribute('aria-expanded', 'true');
			await user.click(await screen.findByText('Apply status filter'));
			expect(trigger).toHaveAccessibleName('Filter 1');
			expect(trigger).toHaveAttribute('aria-expanded', 'false');
			expect(trigger).not.toHaveAttribute('aria-pressed');
			await user.click(trigger);
			await user.click(await screen.findByText('Clear filters'));
			expect(trigger).toHaveAccessibleName('Filter');
			await user.click(trigger);
			await user.keyboard('{Escape}');
			expect(trigger).toHaveAttribute('aria-expanded', 'false');
			// Platform's shared Jest setup stubs requestAnimationFrame, including this focus callback.
			act(() => {
				(
					window.requestAnimationFrame as typeof window.requestAnimationFrame & {
						flush: () => void;
					}
				).flush();
			});
			expect(trigger).toHaveFocus();
			await expect(container).toBeAccessible();
		},
	);
});
