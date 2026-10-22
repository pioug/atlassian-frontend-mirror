import React, { useLayoutEffect, useRef, useState } from 'react';

import { bind } from 'bind-event-listener';
import invariant from 'tiny-invariant';

import { screen } from '@atlassian/testing-library/screen';
import { act, render } from '@atlassian/testing-library/testing-library/react';

import { Dialog } from '../../src/dialog/dialog-content';
import { hasOpenDialogOrPopover } from '../../src/page-surface/has-open-dialog-or-popover';
import { requestClosePopovers } from '../../src/page-surface/request-close-popovers';
import { Popover } from '../../src/popover/popover';

/**
 * Waits for the queued `toggle` and `close` tasks. The polyfill dispatches
 * them with `setTimeout`, as browsers do.
 */
async function flushToggleTasks() {
	await act(async () => {
		await new Promise((resolve) => setTimeout(resolve, 0));
	});
}

function getContainer({ testId }: { testId: string }): HTMLElement {
	return screen.getByTestId(testId);
}

/**
 * A plain `<dialog>` opened with `show()`, so it is open but not modal.
 */
function NonModalDialog() {
	const ref = useRef<HTMLDialogElement>(null);
	useLayoutEffect(() => {
		const dialog = ref.current;
		invariant(dialog);
		dialog.show();
		return () => {
			dialog.close();
		};
	}, []);
	return <dialog ref={ref} aria-label="Non-modal dialog" />;
}

it('should capture and report a11y violations', async () => {
	const { container } = render(
		<Popover isOpen={true} role="dialog" label="a11y-test" onClose={() => {}}>
			Popover content
		</Popover>,
	);
	await expect(container).toBeAccessible();
});

describe('hasOpenDialogOrPopover()', () => {
	it('returns false when nothing is open', () => {
		render(<div>Nothing open</div>);

		expect(hasOpenDialogOrPopover()).toBe(false);
	});

	it('counts an open popover that has onClose', () => {
		render(
			<Popover isOpen={true} role="dialog" label="Test popover" onClose={() => {}}>
				Popover content
			</Popover>,
		);

		expect(hasOpenDialogOrPopover()).toBe(true);
	});

	it('does not count an open popover without onClose', () => {
		render(
			<Popover isOpen={true} mode="manual" role="dialog" label="Test popover">
				Popover content
			</Popover>,
		);

		expect(hasOpenDialogOrPopover()).toBe(false);
	});

	it('counts a popover once onClose is provided', () => {
		const { rerender } = render(
			<Popover isOpen={true} mode="manual" role="dialog" label="Test popover">
				Popover content
			</Popover>,
		);

		expect(hasOpenDialogOrPopover()).toBe(false);

		rerender(
			<Popover isOpen={true} mode="manual" role="dialog" label="Test popover" onClose={() => {}}>
				Popover content
			</Popover>,
		);

		expect(hasOpenDialogOrPopover()).toBe(true);
	});

	it('does not count an open tooltip, even with onClose', () => {
		render(
			<Popover isOpen={true} mode="hint" role="tooltip" onClose={() => {}}>
				Tooltip content
			</Popover>,
		);

		expect(hasOpenDialogOrPopover()).toBe(false);
	});

	it('does not count a closed popover', () => {
		render(
			<Popover isOpen={false} role="dialog" label="Test popover" onClose={() => {}}>
				Popover content
			</Popover>,
		);

		expect(hasOpenDialogOrPopover()).toBe(false);
	});

	it('stops counting a popover when isOpen transitions to false', () => {
		const { rerender } = render(
			<Popover isOpen={true} role="dialog" label="Test popover" onClose={() => {}}>
				Popover content
			</Popover>,
		);

		expect(hasOpenDialogOrPopover()).toBe(true);

		rerender(
			<Popover isOpen={false} role="dialog" label="Test popover" onClose={() => {}}>
				Popover content
			</Popover>,
		);

		expect(hasOpenDialogOrPopover()).toBe(false);
	});

	it('counts an open dialog', () => {
		render(
			<Dialog isOpen={true} onClose={() => {}} label="Test dialog">
				<button type="button">Close</button>
			</Dialog>,
		);

		expect(hasOpenDialogOrPopover()).toBe(true);
	});

	it('does not count a closed dialog', () => {
		render(
			<Dialog isOpen={false} onClose={() => {}} label="Test dialog">
				<button type="button">Close</button>
			</Dialog>,
		);

		expect(hasOpenDialogOrPopover()).toBe(false);
	});

	describe('type: "modal"', () => {
		it('counts an open modal dialog', () => {
			render(
				<Dialog isOpen={true} onClose={() => {}} label="Test dialog">
					<button type="button">Close</button>
				</Dialog>,
			);

			expect(hasOpenDialogOrPopover({ type: 'modal' })).toBe(true);
		});

		it('does not count an open non-modal dialog', () => {
			render(<NonModalDialog />);

			expect(hasOpenDialogOrPopover()).toBe(true);
			expect(hasOpenDialogOrPopover({ type: 'modal' })).toBe(false);
		});

		it('does not count an open closable popover', () => {
			render(
				<Popover isOpen={true} role="dialog" label="Test popover" onClose={() => {}}>
					Popover content
				</Popover>,
			);

			expect(hasOpenDialogOrPopover()).toBe(true);
			expect(hasOpenDialogOrPopover({ type: 'modal' })).toBe(false);
		});
	});

	it('only counts layers inside `within`', () => {
		render(
			<>
				<div data-testid="inside">
					<Popover isOpen={true} role="dialog" label="Test popover" onClose={() => {}}>
						Popover content
					</Popover>
				</div>
				<div data-testid="outside" />
			</>,
		);

		expect(hasOpenDialogOrPopover({ within: getContainer({ testId: 'inside' }) })).toBe(true);
		expect(hasOpenDialogOrPopover({ within: getContainer({ testId: 'outside' }) })).toBe(false);
	});
});

