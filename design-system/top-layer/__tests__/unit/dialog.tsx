import React, { useEffect, useState } from 'react';

import { bind } from 'bind-event-listener';

import { OpenLayerObserver } from '@atlaskit/layering/open-layer-observer';
import { useOpenLayerObserver } from '@atlaskit/layering/use-open-layer-observer';
import { act, fireEvent, render, screen, userEvent, waitFor } from '@atlassian/testing-library';

import { Dialog } from '../../src/dialog/dialog-content';

// ── Observer test helpers ──

/**
 * Renders the open layer count as text so tests can assert declaratively
 * on what the observer reports, without imperatively reading the API.
 * Subscribes to onChange so it re-renders whenever the count changes.
 */
function LayerCountDisplay() {
	const api = useOpenLayerObserver();
	const [totalCount, setTotalCount] = useState(0);
	const [modalCount, setModalCount] = useState(0);

	useEffect(() => {
		if (!api) {
			return;
		}

		// Sync immediately in case counts changed before this effect ran
		setTotalCount(api.getCount());
		setModalCount(api.getCount({ type: 'modal' }));

		// Subscribe to future changes
		return api.onChange(() => {
			setTotalCount(api.getCount());
			setModalCount(api.getCount({ type: 'modal' }));
		});
	}, [api]);

	return (
		<div>
			<span data-testid="total-count">{totalCount}</span>
			<span data-testid="modal-count">{modalCount}</span>
		</div>
	);
}

/**
 * A button that calls closeLayers() when clicked, allowing tests to trigger
 * programmatic close without imperatively holding the API reference.
 */
function CloseLayersButton() {
	const api = useOpenLayerObserver();
	return (
		<button type="button" onClick={() => api?.closeLayers()}>
			Close layers
		</button>
	);
}

