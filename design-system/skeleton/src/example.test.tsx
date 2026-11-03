import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import SkeletonInteractionTracing from '../examples/constellation/skeleton-interaction-tracing';

const INTERACTION_NAME = 'skeleton.example.content';

describe('SkeletonInteractionTracing example', () => {
	it('holds on mount and releases on unmount, logging each transition', async () => {
		passGate('platform-dst-skeleton-ufo-hold');

		const { container } = render(<SkeletonInteractionTracing />);

		// The skeleton renders on first mount, so the interaction is held immediately.
		expect(screen.getByText(`Held interaction: ${INTERACTION_NAME}`)).toBeInTheDocument();
		expect(screen.queryByText(`Released interaction: ${INTERACTION_NAME}`)).not.toBeInTheDocument();

		// Toggling off unmounts the skeleton, which releases the hold.
		fireEvent.click(screen.getByRole('button'));
		expect(screen.getByText(`Released interaction: ${INTERACTION_NAME}`)).toBeInTheDocument();
		expect(screen.getByText('Content loaded')).toBeInTheDocument();

		// Toggling back on remounts the skeleton, holding the interaction a second time.
		// This also guards against the context value losing referential stability, which
		// would cause the hold/release effect to loop on every render.
		fireEvent.click(screen.getByRole('button'));
		expect(screen.getAllByText(`Held interaction: ${INTERACTION_NAME}`)).toHaveLength(2);

		await expect(container).toBeAccessible();
	});

	it('does not hold the interaction and logs nothing', () => {
		failGate('platform-dst-skeleton-ufo-hold');

		render(<SkeletonInteractionTracing />);

		expect(screen.getByText('No events yet.')).toBeInTheDocument();
		expect(screen.queryByText(/Held interaction:/)).not.toBeInTheDocument();
	});
});
