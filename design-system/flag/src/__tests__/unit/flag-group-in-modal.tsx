import React, { type ReactNode, useState } from 'react';

import { Drawer } from '@atlaskit/drawer/drawer';
import { DrawerContent } from '@atlaskit/drawer/drawer-content';
import noop from '@atlaskit/ds-lib/noop';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import Modal from '@atlaskit/modal-dialog/modal-dialog';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import { Box } from '@atlaskit/primitives/compiled/box';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { act, render, waitFor } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import { FlagsProvider } from '../../flags-provider';
import { useFlags } from '../../use-flags';

/**
 * A modal dialog makes everything outside it inert, popovers too. So a flag that shows while a
 * top-layer `ModalDialog` or `Drawer` is open renders inside the topmost one (each flag has its own
 * host), and it moves out when that one closes. The jsdom polyfill models inertness: a user event on
 * inert content throws `pointer-events: none`. The top-layer `toBeVisible()` checks that the flag
 * is in an open popover.
 */

function ShowFlagButton({
	onRetry = noop,
	description,
}: {
	onRetry?: () => void;
	description?: ReactNode;
}) {
	const { showFlag } = useFlags();
	return (
		<button
			type="button"
			onClick={() => {
				showFlag({
					id: 'flag',
					title: 'Connection lost',
					description,
					icon: <Box />,
					actions: [{ content: 'Retry', onClick: onRetry }],
				});
			}}
		>
			Show flag
		</button>
	);
}

function isInert({ element }: { element: Element }): boolean {
	return window.getComputedStyle(element).pointerEvents === 'none';
}

function getFlag(): HTMLElement {
	return screen.getByRole('alert');
}

function getDialog({ testId }: { testId: string }): HTMLElement {
	return screen.getByTestId(testId);
}

function TestModal({
	title,
	testId,
	onClose = noop,
	children,
}: {
	title: string;
	testId: string;
	onClose?: () => void;
	children: ReactNode;
}) {
	return (
		<Modal onClose={onClose} testId={testId}>
			<ModalHeader hasCloseButton>
				<ModalTitle>{title}</ModalTitle>
			</ModalHeader>
			<ModalBody>{children}</ModalBody>
		</Modal>
	);
}

function ModalPage({ isOpen, children }: { isOpen: boolean; children: ReactNode }) {
	return (
		<FlagsProvider>
			<ModalTransition>
				{isOpen ? (
					<TestModal title="Modal" testId="modal">
						{children}
					</TestModal>
				) : null}
			</ModalTransition>
		</FlagsProvider>
	);
}

// An outer modal dialog with a button that opens an inner one.
function NestedModals({ children }: { children: ReactNode }) {
	const [isInnerOpen, setIsInnerOpen] = useState(false);
	return (
		<TestModal title="Outer" testId="outer">
			<button type="button" onClick={() => setIsInnerOpen(true)}>
				Open inner
			</button>
			<ModalTransition>
				{isInnerOpen ? (
					<TestModal title="Inner" testId="inner" onClose={() => setIsInnerOpen(false)}>
						{children}
					</TestModal>
				) : null}
			</ModalTransition>
		</TestModal>
	);
}

// Flag content that opens its own modal dialog.
function LearnMore() {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<>
			<button type="button" onClick={() => setIsOpen(true)}>
				Learn more
			</button>
			<ModalTransition>
				{isOpen ? (
					<TestModal title="Details" testId="details" onClose={() => setIsOpen(false)}>
						Details
					</TestModal>
				) : null}
			</ModalTransition>
		</>
	);
}