/**
 * A `Dialog` that closes when it asks to.
 */
function ClosingDialog() {
	const [isOpen, setIsOpen] = useState(true);
	return (
		<Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} label="Test dialog">
			<button type="button">Close</button>
		</Dialog>
	);
}

// An Escape keydown, as a browser sends it.
function fireEscape({ target }: { target: Element }) {
	act(() => {
		target.dispatchEvent(
			new KeyboardEvent('keydown', {
				key: 'Escape',
				bubbles: true,
				cancelable: true,
				composed: true,
			}),
		);
	});
}

type TEscapeSnapshot = { isLayerOpen: boolean; isDefaultPrevented: boolean };

/**
 * Binds a `window` `keydown` listener that records what it sees for each Escape.
 */
function recordEscapes(): { snapshots: TEscapeSnapshot[]; unbind: () => void } {
	const snapshots: TEscapeSnapshot[] = [];
	const unbind = bind(window, {
		type: 'keydown',
		listener(event) {
			if (event.key === 'Escape') {
				snapshots.push({
					isLayerOpen: hasOpenDialogOrPopover(),
					isDefaultPrevented: event.defaultPrevented,
				});
			}
		},
	});
	return { snapshots, unbind };
}

/**
 * `Dialog` takes Escape in its own `window` `keydown` listener, and closes during that listener.
 * Listeners on `window` run in the order they were bound.
 */
describe('a window Escape listener and a closing Dialog', () => {
	it('sees the dialog when it was bound before the dialog opened', () => {
		const { snapshots, unbind } = recordEscapes();
		render(<ClosingDialog />);

		fireEscape({ target: screen.getByRole('dialog', { hidden: true }) });
		unbind();

		expect(snapshots).toEqual([{ isLayerOpen: true, isDefaultPrevented: false }]);
	});

	it('sees a prevented event, but no dialog, when it was bound after the dialog opened', () => {
		render(<ClosingDialog />);
		const { snapshots, unbind } = recordEscapes();

		fireEscape({ target: screen.getByRole('dialog', { hidden: true }) });
		unbind();

		expect(snapshots).toEqual([{ isLayerOpen: false, isDefaultPrevented: true }]);
	});
});

describe('requestClosePopovers()', () => {
	it('calls onClose with reason "programmatic"', () => {
		const onClose = jest.fn();
		render(
			<Popover isOpen={true} role="dialog" label="Test popover" onClose={onClose}>
				Popover content
			</Popover>,
		);

		act(() => {
			requestClosePopovers();
		});

		expect(onClose).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledWith({ reason: 'programmatic' });
	});

	it('does not hide the popover when the consumer ignores the request', async () => {
		render(
			<Popover isOpen={true} role="dialog" label="Test popover" onClose={() => {}}>
				Popover content
			</Popover>,
		);

		act(() => {
			requestClosePopovers();
		});
		await flushToggleTasks();

		expect(screen.getByRole('dialog', { name: 'Test popover' })).toBeInTheDocument();
		expect(hasOpenDialogOrPopover()).toBe(true);
	});

	it('does not call onClose of a closed popover', () => {
		const onClose = jest.fn();
		render(
			<Popover isOpen={false} role="dialog" label="Test popover" onClose={onClose}>
				Popover content
			</Popover>,
		);

		act(() => {
			requestClosePopovers();
		});

		expect(onClose).not.toHaveBeenCalled();
	});

	it('does not touch a popover without onClose', async () => {
		render(
			<Popover isOpen={true} mode="manual" role="dialog" label="Test popover">
				Popover content
			</Popover>,
		);

		act(() => {
			requestClosePopovers();
		});
		await flushToggleTasks();

		expect(screen.getByRole('dialog', { name: 'Test popover' })).toBeInTheDocument();
	});

	it('does not ask dialogs to close', () => {
		const onClose = jest.fn();
		render(
			<Dialog isOpen={true} onClose={onClose} label="Test dialog">
				<button type="button">Close</button>
			</Dialog>,
		);

		act(() => {
			requestClosePopovers();
		});

		expect(onClose).not.toHaveBeenCalled();
		expect(hasOpenDialogOrPopover({ type: 'modal' })).toBe(true);
	});

	it('only asks popovers inside `within`', () => {
		const onInsideClose = jest.fn();
		const onOutsideClose = jest.fn();
		render(
			<>
				<div data-testid="inside">
					<Popover isOpen={true} mode="manual" role="dialog" label="Inside" onClose={onInsideClose}>
						Inside content
					</Popover>
				</div>
				<div data-testid="outside">
					<Popover
						isOpen={true}
						mode="manual"
						role="dialog"
						label="Outside"
						onClose={onOutsideClose}
					>
						Outside content
					</Popover>
				</div>
			</>,
		);

		act(() => {
			requestClosePopovers({ within: getContainer({ testId: 'inside' }) });
		});

		expect(onInsideClose).toHaveBeenCalledWith({ reason: 'programmatic' });
		expect(onOutsideClose).not.toHaveBeenCalled();
	});
});
