import React, { type MutableRefObject } from 'react';

import { fireEvent, render } from '@testing-library/react';

import { SpotlightContext, type SpotlightContextType } from '../../controllers/context';

import { useOnClickOutside } from './index';

// Test component to expose hook behavior
const TestComponent = ({ onClickOutside }: { onClickOutside: (event: MouseEvent) => void }) => {
	useOnClickOutside(onClickOutside);

	return <div data-testid="test-component">Test Component</div>;
};

// Helper to create mock SpotlightContext value
const createMockContext = (ref: MutableRefObject<HTMLDivElement | null> | null = null) =>
	({
		card: {
			ref,
			setRef: jest.fn(),
			placement: 'bottom-end',
			setPlacement: jest.fn(),
		},
	}) as unknown as SpotlightContextType;

describe('useOnClickOutside', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('calls onClickOutside callback when mousedown event occurs outside the card', () => {
		const mockOnClickOutside = jest.fn();
		const mockElement = document.createElement('div');
		const mockRef = { current: mockElement } as MutableRefObject<HTMLDivElement | null>;

		// Create an outside element that's not contained within mockElement
		const outsideElement = document.createElement('div');
		document.body.appendChild(outsideElement);

		const mockContextValue = createMockContext(mockRef);

		render(
			<SpotlightContext.Provider value={mockContextValue}>
				<TestComponent onClickOutside={mockOnClickOutside} />
			</SpotlightContext.Provider>,
		);

		// Simulate mousedown on element outside the card
		// eslint-disable-next-line testing-library/prefer-user-event
		fireEvent.mouseDown(outsideElement, { clientX: 50, clientY: 50 });

		expect(mockOnClickOutside).toHaveBeenCalledTimes(1);
		expect(mockOnClickOutside).toHaveBeenCalledWith(
			expect.objectContaining({
				clientX: 50,
				clientY: 50,
			}),
		);

		// Clean up
		document.body.removeChild(outsideElement);
	});

	it('does not call onClickOutside callback when mousedown occurs inside the card', () => {
		const mockOnClickOutside = jest.fn();
		const mockElement = document.createElement('div');
		const mockRef = { current: mockElement } as MutableRefObject<HTMLDivElement | null>;

		// Create child elements inside the mockElement
		const insideElements = Array.from({ length: 7 }, () => {
			const child = document.createElement('div');
			mockElement.appendChild(child);
			return child;
		});

		const mockContextValue = createMockContext(mockRef);

		render(
			<SpotlightContext.Provider value={mockContextValue}>
				<TestComponent onClickOutside={mockOnClickOutside} />
			</SpotlightContext.Provider>,
		);

		// Test clicks on various child elements inside the card
		insideElements.forEach((element) => {
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.mouseDown(element);
		});

		// Also test clicking directly on the mockElement itself
		// eslint-disable-next-line testing-library/prefer-user-event
		fireEvent.mouseDown(mockElement);

		expect(mockOnClickOutside).not.toHaveBeenCalled();
	});

	it('handles missing ref gracefully and cleans up event listeners properly', () => {
		const mockOnClickOutside = jest.fn();

		// Test with null ref
		const mockContextWithNullRef = createMockContext(null);

		const { rerender, unmount } = render(
			<SpotlightContext.Provider value={mockContextWithNullRef}>
				<TestComponent onClickOutside={mockOnClickOutside} />
			</SpotlightContext.Provider>,
		);

		// Create an outside element for testing null ref cases
		const outsideElementForNullTests = document.createElement('div');
		document.body.appendChild(outsideElementForNullTests);

		// Should not crash with null ref
		// eslint-disable-next-line testing-library/prefer-user-event
		fireEvent.mouseDown(outsideElementForNullTests, { clientX: 50, clientY: 50 });
		expect(mockOnClickOutside).not.toHaveBeenCalled();

		// Test with ref.current being null
		const mockRefWithNullCurrent = { current: null } as MutableRefObject<HTMLDivElement | null>;
		const mockContextWithNullCurrent = createMockContext(mockRefWithNullCurrent);

		rerender(
			<SpotlightContext.Provider value={mockContextWithNullCurrent}>
				<TestComponent onClickOutside={mockOnClickOutside} />
			</SpotlightContext.Provider>,
		);

		// Should not crash with null current
		// eslint-disable-next-line testing-library/prefer-user-event
		fireEvent.mouseDown(outsideElementForNullTests, { clientX: 50, clientY: 50 });
		expect(mockOnClickOutside).not.toHaveBeenCalled();

		// Clean up null test element
		document.body.removeChild(outsideElementForNullTests);

		// Test with valid ref
		const mockElement = document.createElement('div');
		const mockRef = { current: mockElement } as MutableRefObject<HTMLDivElement | null>;

		// Create an outside element for testing
		const outsideElement = document.createElement('div');
		document.body.appendChild(outsideElement);

		const mockContextWithValidRef = createMockContext(mockRef);

		rerender(
			<SpotlightContext.Provider value={mockContextWithValidRef}>
				<TestComponent onClickOutside={mockOnClickOutside} />
			</SpotlightContext.Provider>,
		);

		// Should work with valid ref
		// eslint-disable-next-line testing-library/prefer-user-event
		fireEvent.mouseDown(outsideElement, { clientX: 50, clientY: 50 });
		expect(mockOnClickOutside).toHaveBeenCalledTimes(1);

		// Clean up
		document.body.removeChild(outsideElement);

		mockOnClickOutside.mockClear();

		// Test cleanup after unmount
		unmount();

		// Create an element for testing cleanup
		const cleanupTestElement = document.createElement('div');
		document.body.appendChild(cleanupTestElement);

		// eslint-disable-next-line testing-library/prefer-user-event
		fireEvent.mouseDown(cleanupTestElement, { clientX: 50, clientY: 50 });
		expect(mockOnClickOutside).not.toHaveBeenCalled();

		// Clean up
		document.body.removeChild(cleanupTestElement);
	});

	it('responds to callback changes and updates event listener properly', () => {
		const mockOnClickOutside1 = jest.fn();
		const mockOnClickOutside2 = jest.fn();
		const mockElement = document.createElement('div');
		const mockRef = { current: mockElement } as MutableRefObject<HTMLDivElement | null>;

		// Create an outside element for testing
		const outsideElement = document.createElement('div');
		document.body.appendChild(outsideElement);

		const mockContextValue = createMockContext(mockRef);

		const { rerender } = render(
			<SpotlightContext.Provider value={mockContextValue}>
				<TestComponent onClickOutside={mockOnClickOutside1} />
			</SpotlightContext.Provider>,
		);

		// First callback should be called
		// eslint-disable-next-line testing-library/prefer-user-event
		fireEvent.mouseDown(outsideElement, { clientX: 50, clientY: 50 });
		expect(mockOnClickOutside1).toHaveBeenCalledTimes(1);
		expect(mockOnClickOutside2).not.toHaveBeenCalled();

		// Change callback
		rerender(
			<SpotlightContext.Provider value={mockContextValue}>
				<TestComponent onClickOutside={mockOnClickOutside2} />
			</SpotlightContext.Provider>,
		);

		// Second callback should be called, first should not be called again
		// eslint-disable-next-line testing-library/prefer-user-event
		fireEvent.mouseDown(outsideElement, { clientX: 50, clientY: 50 });
		expect(mockOnClickOutside1).toHaveBeenCalledTimes(1); // Still only called once
		expect(mockOnClickOutside2).toHaveBeenCalledTimes(1);

		// Clean up
		document.body.removeChild(outsideElement);
	});

	it('handles ref changes properly when ref updates to different elements', () => {
		const mockOnClickOutside = jest.fn();
		const mockElement1 = document.createElement('div');
		const mockElement2 = document.createElement('div');

		// Add both elements to the document body so they're in the DOM
		document.body.appendChild(mockElement1);
		document.body.appendChild(mockElement2);

		const mockRef1 = { current: mockElement1 } as MutableRefObject<HTMLDivElement | null>;
		const mockRef2 = { current: mockElement2 } as MutableRefObject<HTMLDivElement | null>;

		// Create child elements for testing inside behavior
		const insideElement1 = document.createElement('div');
		const insideElement2 = document.createElement('div');
		mockElement1.appendChild(insideElement1);
		mockElement2.appendChild(insideElement2);

		// Create an element that will be completely separate from both containers
		const separateElement = document.createElement('div');
		document.body.appendChild(separateElement);

		const mockContext1 = createMockContext(mockRef1);
		const mockContext2 = createMockContext(mockRef2);

		const { rerender } = render(
			<SpotlightContext.Provider value={mockContext1}>
				<TestComponent onClickOutside={mockOnClickOutside} />
			</SpotlightContext.Provider>,
		);

		// Click outside first element (should trigger)
		// eslint-disable-next-line testing-library/prefer-user-event
		fireEvent.mouseDown(separateElement);
		expect(mockOnClickOutside).toHaveBeenCalledTimes(1);

		// Click inside first element (should not trigger)
		// eslint-disable-next-line testing-library/prefer-user-event
		fireEvent.mouseDown(insideElement1);
		expect(mockOnClickOutside).toHaveBeenCalledTimes(1); // Still only called once

		// Change to second ref
		rerender(
			<SpotlightContext.Provider value={mockContext2}>
				<TestComponent onClickOutside={mockOnClickOutside} />
			</SpotlightContext.Provider>,
		);

		// Click on element that was inside first element but is outside second element
		// Since insideElement1 is not contained within mockElement2, this should trigger
		// eslint-disable-next-line testing-library/prefer-user-event
		fireEvent.mouseDown(insideElement1);
		expect(mockOnClickOutside).toHaveBeenCalledTimes(2); // Should trigger for second element

		// Click inside second element (should not trigger)
		// eslint-disable-next-line testing-library/prefer-user-event
		fireEvent.mouseDown(insideElement2);
		expect(mockOnClickOutside).toHaveBeenCalledTimes(2); // Still only called twice

		// Clean up
		document.body.removeChild(mockElement1);
		document.body.removeChild(mockElement2);
		document.body.removeChild(separateElement);
	});
});
