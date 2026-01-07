import React from 'react';

import { render } from '@testing-library/react';

import InteractionContext from '@atlaskit/interaction-context';

import Spinner from '../../index';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('spinner', () => {
	it('calls hold from context', () => {
		const interactionName = 'load.event';
		const mockHold = jest.fn();

		const context = {
			labelStack: null,
			segmentStack: null,
			hold: mockHold,
			tracePress: jest.fn(),
		};

		render(
			<InteractionContext.Provider value={context}>
				<Spinner size={4000} testId="spinner" interactionName={interactionName} />
			</InteractionContext.Provider>,
		);

		expect(mockHold).toHaveBeenCalledWith(interactionName);
	});

	it('does not throw errors when no context is provided', () => {
		expect(() => render(<Spinner size={4000} testId="spinner" />)).not.toThrow();
	});
});
