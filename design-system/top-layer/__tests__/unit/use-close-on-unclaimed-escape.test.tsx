import React, { useRef, useState } from 'react';

import { bind } from 'bind-event-listener';

import { screen } from '@atlassian/testing-library/screen';
import { act, render } from '@atlassian/testing-library/testing-library/react';

import { Dialog } from '../../src/dialog/dialog-content';
import { useCloseOnUnclaimedEscape } from '../../src/page-surface/use-close-on-unclaimed-escape';
import { Popover } from '../../src/popover/popover';
import { useManualLightDismiss } from '../../src/use-manual-light-dismiss';

// A keydown, as a browser sends it.
function fireKeyDown({
	target,
	key = 'Escape',
	repeat = false,
}: {
	target: Element | Document;
	key?: string;
	repeat?: boolean;
}): KeyboardEvent {
	const event = new KeyboardEvent('keydown', {
		key,
		repeat,
		bubbles: true,
		cancelable: true,
		composed: true,
	});
	act(() => {
		target.dispatchEvent(event);
	});
	return event;
}

type TSurfaceProps = {
	onClose: () => void;
	isEnabled?: boolean;
	shouldClose?: () => boolean;
	isPopoverOpen?: boolean;
	isOutsidePopoverOpen?: boolean;
	hasTarget?: boolean;
};

/**
 * A page surface (not in the top layer) that closes on Escape.
 */
function Surface({
	onClose,
	isEnabled = true,
	shouldClose,
	isPopoverOpen = false,
	isOutsidePopoverOpen = false,
	hasTarget = false,
}: TSurfaceProps) {
	const panelRef = useRef<HTMLDivElement>(null);
	useCloseOnUnclaimedEscape({
		isEnabled,
		onClose,
		shouldClose,
		targetRef: hasTarget ? panelRef : undefined,
	});
	return (
		<>
			<div ref={panelRef} data-testid="panel">
				<button type="button">Inside panel</button>
				<Popover isOpen={isPopoverOpen} role="dialog" label="Inside popover" onClose={() => {}}>
					<button type="button">Inside popover</button>
				</Popover>
			</div>
			<Popover
				isOpen={isOutsidePopoverOpen}
				role="dialog"
				label="Outside popover"
				onClose={() => {}}
			>
				<button type="button">Outside popover</button>
			</Popover>
			<button type="button">Outside panel</button>
		</>
	);
}

