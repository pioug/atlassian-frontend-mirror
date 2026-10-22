import React, { useRef, useState } from 'react';

import { bind } from 'bind-event-listener';

import { screen } from '@atlassian/testing-library/screen';
import { act, render } from '@atlassian/testing-library/testing-library/react';

import { Dialog } from '../../src/dialog/dialog-content';
import { useCloseOnUnclaimedEscape } from '../../src/page-surface/use-close-on-unclaimed-escape';
import { Popover } from '../../src/popover/popover';

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

		it('closes while only a popover outside the target is open', () => {
			const onClose = jest.fn();
			render(<Surface onClose={onClose} hasTarget isOutsidePopoverOpen />);

			fireKeyDown({ target: screen.getByRole('button', { name: 'Inside panel' }) });

			expect(onClose).toHaveBeenCalledTimes(1);
		});
	});
});
