import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import type { InteractionContextType } from '@atlaskit/interaction-context';
// eslint-disable-next-line no-duplicate-imports
import InteractionContext from '@atlaskit/interaction-context';

import Button from '../../../old-button/button';

const mockTraceInteraction = jest.fn();
const mockHold = jest.fn();
const mockOnClick = jest.fn();

const context: InteractionContextType = {
	hold: mockHold,
	tracePress: mockTraceInteraction,
};

describe('press-tracing', () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should call click handler when context is not present', () => {
		render(
			<Button onClick={mockOnClick} testId="iamTheDataTestId">
				Button
			</Button>,
		);

		fireEvent.click(screen.getByTestId('iamTheDataTestId'));

		expect(mockTraceInteraction).not.toHaveBeenCalled();
		expect(mockOnClick).toHaveBeenCalled();
	});

	it('should call click handler even when interactionName is not present', () => {
		render(
			<InteractionContext.Provider value={context}>
				<Button onClick={mockOnClick} testId="iamTheDataTestId">
					Button
				</Button>
			</InteractionContext.Provider>,
		);

		fireEvent.click(screen.getByTestId('iamTheDataTestId'));

		expect(mockTraceInteraction).toHaveBeenCalled();
		expect(mockOnClick).toHaveBeenCalled();
	});

	it('should not explode when no click handler exists', () => {
		render(<Button testId="iamTheDataTestId">Button</Button>);

		expect(() => {
			fireEvent.click(screen.getByTestId('iamTheDataTestId'));
		}).not.toThrow();
		expect(mockOnClick).not.toHaveBeenCalled();
	});

	it('should trace button press with interactionName', () => {
		const interactionName = 'ufo.event';
		render(
			<InteractionContext.Provider value={context}>
				<Button onClick={mockOnClick} testId="iamTheDataTestId" interactionName={interactionName}>
					Button
				</Button>
			</InteractionContext.Provider>,
		);

		fireEvent.click(screen.getByTestId('iamTheDataTestId'));

		expect(mockTraceInteraction).toHaveBeenCalled();
		expect(mockTraceInteraction).toHaveBeenCalledWith(interactionName, expect.any(Number));
		expect(mockOnClick).toHaveBeenCalled();
	});
});
