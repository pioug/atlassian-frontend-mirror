import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import Box from '@atlaskit/primitives/box';

import Flag from '../../flag';

describe('Flag Expander', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('should only render children when isExpanded true (and while doing expand/contract animation)', () => {
		// Check that default collapsed state doesn't render children
		render(
			<Flag
				id=""
				icon={<Box />}
				title="Flag"
				appearance="info"
				description="Hi!"
				testId="expander-test"
			/>,
		);
		expect(screen.queryByText('Hi!')).not.toBeInTheDocument();

		// Trigger expand
		let toggleButton = screen.getByTestId('expander-test-toggle');
		fireEvent.click(toggleButton);
		expect(screen.getByText('Hi!')).toBeInTheDocument();
		act(() => {
			jest.runAllTimers();
		});

		// Trigger collapse
		toggleButton = screen.getByTestId('expander-test-toggle');
		fireEvent.click(toggleButton);
		expect(screen.getByText('Hi!')).toBeInTheDocument();

		// ..once collapse animation finishes, children not rendered
		act(() => {
			jest.runAllTimers();
		});
		expect(screen.queryByText('Hi!')).not.toBeInTheDocument();
	});

	it('should set aria-hidden true on content when isExpanded is false', () => {
		render(
			<Flag
				id=""
				icon={<Box />}
				title="Flag"
				appearance="info"
				description="Hi!"
				testId="expander-test"
			/>,
		);

		expect(screen.getByTestId('expander-test-expander')).toHaveAttribute('aria-hidden', 'true');
	});

	it('should set aria-hidden false on content when isExpanded is true', () => {
		render(
			<Flag
				id=""
				icon={<Box />}
				title="Flag"
				appearance="info"
				description="Hi!"
				testId="expander-test"
			/>,
		);

		const toggleButton = screen.getByTestId('expander-test-toggle');
		fireEvent.click(toggleButton);

		expect(screen.getByTestId('expander-test-expander')).toHaveAttribute('aria-hidden', 'false');
	});
});
