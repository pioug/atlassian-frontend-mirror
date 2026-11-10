import React, { useState } from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';

import Select from '@atlaskit/select/default';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import {
	BaseUserPicker,
	BaseUserPickerWithoutAnalytics,
	type BaseUserPickerProps,
} from '../../../components/BaseUserPicker';
import { getComponents } from '../../../components/components';
import { type User } from '../../../types';

const options: User[] = [
	{
		id: 'abc-123',
		name: 'Jace Beleren',
		publicName: 'jbeleren',
		type: 'user',
	},
	{
		id: '123-abc',
		name: 'Chandra Nalaar',
		publicName: 'cnalaar',
		type: 'user',
	},
];

const renderBase = (
	props: Partial<BaseUserPickerProps> = {},
	BasePicker:
		| typeof BaseUserPickerWithoutAnalytics
		| typeof BaseUserPicker = BaseUserPickerWithoutAnalytics,
) =>
	render(
		<IntlProvider locale="en">
			<BasePicker
				inputId="test"
				fieldId="test"
				aria-label="Test"
				SelectComponent={Select}
				styles={{}}
				components={getComponents(props.isMulti)}
				width="100%"
				{...props}
			/>
		</IntlProvider>,
	);

describe('BaseUserPicker', () => {
	it('should render a combobox', async () => {
		renderBase({ options });

		expect(screen.getByRole('combobox')).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	it('should disable picker if isDisabled is true', async () => {
		renderBase({ isDisabled: true });

		expect(screen.getByRole('combobox', { hidden: true })).toBeDisabled();
		await expect(document.body).toBeAccessible();
	});

	it('should set a custom placeholder', async () => {
		renderBase({ placeholder: 'custom placeholder' });

		expect(screen.getByText('custom placeholder')).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	it('should show options when opened', async () => {
		renderBase({ options, open: true });

		expect(await screen.findByText('Jace Beleren')).toBeInTheDocument();
		expect(screen.getByText('Chandra Nalaar')).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	it('should invoke onFocus with the input focus event', async () => {
		const onFocus = jest.fn();
		renderBase({ onFocus });

		fireEvent.focus(screen.getByRole('combobox'));
		await waitFor(() => expect(onFocus).toHaveBeenCalled());
		await expect(document.body).toBeAccessible();
	});

	it.each([true, false])(
		'notifies once when clicking to open and pressing Escape to close (top layer: %s)',
		async (topLayer) => {
			if (topLayer) {
				passGate('platform-dst-top-layer');
			} else {
				failGate('platform-dst-top-layer');
			}
			const onOpen = jest.fn();
			const onClose = jest.fn();
			renderBase({ options, onOpen, onClose });

			await userEvent.click(screen.getByRole('combobox'));

			expect(screen.getByRole('listbox')).toBeVisible();
			expect(onOpen).toHaveBeenCalledTimes(1);

			await userEvent.keyboard('{Escape}');

			expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
			expect(onClose).toHaveBeenCalledTimes(1);
		},
	);

	it('should invoke onSelection when an option is selected', async () => {
		const onSelection = jest.fn();
		renderBase({ options, open: true, onSelection });

		fireEvent.click(await screen.findByText('Jace Beleren'));
		await waitFor(() => expect(onSelection).toHaveBeenCalled());
		expect(onSelection.mock.calls[0][0]).toEqual(options[0]);
		await expect(document.body).toBeAccessible();
	});

	it('should render multiple selected values', async () => {
		renderBase({ options, isMulti: true, value: options });

		expect(screen.getByText('Jace Beleren')).toBeInTheDocument();
		expect(screen.getByText('Chandra Nalaar')).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	it('should expose aria-labelledby on the input', async () => {
		renderBase({ ariaLabelledBy: 'label-id' });

		expect(screen.getByRole('combobox')).toHaveAttribute('aria-labelledby', 'label-id');
		await expect(document.body).toBeAccessible();
	});

	it('should emit analytics events through the analytics wrapper', async () => {
		const onSelection = jest.fn();
		renderBase({ options, open: true, onSelection }, BaseUserPicker);

		fireEvent.click(await screen.findByText('Jace Beleren'));
		await waitFor(() => expect(onSelection).toHaveBeenCalled());
		await expect(document.body).toBeAccessible();
	});

	// A control in the header (or footer) whose own popup is open, for example a select.
	describe('Escape from a header control whose own popup is open', () => {
		const HeaderControl = () => {
			const [isOpen, setIsOpen] = useState(false);
			return (
				<>
					<button type="button" aria-expanded={isOpen} onClick={() => setIsOpen(true)}>
						Filter
					</button>
					<Popover
						isOpen={isOpen}
						onClose={() => setIsOpen(false)}
						role="dialog"
						label="Filter options"
					>
						<button type="button">Teams only</button>
					</Popover>
				</>
			);
		};

		const renderWithHeaderControl = (setIsHeaderFocused: jest.Mock, header: React.ReactNode) =>
			renderBase({
				options,
				header,
				isHeaderFocused: true,
				setIsHeaderFocused,
			});

		const openMenu = async (user: ReturnType<typeof userEvent.setup>) => {
			await user.click(screen.getByRole('combobox'));
			expect(await screen.findByRole('listbox')).toBeInTheDocument();
		};

		const openHeaderPopup = async (user: ReturnType<typeof userEvent.setup>) => {
			await user.click(screen.getByRole('button', { name: 'Filter' }));
			expect(await screen.findByRole('dialog', { name: 'Filter options' })).toBeInTheDocument();
		};

		// On the top layer the control's own popup takes the Escape and closes.
		it.each([
			['the popup trigger', 'Filter'],
			['a control inside the popup', 'Teams only'],
		])(
			'keeps the picker menu and header focus on the top-layer path, with focus on %s',
			async (_name, focusedButton) => {
				passGate('platform-dst-top-layer');
				const user = userEvent.setup();
				const setIsHeaderFocused = jest.fn();
				renderWithHeaderControl(setIsHeaderFocused, <HeaderControl />);
				await openMenu(user);
				await openHeaderPopup(user);
				screen.getByRole('button', { name: focusedButton }).focus();

				await user.keyboard('{Escape}');

				expect(screen.getByRole('listbox')).toBeInTheDocument();
				expect(setIsHeaderFocused).not.toHaveBeenCalled();
			},
		);

		it('closes the picker menu on the legacy path', async () => {
			failGate('platform-dst-top-layer');
			const user = userEvent.setup();
			const setIsHeaderFocused = jest.fn();
			renderWithHeaderControl(
				setIsHeaderFocused,
				<button type="button" aria-expanded="true">
					Filter
				</button>,
			);
			await openMenu(user);
			screen.getByRole('button', { name: 'Filter' }).focus();

			await user.keyboard('{Escape}');

			await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
			expect(setIsHeaderFocused).toHaveBeenCalledWith(false);
		});
	});
});
