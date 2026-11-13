import React, { type ReactNode, StrictMode, Suspense, useState } from 'react';

import { bind } from 'bind-event-listener';

import { screen } from '@atlassian/testing-library/screen';
import { act, render, waitFor } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import { DialogAwarePortal } from '../../src/dialog/dialog-aware-portal';
import { Dialog } from '../../src/dialog/dialog-content';
import { Popover } from '../../src/popover/popover';

/**
 * `DialogAwarePortal` renders a layer inside the `Dialog` that is topmost when it renders first, so
 * the modal dialog does not make it inert. It picks again when that dialog closes. Most tests open
 * the dialogs first, then mount the layer. The polyfill models inertness: everything outside the
 * topmost modal dialog is inert, popovers too. It also fires `close` as a task after the close, as
 * browsers do, so a move after a close needs `waitFor`.
 */

function noop() {}

function isInert({ element }: { element: Element }): boolean {
	return window.getComputedStyle(element).pointerEvents === 'none';
}

function getHost(): HTMLElement {
	return screen.getByTestId('host');
}

function getDialog({ testId }: { testId: string }): HTMLDialogElement {
	return screen.getByTestId(testId) as HTMLDialogElement;
}

function waitForDialogCloseToggle({ dialog }: { dialog: HTMLElement }): Promise<void> {
	return new Promise((resolve) => {
		bind(dialog, {
			type: 'toggle',
			listener: (event: ToggleEvent) => {
				if (event.newState === 'closed') {
					resolve();
				}
			},
			options: { once: true },
		});
	});
}

function Layer({ onClick = noop }: { onClick?: () => unknown }) {
	return (
		<DialogAwarePortal>
			<Popover mode="manual" isOpen testId="host">
				<button type="button" onClick={onClick}>
					Layer button
				</button>
			</Popover>
		</DialogAwarePortal>
	);
}

// A layer whose children render their own `Dialog`.
function LayerWithDialog() {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<DialogAwarePortal>
			<Popover mode="manual" isOpen testId="host">
				<button type="button" onClick={() => setIsOpen(true)}>
					Open layer dialog
				</button>
				<Dialog
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
					label="Layer dialog"
					testId="layer-dialog"
				>
					<button type="button">Layer dialog button</button>
				</Dialog>
			</Popover>
		</DialogAwarePortal>
	);
}

function Page({
	isOuterOpen,
	isInnerOpen = false,
	layer,
}: {
	isOuterOpen: boolean;
	isInnerOpen?: boolean;
	layer: ReactNode;
}) {
	return (
		<div data-testid="page">
			{layer}
			<Dialog isOpen={isOuterOpen} onClose={noop} label="Outer" testId="outer">
				<button type="button">Outer button</button>
				<Dialog isOpen={isInnerOpen} onClose={noop} label="Inner" testId="inner">
					<button type="button">Inner button</button>
				</Dialog>
			</Dialog>
		</div>
	);
}

