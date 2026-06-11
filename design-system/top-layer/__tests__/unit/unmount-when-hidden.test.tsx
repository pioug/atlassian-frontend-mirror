import React, { useRef } from 'react';

import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';
import { render, screen, waitFor } from '@atlassian/testing-library';

import { Dialog } from '../../src/entry-points/dialog';
import { Popover } from '../../src/entry-points/popover';

function noop() {}

/**
 * Covers the "host element unmounts when not visible" contract added to
 * `Popover` and `Dialog`. The host element (`<div popover>` for Popover,
 * `<dialog>` for Dialog) is rendered only while open or exit-animating, so
 * a closed popover does not leave an empty role-bearing element in the
 * accessibility tree. Once the exit completes, the host is unmounted.
 *
 * Tests in this file assert behaviour at the boundary of the contract:
 * - initial closed render produces no host element,
 * - opening mounts the host,
 * - closing unmounts the host (after the deferred unmount task),
 * - reopening produces a fresh host element with a stable id,
 * - `aria-controls` returned by `getAriaForTrigger` mirrors the host
 *   lifecycle so triggers never point at a missing id.
 */
describe('top-layer unmount-when-hidden contract', () => {
	describe('Popover', () => {
		it('does not render the host element when initially closed', async () => {
			const { container } = render(
				<Popover isOpen={false} onClose={noop} role="dialog" label="closed-popover">
					content
				</Popover>,
			);

			expect(screen.queryByRole('dialog', { name: 'closed-popover' })).not.toBeInTheDocument();
			await expect(container).toBeAccessible();
		});

		it('mounts the host element when isOpen flips to true', () => {
			const { rerender } = render(
				<Popover isOpen={false} onClose={noop} role="dialog" label="lifecycle">
					content
				</Popover>,
			);
			expect(screen.queryByRole('dialog', { name: 'lifecycle' })).not.toBeInTheDocument();

			rerender(
				<Popover isOpen={true} onClose={noop} role="dialog" label="lifecycle">
					content
				</Popover>,
			);

			expect(screen.getByRole('dialog', { name: 'lifecycle' })).toBeVisible();
		});

		it('unmounts the host element after closing', async () => {
			const { rerender } = render(
				<Popover isOpen={true} onClose={noop} role="dialog" label="lifecycle">
					content
				</Popover>,
			);
			expect(screen.getByRole('dialog', { name: 'lifecycle' })).toBeVisible();

			rerender(
				<Popover isOpen={false} onClose={noop} role="dialog" label="lifecycle">
					content
				</Popover>,
			);

			await waitFor(() =>
				expect(screen.queryByRole('dialog', { name: 'lifecycle' })).not.toBeInTheDocument(),
			);
		});

		it('remounts a fresh host element on reopen with the same generated id', async () => {
			const { rerender } = render(
				<Popover isOpen={true} onClose={noop} role="dialog" label="id-stable">
					content
				</Popover>,
			);
			const firstHost = screen.getByRole('dialog', { name: 'id-stable' });
			const firstId = firstHost.id;
			expect(firstId.length).toBeGreaterThan(0);

			rerender(
				<Popover isOpen={false} onClose={noop} role="dialog" label="id-stable">
					content
				</Popover>,
			);
			await waitFor(() =>
				expect(screen.queryByRole('dialog', { name: 'id-stable' })).not.toBeInTheDocument(),
			);

			rerender(
				<Popover isOpen={true} onClose={noop} role="dialog" label="id-stable">
					content
				</Popover>,
			);
			const secondHost = screen.getByRole('dialog', { name: 'id-stable' });

			expect(secondHost).not.toBe(firstHost);
			expect(secondHost.id).toBe(firstId);
		});

		it('forwarded ref is null while closed and populated while open', async () => {
			const ref = React.createRef<HTMLDivElement>();
			const { rerender } = render(
				<Popover ref={ref} isOpen={false} onClose={noop} role="dialog" label="ref-lifecycle">
					content
				</Popover>,
			);
			expect(ref.current).toBeNull();

			rerender(
				<Popover ref={ref} isOpen={true} onClose={noop} role="dialog" label="ref-lifecycle">
					content
				</Popover>,
			);
			expect(ref.current).toBeInstanceOf(HTMLDivElement);

			rerender(
				<Popover ref={ref} isOpen={false} onClose={noop} role="dialog" label="ref-lifecycle">
					content
				</Popover>,
			);
			await waitFor(() => expect(ref.current).toBeNull());
		});
	});

	describe('Dialog', () => {
		it('does not render the <dialog> when initially closed', () => {
			render(
				<Dialog isOpen={false} onClose={noop} label="closed-dialog">
					content
				</Dialog>,
			);

			expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument();
		});

		it('mounts the <dialog> when isOpen flips to true', () => {
			const { rerender } = render(
				<Dialog isOpen={false} onClose={noop} label="lifecycle">
					content
				</Dialog>,
			);
			expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument();

			rerender(
				<Dialog isOpen={true} onClose={noop} label="lifecycle">
					content
				</Dialog>,
			);

			expect(screen.getByRole('dialog', { hidden: true })).toBeVisible();
		});

		it('unmounts the <dialog> after closing', async () => {
			const { rerender } = render(
				<Dialog isOpen={true} onClose={noop} label="lifecycle">
					content
				</Dialog>,
			);
			expect(screen.getByRole('dialog', { hidden: true })).toBeVisible();

			rerender(
				<Dialog isOpen={false} onClose={noop} label="lifecycle">
					content
				</Dialog>,
			);

			await waitFor(() =>
				expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument(),
			);
		});

		it('remounts a fresh <dialog> on reopen with the same generated id', async () => {
			const { rerender } = render(
				<Dialog isOpen={true} onClose={noop} label="dialog-id-stable">
					content
				</Dialog>,
			);
			const firstHost = screen.getByRole('dialog', { hidden: true });
			const firstId = firstHost.id;
			expect(firstId.length).toBeGreaterThan(0);

			rerender(
				<Dialog isOpen={false} onClose={noop} label="dialog-id-stable">
					content
				</Dialog>,
			);
			await waitFor(() =>
				expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument(),
			);

			rerender(
				<Dialog isOpen={true} onClose={noop} label="dialog-id-stable">
					content
				</Dialog>,
			);
			const secondHost = screen.getByRole('dialog', { hidden: true });

			expect(secondHost).not.toBe(firstHost);
			expect(secondHost.id).toBe(firstId);
		});
	});

	describe('getAriaForTrigger', () => {
		it('returns aria-controls undefined while closed (key present, value undefined)', () => {
			const result = getAriaForTrigger({
				role: 'dialog',
				isOpen: false,
				popoverId: 'popover-1',
			});

			expect(result['aria-controls']).toBeUndefined();
			// Key is present so the JSX spread can remove a previously set
			// attribute on the trigger when the popover closes.
			expect('aria-controls' in result).toBe(true);
		});

		it('returns aria-controls set to popoverId while open', () => {
			const result = getAriaForTrigger({
				role: 'dialog',
				isOpen: true,
				popoverId: 'popover-1',
			});

			expect(result['aria-controls']).toBe('popover-1');
		});

		it('aria-expanded mirrors isOpen on both sides of the toggle', () => {
			const closed = getAriaForTrigger({
				role: 'dialog',
				isOpen: false,
				popoverId: 'p',
			});
			const open = getAriaForTrigger({
				role: 'dialog',
				isOpen: true,
				popoverId: 'p',
			});

			expect(closed['aria-expanded']).toBe(false);
			expect(open['aria-expanded']).toBe(true);
		});
	});

	describe('end-to-end trigger wiring (spread into a real button)', () => {
		function TriggerAndPopover({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
			const triggerRef = useRef<HTMLButtonElement>(null);
			const popoverId = usePopoverId();
			const aria = getAriaForTrigger({ role: 'dialog', isOpen, popoverId });

			return (
				<>
					<button ref={triggerRef} type="button" data-testid="trigger" {...aria}>
						open
					</button>
					<Popover
						isOpen={isOpen}
						onClose={onClose}
						role="dialog"
						label="end-to-end"
						id={popoverId}
					>
						content
					</Popover>
				</>
			);
		}

		it('trigger drops aria-controls when popover closes; restores it when reopened', async () => {
			const { rerender } = render(<TriggerAndPopover isOpen={true} onClose={noop} />);
			const trigger = screen.getByTestId('trigger');
			const popoverHost = screen.getByRole('dialog', { name: 'end-to-end' });

			expect(trigger).toHaveAttribute('aria-controls', popoverHost.id);
			expect(trigger).toHaveAttribute('aria-expanded', 'true');

			rerender(<TriggerAndPopover isOpen={false} onClose={noop} />);

			await waitFor(() =>
				expect(screen.queryByRole('dialog', { name: 'end-to-end' })).not.toBeInTheDocument(),
			);
			expect(trigger).not.toHaveAttribute('aria-controls');
			expect(trigger).toHaveAttribute('aria-expanded', 'false');

			rerender(<TriggerAndPopover isOpen={true} onClose={noop} />);

			const reopenedHost = screen.getByRole('dialog', { name: 'end-to-end' });
			expect(trigger).toHaveAttribute('aria-controls', reopenedHost.id);
			expect(trigger).toHaveAttribute('aria-expanded', 'true');
		});
	});
});