describe('FlagGroup with an open modal', () => {
	describe('when top layer is on', () => {
		beforeEach(() => {
			passGate('platform-dst-top-layer');
		});

		it('renders the flag inside an open modal dialog, where it can be used', async () => {
			const user = userEvent.setup();
			const onRetry = jest.fn();
			render(
				<ModalPage isOpen>
					<ShowFlagButton onRetry={onRetry} />
				</ModalPage>,
			);

			await user.click(screen.getByRole('button', { name: 'Show flag' }));

			expect(getDialog({ testId: 'modal' })).toContainElement(getFlag());
			expect(getFlag()).toBeVisible();
			await user.click(screen.getByRole('button', { name: 'Retry' }));
			expect(onRetry).toHaveBeenCalledTimes(1);
		});

		it('is accessible inside an open modal dialog', async () => {
			const user = userEvent.setup();
			const { container } = render(
				<ModalPage isOpen>
					<ShowFlagButton />
				</ModalPage>,
			);

			await user.click(screen.getByRole('button', { name: 'Show flag' }));

			await expect(container).toBeAccessible();
		});

		it('leaves an Escape from a flag to the modal dialog', async () => {
			const user = userEvent.setup();
			const onClose = jest.fn();
			render(
				<FlagsProvider>
					<TestModal title="Modal" testId="modal" onClose={onClose}>
						<ShowFlagButton />
					</TestModal>
				</FlagsProvider>,
			);
			await user.click(screen.getByRole('button', { name: 'Show flag' }));
			const retry = screen.getByRole('button', { name: 'Retry' });
			act(() => {
				retry.focus();
			});
			expect(retry).toHaveFocus();

			// The host is a manual popover, which does not take Escape.
			await user.keyboard('{Escape}');

			expect(onClose).toHaveBeenCalledTimes(1);
		});

		it('stays in place when a modal dialog opens after it', async () => {
			const user = userEvent.setup();
			function Page({ isModalOpen }: { isModalOpen: boolean }) {
				return (
					<FlagsProvider>
						<ShowFlagButton />
						<ModalTransition>
							{isModalOpen ? (
								<TestModal title="Modal" testId="modal">
									Content
								</TestModal>
							) : null}
						</ModalTransition>
					</FlagsProvider>
				);
			}
			const { rerender } = render(<Page isModalOpen={false} />);
			await user.click(screen.getByRole('button', { name: 'Show flag' }));
			const flagBefore = getFlag();

			rerender(<Page isModalOpen />);

			// The flag is under the modal dialog, and inert, until the modal dialog closes.
			expect(getFlag()).toBe(flagBefore);
			expect(getDialog({ testId: 'modal' })).not.toContainElement(getFlag());
			expect(isInert({ element: screen.getByRole('button', { name: 'Retry' }) })).toBe(true);
			expect(screen.getByRole('button', { name: 'Close Modal' })).toHaveFocus();
		});

		// Each flag has its own host, which picks its place when the flag mounts.
		it('shows a new flag inside a modal dialog that opened after an earlier flag', async () => {
			const user = userEvent.setup();
			function ShowSecondFlagButton() {
				const { showFlag } = useFlags();
				return (
					<button
						type="button"
						onClick={() => showFlag({ id: 'second', title: 'Saved', icon: <Box /> })}
					>
						Show second flag
					</button>
				);
			}
			function Page({ isModalOpen }: { isModalOpen: boolean }) {
				return (
					<FlagsProvider>
						<ShowFlagButton />
						<ModalTransition>
							{isModalOpen ? (
								<TestModal title="Modal" testId="modal">
									<ShowSecondFlagButton />
								</TestModal>
							) : null}
						</ModalTransition>
					</FlagsProvider>
				);
			}
			const { rerender } = render(<Page isModalOpen={false} />);
			await user.click(screen.getByRole('button', { name: 'Show flag' }));
			// Inert content is not in the accessibility tree.
			const first = screen.getByText('Connection lost');
			rerender(<Page isModalOpen />);

			await user.click(screen.getByRole('button', { name: 'Show second flag' }));

			const second = screen.getByText('Saved');
			expect(getDialog({ testId: 'modal' })).toContainElement(second);
			expect(isInert({ element: second })).toBe(false);
			// The earlier flag stays under the modal dialog.
			expect(getDialog({ testId: 'modal' })).not.toContainElement(first);
			expect(isInert({ element: first })).toBe(true);
		});

		it('moves the flag back out when the modal dialog closes', async () => {
			const user = userEvent.setup();
			const onRetry = jest.fn();
			const { rerender } = render(
				<ModalPage isOpen>
					<ShowFlagButton onRetry={onRetry} />
				</ModalPage>,
			);
			await user.click(screen.getByRole('button', { name: 'Show flag' }));
			const modal = getDialog({ testId: 'modal' });
			expect(modal).toContainElement(getFlag());

			rerender(
				<ModalPage isOpen={false}>
					<ShowFlagButton onRetry={onRetry} />
				</ModalPage>,
			);

			await waitFor(() => expect(modal).not.toContainElement(getFlag()));
			expect(getFlag()).toBeVisible();
			await user.click(screen.getByRole('button', { name: 'Retry' }));
			expect(onRetry).toHaveBeenCalledTimes(1);
		});

		// For example, a submit handler. With `delay: null`, no task runs between the click and the
		// checks, so the flag did not wait in the closing modal dialog for its `close` task.
		it('shows the flag in place when the handler that shows it also closes the modal dialog', async () => {
			const user = userEvent.setup({ delay: null });
			function SaveButton({ onSave }: { onSave: () => void }) {
				const { showFlag } = useFlags();
				return (
					<button
						type="button"
						onClick={() => {
							showFlag({ id: 'flag', title: 'Saved', icon: <Box /> });
							onSave();
						}}
					>
						Save
					</button>
				);
			}
			function Page() {
				const [isOpen, setIsOpen] = useState(true);
				return (
					<FlagsProvider>
						<ModalTransition>
							{isOpen ? (
								<TestModal title="Modal" testId="modal">
									<SaveButton onSave={() => setIsOpen(false)} />
								</TestModal>
							) : null}
						</ModalTransition>
					</FlagsProvider>
				);
			}
			render(<Page />);
			const modal = getDialog({ testId: 'modal' });

			await user.click(screen.getByRole('button', { name: 'Save' }));

			expect(modal).not.toContainElement(getFlag());
			expect(getFlag()).toBeVisible();
		});

		it('renders the flag inside an open drawer', async () => {
			const user = userEvent.setup();
			const onRetry = jest.fn();
			render(
				<FlagsProvider>
					<Drawer isOpen onClose={noop} label="Drawer" testId="drawer">
						<DrawerContent>
							<ShowFlagButton onRetry={onRetry} />
						</DrawerContent>
					</Drawer>
				</FlagsProvider>,
			);

			await user.click(screen.getByRole('button', { name: 'Show flag' }));

			expect(getDialog({ testId: 'drawer' })).toContainElement(getFlag());
			await user.click(screen.getByRole('button', { name: 'Retry' }));
			expect(onRetry).toHaveBeenCalledTimes(1);
		});

		it('renders the flag inside the topmost of nested modal dialogs', async () => {
			const user = userEvent.setup();
			const onRetry = jest.fn();
			render(
				<FlagsProvider>
					<NestedModals>
						<ShowFlagButton onRetry={onRetry} />
					</NestedModals>
				</FlagsProvider>,
			);

			await user.click(screen.getByRole('button', { name: 'Open inner' }));
			await user.click(screen.getByRole('button', { name: 'Show flag' }));

			expect(getDialog({ testId: 'inner' })).toContainElement(getFlag());
			await user.click(screen.getByRole('button', { name: 'Retry' }));
			expect(onRetry).toHaveBeenCalledTimes(1);
		});

		it('moves to the outer modal dialog when the inner one closes, and focus returns to the opener', async () => {
			const user = userEvent.setup();
			render(
				<FlagsProvider>
					<NestedModals>
						<ShowFlagButton />
					</NestedModals>
				</FlagsProvider>,
			);
			const openInner = screen.getByRole('button', { name: 'Open inner' });
			await user.click(openInner);
			await user.click(screen.getByRole('button', { name: 'Show flag' }));
			expect(getDialog({ testId: 'inner' })).toContainElement(getFlag());
			// Focus is in the flag when the inner modal dialog closes.
			const retry = screen.getByRole('button', { name: 'Retry' });
			act(() => {
				retry.focus();
			});

			await user.keyboard('{Escape}');

			await waitFor(() => expect(getDialog({ testId: 'outer' })).toContainElement(getFlag()));
			expect(screen.queryByTestId('inner')).not.toBeInTheDocument();
			expect(openInner).toHaveFocus();
		});

		it('moves only the flags inside a modal dialog when it closes', async () => {
			const user = userEvent.setup();
			function ShowSecondFlagButton() {
				const { showFlag } = useFlags();
				return (
					<button
						type="button"
						onClick={() => showFlag({ id: 'second', title: 'Saved', icon: <Box /> })}
					>
						Show second flag
					</button>
				);
			}
			function Page({ isModalOpen }: { isModalOpen: boolean }) {
				return (
					<FlagsProvider>
						<ShowFlagButton />
						<ModalTransition>
							{isModalOpen ? (
								<TestModal title="Modal" testId="modal">
									<ShowSecondFlagButton />
								</TestModal>
							) : null}
						</ModalTransition>
					</FlagsProvider>
				);
			}
			const { rerender } = render(<Page isModalOpen={false} />);
			await user.click(screen.getByRole('button', { name: 'Show flag' }));
			const first = screen.getByText('Connection lost');
			rerender(<Page isModalOpen />);
			await user.click(screen.getByRole('button', { name: 'Show second flag' }));
			const modal = getDialog({ testId: 'modal' });
			const secondInModal = screen.getByText('Saved');
			expect(modal).toContainElement(secondInModal);

			rerender(<Page isModalOpen={false} />);

			// The flag from the modal remounts in place. The earlier flag does not move.
			await waitFor(() => expect(screen.getByText('Saved')).not.toBe(secondInModal));
			expect(modal).not.toContainElement(screen.getByText('Saved'));
			expect(screen.getByText('Connection lost')).toBe(first);
			expect(isInert({ element: screen.getByText('Saved') })).toBe(false);
			expect(isInert({ element: first })).toBe(false);
		});

		it('stays in place when its content opens a modal dialog, and focus returns to the flag', async () => {
			const user = userEvent.setup();
			render(
				<FlagsProvider>
					<ShowFlagButton description={<LearnMore />} />
				</FlagsProvider>,
			);
			await user.click(screen.getByRole('button', { name: 'Show flag' }));
			const learnMore = screen.getByRole('button', { name: 'Learn more' });

			await user.click(learnMore);

			// The flag does not move into a modal dialog that it renders itself.
			const details = getDialog({ testId: 'details' });
			expect(getFlag()).toContainElement(details);
			expect(screen.getByRole('dialog', { name: 'Details' })).toBeVisible();
			expect(learnMore).toBeInTheDocument();

			await user.click(screen.getByRole('button', { name: 'Close Modal' }));

			await waitFor(() => expect(learnMore).toHaveFocus());
		});

		it('stays in place when its action opens a modal dialog elsewhere, and focus returns to the action', async () => {
			const user = userEvent.setup();
			function Page() {
				const [isOpen, setIsOpen] = useState(false);
				const { showFlag } = useFlags();
				return (
					<>
						<button
							type="button"
							onClick={() =>
								showFlag({
									id: 'flag',
									title: 'Saved',
									icon: <Box />,
									actions: [{ content: 'Details', onClick: () => setIsOpen(true) }],
								})
							}
						>
							Show flag
						</button>
						<ModalTransition>
							{isOpen ? (
								<TestModal title="Details" testId="details" onClose={() => setIsOpen(false)}>
									Details
								</TestModal>
							) : null}
						</ModalTransition>
					</>
				);
			}
			render(
				<FlagsProvider>
					<Page />
				</FlagsProvider>,
			);
			await user.click(screen.getByRole('button', { name: 'Show flag' }));
			const action = screen.getByRole('button', { name: 'Details' });
			act(() => {
				action.focus();
			});
			await user.keyboard('{Enter}');
			expect(getDialog({ testId: 'details' })).not.toContainElement(getFlag());
			expect(action).toBeInTheDocument();

			await user.click(screen.getByRole('button', { name: 'Close Modal' }));

			await waitFor(() => expect(action).toHaveFocus());
		});
	});

	describe('when top layer is off', () => {
		beforeEach(() => {
			failGate('platform-dst-top-layer');
		});

		it('renders the flags in their own portal, outside the modal dialog', async () => {
			const user = userEvent.setup();
			const onRetry = jest.fn();
			render(
				<ModalPage isOpen>
					<ShowFlagButton onRetry={onRetry} />
				</ModalPage>,
			);

			await user.click(screen.getByRole('button', { name: 'Show flag' }));

			expect(getDialog({ testId: 'modal' })).not.toContainElement(getFlag());
			await user.click(screen.getByRole('button', { name: 'Retry' }));
			expect(onRetry).toHaveBeenCalledTimes(1);
		});
	});
});
