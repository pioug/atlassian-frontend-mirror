import React, { useState } from 'react';

import { bind } from 'bind-event-listener';

import { hasOpenDialogOrPopover } from '@atlaskit/top-layer/page-surface/has-open-dialog-or-popover';
import { requestClosePopovers } from '@atlaskit/top-layer/page-surface/request-close-popovers';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { act, render, waitFor } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import { Popup } from '../../popup';
import { type TriggerProps } from '../../types';

type TOnClose = (event: Event | React.MouseEvent | React.KeyboardEvent | null) => void;

/**
 * A press on the trigger pins the popup open. `onClose` (when given) closes it.
 */
function PinnablePopup({
	onClose,
	role,
	label,
	isInitiallyOpen = true,
	isOutsideMouseDownPrevented = false,
}: {
	isInitiallyOpen?: boolean;
	/**
	 * The outside button cancels `mousedown`, so a press on it does not move focus.
	 */
	isOutsideMouseDownPrevented?: boolean;
	onClose?: TOnClose;
	role?: 'dialog';
	label?: string;
}) {
	const [isOpen, setIsOpen] = useState(isInitiallyOpen);
	function handleClose(event: Event | React.MouseEvent | React.KeyboardEvent | null) {
		onClose?.(event);
		setIsOpen(false);
	}
	return (
		<div>
			<button
				type="button"
				onMouseDown={isOutsideMouseDownPrevented ? (event) => event.preventDefault() : undefined}
			>
				Outside
			</button>
			<Popup
				isOpen={isOpen}
				onClose={onClose ? handleClose : undefined}
				role={role}
				label={label}
				testId="popup"
				trigger={(triggerProps: TriggerProps) => (
					<button type="button" {...triggerProps} onClick={() => setIsOpen(true)}>
						Trigger
					</button>
				)}
				content={() => <button type="button">Inside</button>}
			/>
		</div>
	);
}

describe('Popup light dismiss with platform-dst-top-layer', () => {
	beforeEach(() => {
		passGate('platform-dst-top-layer');
	});

	it('does not close on a press on the trigger', async () => {
		const onClose = jest.fn();
		render(<PinnablePopup onClose={onClose} />);

		await userEvent.click(screen.getByRole('button', { name: 'Trigger' }));

		expect(onClose).not.toHaveBeenCalled();
		expect(screen.getByTestId('popup')).toBeVisible();
	});

	it('does not close on a press inside the popup', async () => {
		const onClose = jest.fn();
		render(<PinnablePopup onClose={onClose} />);

		await userEvent.click(screen.getByRole('button', { name: 'Inside' }));

		expect(onClose).not.toHaveBeenCalled();
		expect(screen.getByTestId('popup')).toBeVisible();
	});

	it('calls onClose on an outside press', async () => {
		const onClose = jest.fn();
		render(<PinnablePopup onClose={onClose} />);

		await userEvent.click(screen.getByRole('button', { name: 'Outside' }));

		expect(onClose).toHaveBeenCalledTimes(1);
		expect(onClose.mock.calls[0][0]).toBeInstanceOf(MouseEvent);
		expect(screen.queryByTestId('popup')).not.toBeInTheDocument();
	});

	it('calls onClose on Escape', async () => {
		const onClose = jest.fn();
		render(<PinnablePopup onClose={onClose} />);

		await userEvent.keyboard('{Escape}');

		expect(onClose).toHaveBeenCalledTimes(1);
		expect(onClose.mock.calls[0][0]).toBeInstanceOf(KeyboardEvent);
		expect(onClose.mock.calls[0][0]).toHaveProperty('key', 'Escape');
	});

	it('does not move focus to the trigger after an outside press', async () => {
		render(<PinnablePopup onClose={jest.fn()} />);
		screen.getByRole('button', { name: 'Inside' }).focus();

		await userEvent.click(screen.getByRole('button', { name: 'Outside' }));

		expect(screen.queryByTestId('popup')).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Trigger' })).not.toHaveFocus();
	});

	it('does not move focus to the trigger after an outside press that keeps focus inside', async () => {
		const onClose = jest.fn();
		render(<PinnablePopup onClose={onClose} isOutsideMouseDownPrevented />);
		screen.getByRole('button', { name: 'Inside' }).focus();

		await userEvent.click(screen.getByRole('button', { name: 'Outside' }));

		// As an auto light dismiss: the popup closes, and focus does not return to the trigger.
		expect(onClose).toHaveBeenCalledTimes(1);
		await waitFor(() => expect(screen.queryByTestId('popup')).not.toBeInTheDocument());
		expect(screen.getByRole('button', { name: 'Trigger' })).not.toHaveFocus();
	});

	it('stays open on an outside press and Escape without onClose', async () => {
		render(<PinnablePopup />);

		await userEvent.click(screen.getByRole('button', { name: 'Outside' }));
		await userEvent.keyboard('{Escape}');

		expect(screen.getByTestId('popup')).toBeVisible();
	});

	it('closes through requestClosePopovers() when given onClose', () => {
		const onClose = jest.fn();
		render(<PinnablePopup onClose={onClose} />);

		act(() => {
			requestClosePopovers();
		});

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('is not closable by requestClosePopovers() without onClose', () => {
		render(<PinnablePopup />);

		act(() => {
			requestClosePopovers();
		});

		expect(screen.getByTestId('popup')).toBeVisible();
	});

	it('leaves Escape to a layer around it without onClose', async () => {
		render(<PinnablePopup />);
		let isEscapePrevented: boolean | null = null;
		const unbind = bind(window, {
			type: 'keydown',
			listener(event: KeyboardEvent) {
				isEscapePrevented = event.defaultPrevented;
			},
		});

		await userEvent.keyboard('{Escape}');
		unbind();

		expect(isEscapePrevented).toBe(false);
		expect(screen.getByTestId('popup')).toBeVisible();
	});

	it('is not counted as a closable layer without onClose', () => {
		render(<PinnablePopup />);

		expect(screen.getByTestId('popup')).toBeVisible();
		expect(hasOpenDialogOrPopover()).toBe(false);
	});

	it('renders a manual popover', () => {
		render(<PinnablePopup onClose={jest.fn()} />);

		expect(screen.getByTestId('popup--container')).toHaveAttribute('popover', 'manual');
	});

	it('gives the trigger and popup the dialog aria and initial focus', () => {
		render(<PinnablePopup role="dialog" label="Details" onClose={jest.fn()} />);
		const trigger = screen.getByRole('button', { name: 'Trigger' });
		const dialog = screen.getByRole('dialog', { name: 'Details' });

		expect(trigger).toHaveAttribute('aria-expanded', 'true');
		expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
		expect(trigger).toHaveAttribute('aria-controls', dialog.id);
		expect(screen.getByRole('button', { name: 'Inside' })).toHaveFocus();
	});

	it('returns focus to the trigger on Escape', async () => {
		render(
			<PinnablePopup role="dialog" label="Details" onClose={jest.fn()} isInitiallyOpen={false} />,
		);
		await userEvent.click(screen.getByRole('button', { name: 'Trigger' }));
		expect(screen.getByRole('button', { name: 'Inside' })).toHaveFocus();

		await userEvent.keyboard('{Escape}');

		expect(screen.getByRole('button', { name: 'Trigger' })).toHaveFocus();
	});
});
