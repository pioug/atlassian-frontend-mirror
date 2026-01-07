import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { useOnEscape } from './index';

// Test component to expose hook behavior
const TestComponent = ({ onEscape }: { onEscape: (event: KeyboardEvent) => void }) => {
	useOnEscape(onEscape);

	return <div data-testid="test-component">Test Component</div>;
};

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('useOnEscape', () => {
	it('calls onEscape callback when Escape key is pressed', () => {
		const mockOnEscape = jest.fn();
		render(<TestComponent onEscape={mockOnEscape} />);

		// Simulate Escape key press on document
		fireEvent.keyDown(document, { key: 'Escape' });

		expect(mockOnEscape).toHaveBeenCalledTimes(1);
		expect(mockOnEscape).toHaveBeenCalledWith(
			expect.objectContaining({
				key: 'Escape',
			}),
		);
	});

	it('does not call onEscape callback for other keys', () => {
		const mockOnEscape = jest.fn();
		render(<TestComponent onEscape={mockOnEscape} />);

		// Test various other keys
		const otherKeys = ['Enter', 'Space', 'Tab', 'ArrowDown', 'a', 'A', '1'];

		otherKeys.forEach((key) => {
			fireEvent.keyDown(document, { key });
		});

		expect(mockOnEscape).not.toHaveBeenCalled();
	});

	it('passes the correct KeyboardEvent object to the callback', () => {
		const mockOnEscape = jest.fn();
		render(<TestComponent onEscape={mockOnEscape} />);

		// Create a more detailed keyboard event
		const keyboardEvent = new KeyboardEvent('keydown', {
			key: 'Escape',
			code: 'Escape',
			keyCode: 27,
			which: 27,
			ctrlKey: false,
			shiftKey: false,
			altKey: false,
			metaKey: false,
		});

		fireEvent(document, keyboardEvent);

		expect(mockOnEscape).toHaveBeenCalledTimes(1);

		const receivedEvent = mockOnEscape.mock.calls[0][0];
		expect(receivedEvent).toBeInstanceOf(KeyboardEvent);
		expect(receivedEvent.key).toBe('Escape');
		expect(receivedEvent.code).toBe('Escape');
		expect(receivedEvent.keyCode).toBe(27);
		expect(receivedEvent.ctrlKey).toBe(false);
		expect(receivedEvent.shiftKey).toBe(false);
		expect(receivedEvent.altKey).toBe(false);
		expect(receivedEvent.metaKey).toBe(false);
	});
});
