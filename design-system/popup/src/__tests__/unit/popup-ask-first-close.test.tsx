import React, { useCallback, useEffect, useState } from 'react';

import { bind } from 'bind-event-listener';

import Textfield from '@atlaskit/textfield/text-field';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { act, fireEvent, render } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import { Popup } from '../../popup';

/**
 * On the top layer, `Popup` asks `onClose` first, and closes only when `isOpen` becomes `false`.
 * See `@atlaskit/top-layer` `notes/decisions/wrappers-ask-first-close.md`.
 */

type TCloseEvent = Event | React.MouseEvent | React.KeyboardEvent | null;

function getButton(name: string): HTMLElement {
	return screen.getByRole('button', { name });
}

function getContainer(testId: string): HTMLElement {
	return screen.getByTestId(`${testId}--container`);
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

/**
 * A popup with a trigger that toggles it. `shouldAccept` decides if `onClose` closes it.
 */
function TogglePopup({
	testId,
	label,
	shouldAccept,
	onClose,
	defaultOpen = false,
	children,
}: {
	testId: string;
	label: string;
	shouldAccept: boolean;
	onClose?: (event: TCloseEvent) => void;
	defaultOpen?: boolean;
	children?: React.ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(defaultOpen);
	return (
		<Popup
			isOpen={isOpen}
			onClose={(event) => {
				onClose?.(event);
				if (shouldAccept) {
					setIsOpen(false);
				}
			}}
			role="dialog"
			label={label}
			testId={testId}
			trigger={(triggerProps) => (
				<button type="button" {...triggerProps} onClick={() => setIsOpen((current) => !current)}>
					{`${label} trigger`}
				</button>
			)}
			content={() => (
				<div>
					<button type="button">{`${label} inside`}</button>
					{children}
				</div>
			)}
		/>
	);
}

describe('Popup top-layer: ask first on close', () => {
	beforeEach(() => {
		passGate('platform-dst-top-layer');
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
		expect(onClose.mock.calls[0][0]).toBeInstanceOf(MouseEvent);
		expect(getContainer('first')).toBeVisible();
		expect(getButton('First trigger')).toHaveAttribute('aria-expanded', 'true');
		// The press moved focus, as for any press.
		expect(getButton('Outside')).toHaveFocus();
	});

	it('should stay open and keep focus when onClose refuses Escape', async () => {
		const onClose = jest.fn();
		render(<TogglePopup testId="first" label="First" shouldAccept={false} onClose={onClose} />);
		await userEvent.click(getButton('First trigger'));
		expect(getButton('First inside')).toHaveFocus();

		await userEvent.keyboard('{Escape}');
		await flushTasks();

		expect(onClose).toHaveBeenCalledTimes(1);
		expect(onClose.mock.calls[0][0]).toHaveProperty('key', 'Escape');
		expect(getContainer('first')).toBeVisible();
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

	it('should not return focus to the trigger after an accepted outside press that did not move focus', async () => {
		render(
			<>
				<button
					type="button"
					// Keeps focus where it is on press, as legacy `@atlaskit/button` does.
					onMouseDown={(event) => event.preventDefault()}
				>
					Outside
				</button>
				<TogglePopup testId="first" label="First" shouldAccept />
			</>,
		);
		getButton('First trigger').focus();
		await userEvent.keyboard('{Enter}');
		expect(getButton('First inside')).toHaveFocus();

		await userEvent.click(getButton('Outside'));
		// `Popover` returns focus in the `toggle` task after the close.
		await flushTasks();

		// As native light dismiss: no focus return. Focus was blurred, so it is on `<body>`.
		expect(screen.queryByTestId('first--container')).not.toBeInTheDocument();
		expect(getButton('First trigger')).not.toHaveFocus();
		expect(document.body).toHaveFocus();
	});

	it('should ask before it closes on an accepted Escape, and return focus to the trigger', async () => {
		const isOpenWhenAsked = jest.fn();
		render(
			<TogglePopup
				testId="first"
				label="First"
				shouldAccept
				onClose={() => isOpenWhenAsked(isPopoverOpen(screen.queryByTestId('first--container')))}
			/>,
		);
		getButton('First trigger').focus();
		await userEvent.keyboard('{Enter}');
		expect(getButton('First inside')).toHaveFocus();

		await userEvent.keyboard('{Escape}');
		await flushTasks();

		expect(isOpenWhenAsked).toHaveBeenCalledWith(true);
		expect(screen.queryByTestId('first--container')).not.toBeInTheDocument();
		expect(getButton('First trigger')).toHaveFocus();
	});

	it('should not ask on a press on its trigger: the trigger click decides', async () => {
		const onClose = jest.fn();
		function OpenOnlyPopup() {
			const [isOpen, setIsOpen] = useState(true);
			return (
				<Popup
					isOpen={isOpen}
					onClose={onClose}
					testId="first"
					trigger={(triggerProps) => (
						<button type="button" {...triggerProps} onClick={() => setIsOpen(true)}>
							Open only
						</button>
					)}
					content={() => <div>Content</div>}
				/>
			);
		}
		render(<OpenOnlyPopup />);

		await userEvent.click(getButton('Open only'));
		await flushTasks();

		expect(onClose).not.toHaveBeenCalled();
		expect(getContainer('first')).toBeVisible();
	});

	it('should stay open on an outside press and Escape without onClose, and leave the Escape to a layer around it', async () => {
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
				<Popup
					isOpen
					role="dialog"
					label="Details"
					testId="first"
					trigger={(triggerProps) => (
						<button type="button" {...triggerProps}>
							Trigger
						</button>
					)}
					content={() => <button type="button">Inside</button>}
				/>
			</>,
		);
		expect(getButton('Inside')).toHaveFocus();

		await userEvent.keyboard('{Escape}');
		await userEvent.click(getButton('Outside'));
		await flushTasks();
		unbind();

		expect(getContainer('first')).toBeVisible();
		// Nothing can be asked to close it, so the popup does not take the Escape: a layer around it
		// (for example an inline edit or a modal) gets it.
		expect(isEscapeClaimed).toHaveBeenCalledWith(false);
	});

	it('should return focus to the element that opened it, not the trigger, after an accepted Escape', async () => {
		function OpenFromFieldPopup() {
			const [isOpen, setIsOpen] = useState(false);
			return (
				<>
					<Textfield
						aria-label="Search"
						onKeyDown={(event) => {
							if (event.key === 'Enter') {
								setIsOpen(true);
							}
						}}
					/>
					<Popup
						isOpen={isOpen}
						onClose={() => setIsOpen(false)}
						role="dialog"
						label="Details"
						testId="first"
						trigger={(triggerProps) => (
							<button type="button" {...triggerProps}>
								Trigger
							</button>
						)}
						content={() => <button type="button">Inside</button>}
					/>
				</>
			);
		}
		render(<OpenFromFieldPopup />);
		const field = screen.getByRole('textbox', { name: 'Search' });
		field.focus();
		await userEvent.keyboard('{Enter}');
		expect(getButton('Inside')).toHaveFocus();

		await userEvent.keyboard('{Escape}');
		await flushTasks();

		expect(screen.queryByTestId('first--container')).not.toBeInTheDocument();
		expect(field).toHaveFocus();
	});

	it('should return focus to the element that opened it when the trigger has an inline callback ref', async () => {
		function InlineRefPopup() {
			const [isOpen, setIsOpen] = useState(false);
			return (
				<>
					<button type="button" onClick={() => setIsOpen(true)}>
						Open from elsewhere
					</button>
					<Popup
						isOpen={isOpen}
						onClose={() => setIsOpen(false)}
						role="dialog"
						label="Details"
						testId="first"
						trigger={({ ref, ...triggerProps }) => (
							<button
								type="button"
								{...triggerProps}
								// A new callback on each render: React sets it to `null`, then to the node, in
								// every commit.
								ref={(node) => {
									if (typeof ref === 'function') {
										ref(node);
									}
								}}
							>
								Trigger
							</button>
						)}
						content={() => <button type="button">Inside</button>}
					/>
				</>
			);
		}
		render(<InlineRefPopup />);
		const opener = getButton('Open from elsewhere');
		opener.focus();
		await userEvent.keyboard('{Enter}');
		expect(getButton('Inside')).toHaveFocus();

		await userEvent.keyboard('{Escape}');
		await flushTasks();

		expect(screen.queryByTestId('first--container')).not.toBeInTheDocument();
		expect(opener).toHaveFocus();
	});

	it('should return focus after the commit that closes it, so blur handlers in it run outside the commit', async () => {
		const consoleError = jest.spyOn(console, 'error');
		function Field({ onBlur, onUnmount }: { onBlur: () => void; onUnmount: () => void }) {
			// As a form field does: its form updates state on blur and when the field unmounts.
			useEffect(() => onUnmount, [onUnmount]);
			return <input aria-label="Limit" onBlur={onBlur} />;
		}
		function FieldPopup() {
			const [isOpen, setIsOpen] = useState(false);
			const [, setUnmountCount] = useState(0);
			const [, setBlurCount] = useState(0);
			const [, setCloseCount] = useState(0);
			const onUnmount = useCallback(() => setUnmountCount((count) => count + 1), []);
			const onBlur = useCallback(() => setBlurCount((count) => count + 1), []);
			// An update in the commit that closes the popup, after the focus return (a passive effect).
			useEffect(() => {
				if (!isOpen) {
					setCloseCount((count) => count + 1);
				}
			}, [isOpen]);
			return (
				<Popup
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
					role="dialog"
					label="Details"
					testId="first"
					trigger={(triggerProps) => (
						<button type="button" {...triggerProps} onClick={() => setIsOpen(true)}>
							Trigger
						</button>
					)}
					content={() => <Field onBlur={onBlur} onUnmount={onUnmount} />}
				/>
			);
		}
		const user = userEvent.setup();
		render(<FieldPopup />);
		getButton('Trigger').focus();
		await user.keyboard('{Enter}');
		const field = screen.getByRole('textbox', { name: 'Limit' });
		await user.type(field, '200');

		await user.keyboard('{Escape}');
		await flushTasks();

		expect(screen.queryByTestId('first--container')).not.toBeInTheDocument();
		expect(getButton('Trigger')).toHaveFocus();
		// The blur of the field sends a `change` event through an `act()` of its own. Inside React's
		// commit, that would end the `act()` around the close, and the rest of the close would warn.
		const actWarnings = consoleError.mock.calls.filter(([message]) =>
			String(message).includes('not wrapped in act'),
		);
		consoleError.mockRestore();
		expect(actWarnings).toEqual([]);
	});

	it('should return focus so that React focus handlers around the trigger see it', async () => {
		const onFocusTarget = jest.fn();
		function HoverCard() {
			const [isOpen, setIsOpen] = useState(false);
			return (
				// As a card that shows its actions while focus is in it.
				<div onFocus={(event) => onFocusTarget(event.target)}>
					<Popup
						isOpen={isOpen}
						onClose={() => setIsOpen(false)}
						role="dialog"
						label="Details"
						testId="first"
						trigger={(triggerProps) => (
							<button type="button" {...triggerProps} onClick={() => setIsOpen(true)}>
								More actions
							</button>
						)}
						content={() => <button type="button">Inside</button>}
					/>
				</div>
			);
		}
		render(<HoverCard />);
		getButton('More actions').focus();
		await userEvent.keyboard('{Enter}');
		expect(getButton('Inside')).toHaveFocus();
		onFocusTarget.mockClear();

		await userEvent.keyboard('{Escape}');
		await flushTasks();

		expect(getButton('More actions')).toHaveFocus();
		// React drops focus events that the browser sends during its commit.
		expect(onFocusTarget).toHaveBeenCalledWith(getButton('More actions'));
	});

	/**
	 * `shouldReturnFocus={false}` is a no-op on the top layer: focus returns as the platform returns it.
	 * A consumer that wants another target moves focus itself, and the return leaves it there.
	 */
	describe('shouldReturnFocus={false}', () => {
		function NoReturnPopup({ onClose }: { onClose?: () => void }) {
			const [isOpen, setIsOpen] = useState(false);
			return (
				<>
					<Popup
						isOpen={isOpen}
						onClose={() => {
							onClose?.();
							setIsOpen(false);
						}}
						shouldReturnFocus={false}
						role="dialog"
						label="Details"
						testId="first"
						trigger={(triggerProps) => (
							<button
								type="button"
								{...triggerProps}
								onClick={() => setIsOpen((current) => !current)}
							>
								Trigger
							</button>
						)}
						content={() => (
							<button type="button" onClick={() => setIsOpen(false)}>
								Done
							</button>
						)}
					/>
					<button type="button">Elsewhere</button>
				</>
			);
		}

		async function openByKeyboard() {
			getButton('Trigger').focus();
			await userEvent.keyboard('{Enter}');
			expect(getButton('Done')).toHaveFocus();
		}

		it('should still return focus to the trigger after Escape', async () => {
			render(<NoReturnPopup />);
			await openByKeyboard();

			await userEvent.keyboard('{Escape}');
			await flushTasks();

			expect(screen.queryByTestId('first--container')).not.toBeInTheDocument();
			expect(getButton('Trigger')).toHaveFocus();
		});

		it('should still return focus to the trigger after a close from isOpen', async () => {
			render(<NoReturnPopup />);
			await openByKeyboard();

			await userEvent.keyboard('{Enter}');
			await flushTasks();

			expect(screen.queryByTestId('first--container')).not.toBeInTheDocument();
			expect(getButton('Trigger')).toHaveFocus();
		});

		it('should leave focus where onClose moved it', async () => {
			render(<NoReturnPopup onClose={() => getButton('Elsewhere').focus()} />);
			await openByKeyboard();

			await userEvent.keyboard('{Escape}');
			await flushTasks();

			expect(screen.queryByTestId('first--container')).not.toBeInTheDocument();
			expect(getButton('Elsewhere')).toHaveFocus();
		});
	});

	describe('nested popups', () => {
		function NestedPopups({
			shouldOuterAccept,
			shouldInnerAccept,
			onOuterClose,
			onInnerClose,
		}: {
			shouldOuterAccept: boolean;
			shouldInnerAccept: boolean;
			onOuterClose: (event: TCloseEvent) => void;
			onInnerClose: (event: TCloseEvent) => void;
		}) {
			return (
				<>
					<button type="button">Outside</button>
					<TogglePopup
						testId="outer"
						label="Outer"
						shouldAccept={shouldOuterAccept}
						onClose={onOuterClose}
					>
						<TogglePopup
							testId="inner"
							label="Inner"
							shouldAccept={shouldInnerAccept}
							onClose={onInnerClose}
						/>
					</TogglePopup>
				</>
			);
		}

		async function openBoth() {
			await userEvent.click(getButton('Outer trigger'));
			await userEvent.click(getButton('Inner trigger'));
			expect(getContainer('outer')).toBeVisible();
			expect(getContainer('inner')).toBeVisible();
		}

		it('should hide the inner popup at once when the outer popup closes from isOpen', async () => {
			const onInnerClose = jest.fn();
			function CloseOuterFromInner() {
				const [isOuterOpen, setIsOuterOpen] = useState(true);
				const [isInnerOpen, setIsInnerOpen] = useState(true);
				return (
					<Popup
						isOpen={isOuterOpen}
						onClose={() => setIsOuterOpen(false)}
						role="dialog"
						label="Outer"
						testId="outer"
						trigger={(triggerProps) => (
							<button type="button" {...triggerProps}>
								Outer trigger
							</button>
						)}
						content={() => (
							<Popup
								isOpen={isInnerOpen}
								onClose={(event) => {
									onInnerClose(event);
									setIsInnerOpen(false);
								}}
								role="dialog"
								label="Inner"
								testId="inner"
								trigger={(triggerProps) => (
									<button type="button" {...triggerProps}>
										Inner trigger
									</button>
								)}
								content={() => (
									// For example a menu item in a nested popup that closes the whole menu.
									<button type="button" onClick={() => setIsOuterOpen(false)}>
										Pick
									</button>
								)}
							/>
						)}
					/>
				);
			}
			render(<CloseOuterFromInner />);
			const inner = getContainer('inner');
			expect(isPopoverOpen(inner)).toBe(true);

			fireEvent.click(getButton('Pick'));

			// Before the outer popup's exit ends and its content unmounts: the inner popup does not stay
			// open in the top layer, and does not take the next Escape.
			expect(isPopoverOpen(getContainer('outer'))).toBe(false);
			expect(isPopoverOpen(inner)).toBe(false);
			await flushTasks();
			// Its owner hears of the close, as for a light dismiss.
			expect(onInnerClose).toHaveBeenCalledTimes(1);
		});

		it('should not ask either popup on a press inside the inner popup', async () => {
			const onOuterClose = jest.fn();
			const onInnerClose = jest.fn();
			render(
				<NestedPopups
					shouldOuterAccept
					shouldInnerAccept
					onOuterClose={onOuterClose}
					onInnerClose={onInnerClose}
				/>,
			);
			await openBoth();

			await userEvent.click(getButton('Inner inside'));
			await flushTasks();

			expect(onOuterClose).not.toHaveBeenCalled();
			expect(onInnerClose).not.toHaveBeenCalled();
			expect(getContainer('outer')).toBeVisible();
			expect(getContainer('inner')).toBeVisible();
		});

		it('should ask only the inner popup on a press in the outer popup, and keep it open when it refuses', async () => {
			const onOuterClose = jest.fn();
			const onInnerClose = jest.fn();
			render(
				<NestedPopups
					shouldOuterAccept
					shouldInnerAccept={false}
					onOuterClose={onOuterClose}
					onInnerClose={onInnerClose}
				/>,
			);
			await openBoth();

			await userEvent.click(getButton('Outer inside'));
			await flushTasks();

			expect(onOuterClose).not.toHaveBeenCalled();
			expect(onInnerClose).toHaveBeenCalledTimes(1);
			expect(getContainer('outer')).toBeVisible();
			expect(getContainer('inner')).toBeVisible();
		});

		it('should ask both popups on one press outside both, and keep the one that refuses', async () => {
			const onOuterClose = jest.fn();
			const onInnerClose = jest.fn();
			render(
				<NestedPopups
					shouldOuterAccept={false}
					shouldInnerAccept
					onOuterClose={onOuterClose}
					onInnerClose={onInnerClose}
				/>,
			);
			await openBoth();

			await userEvent.click(getButton('Outside'));
			await flushTasks();

			expect(onOuterClose).toHaveBeenCalledTimes(1);
			expect(onInnerClose).toHaveBeenCalledTimes(1);
			expect(getContainer('outer')).toBeVisible();
			expect(screen.queryByTestId('inner--container')).not.toBeInTheDocument();
		});

		it('should ask one popup per Escape, innermost first, also when it refuses', async () => {
			const onOuterClose = jest.fn();
			const onInnerClose = jest.fn();
			render(
				<NestedPopups
					shouldOuterAccept
					shouldInnerAccept={false}
					onOuterClose={onOuterClose}
					onInnerClose={onInnerClose}
				/>,
			);
			await openBoth();
			expect(getButton('Inner inside')).toHaveFocus();

			await userEvent.keyboard('{Escape}');
			await flushTasks();

			// The inner popup took the Escape and refused, so the outer popup was not asked.
			expect(onInnerClose).toHaveBeenCalledTimes(1);
			expect(onOuterClose).not.toHaveBeenCalled();
			expect(getContainer('outer')).toBeVisible();
			expect(getContainer('inner')).toBeVisible();
		});

		it('should close one popup per accepted Escape, and return focus to each trigger', async () => {
			render(
				<NestedPopups
					shouldOuterAccept
					shouldInnerAccept
					onOuterClose={jest.fn()}
					onInnerClose={jest.fn()}
				/>,
			);
			await openBoth();

			await userEvent.keyboard('{Escape}');
			await flushTasks();

			expect(screen.queryByTestId('inner--container')).not.toBeInTheDocument();
			expect(getContainer('outer')).toBeVisible();
			expect(getButton('Inner trigger')).toHaveFocus();

			await userEvent.keyboard('{Escape}');
			await flushTasks();

			expect(screen.queryByTestId('outer--container')).not.toBeInTheDocument();
			expect(getButton('Outer trigger')).toHaveFocus();
		});
	});

	describe('sibling popups', () => {
		it('should ask the open popup on a press on the trigger of another popup', async () => {
			const onFirstClose = jest.fn();
			render(
				<>
					<TogglePopup testId="first" label="First" shouldAccept onClose={onFirstClose} />
					<TogglePopup testId="second" label="Second" shouldAccept />
				</>,
			);
			await userEvent.click(getButton('First trigger'));

			await userEvent.click(getButton('Second trigger'));
			await flushTasks();

			expect(onFirstClose).toHaveBeenCalledTimes(1);
			expect(screen.queryByTestId('first--container')).not.toBeInTheDocument();
			expect(getContainer('second')).toBeVisible();
		});

		it('should keep the first popup open when it refuses, while the other popup opens', async () => {
			const onFirstClose = jest.fn();
			render(
				<>
					<TogglePopup testId="first" label="First" shouldAccept={false} onClose={onFirstClose} />
					<TogglePopup testId="second" label="Second" shouldAccept />
				</>,
			);
			await userEvent.click(getButton('First trigger'));

			await userEvent.click(getButton('Second trigger'));
			await flushTasks();

			expect(onFirstClose).toHaveBeenCalledTimes(1);
			expect(getContainer('first')).toBeVisible();
			expect(getContainer('second')).toBeVisible();
		});
	});
});
