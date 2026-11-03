import React from 'react';

import { render, screen } from '@testing-library/react';

import InteractionContext from '@atlaskit/interaction-context';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import Skeleton from './index';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Skeleton', () => {
	const testId = 'skeleton';

	it('should find Skeleton by its testid', async () => {
		render(<Skeleton width={200} height={8} testId={testId} />);

		expect(screen.getByTestId(testId)).toBeTruthy();
	});

	it('should have a width and height', () => {
		render(<Skeleton width={200} height="8px" testId={testId} />);

		expect(screen.getByTestId(testId)).toHaveStyle({
			width: '200px',
			height: '8px',
		});
	});

	it('should call hold from context', () => {
		passGate('platform-dst-skeleton-ufo-hold');

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
				<Skeleton width={200} height={8} testId={testId} interactionName={interactionName} />
			</InteractionContext.Provider>,
		);

		expect(mockHold).toHaveBeenCalledWith(interactionName);
	});

	it('should not call hold from context', () => {
		failGate('platform-dst-skeleton-ufo-hold');

		const mockHold = jest.fn();

		const context = {
			labelStack: null,
			segmentStack: null,
			hold: mockHold,
			tracePress: jest.fn(),
		};

		render(
			<InteractionContext.Provider value={context}>
				<Skeleton width={200} height={8} testId={testId} />
			</InteractionContext.Provider>,
		);

		expect(mockHold).not.toHaveBeenCalled();
	});

	it('should not throw errors when no context is provided', () => {
		expect(() => render(<Skeleton width={200} height={8} testId={testId} />)).not.toThrow();
	});
});
