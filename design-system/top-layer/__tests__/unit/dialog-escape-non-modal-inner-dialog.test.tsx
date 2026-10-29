import React, { useRef } from 'react';

import { screen } from '@atlassian/testing-library/screen';
import { act, render } from '@atlassian/testing-library/testing-library/react';

import { Dialog } from '../../src/dialog/dialog-content';
import { Popover } from '../../src/popover/popover';
import { useManualLightDismiss } from '../../src/use-manual-light-dismiss';

// A keydown, as a browser sends it.
function fireKeyDown({ target }: { target: Element }): KeyboardEvent {
	const event = new KeyboardEvent('keydown', {
		key: 'Escape',
		bubbles: true,
		cancelable: true,
		composed: true,
	});
	act(() => {
		target.dispatchEvent(event);
	});
	return event;
}

// Opens the inner dialog as a non-modal dialog, with `show()`.
function showInnerDialog() {
	const inner = screen.getByTestId('inner');
	if (!(inner instanceof HTMLDialogElement)) {
		throw new Error('The inner element must be a <dialog>');
	}
	act(() => {
		inner.show();
	});
	expect(inner).toHaveAttribute('open');
}

function DialogWithInnerDialog({
	onClose,
	innerClosedBy,
}: {
	onClose: () => void;
	innerClosedBy?: 'closerequest';
}) {
	return (
		<Dialog isOpen onClose={onClose} label="Outer dialog">
			<button type="button">Inside outer dialog</button>
			<dialog closedby={innerClosedBy} data-testid="inner">
				<button type="button">Inside inner dialog</button>
			</dialog>
		</Dialog>
	);
}

describe('Dialog with an open non-modal <dialog> inside it', () => {
	it.each([['Inside outer dialog'], ['Inside inner dialog']])(
		'closes on Escape (focus on "%s"), as the inner dialog does not close on Escape',
		(name) => {
			const onClose = jest.fn();
			render(<DialogWithInnerDialog onClose={onClose} />);
			showInnerDialog();
			const target = screen.getByRole('button', { name });
			act(() => {
				target.focus();
			});

			const event = fireKeyDown({ target });

			expect(onClose).toHaveBeenCalledTimes(1);
			expect(onClose).toHaveBeenCalledWith({ reason: 'escape' });
			expect(event.defaultPrevented).toBe(true);
		},
	);

	it('lets an inner dialog with closedby="closerequest" close first', () => {
		const onClose = jest.fn();
		render(<DialogWithInnerDialog onClose={onClose} innerClosedBy="closerequest" />);
		showInnerDialog();
		const target = screen.getByRole('button', { name: 'Inside inner dialog' });
		act(() => {
			target.focus();
		});

		fireKeyDown({ target });

		expect(onClose).not.toHaveBeenCalled();
		expect(screen.getByTestId('inner')).not.toHaveAttribute('open');
	});

	it('still takes its own Escape where the :modal pseudo-class is not supported', () => {
		const onClose = jest.fn();
		const matches = Element.prototype.matches;
		const matchesSpy = jest
			.spyOn(Element.prototype, 'matches')
			.mockImplementation(function mockMatches(this: Element, selector: string) {
				if (selector === ':modal') {
					throw new DOMException('Unsupported pseudo-class', 'SyntaxError');
				}
				return matches.call(this, selector);
			});
		render(
			<Dialog isOpen onClose={onClose} label="Outer dialog">
				<button type="button">Inside outer dialog</button>
			</Dialog>,
		);
		const target = screen.getByRole('button', { name: 'Inside outer dialog' });
		act(() => {
			target.focus();
		});

		fireKeyDown({ target });
		matchesSpy.mockRestore();

		expect(onClose).toHaveBeenCalledWith({ reason: 'escape' });
	});
});

/**
 * Models a browser without `closedby` (for example Safari 27) until the returned function runs.
 */
