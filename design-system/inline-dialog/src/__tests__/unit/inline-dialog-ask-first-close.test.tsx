import React, { useState } from 'react';

import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { bind } from 'bind-event-listener';

import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import InlineDialog from '../../inline-dialog';

/**
 * On the top layer, `InlineDialog` asks `onClose` first, and closes only when `isOpen` becomes
 * `false`. See `@atlaskit/top-layer` `notes/decisions/wrappers-ask-first-close.md`.
 */

function isPopoverOpen(element: Element | null): boolean {
	return Boolean(element?.matches(':popover-open'));
}

function getButton(name: string): HTMLElement {
	return screen.getByRole('button', { name });
}

/**
 * Lets queued `toggle` events and the polyfill focus fixup (one frame) run.
 */
async function flushTasks() {
	await act(async () => {
		await new Promise((resolve) => setTimeout(resolve, 20));
	});
}

function ControlledInlineDialog({
	shouldAccept,
	onClose,
	isInitiallyOpen = false,
}: {
	shouldAccept: boolean;
	onClose?: () => void;
	isInitiallyOpen?: boolean;
}) {
	const [isOpen, setIsOpen] = useState(isInitiallyOpen);
	return (
		<>
			<button type="button">Outside</button>
			<InlineDialog
				testId="inline-dialog"
				isOpen={isOpen}
				onClose={() => {
					onClose?.();
					if (shouldAccept) {
						setIsOpen(false);
					}
				}}
				content={<button type="button">Inside</button>}
			>
				<button type="button" onClick={() => setIsOpen(true)}>
					Open
				</button>
			</InlineDialog>
		</>
	);
}

describe('InlineDialog top-layer: ask first on close', () => {
	beforeEach(() => {
		passGate('platform-dst-top-layer');
	});

	it('should neither take Escape nor close on an outside press without onClose, as on the legacy path', async () => {
		const isEscapeClaimed = jest.fn();
		const unbind = bind(document, {
			type: 'keydown',
			listener(event: KeyboardEvent) {
				isEscapeClaimed(event.defaultPrevented);
			},
		});
		render(
			<>
				<button type="button">Outside</button>
				<InlineDialog testId="inline-dialog" isOpen content={<button type="button">Inside</button>}>
					<button type="button">Open</button>
				</InlineDialog>
			</>,
		);
		getButton('Inside').focus();

		await userEvent.keyboard('{Escape}');
		await userEvent.click(getButton('Outside'));
		await flushTasks();
		unbind();

		// The Escape goes on to the page, unclaimed, for example to an `InlineEdit` around the dialog.
		expect(isEscapeClaimed).toHaveBeenCalledWith(false);
		expect(screen.getByTestId('inline-dialog')).toBeVisible();
	});

	it('should stay open and visible when onClose refuses an outside press', async () => {
		const onClose = jest.fn();
		render(<ControlledInlineDialog shouldAccept={false} onClose={onClose} />);
		await userEvent.click(getButton('Open'));

		await userEvent.click(getButton('Outside'));
		await flushTasks();

		expect(onClose).toHaveBeenCalledTimes(1);
		expect(screen.getByTestId('inline-dialog')).toBeVisible();
		await expect(document.body).toBeAccessible();
	});

	it('should stay open and keep focus when onClose refuses Escape', async () => {
		const onClose = jest.fn();
		render(<ControlledInlineDialog shouldAccept={false} onClose={onClose} />);
		await userEvent.click(getButton('Open'));
		expect(getButton('Inside')).toHaveFocus();

		await userEvent.keyboard('{Escape}');
		await flushTasks();

		expect(onClose).toHaveBeenCalledTimes(1);
		expect(screen.getByTestId('inline-dialog')).toBeVisible();
		expect(getButton('Inside')).toHaveFocus();
	});

	it('should ask before it closes on an accepted outside press, and leave focus where the user pressed', async () => {
		const isOpenWhenAsked = jest.fn();
		render(
			<ControlledInlineDialog
				shouldAccept
				onClose={() => isOpenWhenAsked(isPopoverOpen(screen.queryByTestId('inline-dialog')))}
			/>,
		);
		await userEvent.click(getButton('Open'));

		await userEvent.click(getButton('Outside'));
		await flushTasks();

		expect(isOpenWhenAsked).toHaveBeenCalledTimes(1);
		expect(isOpenWhenAsked).toHaveBeenCalledWith(true);
		expect(screen.queryByTestId('inline-dialog')).not.toBeInTheDocument();
		expect(getButton('Outside')).toHaveFocus();
	});

	it('should not return focus to the trigger after an accepted outside press that did not move focus', async () => {
		render(
			<>
				<button
					type="button"
					// Keeps focus where it is on press, as legacy `@atlaskit/button` does.
					onMouseDown={(event) => event.preventDefault()}
				>
					No focus on press
				</button>
				<ControlledInlineDialog shouldAccept />
			</>,
		);
		getButton('Open').focus();
		await userEvent.keyboard('{Enter}');
		expect(getButton('Inside')).toHaveFocus();

		await userEvent.click(getButton('No focus on press'));
		// `Popover` returns focus in the `toggle` task after the close.
		await flushTasks();

		// As native light dismiss: no focus return. Focus was blurred, so it is on `<body>`.
		expect(screen.queryByTestId('inline-dialog')).not.toBeInTheDocument();
		expect(getButton('Open')).not.toHaveFocus();
		expect(document.body).toHaveFocus();
	});

	it('should close on an accepted Escape, and return focus to the trigger', async () => {
		render(<ControlledInlineDialog shouldAccept />);
		getButton('Open').focus();
		await userEvent.keyboard('{Enter}');
		expect(getButton('Inside')).toHaveFocus();

		await userEvent.keyboard('{Escape}');
		await flushTasks();

		expect(screen.queryByTestId('inline-dialog')).not.toBeInTheDocument();
		expect(getButton('Open')).toHaveFocus();
	});

	it('should not ask on a press on its trigger: the trigger handles its own clicks', async () => {
		const onClose = jest.fn();
		render(<ControlledInlineDialog shouldAccept onClose={onClose} isInitiallyOpen />);

		await userEvent.click(getButton('Open'));
		await flushTasks();

		expect(onClose).not.toHaveBeenCalled();
		expect(screen.getByTestId('inline-dialog')).toBeVisible();
	});
});
