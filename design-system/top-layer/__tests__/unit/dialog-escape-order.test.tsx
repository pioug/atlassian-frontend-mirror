import React, { type ReactNode, useRef, useState } from 'react';

import { screen } from '@atlassian/testing-library/screen';
import { act, render } from '@atlassian/testing-library/testing-library/react';

import { Dialog } from '../../src/dialog/dialog-content';
import { Popover } from '../../src/popover/popover';
import { useManualLightDismiss } from '../../src/use-manual-light-dismiss';

/**
 * `Dialog` and the Escape stack that it shares with `useManualLightDismiss` and page surfaces: a
 * descendant is above its ancestors, otherwise the later open is above.
 */

// A keydown on the focused element, as a browser sends it.
function pressEscape(): KeyboardEvent {
	const event = new KeyboardEvent('keydown', {
		key: 'Escape',
		bubbles: true,
		cancelable: true,
		composed: true,
	});
	act(() => {
		// eslint-disable-next-line testing-library/no-node-access -- the browser sends keydown to the focused element
		(document.activeElement ?? document.body).dispatchEvent(event);
	});
	return event;
}

function focusButton({ name }: { name: string }): void {
	const button = screen.getByRole('button', { name, hidden: true });
	act(() => {
		button.focus();
	});
}

/**
 * A `Dialog` that closes when asked, and records each ask.
 */
function ClosableDialog({
	name,
	isOpen,
	onClose,
	children,
}: {
	name: string;
	isOpen: boolean;
	onClose: (name: string) => void;
	children?: ReactNode;
}) {
	const [isDismissed, setIsDismissed] = useState(false);
	return (
		<Dialog
			isOpen={isOpen && !isDismissed}
			label={name}
			onClose={() => {
				onClose(name);
				setIsDismissed(true);
			}}
		>
			<button type="button">{`Inside ${name}`}</button>
			{children}
		</Dialog>
	);
}

function ManualPopover({ onClose }: { onClose: () => void }) {
	const popoverRef = useRef<HTMLDivElement>(null);
	useManualLightDismiss({ popoverRef, isOpen: true, onClose });
	return (
		<Popover ref={popoverRef} mode="manual" isOpen role="dialog" label="Manual">
			<button type="button">Inside manual</button>
		</Popover>
	);
}

function PageSurface({ onClose }: { onClose: () => void }) {
	const surfaceRef = useRef<HTMLDivElement>(null);
	useManualLightDismiss({ popoverRef: surfaceRef, mode: 'page-surface', isOpen: true, onClose });
	return (
		<div ref={surfaceRef}>
			<button type="button">Inside surface</button>
		</div>
	);
}

describe('Dialog Escape order', () => {
	it('closes the sibling Dialog that opened last, then the other', () => {
		const onClose = jest.fn();
		function Siblings({ isSecondOpen }: { isSecondOpen: boolean }) {
			return (
				<>
					<ClosableDialog name="first" isOpen onClose={onClose} />
					<ClosableDialog name="second" isOpen={isSecondOpen} onClose={onClose} />
				</>
			);
		}
		const { rerender } = render(<Siblings isSecondOpen={false} />);
		rerender(<Siblings isSecondOpen />);
		focusButton({ name: 'Inside second' });

		expect(pressEscape().defaultPrevented).toBe(true);
		expect(onClose.mock.calls).toEqual([['second']]);

		focusButton({ name: 'Inside first' });
		pressEscape();

		expect(onClose.mock.calls).toEqual([['second'], ['first']]);
	});

	it('takes the Escape over a page surface outside it, which ranks below every layer', () => {
		const onDialogClose = jest.fn();
		const onSurfaceClose = jest.fn();
		function Page({ isDialogOpen }: { isDialogOpen: boolean }) {
			return (
				<>
					<PageSurface onClose={onSurfaceClose} />
					<ClosableDialog name="dialog" isOpen={isDialogOpen} onClose={onDialogClose} />
				</>
			);
		}
		const { rerender } = render(<Page isDialogOpen={false} />);
		rerender(<Page isDialogOpen />);
		focusButton({ name: 'Inside dialog' });

		const event = pressEscape();

		expect(event.defaultPrevented).toBe(true);
		expect(onDialogClose).toHaveBeenCalledTimes(1);
		expect(onSurfaceClose).not.toHaveBeenCalled();
	});

	it('gives the next Escape to an older manual popover once it closes, during its exit', () => {
		const onDialogClose = jest.fn();
		const onPopoverClose = jest.fn();
		function Page({ isDialogOpen }: { isDialogOpen: boolean }) {
			return (
				<>
					<ManualPopover onClose={onPopoverClose} />
					<ClosableDialog name="dialog" isOpen={isDialogOpen} onClose={onDialogClose} />
				</>
			);
		}
		const { rerender } = render(<Page isDialogOpen={false} />);
		rerender(<Page isDialogOpen />);
		focusButton({ name: 'Inside dialog' });

		pressEscape();

		expect(onDialogClose).toHaveBeenCalledTimes(1);
		expect(onPopoverClose).not.toHaveBeenCalled();
		// The dialog stays mounted, and marked, until its exit ends. It is no longer open, so it does
		// not take the next Escape.
		// eslint-disable-next-line testing-library/no-node-access -- a closed <dialog> has no accessible name
		const exitingDialog = document.querySelector('dialog[aria-label="dialog"]');
		expect(exitingDialog).toHaveAttribute('data-top-layer-takes-escape');
		expect(exitingDialog).not.toHaveAttribute('open');

		focusButton({ name: 'Inside manual' });
		pressEscape();

		expect(onDialogClose).toHaveBeenCalledTimes(1);
		expect(onPopoverClose).toHaveBeenCalledWith({ reason: 'escape' });
	});
});
