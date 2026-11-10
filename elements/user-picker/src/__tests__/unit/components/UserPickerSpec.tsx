import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

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
