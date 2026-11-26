import React, { useState } from 'react';

import { bind } from 'bind-event-listener';

import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { act, render } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import { Popup } from '../../compositional/popup';
import { PopupContent } from '../../compositional/popup-content';
import { PopupTrigger } from '../../compositional/popup-trigger';

/**
 * On the top layer, `PopupContent` asks `onClose` first, and closes only when `isOpen` becomes
 * `false`. See `@atlaskit/top-layer` `notes/decisions/wrappers-ask-first-close.md`.
 */

function getButton(name: string): HTMLElement {
	return screen.getByRole('button', { name });
}

function isPopoverOpen(element: Element | null): boolean {
	return Boolean(element?.matches(':popover-open'));
}

/**
 * Lets queued `toggle` events and the polyfill focus fixup (one frame) run.
 */
async function flushTasks() {
	await act(async () => {
		await new Promise((resolve) => setTimeout(resolve, 20));
	});
}

function TogglePopup({
	testId,
	label,
	shouldAccept,
	onClose,
	children,
}: {
	testId: string;
	label: string;
	shouldAccept: boolean;
	onClose?: () => void;
	children?: React.ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Popup isOpen={isOpen} role="dialog">
			<PopupTrigger>
				{(triggerProps) => (
					<button type="button" {...triggerProps} onClick={() => setIsOpen((current) => !current)}>
						{`${label} trigger`}
					</button>
				)}
			</PopupTrigger>
			<PopupContent
				role="dialog"
				label={label}
				testId={testId}
				onClose={() => {
					onClose?.();
					if (shouldAccept) {
						setIsOpen(false);
					}
				}}
			>
				{() => (
					<div>
						<button type="button">{`${label} inside`}</button>
						{children}
					</div>
				)}
			</PopupContent>
		</Popup>
	);
}

describe('Composable Popup top-layer: ask first on close', () => {
	beforeEach(() => {
		passGate('platform-dst-top-layer');
	});

	it('should stay open without onClose, and leave the Escape to a layer around it', async () => {
		const isEscapeClaimed = jest.fn();
		// On the window, so it runs after the listener on the document that would take the Escape.
		const unbind = bind(window, {
			type: 'keydown',
			listener(event: KeyboardEvent) {
				isEscapeClaimed(event.defaultPrevented);
			},
		});
		render(
			<>
				<button type="button">Outside</button>
				<Popup isOpen role="dialog">
					<PopupTrigger>
						{(triggerProps) => (
							<button type="button" {...triggerProps}>
								Trigger
							</button>
						)}
					</PopupTrigger>
					<PopupContent role="dialog" label="Details" testId="first">
						{() => <button type="button">Inside</button>}
					</PopupContent>
				</Popup>
			</>,
		);

		await userEvent.keyboard('{Escape}');
		await userEvent.click(getButton('Outside'));
		await flushTasks();
		unbind();

		expect(screen.getByTestId('first--container')).toBeVisible();
		expect(isEscapeClaimed).toHaveBeenCalledWith(false);
	});

	it('should stay open and visible when onClose refuses an outside press', async () => {
		const onClose = jest.fn();
		render(
			<>
				<button type="button">Outside</button>
				<TogglePopup testId="first" label="First" shouldAccept={false} onClose={onClose} />
			</>,
		);
		await userEvent.click(getButton('First trigger'));

		await userEvent.click(getButton('Outside'));
		await flushTasks();

		expect(onClose).toHaveBeenCalledTimes(1);
		expect(screen.getByTestId('first--container')).toBeVisible();
	});

	it('should stay open and keep focus when onClose refuses Escape', async () => {
		const onClose = jest.fn();
		render(<TogglePopup testId="first" label="First" shouldAccept={false} onClose={onClose} />);
		await userEvent.click(getButton('First trigger'));
		expect(getButton('First inside')).toHaveFocus();

		await userEvent.keyboard('{Escape}');
		await flushTasks();

		expect(onClose).toHaveBeenCalledTimes(1);
		expect(screen.getByTestId('first--container')).toBeVisible();
		expect(getButton('First inside')).toHaveFocus();
	});

	it('should ask before it closes on an accepted outside press, and leave focus where the user pressed', async () => {
		const isOpenWhenAsked = jest.fn();
		render(
			<>
				<button type="button">Outside</button>
				<TogglePopup
					testId="first"
					label="First"
					shouldAccept
					onClose={() => isOpenWhenAsked(isPopoverOpen(screen.queryByTestId('first--container')))}
				/>
			</>,
		);
		await userEvent.click(getButton('First trigger'));

		await userEvent.click(getButton('Outside'));
		await flushTasks();

		expect(isOpenWhenAsked).toHaveBeenCalledTimes(1);
		expect(isOpenWhenAsked).toHaveBeenCalledWith(true);
		expect(screen.queryByTestId('first--container')).not.toBeInTheDocument();
		expect(getButton('Outside')).toHaveFocus();
	});

	it('should close on an accepted Escape, and return focus to the trigger', async () => {
		render(<TogglePopup testId="first" label="First" shouldAccept />);
		getButton('First trigger').focus();
		await userEvent.keyboard('{Enter}');
		expect(getButton('First inside')).toHaveFocus();

		await userEvent.keyboard('{Escape}');
		await flushTasks();

		expect(screen.queryByTestId('first--container')).not.toBeInTheDocument();
		expect(getButton('First trigger')).toHaveFocus();
	});

	it('should not ask on a press on its trigger: the trigger click decides', async () => {
		const onClose = jest.fn();
		render(<TogglePopup testId="first" label="First" shouldAccept onClose={onClose} />);
		await userEvent.click(getButton('First trigger'));

		await userEvent.click(getButton('First trigger'));
		await flushTasks();

		// The trigger click closed it. `onClose` was not asked.
		expect(onClose).not.toHaveBeenCalled();
		expect(screen.queryByTestId('first--container')).not.toBeInTheDocument();
	});

	it('should ask only the inner popup on a press in the outer popup, and keep it open when it refuses', async () => {
		const onOuterClose = jest.fn();
		const onInnerClose = jest.fn();
		render(
			<TogglePopup testId="outer" label="Outer" shouldAccept onClose={onOuterClose}>
				<TogglePopup testId="inner" label="Inner" shouldAccept={false} onClose={onInnerClose} />
			</TogglePopup>,
		);
		await userEvent.click(getButton('Outer trigger'));
		await userEvent.click(getButton('Inner trigger'));

		await userEvent.click(getButton('Inner inside'));
		await flushTasks();

		expect(onOuterClose).not.toHaveBeenCalled();
		expect(onInnerClose).not.toHaveBeenCalled();

		await userEvent.click(getButton('Outer inside'));
		await flushTasks();

		expect(onOuterClose).not.toHaveBeenCalled();
		expect(onInnerClose).toHaveBeenCalledTimes(1);
		expect(screen.getByTestId('outer--container')).toBeVisible();
		expect(screen.getByTestId('inner--container')).toBeVisible();
	});
});