describe('DialogAwarePortal', () => {
	it('renders in place when no dialog is open', () => {
		render(<Page isOuterOpen={false} layer={<Layer />} />);

		expect(screen.getByTestId('page')).toContainElement(getHost());
		expect(getHost().matches(':popover-open')).toBe(true);
	});

	it('renders inside the open dialog, where it is not inert', async () => {
		const user = userEvent.setup();
		const onClick = jest.fn();
		const { rerender } = render(<Page isOuterOpen layer={null} />);

		rerender(<Page isOuterOpen layer={<Layer onClick={onClick} />} />);

		expect(getDialog({ testId: 'outer' })).toContainElement(getHost());
		expect(getHost().matches(':popover-open')).toBe(true);
		const button = screen.getByRole('button', { name: 'Layer button' });
		expect(isInert({ element: button })).toBe(false);
		await user.click(button);
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('does not move into a dialog that opens after it', () => {
		const { rerender } = render(<Page isOuterOpen={false} layer={<Layer />} />);
		const hostBefore = getHost();

		rerender(<Page isOuterOpen layer={<Layer />} />);

		expect(getHost()).toBe(hostBefore);
		expect(getDialog({ testId: 'outer' })).not.toContainElement(getHost());
		expect(isInert({ element: screen.getByRole('button', { name: 'Layer button' }) })).toBe(true);
	});

	it('does not join a dialog that opens in the same commit', () => {
		render(<Page isOuterOpen isInnerOpen layer={<Layer />} />);

		expect(getDialog({ testId: 'outer' })).not.toContainElement(getHost());
		expect(screen.getByTestId('page')).toContainElement(getHost());
		expect(isInert({ element: screen.getByRole('button', { name: 'Layer button' }) })).toBe(true);
	});

	it('moves back in place when its dialog closes', async () => {
		const { rerender } = render(<Page isOuterOpen layer={null} />);
		rerender(<Page isOuterOpen layer={<Layer />} />);
		const outer = getDialog({ testId: 'outer' });
		expect(outer).toContainElement(getHost());

		rerender(<Page isOuterOpen={false} layer={<Layer />} />);

		await waitFor(() => expect(outer).not.toContainElement(getHost()));
		expect(screen.getByTestId('page')).toContainElement(getHost());
		expect(getHost().matches(':popover-open')).toBe(true);
		expect(isInert({ element: screen.getByRole('button', { name: 'Layer button' }) })).toBe(false);
	});

	it('moves back in place when its dialog unmounts', async () => {
		function MaybeDialog({ hasDialog, hasLayer }: { hasDialog: boolean; hasLayer: boolean }) {
			return (
				<div data-testid="page">
					{hasLayer ? <Layer /> : null}
					{hasDialog ? (
						<Dialog isOpen onClose={noop} label="Outer" testId="outer">
							<button type="button">Outer button</button>
						</Dialog>
					) : null}
				</div>
			);
		}
		const { rerender } = render(<MaybeDialog hasDialog hasLayer={false} />);
		rerender(<MaybeDialog hasDialog hasLayer />);
		expect(getDialog({ testId: 'outer' })).toContainElement(getHost());
		const hostBefore = getHost();

		rerender(<MaybeDialog hasDialog={false} hasLayer />);

		await waitFor(() => expect(screen.getByTestId('page')).toContainElement(getHost()));
		expect(getHost()).not.toBe(hostBefore);
		expect(getHost().matches(':popover-open')).toBe(true);
	});

	// For example, a submit handler that shows a flag and closes the modal. The checks do not wait,
	// so the children did not stay in the closing dialog until its `close` task.
	it('renders in place, with no wait, when it mounts in the commit that closes its dialog', () => {
		const { rerender } = render(<Page isOuterOpen layer={null} />);

		rerender(<Page isOuterOpen={false} layer={<Layer />} />);

		expect(getDialog({ testId: 'outer' })).not.toContainElement(getHost());
		expect(screen.getByTestId('page')).toContainElement(getHost());
		expect(getHost().matches(':popover-open')).toBe(true);
		expect(isInert({ element: screen.getByRole('button', { name: 'Layer button' }) })).toBe(false);
	});

	it('renders in place, with no wait, when it mounts in the commit that unmounts its dialog', () => {
		function MaybeDialog({ hasDialog, hasLayer }: { hasDialog: boolean; hasLayer: boolean }) {
			return (
				<div data-testid="page">
					{hasLayer ? <Layer /> : null}
					{hasDialog ? (
						<Dialog isOpen onClose={noop} label="Outer" testId="outer">
							<button type="button">Outer button</button>
						</Dialog>
					) : null}
				</div>
			);
		}
		const { rerender } = render(<MaybeDialog hasDialog hasLayer={false} />);

		rerender(<MaybeDialog hasDialog={false} hasLayer />);

		expect(screen.getByTestId('page')).toContainElement(getHost());
		expect(getHost().matches(':popover-open')).toBe(true);
	});

	it('joins the outer dialog, with no wait, when it mounts in the commit that closes the inner one', () => {
		const { rerender } = render(<Page isOuterOpen isInnerOpen layer={null} />);

		rerender(<Page isOuterOpen isInnerOpen={false} layer={<Layer />} />);

		expect(getDialog({ testId: 'inner' })).not.toContainElement(getHost());
		expect(getDialog({ testId: 'outer' })).toContainElement(getHost());
		expect(getHost().matches(':popover-open')).toBe(true);
		expect(isInert({ element: screen.getByRole('button', { name: 'Layer button' }) })).toBe(false);
	});

	it('stays in the outer dialog when an inner dialog opens', () => {
		const { rerender } = render(<Page isOuterOpen layer={null} />);
		rerender(<Page isOuterOpen layer={<Layer />} />);

		rerender(<Page isOuterOpen isInnerOpen layer={<Layer />} />);

		expect(getDialog({ testId: 'inner' })).not.toContainElement(getHost());
		expect(getDialog({ testId: 'outer' })).toContainElement(getHost());
	});

	it('joins the inner of nested open dialogs, and moves to the outer one when the inner one closes', async () => {
		const { rerender } = render(<Page isOuterOpen isInnerOpen layer={null} />);

		rerender(<Page isOuterOpen isInnerOpen layer={<Layer />} />);

		const inner = getDialog({ testId: 'inner' });
		expect(inner).toContainElement(getHost());
		expect(isInert({ element: screen.getByRole('button', { name: 'Layer button' }) })).toBe(false);

		rerender(<Page isOuterOpen isInnerOpen={false} layer={<Layer />} />);

		await waitFor(() => expect(inner).not.toContainElement(getHost()));
		expect(getDialog({ testId: 'outer' })).toContainElement(getHost());
		expect(isInert({ element: screen.getByRole('button', { name: 'Layer button' }) })).toBe(false);
	});

	it('joins the dialog that opened last, not the last one in DOM order', () => {
		function Siblings({ isFirstOpen, layer }: { isFirstOpen: boolean; layer: ReactNode }) {
			return (
				<div data-testid="page">
					<Dialog isOpen={isFirstOpen} onClose={noop} label="First" testId="first">
						<button type="button">First button</button>
					</Dialog>
					<Dialog isOpen onClose={noop} label="Second" testId="second">
						<button type="button">Second button</button>
					</Dialog>
					{layer}
				</div>
			);
		}
		const { rerender } = render(<Siblings isFirstOpen={false} layer={null} />);
		rerender(<Siblings isFirstOpen layer={null} />);

		rerender(<Siblings isFirstOpen layer={<Layer />} />);

		expect(getDialog({ testId: 'first' })).toContainElement(getHost());
		expect(isInert({ element: screen.getByRole('button', { name: 'Layer button' }) })).toBe(false);
	});

	it('skips a dialog that wants to be open but is not shown', () => {
		const suspended = new Promise<never>(() => {});
		function Suspend({ isSuspended }: { isSuspended: boolean }) {
			if (isSuspended) {
				throw suspended;
			}
			return null;
		}
		function HiddenDialog({ isSuspended, layer }: { isSuspended: boolean; layer: ReactNode }) {
			return (
				<div data-testid="page">
					<Suspense fallback={null}>
						<Dialog isOpen onClose={noop} label="Hidden" testId="hidden">
							<button type="button">Hidden button</button>
						</Dialog>
						<Suspend isSuspended={isSuspended} />
					</Suspense>
					{layer}
				</div>
			);
		}
		const { rerender } = render(<HiddenDialog isSuspended={false} layer={null} />);
		// Suspense hides the dialog, and its cleanup closes it. Its `isOpen` is still `true`.
		rerender(<HiddenDialog isSuspended layer={null} />);
		expect(getDialog({ testId: 'hidden' }).open).toBe(false);

		rerender(<HiddenDialog isSuspended layer={<Layer />} />);

		expect(getDialog({ testId: 'hidden' })).not.toContainElement(getHost());
		expect(getHost().matches(':popover-open')).toBe(true);
	});

	it('moves into an open sibling dialog when its dialog closes', async () => {
		function Siblings({
			isFirstOpen,
			isSecondOpen,
			hasLayer,
		}: {
			isFirstOpen: boolean;
			isSecondOpen: boolean;
			hasLayer: boolean;
		}) {
			return (
				<div data-testid="page">
					<Dialog isOpen={isFirstOpen} onClose={noop} label="First" testId="first">
						<button type="button">First button</button>
					</Dialog>
					<Dialog isOpen={isSecondOpen} onClose={noop} label="Second" testId="second">
						<button type="button">Second button</button>
					</Dialog>
					{hasLayer ? <Layer /> : null}
				</div>
			);
		}
		const { rerender } = render(<Siblings isFirstOpen isSecondOpen={false} hasLayer={false} />);
		rerender(<Siblings isFirstOpen isSecondOpen={false} hasLayer />);
		const first = getDialog({ testId: 'first' });
		expect(first).toContainElement(getHost());
		rerender(<Siblings isFirstOpen isSecondOpen hasLayer />);
		expect(first).toContainElement(getHost());

		rerender(<Siblings isFirstOpen={false} isSecondOpen hasLayer />);

		await waitFor(() => expect(getDialog({ testId: 'second' })).toContainElement(getHost()));
		expect(isInert({ element: screen.getByRole('button', { name: 'Layer button' }) })).toBe(false);
	});

	it('stays in place when its children open a dialog', async () => {
		const user = userEvent.setup();
		render(<Page isOuterOpen={false} layer={<LayerWithDialog />} />);
		const hostBefore = getHost();

		await user.click(screen.getByRole('button', { name: 'Open layer dialog' }));

		expect(getHost()).toBe(hostBefore);
		expect(screen.getByTestId('page')).toContainElement(getHost());
		expect(getHost()).toContainElement(getDialog({ testId: 'layer-dialog' }));
		expect(getDialog({ testId: 'layer-dialog' }).matches(':modal')).toBe(true);
		expect(isInert({ element: screen.getByRole('button', { name: 'Layer dialog button' }) })).toBe(
			false,
		);
	});

	it('stays in place when its children mount with an open dialog', () => {
		function LayerWithOpenDialog() {
			return (
				<DialogAwarePortal>
					<Popover mode="manual" isOpen testId="host">
						<Dialog isOpen onClose={noop} label="Layer dialog" testId="layer-dialog">
							<button type="button">Layer dialog button</button>
						</Dialog>
					</Popover>
				</DialogAwarePortal>
			);
		}

		render(<Page isOuterOpen={false} layer={<LayerWithOpenDialog />} />);

		expect(screen.getByTestId('page')).toContainElement(getHost());
		expect(getHost()).toContainElement(getDialog({ testId: 'layer-dialog' }));
		expect(getDialog({ testId: 'layer-dialog' }).matches(':modal')).toBe(true);
	});

	it('skips the dialogs that its children render when its dialog closes', async () => {
		const user = userEvent.setup();
		const { rerender } = render(<Page isOuterOpen layer={null} />);
		rerender(<Page isOuterOpen layer={<LayerWithDialog />} />);
		await user.click(screen.getByRole('button', { name: 'Open layer dialog' }));
		const outer = getDialog({ testId: 'outer' });
		expect(outer).toContainElement(getDialog({ testId: 'layer-dialog' }));

		rerender(<Page isOuterOpen={false} layer={<LayerWithDialog />} />);

		// In place, not inside its own dialog. The move remounts the dialog, which shows again.
		await waitFor(() => expect(outer).not.toContainElement(getHost()));
		expect(screen.getByTestId('page')).toContainElement(getHost());
		expect(getHost()).toContainElement(getDialog({ testId: 'layer-dialog' }));
		expect(getDialog({ testId: 'layer-dialog' }).matches(':modal')).toBe(true);
	});

	it('another portal that mounts later joins a dialog that the children of a portal render', async () => {
		const user = userEvent.setup();
		function Layers({ hasOther }: { hasOther: boolean }) {
			return (
				<Page
					isOuterOpen={false}
					layer={
						<>
							<LayerWithDialog />
							{hasOther ? (
								<DialogAwarePortal>
									<Popover mode="manual" isOpen testId="other-host">
										<button type="button">Other layer button</button>
									</Popover>
								</DialogAwarePortal>
							) : null}
						</>
					}
				/>
			);
		}
		const { rerender } = render(<Layers hasOther={false} />);
		await user.click(screen.getByRole('button', { name: 'Open layer dialog' }));

		rerender(<Layers hasOther />);

		expect(getDialog({ testId: 'layer-dialog' })).toContainElement(
			screen.getByTestId('other-host'),
		);
		expect(isInert({ element: screen.getByRole('button', { name: 'Other layer button' }) })).toBe(
			false,
		);
	});

	it('works in strict mode', async () => {
		const user = userEvent.setup();
		const { rerender } = render(
			<StrictMode>
				<Page isOuterOpen layer={null} />
			</StrictMode>,
		);
		rerender(
			<StrictMode>
				<Page isOuterOpen layer={<LayerWithDialog />} />
			</StrictMode>,
		);
		expect(getDialog({ testId: 'outer' })).toContainElement(getHost());
		expect(getHost().matches(':popover-open')).toBe(true);

		await user.click(screen.getByRole('button', { name: 'Open layer dialog' }));
		expect(getDialog({ testId: 'outer' })).toContainElement(getHost());
		expect(getDialog({ testId: 'layer-dialog' }).matches(':modal')).toBe(true);
		const outer = getDialog({ testId: 'outer' });

		rerender(
			<StrictMode>
				<Page isOuterOpen={false} layer={<LayerWithDialog />} />
			</StrictMode>,
		);
		await waitFor(() => expect(outer).not.toContainElement(getHost()));
		expect(screen.getByTestId('page')).toContainElement(getHost());
		expect(getHost().matches(':popover-open')).toBe(true);
	});

	it('stays in its dialog when the dialog shows again after a close that Dialog did not ask about', async () => {
		const { rerender } = render(<Page isOuterOpen layer={null} />);
		rerender(<Page isOuterOpen layer={<Layer />} />);
		const outer = getDialog({ testId: 'outer' });
		expect(outer).toContainElement(getHost());
		const hostBefore = getHost();
		const closeToggle = waitForDialogCloseToggle({ dialog: outer });

		await act(async () => {
			outer.close();
			await closeToggle;
			// `close` is a task after `toggle`.
			await new Promise((resolve) => setTimeout(resolve, 0));
		});

		expect(outer.open).toBe(true);
		expect(getHost()).toBe(hostBefore);
		expect(outer).toContainElement(getHost());
		expect(isInert({ element: screen.getByRole('button', { name: 'Layer button' }) })).toBe(false);
	});

	it('moves back in place when its dialog closes and cannot show again', async () => {
		function ClosedLayerPage({ hasLayer }: { hasLayer: boolean }) {
			return (
				<div data-testid="page">
					{hasLayer ? <Layer /> : null}
					<div data-testid="closed-layer">
						<Dialog isOpen onClose={noop} label="Outer" testId="outer">
							<button type="button">Outer button</button>
						</Dialog>
					</div>
				</div>
			);
		}
		const { rerender } = render(<ClosedLayerPage hasLayer={false} />);
		rerender(<ClosedLayerPage hasLayer />);
		expect(getDialog({ testId: 'outer' })).toContainElement(getHost());
		// A dialog in a closed layer does not show again (see `dialog-content.tsx`).
		screen.getByTestId('closed-layer').setAttribute('popover', 'manual');
		const outer = getDialog({ testId: 'outer' });
		const closeToggle = waitForDialogCloseToggle({ dialog: outer });

		await act(async () => {
			outer.close();
			await closeToggle;
		});

		expect(outer.open).toBe(false);
		await waitFor(() => expect(outer).not.toContainElement(getHost()));
		expect(screen.getByTestId('page')).toContainElement(getHost());
		expect(getHost().matches(':popover-open')).toBe(true);
	});
});
