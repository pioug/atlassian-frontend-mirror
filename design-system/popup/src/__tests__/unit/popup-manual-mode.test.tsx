import React, { useState } from 'react';

import { requestClosePopovers } from '@atlaskit/top-layer/page-surface/request-close-popovers';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { act, render } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import { Popup } from '../../popup';
import { type TriggerProps } from '../../types';

type TOnClose = (event: Event | React.MouseEvent | React.KeyboardEvent | null) => void;

/**
 * A press on the trigger pins the popup open. `onClose` (when given) closes it.
 */
function PinnablePopup({
	mode,
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
	mode?: 'auto' | 'manual';
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
				mode={mode}
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

describe('Popup mode="manual" with platform-dst-top-layer', () => {
	beforeEach(() => {
		passGate('platform-dst-top-layer');
	});

	it('does not close on a press on the trigger', async () => {
		const onClose = jest.fn();
		render(<PinnablePopup mode="manual" onClose={onClose} />);

		await userEvent.click(screen.getByRole('button', { name: 'Trigger' }));

		expect(onClose).not.toHaveBeenCalled();
		expect(screen.getByTestId('popup')).toBeVisible();
	});

	it('does not close on a press inside the popup', async () => {
		const onClose = jest.fn();
		render(<PinnablePopup mode="manual" onClose={onClose} />);

		await userEvent.click(screen.getByRole('button', { name: 'Inside' }));

		expect(onClose).not.toHaveBeenCalled();
		expect(screen.getByTestId('popup')).toBeVisible();
	});

	it('calls onClose on an outside press', async () => {
		const onClose = jest.fn();
		render(<PinnablePopup mode="manual" onClose={onClose} />);

		await userEvent.click(screen.getByRole('button', { name: 'Outside' }));

		expect(onClose).toHaveBeenCalledTimes(1);
		expect(onClose.mock.calls[0][0]).toBeInstanceOf(MouseEvent);
		expect(screen.queryByTestId('popup')).not.toBeInTheDocument();
	});

	it('calls onClose on Escape', async () => {
		const onClose = jest.fn();
		render(<PinnablePopup mode="manual" onClose={onClose} />);

		await userEvent.keyboard('{Escape}');

		expect(onClose).toHaveBeenCalledTimes(1);
		expect(onClose.mock.calls[0][0]).toBeInstanceOf(KeyboardEvent);
		expect(onClose.mock.calls[0][0]).toHaveProperty('key', 'Escape');
	});

	it('does not move focus to the trigger after an outside press', async () => {
		render(<PinnablePopup mode="manual" onClose={jest.fn()} />);
		screen.getByRole('button', { name: 'Inside' }).focus();

		await userEvent.click(screen.getByRole('button', { name: 'Outside' }));

		expect(screen.queryByTestId('popup')).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Trigger' })).not.toHaveFocus();
	});

	it('does not move focus to the trigger after an outside press that keeps focus inside', async () => {
		const onClose = jest.fn();
		render(<PinnablePopup mode="manual" onClose={onClose} isOutsideMouseDownPrevented />);
		screen.getByRole('button', { name: 'Inside' }).focus();

		await userEvent.click(screen.getByRole('button', { name: 'Outside' }));

		// As an auto light dismiss: the popup closes, and focus does not return to the trigger.
		expect(onClose).toHaveBeenCalledTimes(1);
		expect(screen.queryByTestId('popup')).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Trigger' })).not.toHaveFocus();
	});

	it('stays open on an outside press and Escape without onClose', async () => {
		render(<PinnablePopup mode="manual" />);

		await userEvent.click(screen.getByRole('button', { name: 'Outside' }));
		await userEvent.keyboard('{Escape}');

		expect(screen.getByTestId('popup')).toBeVisible();
	});

	it('closes through requestClosePopovers() when given onClose', () => {
		const onClose = jest.fn();
		render(<PinnablePopup mode="manual" onClose={onClose} />);

		act(() => {
			requestClosePopovers();
		});

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('is not closable by requestClosePopovers() without onClose', () => {
		render(<PinnablePopup mode="manual" />);

		act(() => {
			requestClosePopovers();
		});

		expect(screen.getByTestId('popup')).toBeVisible();
	});

	it('renders a manual popover', () => {
		render(<PinnablePopup mode="manual" />);

		expect(screen.getByTestId('popup--container')).toHaveAttribute('popover', 'manual');
	});

	it('renders an auto popover by default', () => {
		render(<PinnablePopup onClose={jest.fn()} />);

		expect(screen.getByTestId('popup--container')).toHaveAttribute('popover', 'auto');
	});

	it.each([['auto' as const], ['manual' as const]])(
		'gives the trigger and popup the dialog aria and initial focus in %s mode',
		(mode) => {
			render(<PinnablePopup mode={mode} role="dialog" label="Details" onClose={jest.fn()} />);
			const trigger = screen.getByRole('button', { name: 'Trigger' });
			const dialog = screen.getByRole('dialog', { name: 'Details' });

			expect(trigger).toHaveAttribute('aria-expanded', 'true');
			expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
			expect(trigger).toHaveAttribute('aria-controls', dialog.id);
			expect(screen.getByRole('button', { name: 'Inside' })).toHaveFocus();
		},
	);

	it.each([['auto' as const], ['manual' as const]])(
		'returns focus to the trigger on Escape in %s mode',
		async (mode) => {
			render(
				<PinnablePopup
					mode={mode}
					role="dialog"
					label="Details"
					onClose={jest.fn()}
					isInitiallyOpen={false}
				/>,
			);
			await userEvent.click(screen.getByRole('button', { name: 'Trigger' }));
			expect(screen.getByRole('button', { name: 'Inside' })).toHaveFocus();

			await userEvent.keyboard('{Escape}');

			expect(screen.getByRole('button', { name: 'Trigger' })).toHaveFocus();
		},
	);
});

describe('Popup mode="manual" without platform-dst-top-layer', () => {
	beforeEach(() => {
		failGate('platform-dst-top-layer');
	});

	it('does not close on a press on the trigger, as in the default mode', async () => {
		const onClose = jest.fn();
		render(<PinnablePopup mode="manual" onClose={onClose} />);

		await userEvent.click(screen.getByRole('button', { name: 'Trigger' }));

		expect(onClose).not.toHaveBeenCalled();
		expect(screen.getByTestId('popup')).toBeVisible();
	});

	it('calls onClose on an outside press, as in the default mode', async () => {
		const onClose = jest.fn();
		render(<PinnablePopup mode="manual" onClose={onClose} />);

		await userEvent.click(screen.getByRole('button', { name: 'Outside' }));

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('renders the same trigger and popup markup as the default mode', () => {
		function getMarkup() {
			const trigger = screen.getByRole('button', { name: 'Trigger' }).outerHTML;
			const popup = screen.getByRole('dialog', { name: 'Details' }).outerHTML;
			return `${trigger}${popup}`.replace(/(id|aria-controls)="[^"]*"/g, '');
		}
		const { unmount } = render(<PinnablePopup role="dialog" label="Details" onClose={jest.fn()} />);
		const autoMarkup = getMarkup();
		unmount();

		render(<PinnablePopup mode="manual" role="dialog" label="Details" onClose={jest.fn()} />);

		expect(getMarkup()).toBe(autoMarkup);
	});
});