describe('useCloseOnUnclaimedEscape()', () => {
	it('calls onClose with the event on Escape', () => {
		const onClose = jest.fn();
		render(<Surface onClose={onClose} />);

		const event = fireKeyDown({ target: screen.getByRole('button', { name: 'Inside panel' }) });

		expect(onClose).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledWith({ event });
	});

	it('ignores other keys', () => {
		const onClose = jest.fn();
		render(<Surface onClose={onClose} />);

		fireKeyDown({ target: document.body, key: 'Enter' });

		expect(onClose).not.toHaveBeenCalled();
	});

	it('ignores an Escape that was already handled', () => {
		const onClose = jest.fn();
		render(<Surface onClose={onClose} />);
		const button = screen.getByRole('button', { name: 'Inside panel' });
		const unbind = bind(button, {
			type: 'keydown',
			listener(event) {
				event.preventDefault();
			},
		});

		fireKeyDown({ target: button });
		unbind();

		expect(onClose).not.toHaveBeenCalled();
	});

	it('ignores repeated keydown events from a held key', () => {
		const onClose = jest.fn();
		render(<Surface onClose={onClose} />);

		fireKeyDown({ target: document.body });
		fireKeyDown({ target: document.body, repeat: true });
		fireKeyDown({ target: document.body, repeat: true });

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('does not close while a popover with onClose is open', () => {
		const onClose = jest.fn();
		render(<Surface onClose={onClose} isPopoverOpen />);

		fireKeyDown({ target: screen.getByRole('button', { name: 'Inside popover' }) });

		expect(onClose).not.toHaveBeenCalled();
	});

	it('does not close while a dialog is open', () => {
		const onClose = jest.fn();
		function SurfaceWithDialog() {
			const [isDialogOpen, setIsDialogOpen] = useState(true);
			return (
				<>
					<Surface onClose={onClose} />
					<Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} label="Dialog">
						<button type="button">Inside dialog</button>
					</Dialog>
				</>
			);
		}
		render(<SurfaceWithDialog />);

		fireKeyDown({ target: screen.getByRole('button', { name: 'Inside dialog', hidden: true }) });

		expect(onClose).not.toHaveBeenCalled();
	});

	it('closes while only a non-modal dialog is open', () => {
		const onClose = jest.fn();
		render(
			<>
				<Surface onClose={onClose} />
				<dialog open>
					<button type="button">Inside non-modal dialog</button>
				</dialog>
			</>,
		);

		fireKeyDown({ target: screen.getByRole('button', { name: 'Inside non-modal dialog' }) });

		// A non-modal dialog does not close on Escape, so the surface takes it.
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('does not close while a tooltip is open', () => {
		const onClose = jest.fn();
		render(
			<>
				<Surface onClose={onClose} />
				<Popover isOpen mode="hint" role="tooltip" onClose={() => {}}>
					Tooltip
				</Popover>
			</>,
		);

		fireKeyDown({ target: screen.getByRole('button', { name: 'Inside panel' }) });

		expect(onClose).not.toHaveBeenCalled();
	});

	it('does not close while a manual popover with useManualLightDismiss is open', () => {
		const onClose = jest.fn();
		const onPopoverClose = jest.fn();
		function ManualPopover() {
			const popoverRef = useRef<HTMLDivElement>(null);
			useManualLightDismiss({ popoverRef, isOpen: true, onClose: onPopoverClose });
			return (
				<Popover ref={popoverRef} mode="manual" isOpen role="dialog" label="Manual">
					<button type="button">Inside manual popover</button>
				</Popover>
			);
		}
		// The popover opens after the surface, so its listener runs after the surface listener.
		render(
			<>
				<Surface onClose={onClose} />
				<ManualPopover />
			</>,
		);

		fireKeyDown({ target: screen.getByRole('button', { name: 'Inside manual popover' }) });

		expect(onClose).not.toHaveBeenCalled();
		expect(onPopoverClose).toHaveBeenCalledWith({ reason: 'escape' });
	});

	it('closes while only a manual popover that does not take Escape is open', () => {
		const onClose = jest.fn();
		render(
			<>
				<Surface onClose={onClose} />
				<Popover mode="manual" isOpen role="dialog" label="Field error" onClose={() => {}}>
					Field error
				</Popover>
			</>,
		);

		fireKeyDown({ target: screen.getByRole('button', { name: 'Inside panel' }) });

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('ignores Escape during IME composition', () => {
		const onClose = jest.fn();
		render(<Surface onClose={onClose} />);
		const event = new KeyboardEvent('keydown', {
			key: 'Escape',
			isComposing: true,
			bubbles: true,
			cancelable: true,
		});

		act(() => {
			screen.getByRole('button', { name: 'Inside panel' }).dispatchEvent(event);
		});

		expect(onClose).not.toHaveBeenCalled();
	});

	it('does not close when shouldClose returns false', () => {
		const onClose = jest.fn();
		render(<Surface onClose={onClose} shouldClose={() => false} />);

		fireKeyDown({ target: document.body });

		expect(onClose).not.toHaveBeenCalled();
	});

	it('binds no listener when isEnabled is false', () => {
		const onClose = jest.fn();
		render(<Surface onClose={onClose} isEnabled={false} />);

		fireKeyDown({ target: document.body });

		expect(onClose).not.toHaveBeenCalled();
	});

	it('binds no listener when isEnabled is undefined', () => {
		const onClose = jest.fn();
		function SurfaceWithUndefined() {
			useCloseOnUnclaimedEscape({
				// For example, an unmocked feature gate in a test.
				isEnabled: undefined as unknown as boolean,
				onClose,
			});
			return null;
		}
		render(<SurfaceWithUndefined />);

		fireKeyDown({ target: document.body });

		expect(onClose).not.toHaveBeenCalled();
	});

	it('uses the latest callbacks without binding again', () => {
		const first = jest.fn();
		const second = jest.fn();
		const { rerender } = render(<Surface onClose={first} />);
		rerender(<Surface onClose={second} />);

		fireKeyDown({ target: document.body });

		expect(first).not.toHaveBeenCalled();
		expect(second).toHaveBeenCalledTimes(1);
	});

	describe('with targetRef', () => {
		it('closes on an Escape from inside the target', () => {
			const onClose = jest.fn();
			render(<Surface onClose={onClose} hasTarget />);

			fireKeyDown({ target: screen.getByRole('button', { name: 'Inside panel' }) });

			expect(onClose).toHaveBeenCalledTimes(1);
		});

		it('ignores an Escape from outside the target', () => {
			const onClose = jest.fn();
			render(<Surface onClose={onClose} hasTarget />);

			fireKeyDown({ target: screen.getByRole('button', { name: 'Outside panel' }) });

			expect(onClose).not.toHaveBeenCalled();
		});

		it('does not close while a popover inside the target is open', () => {
			const onClose = jest.fn();
			render(<Surface onClose={onClose} hasTarget isPopoverOpen />);

			fireKeyDown({ target: screen.getByRole('button', { name: 'Inside popover' }) });

			expect(onClose).not.toHaveBeenCalled();
		});

		it('does not close while a manual popover with useManualLightDismiss is open outside the target', () => {
			const onClose = jest.fn();
			const onPopoverClose = jest.fn();
			function OutsideManualPopover() {
				const popoverRef = useRef<HTMLDivElement>(null);
				useManualLightDismiss({ popoverRef, isOpen: true, onClose: onPopoverClose });
				return (
					<Popover ref={popoverRef} mode="manual" isOpen role="dialog" label="Spotlight">
						<button type="button">Inside spotlight</button>
					</Popover>
				);
			}
			render(
				<>
					<Surface onClose={onClose} hasTarget />
					<OutsideManualPopover />
				</>,
			);

			fireKeyDown({ target: screen.getByRole('button', { name: 'Inside panel' }) });

			// The manual popover takes Escape from anywhere, so only it closes.
			expect(onClose).not.toHaveBeenCalled();
			expect(onPopoverClose).toHaveBeenCalledWith({ reason: 'escape' });
		});

		it('closes, and keeps a Dialog around the target open, on an Escape inside the target', () => {
			const onClose = jest.fn();
			const onDialogClose = jest.fn();
			function PanelInDialog() {
				const panelRef = useRef<HTMLDivElement>(null);
				useCloseOnUnclaimedEscape({ isEnabled: true, onClose, targetRef: panelRef });
				return (
					<Dialog isOpen onClose={onDialogClose} label="Dialog">
						<div ref={panelRef}>
							<button type="button">Inside panel in dialog</button>
						</div>
					</Dialog>
				);
			}
			render(<PanelInDialog />);
			const target = screen.getByRole('button', { name: 'Inside panel in dialog' });
			act(() => {
				target.focus();
			});

			const event = fireKeyDown({ target });

			expect(onClose).toHaveBeenCalledTimes(1);
			expect(event.defaultPrevented).toBe(true);
			expect(onDialogClose).not.toHaveBeenCalled();
		});

		it('lets a popover outside the target take the Escape first, as the native order does', () => {
			const onClose = jest.fn();
			render(<Surface onClose={onClose} hasTarget isOutsidePopoverOpen />);
			const target = screen.getByRole('button', { name: 'Inside panel' });

			const first = fireKeyDown({ target });

			// The surface ranks below every layer, so the browser closes the popover, and only it.
			expect(first.defaultPrevented).toBe(false);
			expect(onClose).not.toHaveBeenCalled();

			fireKeyDown({ target });

			expect(onClose).toHaveBeenCalledTimes(1);
		});
	});

	describe('with surfaceRef and no targetRef', () => {
		/**
		 * Closes a surface on Escape from `document`. A separate component, so it can unmount while
		 * the surface element stays.
		 */
		function EscapeCloser({
			surfaceRef,
			onClose,
		}: {
			surfaceRef: React.RefObject<HTMLDivElement | null>;
			onClose: () => void;
		}) {
			useCloseOnUnclaimedEscape({ isEnabled: true, onClose, surfaceRef });
			return null;
		}

		function SurfaceInManualPopover({
			hasCloser,
			onSurfaceClose,
			onPopoverClose,
		}: {
			hasCloser: boolean;
			onSurfaceClose: () => void;
			onPopoverClose: () => void;
		}) {
			const popoverRef = useRef<HTMLDivElement>(null);
			const surfaceRef = useRef<HTMLDivElement>(null);
			useManualLightDismiss({ popoverRef, isOpen: true, onClose: onPopoverClose });
			return (
				<Popover ref={popoverRef} mode="manual" isOpen role="dialog" label="Manual">
					<div ref={surfaceRef} data-testid="surface">
						<button type="button">Inside surface</button>
					</div>
					{hasCloser ? <EscapeCloser surfaceRef={surfaceRef} onClose={onSurfaceClose} /> : null}
				</Popover>
			);
		}

		it('gives the Escape back to a manual popover around the surface once the hook unmounts', () => {
			const onSurfaceClose = jest.fn();
			const onPopoverClose = jest.fn();
			const props = { onSurfaceClose, onPopoverClose };
			const { rerender } = render(<SurfaceInManualPopover {...props} hasCloser />);

			expect(screen.getByTestId('surface')).toHaveAttribute('data-top-layer-surface-takes-escape');

			// The surface element stays, but nothing listens for Escape on it now.
			rerender(<SurfaceInManualPopover {...props} hasCloser={false} />);

			expect(screen.getByTestId('surface')).not.toHaveAttribute(
				'data-top-layer-surface-takes-escape',
			);

			const event = fireKeyDown({ target: screen.getByRole('button', { name: 'Inside surface' }) });

			expect(onSurfaceClose).not.toHaveBeenCalled();
			expect(onPopoverClose).toHaveBeenCalledWith({ reason: 'escape' });
			expect(event.defaultPrevented).toBe(true);
		});
	});
});

describe('useCloseOnUnclaimedEscape() without a surface element', () => {
	it('waits for a marked page surface, as the whole page is around it', () => {
		const onPageClose = jest.fn();
		const onSurfaceClose = jest.fn();
		function Page({ isSurfaceOpen }: { isSurfaceOpen: boolean }) {
			// No `targetRef` or `surfaceRef`: the surface is the whole page (for example a global
			// focus mode that Escape leaves).
			useCloseOnUnclaimedEscape({ isEnabled: true, onClose: onPageClose });
			const surfaceRef = useRef<HTMLDivElement>(null);
			useManualLightDismiss({
				popoverRef: surfaceRef,
				mode: 'page-surface',
				isOpen: isSurfaceOpen,
				onClose: onSurfaceClose,
			});
			return (
				<div ref={surfaceRef}>
					<button type="button">Inside surface</button>
				</div>
			);
		}
		const { rerender } = render(<Page isSurfaceOpen />);
		const target = screen.getByRole('button', { name: 'Inside surface' });

		fireKeyDown({ target });

		expect(onSurfaceClose).toHaveBeenCalledTimes(1);
		expect(onPageClose).not.toHaveBeenCalled();

		rerender(<Page isSurfaceOpen={false} />);
		fireKeyDown({ target });

		expect(onPageClose).toHaveBeenCalledTimes(1);
	});
});