function fireDialogCancel(dialog: HTMLElement) {
	const event = new Event('cancel', { cancelable: true });
	fireEvent(dialog, event);
	return event;
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

describe('Dialog primitive', () => {
	it('opens dialog when isOpen is true', () => {
		render(
			<Dialog onClose={() => {}} isOpen={true} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		const dialogEl = screen.getByRole('dialog', { hidden: true });
		expect(dialogEl).toHaveAttribute('open');
		expect(dialogEl).not.toHaveAttribute('closedby');
	});

	it('does not render the dialog element when isOpen is false', async () => {
		render(
			<Dialog onClose={() => {}} isOpen={false} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		// Host element is unmounted when not open so it does not leave an
		// empty role="dialog" in the accessibility tree.
		await waitFor(() =>
			expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument(),
		);
	});

	it('closes dialog on unmount when dialog is open', () => {
		const { unmount } = render(
			<Dialog onClose={() => {}} isOpen={true} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		const dialogEl = screen.getByRole('dialog', { hidden: true });
		expect(dialogEl).toHaveAttribute('open');

		unmount();

		expect(dialogEl).not.toHaveAttribute('open');
	});

	it('closes dialog when isOpen transitions to false', async () => {
		const { rerender } = render(
			<Dialog onClose={() => {}} isOpen={true} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		expect(screen.getByRole('dialog', { hidden: true })).toHaveAttribute('open');

		rerender(
			<Dialog onClose={() => {}} isOpen={false} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		// Without an animation preset, the host element unmounts synchronously
		// when isOpen flips to false.
		await waitFor(() =>
			expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument(),
		);
	});

	it('opens dialog when isOpen transitions from false to true', async () => {
		const { rerender } = render(
			<Dialog onClose={() => {}} isOpen={false} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		await waitFor(() =>
			expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument(),
		);

		rerender(
			<Dialog onClose={() => {}} isOpen={true} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		expect(screen.getByRole('dialog', { hidden: true })).toHaveAttribute('open');
	});

	it('closes before reporting an overlay click', async () => {
		const dialogRef = React.createRef<HTMLDialogElement>();
		const onClose = jest.fn(() => expect(dialogRef.current?.open).toBe(false));

		render(
			<Dialog ref={dialogRef} onClose={onClose} isOpen={true} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		const dialogEl = screen.getByRole('dialog', { hidden: true });
		const closeToggle = waitForDialogCloseToggle({ dialog: dialogEl });
		fireEvent.click(dialogEl);
		await act(async () => {
			await closeToggle;
		});

		expect(onClose).toHaveBeenCalledWith({ reason: 'overlay-click' });
		expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument();
	});

	it('reports Escape after native dismissal when dismissedBy is "escape"', async () => {
		const dialogRef = React.createRef<HTMLDialogElement>();
		const onClose = jest.fn(() => expect(dialogRef.current?.open).toBe(false));

		render(
			<Dialog
				ref={dialogRef}
				onClose={onClose}
				isOpen={true}
				label="Test dialog"
				dismissedBy="escape"
			>
				<p>Content</p>
			</Dialog>,
		);

		const dialogEl = screen.getByRole('dialog', { hidden: true }) as HTMLDialogElement;
		expect(dialogEl).not.toHaveAttribute('closedby');

		fireEvent.click(dialogEl);
		expect(onClose).not.toHaveBeenCalled();

		const cancelEvent = fireDialogCancel(dialogEl);
		expect(cancelEvent.defaultPrevented).toBe(false);
		expect(onClose).not.toHaveBeenCalled();

		// jsdom does not perform the cancel event's native default action.
		const closeToggle = waitForDialogCloseToggle({ dialog: dialogEl });
		await act(async () => {
			dialogEl.close();
			await closeToggle;
		});

		expect(onClose).toHaveBeenCalledWith({ reason: 'escape' });
	});

	it('does not request close from user actions when dismissedBy is "none"', () => {
		const onClose = jest.fn();

		render(
			<Dialog onClose={onClose} isOpen={true} label="Test dialog" dismissedBy="none">
				<p>Content</p>
			</Dialog>,
		);

		const dialogEl = screen.getByRole('dialog', { hidden: true });
		expect(dialogEl).not.toHaveAttribute('closedby');

		fireEvent.click(dialogEl);
		const cancelEvent = fireDialogCancel(dialogEl);

		expect(cancelEvent.defaultPrevented).toBe(true);
		expect(onClose).not.toHaveBeenCalled();
	});

	it('does not report a close reason when the dialog closes programmatically', async () => {
		const onClose = jest.fn();

		render(
			<Dialog onClose={onClose} isOpen={true} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		const dialogEl = screen.getByRole('dialog', { hidden: true }) as HTMLDialogElement;
		const closeToggle = waitForDialogCloseToggle({ dialog: dialogEl });
		await act(async () => {
			dialogEl.close();
			await closeToggle;
		});

		expect(onClose).not.toHaveBeenCalled();
		expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument();
	});

	it('does NOT fire onClose when a child element is clicked', () => {
		const onClose = jest.fn();

		render(
			<Dialog onClose={onClose} isOpen={true} label="Test dialog">
				<p>Click me</p>
			</Dialog>,
		);

		fireEvent.click(screen.getByText('Click me'));
		expect(onClose).not.toHaveBeenCalled();
	});

	it('applies style prop to the dialog element', () => {
		const testStyle = { width: '800px' };
		render(
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- testing style passthrough
			<Dialog onClose={() => {}} isOpen={true} label="Test dialog" style={testStyle}>
				<p>Content</p>
			</Dialog>,
		);

		const dialogEl = screen.getByRole('dialog', { hidden: true });
		expect(dialogEl).toHaveStyle(testStyle);
	});

	it('should be accessible', async () => {
		const { container } = render(
			<Dialog onClose={() => {}} isOpen={true} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		await expect(container).toBeAccessible();
	});
});

describe('Dialog primitive - open layer observer', () => {
	it('registers with the observer as type "modal" when open', () => {
		render(
			<OpenLayerObserver>
				<LayerCountDisplay />
				<Dialog onClose={() => {}} isOpen={true} label="Test dialog">
					Dialog content
				</Dialog>
			</OpenLayerObserver>,
		);

		expect(screen.getByTestId('total-count')).toHaveTextContent('1');
		expect(screen.getByTestId('modal-count')).toHaveTextContent('1');
	});

	it('does not register with the observer when closed', () => {
		render(
			<OpenLayerObserver>
				<LayerCountDisplay />
				<Dialog onClose={() => {}} isOpen={false} label="Test dialog">
					Dialog content
				</Dialog>
			</OpenLayerObserver>,
		);

		expect(screen.getByTestId('total-count')).toHaveTextContent('0');
	});

	it('deregisters from the observer when isOpen transitions to false', () => {
		const { rerender } = render(
			<OpenLayerObserver>
				<LayerCountDisplay />
				<Dialog onClose={() => {}} isOpen={true} label="Test dialog">
					Dialog content
				</Dialog>
			</OpenLayerObserver>,
		);

		expect(screen.getByTestId('total-count')).toHaveTextContent('1');

		rerender(
			<OpenLayerObserver>
				<LayerCountDisplay />
				<Dialog onClose={() => {}} isOpen={false} label="Test dialog">
					Dialog content
				</Dialog>
			</OpenLayerObserver>,
		);

		expect(screen.getByTestId('total-count')).toHaveTextContent('0');
	});

	it('does not close when the observer requests closeLayers()', async () => {
		const user = userEvent.setup();
		const onClose = jest.fn();

		render(
			<OpenLayerObserver>
				<CloseLayersButton />
				<Dialog onClose={onClose} isOpen={true} label="Test dialog">
					Dialog content
				</Dialog>
			</OpenLayerObserver>,
		);

		await user.click(screen.getByRole('button', { name: 'Close layers' }));

		// Modals are intentionally persistent - they should not be dismissed
		// by closeLayers(). The observer onClose is a no-op.
		expect(onClose).not.toHaveBeenCalled();
	});
});
