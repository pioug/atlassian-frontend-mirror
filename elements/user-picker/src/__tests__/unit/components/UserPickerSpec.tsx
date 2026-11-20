import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { UserPickerWithoutAnalytics } from '../../../components/UserPicker';
import { type User } from '../../../types';

const options: User[] = [
	{ id: 'abc-123', name: 'Jace Beleren', publicName: 'jbeleren' },
	{ id: '123-abc', name: 'Chandra Nalaar', publicName: 'cnalaar' },
];

const renderPicker = (props: React.ComponentProps<typeof UserPickerWithoutAnalytics>) =>
	render(
		<IntlProvider locale="en">
			<UserPickerWithoutAnalytics {...props} />
		</IntlProvider>,
	);

describe('UserPicker', () => {
	it('should render the default picker', async () => {
		renderPicker({ fieldId: 'test', options });

		expect(screen.getByRole('combobox')).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	it('should render options when opened', async () => {
		renderPicker({ fieldId: 'test', options, open: true });

		expect(await screen.findByText('Jace Beleren')).toBeInTheDocument();
		expect(screen.getByText('Chandra Nalaar')).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	it('should render a disabled picker', async () => {
		renderPicker({ fieldId: 'test', isDisabled: true });

		expect(screen.getByRole('combobox', { hidden: true })).toBeDisabled();
		await expect(document.body).toBeAccessible();
	});

	it('should call onSelection after selecting an option', async () => {
		const onSelection = jest.fn();
		renderPicker({ fieldId: 'test', options, open: true, onSelection });

		fireEvent.click(await screen.findByText('Jace Beleren'));
		await waitFor(() => expect(onSelection).toHaveBeenCalled());
		expect(onSelection.mock.calls[0][0]).toEqual(options[0]);
	});

	describe.each([
		{
			scenario: 'legacy tags',
			upliftEnabled: false,
			fixEnabled: null,
			hasNamedImage: false,
		},
		{
			scenario: 'uplifted tags with the fix off',
			upliftEnabled: true,
			fixEnabled: false,
			hasNamedImage: true,
		},
		{
			scenario: 'uplifted tags with the fix on',
			upliftEnabled: true,
			fixEnabled: true,
			hasNamedImage: false,
		},
	])('selected avatars in $scenario', ({ upliftEnabled, fixEnabled, hasNamedImage }) => {
		it.each([
			{
				variant: 'user photo',
				avatar: { type: 'user', avatarUrl: 'https://example.com/user.png' },
			},
			{ variant: 'user fallback', avatar: { type: 'user' } },
			{
				variant: 'team photo',
				avatar: { type: 'team', avatarUrl: 'https://example.com/team.png' },
			},
			{ variant: 'team fallback', avatar: { type: 'team' } },
			{ variant: 'agent fallback', avatar: { type: 'user', appType: 'agent' } },
		] as const)('renders the expected image role for $variant', async ({ avatar }) => {
			(upliftEnabled ? passGate : failGate)('platform-dst-lozenge-tag-badge-visual-uplifts');
			if (fixEnabled !== null) {
				(fixEnabled ? passGate : failGate)('platform-user-picker-a11y-51062-decorative-avatars');
			}
			failGate('platform-dst-motion-uplift-labels');
			mockExpEnabled('platform_user_picker_agent_avatar_hexagon');

			const value = { id: 'selected', name: 'Selected member', ...avatar };
			renderPicker({
				fieldId: 'members',
				ariaLabel: 'Add team members',
				isMulti: true,
				defaultValue: [value],
			});

			expect(await screen.findByText(value.name, { ignore: '[hidden]' })).toBeVisible();
			if (hasNamedImage) {
				expect(screen.getByRole('img', { name: value.name })).toBeInTheDocument();
			} else {
				expect(screen.queryByRole('img')).not.toBeInTheDocument();
			}
		});
	});

	describe('menuRenderMode', () => {
		const isInPopover = (element: HTMLElement) => element.closest('[popover]') !== null;

		beforeEach(() => {
			passGate('platform-dst-top-layer');
		});

		it('renders the menu in a top-layer popover by default', async () => {
			renderPicker({ fieldId: 'test', options, open: true });

			expect(isInPopover(await screen.findByRole('listbox'))).toBe(true);
		});

		it('renders the menu in place, with its header and footer, in inline mode', async () => {
			const { container } = renderPicker({
				fieldId: 'test',
				options,
				open: true,
				menuRenderMode: 'inline',
				header: <div>Menu header</div>,
				footer: <div>Menu footer</div>,
			});

			const listbox = await screen.findByRole('listbox');
			expect(isInPopover(listbox)).toBe(false);
			expect(container).toContainElement(listbox);
			expect(screen.getByRole('option', { name: /Jace Beleren/ })).toBeInTheDocument();
			const menu = listbox.parentElement;
			expect(menu).toContainElement(screen.getByText('Menu header'));
			expect(menu).toContainElement(screen.getByText('Menu footer'));
			await expect(document.body).toBeAccessible();
		});
	});
});
