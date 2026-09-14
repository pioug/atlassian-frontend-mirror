import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import { Box } from '@atlaskit/primitives/compiled';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import Flag from '../../flag';

const collapseAnimationGate = 'platform-dst-flag-collapse-animation-fix';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Flag Expander', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('should only render children when isExpanded true (and while doing expand/contract animation)', () => {
		failGate(collapseAnimationGate);

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

	it('should preserve the existing styles when the collapse animation gate is disabled', () => {
		failGate(collapseAnimationGate);

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

		const expander = screen.getByTestId('expander-test-expander');
		const contentStack = screen.getByTestId('expander-test-content-stack');
		expect(expander).not.toHaveCompiledCss('overflow-x', 'hidden');
		expect(expander).not.toHaveCompiledCss('transition-property', 'max-height');
		expect(contentStack).not.toHaveCompiledCss('transition-property', 'gap');
	});

	it('should animate and clip exiting children when the collapse animation gate is enabled', () => {
		passGate(collapseAnimationGate);

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

		fireEvent.click(screen.getByTestId('expander-test-toggle'));
		act(() => {
			jest.runAllTimers();
		});
		const expander = screen.getByTestId('expander-test-expander');
		expect(expander).not.toHaveCompiledCss('overflow-x', 'hidden');

		fireEvent.click(screen.getByTestId('expander-test-toggle'));

		const contentStack = screen.getByTestId('expander-test-content-stack');
		expect(screen.getByText('Hi!')).toBeInTheDocument();
		expect(expander).toHaveStyle({ maxHeight: 0 });
		expect(expander).toHaveCompiledCss('overflow-x', 'hidden');
		expect(expander).toHaveCompiledCss('overflow-y', 'hidden');
		expect(expander).toHaveCompiledCss('transition-property', 'max-height');
		expect(expander).toHaveCompiledCss('transition-duration', 'var(--ds-duration-long,.25s)');
		expect(expander).toHaveCompiledCss('transition-duration', '0s', {
			media: '(prefers-reduced-motion: reduce)',
		});
		expect(contentStack).toHaveCompiledCss('transition-property', 'gap');
		expect(contentStack).toHaveCompiledCss('transition-duration', 'var(--ds-duration-long,.25s)');
		expect(contentStack).toHaveCompiledCss('transition-duration', '0s', {
			media: '(prefers-reduced-motion: reduce)',
		});
	});

	it('should set aria-hidden true on content when isExpanded is false', () => {
		failGate(collapseAnimationGate);

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
		failGate(collapseAnimationGate);

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
