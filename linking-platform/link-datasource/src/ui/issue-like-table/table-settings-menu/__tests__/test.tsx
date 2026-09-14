import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';

import { layers } from '@atlaskit/theme/constants';

import { TableSettingsMenu } from '../TableSettingsMenu';

const onChange = jest.fn();

const renderMenu = (props?: Partial<React.ComponentProps<typeof TableSettingsMenu>>) =>
	render(
		<IntlProvider locale="en">
			<TableSettingsMenu
				wrapTextSetting={{
					isChecked: false,
					onChange,
				}}
				{...props}
			/>
		</IntlProvider>,
	);

describe('TableSettingsMenu', () => {
	beforeEach(() => {
		onChange.mockClear();
		jest
			.spyOn(window, 'requestAnimationFrame')
			.mockImplementation((callback: FrameRequestCallback): number => {
				callback(0);
				return 0;
			});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('renders a more actions trigger', () => {
		renderMenu();

		expect(screen.getByRole('button', { name: 'More actions' })).toBeInTheDocument();
	});

	it('does not render a trigger when there are no available settings', () => {
		renderMenu({ wrapTextSetting: undefined });

		expect(screen.queryByRole('button', { name: 'More actions' })).not.toBeInTheDocument();
	});

	it('renders the popup above modal dialogs', async () => {
		const user = userEvent.setup();
		renderMenu();

		await user.click(screen.getByRole('button', { name: 'More actions' }));

		const popup = await screen.findByRole('dialog', { name: 'Table settings' });
		expect(popup.closest('.atlaskit-portal')).toHaveStyle(`z-index: ${layers.modal()}`);
	});

	it('moves focus to the setting and supports keyboard interaction', async () => {
		const user = userEvent.setup();
		renderMenu();

		await user.tab();
		const trigger = screen.getByRole('button', { name: 'More actions' });
		expect(trigger).toHaveFocus();

		await user.keyboard('{Enter}');
		expect(await screen.findByRole('dialog', { name: 'Table settings' })).toBeInTheDocument();

		const toggle = screen.getByRole('checkbox', { name: 'Wrap text in all columns' });
		await waitFor(() => expect(toggle).toHaveFocus());

		await user.keyboard(' ');
		expect(onChange).toHaveBeenCalledTimes(1);

		await user.keyboard('{Escape}');
		await waitFor(() => expect(trigger).toHaveFocus());
	});

	it('should capture and report a11y violations', async () => {
		const user = userEvent.setup();
		const { baseElement } = renderMenu();

		await user.click(screen.getByRole('button', { name: 'More actions' }));
		await screen.findByRole('dialog', { name: 'Table settings' });

		await expect(baseElement).toBeAccessible();
	});
});
