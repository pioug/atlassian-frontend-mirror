/* eslint-disable @repo/internal/fs/filename-pattern-match */
import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { groupedCountries } from '../../../data/countries';
import { CountrySelect } from '../../../index';

const OPTIONS = [
	{ icon: '🇺🇿', name: 'Uzbekistan', abbr: 'UZ', code: '998' },
	{ icon: '🇻🇺', name: 'Vanuatu', abbr: 'VU', code: '678' },
	{ icon: '🇻🇪', name: 'Venezuela', abbr: 'VE', code: '58' },
];

describe('Country Select accessible labels and group labels', () => {
	const orginalNavigator = window.navigator;
	Object.defineProperty(
		window.navigator,
		'userAgentData',
		((value) => ({
			get() {
				return value;
			},
			set(v) {
				value = v;
			},
			//@ts-ignore we need to override platform to macOS to test aria-live messages
		}))(window.navigator.userAgentData),
	);
	beforeEach(() => {
		//@ts-ignore we need to override platform to macOS to test aria-live messages
		global.navigator.userAgentData = { platform: 'macOS' };
	});

	afterEach(() => {
		global.navigator = orginalNavigator;
	});

	it('screen reader should announce the option labels, option serial number, and number of all options', async () => {
		render(<CountrySelect options={OPTIONS} aria-label="Options" />);
		const input = screen.getByRole('combobox');
		const ariaLive = screen.getByRole('log');
		await userEvent.click(input);
		expect(ariaLive).toHaveTextContent('Uzbekistan (UZ) +998, 1 of 3.3 results available.');
		await userEvent.keyboard('{ArrowDown>}');
		expect(ariaLive).toHaveTextContent('Vanuatu (VU) +678, 2 of 3.3 results available.');
	});

	it('screen reader should announce the group labels, option serial number in the group, and number of options in the group', async () => {
		render(<CountrySelect options={groupedCountries} aria-label="Options" />);

		await userEvent.click(screen.getByRole('combobox'));

		await waitFor(() => {
			expect(
				screen.getByText('Option Australia (AU) +61, Suggested group, item 1 out of 6.', {
					exact: false,
				}),
			).toBeVisible();
		});

		await userEvent.keyboard('{ArrowDown>}');

		await waitFor(() => {
			expect(
				screen.getByText('Option Canada (CA) +1, Suggested group, item 2 out of 6', {
					exact: false,
				}),
			).toBeVisible();
		});
	});
});
