import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { UserPicker } from '../../../components/UserPicker';

const users = [
	{ id: 'first', name: 'First user' },
	{ id: 'second', name: 'Second user' },
];

describe('User Picker tag motion', () => {
	beforeEach(() => {
		jest.useFakeTimers();
		passGate('platform-dst-lozenge-tag-badge-visual-uplifts');
		passGate('platform-dst-motion-uplift-labels');
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it.each([false, true])('persists a removed user through exit with focus=%s', async (focused) => {
		await act(async () => {
			render(
				<IntlProvider locale="en">
					<UserPicker
						fieldId="users"
						ariaLabel="Users"
						isMulti
						defaultValue={users}
						options={users}
					/>
				</IntlProvider>,
			);
		});
		const input = screen.getByRole('combobox');
		if (focused) {
			fireEvent.focus(input);
		}
		const remove = screen.getByRole('button', { name: 'Remove First user' });
		const label = screen.getByText('First user', { selector: '[data-tag-text]' });
		fireEvent.click(remove);
		expect(label).toBeInTheDocument();
		act(() => jest.advanceTimersByTime(100));
		expect(label).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Remove Second user' })).toBeInTheDocument();
	});

	it('removes an unfocused value immediately with reduced motion', async () => {
		const matchMedia = jest.spyOn(window, 'matchMedia').mockReturnValue({
			matches: true,
		} as MediaQueryList);
		await act(async () => {
			render(
				<IntlProvider locale="en">
					<UserPicker
						fieldId="users"
						ariaLabel="Users"
						isMulti
						defaultValue={users}
						options={users}
					/>
				</IntlProvider>,
			);
		});
		fireEvent.click(screen.getByRole('button', { name: 'Remove First user' }));
		expect(
			screen.queryByText('First user', { selector: '[data-tag-text]' }),
		).not.toBeInTheDocument();
		matchMedia.mockRestore();
	});

	it('is accessible', async () => {
		jest.useRealTimers();
		const { container } = render(
			<IntlProvider locale="en">
				<UserPicker
					fieldId="users"
					ariaLabel="Users"
					isMulti
					defaultValue={users}
					options={users}
				/>
			</IntlProvider>,
		);
		await expect(container).toBeAccessible();
	});
});