function removeClosedBySupport(): () => void {
	/* eslint-disable compat/compat -- jsdom has `<dialog>` */
	const descriptor = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'closedBy');
	if (!descriptor) {
		throw new Error('Expected the polyfill to define closedBy');
	}
	Reflect.deleteProperty(HTMLDialogElement.prototype, 'closedBy');
	return () => Object.defineProperty(HTMLDialogElement.prototype, 'closedBy', descriptor);
	/* eslint-enable compat/compat */
}

function DialogWithInnerModal({ onClose }: { onClose: () => void }) {
	return (
		<Dialog isOpen onClose={onClose} label="Outer dialog">
			<button type="button">Inside outer dialog</button>
			<dialog closedby="none" data-testid="inner-modal">
				<button type="button">Inside inner modal</button>
			</dialog>
		</Dialog>
	);
}

// Opens the inner dialog as a modal dialog, with `showModal()`, and focuses inside it.
function showInnerModal(): HTMLElement {
	const inner = screen.getByTestId('inner-modal');
	if (!(inner instanceof HTMLDialogElement)) {
		throw new Error('The inner element must be a <dialog>');
	}
	act(() => {
		inner.showModal();
	});
	expect(inner).toHaveAttribute('open');
	const target = screen.getByRole('button', { name: 'Inside inner modal' });
	act(() => {
		target.focus();
	});
	return target;
}

describe('Dialog with an open modal <dialog closedby="none"> inside it', () => {
	it('closes on Escape: the browser sends the close request past the inner dialog', () => {
		const onClose = jest.fn();
		render(<DialogWithInnerModal onClose={onClose} />);
		const target = showInnerModal();

		const event = fireKeyDown({ target });

		expect(onClose).toHaveBeenCalledWith({ reason: 'escape' });
		expect(event.defaultPrevented).toBe(true);
		expect(screen.getByTestId('inner-modal')).toHaveAttribute('open');
	});

	it('lets the inner dialog close first in a browser without closedby, which ignores the attribute', () => {
		const restoreClosedBy = removeClosedBySupport();
		try {
			const onClose = jest.fn();
			render(<DialogWithInnerModal onClose={onClose} />);
			const target = showInnerModal();

			fireKeyDown({ target });

			expect(onClose).not.toHaveBeenCalled();
			expect(screen.getByTestId('inner-modal')).not.toHaveAttribute('open');
		} finally {
			restoreClosedBy();
		}
	});
});

describe('Dialog as a layer that takes Escape', () => {
	it('marks the open dialog, as it takes Escape with closedby="none"', () => {
		render(
			<Dialog isOpen onClose={() => {}} label="Outer dialog" testId="outer">
				<button type="button">Inside outer dialog</button>
			</Dialog>,
		);
		const dialog = screen.getByTestId('outer');

		expect(dialog).toHaveAttribute('closedby', 'none');
		expect(dialog).toHaveAttribute('data-top-layer-takes-escape');
	});

	it('does not count as a layer that takes Escape once closed, during its exit', () => {
		const onPopoverClose = jest.fn();
		function DialogInPopover({ isDialogOpen }: { isDialogOpen: boolean }) {
			const popoverRef = useRef<HTMLDivElement>(null);
			useManualLightDismiss({ popoverRef, isOpen: true, onClose: onPopoverClose });
			return (
				<Popover ref={popoverRef} mode="manual" isOpen role="dialog" label="Manual">
					<button type="button">Inside popover</button>
					<Dialog isOpen={isDialogOpen} onClose={() => {}} label="Inner dialog">
						<button type="button">Inside inner dialog</button>
					</Dialog>
				</Popover>
			);
		}
		const { rerender } = render(<DialogInPopover isDialogOpen />);
		// The dialog stays mounted, and marked, until its exit ends.
		rerender(<DialogInPopover isDialogOpen={false} />);

		fireKeyDown({ target: screen.getByRole('button', { name: 'Inside popover' }) });

		expect(onPopoverClose).toHaveBeenCalledWith({ reason: 'escape' });
	});
});
