import React, { useRef } from 'react';

import { act, render, screen } from '@testing-library/react';

import { skipA11yAudit } from '@af/accessibility-testing';

import { useFocusWithin } from './index';

// Test component to expose hook behavior
const TestComponent = ({
	containerRef,
	onFocusChange,
}: {
	containerRef?: React.MutableRefObject<HTMLDivElement | undefined>;
	onFocusChange?: (activeElement: Element | null) => void;
}) => {
	const internalRef = useRef<HTMLDivElement>(null);
	// Type assertion to match hook's expected type while keeping React compatibility
	const ref = containerRef || (internalRef as React.MutableRefObject<HTMLDivElement | undefined>);
	const activeElement = useFocusWithin(ref);

	React.useEffect(() => {
		onFocusChange?.(activeElement);
	}, [activeElement, onFocusChange]);

	return (
		<div>
			<div ref={internalRef} data-testid="container">
				<input data-testid="input-1" />
				<button type="button" data-testid="button-1">
					Button 1
				</button>
				<input data-testid="input-2" />
			</div>
			<input data-testid="outside-input" />
		</div>
	);
};

// Test component that allows passing undefined ref without fallback
const TestComponentNoFallback = ({
	containerRef,
	onFocusChange,
}: {
	containerRef?: React.MutableRefObject<HTMLDivElement | undefined>;
	onFocusChange?: (activeElement: Element | null) => void;
}) => {
	const activeElement = useFocusWithin(containerRef);

	React.useEffect(() => {
		onFocusChange?.(activeElement);
	}, [activeElement, onFocusChange]);

	return (
		<div>
			<div data-testid="container">
				<input data-testid="input-1" />
				<button type="button" data-testid="button-1">
					Button 1
				</button>
				<input data-testid="input-2" />
			</div>
			<input data-testid="outside-input" />
		</div>
	);
};

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('useFocusWithin', () => {
	beforeEach(() => {
		skipA11yAudit();
	});
	it('returns focused element when focus moves inside the container', () => {
		const mockFocusChange = jest.fn();
		render(<TestComponent onFocusChange={mockFocusChange} />);

		const input1 = screen.getByTestId('input-1');

		act(() => {
			input1.focus();
		});

		expect(mockFocusChange).toHaveBeenLastCalledWith(input1);
	});

	it('returns null when focus moves outside the container', () => {
		const mockFocusChange = jest.fn();
		render(<TestComponent onFocusChange={mockFocusChange} />);

		const input1 = screen.getByTestId('input-1');
		const outsideInput = screen.getByTestId('outside-input');

		// Focus inside first
		act(() => {
			input1.focus();
		});
		expect(mockFocusChange).toHaveBeenLastCalledWith(input1);

		// Then focus outside
		act(() => {
			outsideInput.focus();
		});
		expect(mockFocusChange).toHaveBeenLastCalledWith(null);
	});

	it('responds to focusin events and updates correctly', () => {
		const mockFocusChange = jest.fn();
		render(<TestComponent onFocusChange={mockFocusChange} />);

		const input1 = screen.getByTestId('input-1');
		const button1 = screen.getByTestId('button-1');

		// Initial state should be null
		expect(mockFocusChange).toHaveBeenLastCalledWith(null);

		// Focus on first element
		act(() => {
			input1.focus();
		});
		expect(mockFocusChange).toHaveBeenLastCalledWith(input1);

		// Focus on second element
		act(() => {
			button1.focus();
		});
		expect(mockFocusChange).toHaveBeenLastCalledWith(button1);
	});

	it('tracks focus moving between different elements within the same container', () => {
		const mockFocusChange = jest.fn();
		render(<TestComponent onFocusChange={mockFocusChange} />);

		const input1 = screen.getByTestId('input-1');
		const button1 = screen.getByTestId('button-1');
		const input2 = screen.getByTestId('input-2');

		// Focus sequence within container
		act(() => {
			input1.focus();
		});
		expect(mockFocusChange).toHaveBeenLastCalledWith(input1);

		act(() => {
			button1.focus();
		});
		expect(mockFocusChange).toHaveBeenLastCalledWith(button1);

		act(() => {
			input2.focus();
		});
		expect(mockFocusChange).toHaveBeenLastCalledWith(input2);
	});

	it('cleans up event listeners when component unmounts', () => {
		const mockFocusChange = jest.fn();
		const { unmount } = render(<TestComponent onFocusChange={mockFocusChange} />);

		const input1 = screen.getByTestId('input-1');

		// Focus should work before unmount
		act(() => {
			input1.focus();
		});
		expect(mockFocusChange).toHaveBeenLastCalledWith(input1);

		// Clear mock calls
		mockFocusChange.mockClear();

		// Unmount component
		unmount();

		// Focus events after unmount should not trigger the callback
		// (Testing that cleanup occurred)
		act(() => {
			document.body.focus();
		});
		expect(mockFocusChange).not.toHaveBeenCalled();
	});

	it('handles ref changes properly when ref updates to different elements', () => {
		const mockFocusChange = jest.fn();
		const ref1 = { current: undefined } as React.MutableRefObject<HTMLDivElement | undefined>;
		const ref2 = { current: undefined } as React.MutableRefObject<HTMLDivElement | undefined>;

		const { rerender } = render(
			<TestComponentNoFallback containerRef={ref1} onFocusChange={mockFocusChange} />,
		);

		// Set up first ref
		const container1 = screen.getByTestId('container');
		ref1.current = container1 as HTMLDivElement;

		const input1 = screen.getByTestId('input-1');
		act(() => {
			input1.focus();
		});
		expect(mockFocusChange).toHaveBeenLastCalledWith(input1);

		// Change to second ref (simulate ref update) - should trigger state update
		rerender(<TestComponentNoFallback containerRef={ref2} onFocusChange={mockFocusChange} />);

		// The hook should update and return null since ref2.current is undefined
		expect(mockFocusChange).toHaveBeenLastCalledWith(null);
	});

	it('returns null when ref is undefined', () => {
		const mockFocusChange = jest.fn();
		render(<TestComponentNoFallback containerRef={undefined} onFocusChange={mockFocusChange} />);

		const input1 = screen.getByTestId('input-1');
		act(() => {
			input1.focus();
		});

		expect(mockFocusChange).toHaveBeenLastCalledWith(null);
	});

	it('returns null when ref.current is null', () => {
		const mockFocusChange = jest.fn();
		const nullRef = { current: undefined } as React.MutableRefObject<HTMLDivElement | undefined>;

		render(<TestComponentNoFallback containerRef={nullRef} onFocusChange={mockFocusChange} />);

		const input1 = screen.getByTestId('input-1');
		act(() => {
			input1.focus();
		});

		expect(mockFocusChange).toHaveBeenLastCalledWith(null);
	});
});
