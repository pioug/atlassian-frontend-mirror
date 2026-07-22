import React, { useEffect, useState } from 'react';

import { OpenLayerObserver } from '@atlaskit/layering/open-layer-observer';
import { useOpenLayerObserver } from '@atlaskit/layering/use-open-layer-observer';
import { render, screen, userEvent } from '@atlassian/testing-library';

import { Popover } from '../../src/entry-points/popover';

/**
 * Renders the open layer count as text so tests can assert declaratively
 * on what the observer reports, without imperatively reading the API.
 * Subscribes to onChange so it re-renders whenever the count changes.
 */
function LayerCountDisplay() {
	const api = useOpenLayerObserver();
	const [totalCount, setTotalCount] = useState(0);
	const [popupCount, setPopupCount] = useState(0);

	useEffect(() => {
		if (!api) {
			return;
		}

		// Sync immediately in case counts changed before this effect ran
		setTotalCount(api.getCount());
		setPopupCount(api.getCount({ type: 'popup' }));

		// Subscribe to future changes
		return api.onChange(() => {
			setTotalCount(api.getCount());
			setPopupCount(api.getCount({ type: 'popup' }));
		});
	}, [api]);

	return (
		<div>
			<span data-testid="total-count">{totalCount}</span>
			<span data-testid="popup-count">{popupCount}</span>
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

it('should capture and report a11y violations', async () => {
	const { container } = render(
		<OpenLayerObserver>
			<Popover isOpen={true} role="dialog" label="a11y-test" onClose={() => {}}>
				Popover content
			</Popover>
		</OpenLayerObserver>,
	);
	await expect(container).toBeAccessible();
});

describe('Popover primitive - open layer observer', () => {
	it('registers with the observer as type "popup" when open with a popup role', () => {
		render(
			<OpenLayerObserver>
				<LayerCountDisplay />
				<Popover isOpen={true} role="dialog" label="Test popover" onClose={() => {}}>
					Popover content
				</Popover>
			</OpenLayerObserver>,
		);

		expect(screen.getByTestId('total-count')).toHaveTextContent('1');
		expect(screen.getByTestId('popup-count')).toHaveTextContent('1');
	});

	it('does not register as type "popup" when role is not a popup role', () => {
		render(
			<OpenLayerObserver>
				<LayerCountDisplay />
				<Popover isOpen={true} role="note" label="Informational popover" onClose={() => {}}>
					Note content
				</Popover>
			</OpenLayerObserver>,
		);

		// Passive roles still register with the observer (total count goes up)
		// but are not classified as 'popup' so the typed count stays at 0.
		expect(screen.getByTestId('popup-count')).toHaveTextContent('0');
	});

	it('does not register with the observer when closed', () => {
		render(
			<OpenLayerObserver>
				<LayerCountDisplay />
				<Popover isOpen={false} role="dialog" label="Test popover" onClose={() => {}}>
					Popover content
				</Popover>
			</OpenLayerObserver>,
		);

		expect(screen.getByTestId('total-count')).toHaveTextContent('0');
		expect(screen.getByTestId('popup-count')).toHaveTextContent('0');
	});

	it('deregisters from the observer when isOpen transitions to false', () => {
		const { rerender } = render(
			<OpenLayerObserver>
				<LayerCountDisplay />
				<Popover isOpen={true} role="dialog" label="Test popover" onClose={() => {}}>
					Popover content
				</Popover>
			</OpenLayerObserver>,
		);

		expect(screen.getByTestId('popup-count')).toHaveTextContent('1');

		rerender(
			<OpenLayerObserver>
				<LayerCountDisplay />
				<Popover isOpen={false} role="dialog" label="Test popover" onClose={() => {}}>
					Popover content
				</Popover>
			</OpenLayerObserver>,
		);

		expect(screen.getByTestId('popup-count')).toHaveTextContent('0');
	});

	it('closes when the observer requests closeLayers()', async () => {
		const user = userEvent.setup();
		const onClose = jest.fn();

		render(
			<OpenLayerObserver>
				<CloseLayersButton />
				<Popover isOpen={true} role="dialog" label="Test popover" onClose={onClose}>
					Popover content
				</Popover>
			</OpenLayerObserver>,
		);

		await user.click(screen.getByRole('button', { name: 'Close layers' }));

		// Unlike Dialog (which is modal and persistent), Popover honors
		// closeLayers() by invoking onClose with reason "programmatic" so
		// the consumer can transition isOpen to false.
		expect(onClose).toHaveBeenCalledWith({ reason: 'programmatic' });
	});
});
