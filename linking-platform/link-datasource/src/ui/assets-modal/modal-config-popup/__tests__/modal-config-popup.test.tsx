import React from 'react';

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';

import { aboveModal } from '../../../../common/zindex';
import { AssetsModalConfigPopup, type AssetsModalConfigPopupProps } from '../index';

const onChange = jest.fn();

const renderPopup = (props?: Partial<AssetsModalConfigPopupProps>) =>
	render(
		<IntlProvider locale="en">
			<AssetsModalConfigPopup onChange={onChange} {...props} />
		</IntlProvider>,
	);

const openPopup = async (user: ReturnType<typeof userEvent.setup>) => {
	await user.click(screen.getByRole('button', { name: 'Configure table' }));
	return screen.findByRole('dialog', { name: 'Configure table' });
};

describe('AssetsModalConfigPopup', () => {
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

	it('renders a trigger button and keeps the popup closed by default', () => {
		renderPopup();

		expect(screen.getByRole('button', { name: 'Configure table' })).toBeInTheDocument();
		expect(screen.queryByRole('dialog', { name: 'Configure table' })).not.toBeInTheDocument();
	});

	it('toggles the popup when the trigger is clicked', async () => {
		const user = userEvent.setup();
		renderPopup();

		const trigger = screen.getByRole('button', { name: 'Configure table' });

		await user.click(trigger);
		expect(await screen.findByRole('dialog', { name: 'Configure table' })).toBeInTheDocument();

		await user.click(trigger);
		expect(screen.queryByRole('dialog', { name: 'Configure table' })).not.toBeInTheDocument();
	});

	it('renders the popup above modal dialogs', async () => {
		const user = userEvent.setup();
		renderPopup();

		const popup = await openPopup(user);
		expect(popup.closest('.atlaskit-portal')).toHaveStyle(`z-index: ${aboveModal}`);
	});

	it('renders the pagination select with default values and the checkbox', async () => {
		const user = userEvent.setup();
		renderPopup();

		await openPopup(user);

		expect(screen.getByRole('combobox', { name: 'Table pagination:' })).toBeInTheDocument();
		expect(screen.getByText('20 objects per page')).toBeInTheDocument();
		expect(
			screen.getByRole('checkbox', { name: 'Enable nested reference attribute selection' }),
		).not.toBeChecked();
	});

	it('renders the provided initial config', async () => {
		const user = userEvent.setup();
		renderPopup({
			initialConfig: { pageSize: 50, isNestedReferenceAttributeSelectionEnabled: true },
		});

		await openPopup(user);

		expect(screen.getByText('50 objects per page')).toBeInTheDocument();
		expect(
			screen.getByRole('checkbox', { name: 'Enable nested reference attribute selection' }),
		).toBeChecked();
	});

	it('lists all page size options', async () => {
		const user = userEvent.setup();
		renderPopup();

		await openPopup(user);
		await user.click(screen.getByText('20 objects per page'));

		expect(await screen.findByRole('option', { name: '10 objects per page' })).toBeInTheDocument();
		expect(screen.getByRole('option', { name: '20 objects per page' })).toBeInTheDocument();
		expect(screen.getByRole('option', { name: '50 objects per page' })).toBeInTheDocument();
		expect(screen.getByRole('option', { name: '100 objects per page' })).toBeInTheDocument();
	});

	it('calls onChange with a numeric page size when a select option is chosen', async () => {
		const user = userEvent.setup();
		renderPopup();

		await openPopup(user);
		await user.click(screen.getByText('20 objects per page'));
		await user.click(await screen.findByRole('option', { name: '100 objects per page' }));

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith({
			pageSize: 100,
			isNestedReferenceAttributeSelectionEnabled: false,
		});
		expect(screen.getByText('100 objects per page')).toBeInTheDocument();
	});

	it('calls onChange with a boolean when the checkbox is toggled', async () => {
		const user = userEvent.setup();
		renderPopup({ initialConfig: { pageSize: 10 } });

		await openPopup(user);
		const checkbox = screen.getByRole('checkbox', {
			name: 'Enable nested reference attribute selection',
		});

		await user.click(checkbox);
		expect(onChange).toHaveBeenLastCalledWith({
			pageSize: 10,
			isNestedReferenceAttributeSelectionEnabled: true,
		});
		expect(checkbox).toBeChecked();

		await user.click(checkbox);
		expect(onChange).toHaveBeenLastCalledWith({
			pageSize: 10,
			isNestedReferenceAttributeSelectionEnabled: false,
		});
		expect(checkbox).not.toBeChecked();
	});

	it('closes the popup on Escape and returns focus to the trigger', async () => {
		const user = userEvent.setup();
		renderPopup();

		await openPopup(user);
		await user.keyboard('{Escape}');

		expect(screen.queryByRole('dialog', { name: 'Configure table' })).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Configure table' })).toHaveFocus();
	});

	it('should capture and report a11y violations', async () => {
		const user = userEvent.setup();
		const { baseElement } = renderPopup();

		await openPopup(user);

		await expect(baseElement).toBeAccessible();
	});
});
