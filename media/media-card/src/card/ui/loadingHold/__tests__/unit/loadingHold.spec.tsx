import React from 'react';

import { render } from '@atlassian/testing-library';

import InteractionContext, { type InteractionContextType } from '@atlaskit/interaction-context';

import { LoadingHold } from '../../loadingHold';

const createContext = () => {
	const release = jest.fn();
	const hold = jest.fn(() => release);
	const context: InteractionContextType = { hold, tracePress: jest.fn() };
	return { context, hold, release };
};

const renderHold = (context: InteractionContextType, interactionName = 'media-card-loading') =>
	render(
		<InteractionContext.Provider value={context}>
			<LoadingHold interactionName={interactionName} />
		</InteractionContext.Provider>,
	);

describe('LoadingHold', () => {
	it('draws nothing', () => {
		const { context } = createContext();

		const { container } = renderHold(context);

		// The whole point: it stands in for an indicator without being one.
		expect(container).toBeEmptyDOMElement();
	});

	it('should capture and report a11y violations', async () => {
		const { context } = createContext();

		const { container } = renderHold(context);

		await expect(container).toBeAccessible();
	});

	it('holds the interaction under the given name while mounted', () => {
		const { context, hold, release } = createContext();

		renderHold(context, 'some-interaction');

		expect(hold).toHaveBeenCalledWith('some-interaction');
		expect(release).not.toHaveBeenCalled();
	});

	it('releases the hold on unmount', () => {
		const { context, release } = createContext();
		const { unmount } = renderHold(context);

		unmount();

		// Matches when a visible indicator would have unmounted, so UFO traces stay comparable.
		expect(release).toHaveBeenCalled();
	});

	it('re-holds under the new name when the interaction name changes', () => {
		const { context, hold, release } = createContext();
		const { rerender } = renderHold(context, 'first-name');

		rerender(
			<InteractionContext.Provider value={context}>
				<LoadingHold interactionName="second-name" />
			</InteractionContext.Provider>,
		);

		expect(release).toHaveBeenCalled();
		expect(hold).toHaveBeenCalledWith('second-name');
	});

	it('renders without an interaction context', () => {
		// Cards render outside an interaction in tests and on some product surfaces.
		expect(() => render(<LoadingHold interactionName="media-card-loading" />)).not.toThrow();
	});
});
