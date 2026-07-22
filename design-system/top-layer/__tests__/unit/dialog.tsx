import React, { useEffect, useState } from 'react';

import { OpenLayerObserver } from '@atlaskit/layering/open-layer-observer';
import { useOpenLayerObserver } from '@atlaskit/layering/use-open-layer-observer';
import { fireEvent, render, screen, userEvent, waitFor } from '@atlassian/testing-library';

import { Dialog } from '../../src/entry-points/dialog';

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

describe('Dialog primitive', () => {
	it('opens dialog when isOpen is true', () => {
		render(
			<Dialog onClose={() => {}} isOpen={true} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		const dialogEl = screen.getByRole('dialog', { hidden: true });
		expect(dialogEl).toHaveAttribute('open');
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

	it('fires onClose with reason "overlay-click" when dialog element itself is clicked', () => {
		const onClose = jest.fn();

		render(
			<Dialog onClose={onClose} isOpen={true} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		const dialogEl = screen.getByRole('dialog', { hidden: true });
		fireEvent.click(dialogEl);

		expect(onClose).toHaveBeenCalledWith({ reason: 'overlay-click' });
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
