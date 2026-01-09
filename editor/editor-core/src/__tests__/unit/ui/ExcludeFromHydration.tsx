import React from 'react';

jest.mock('@atlaskit/editor-common/core-utils', () => ({
	isSSR: jest.fn(),
}));

jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals', () => ({
	expValEquals: jest.fn(),
}));

import { isSSR } from '@atlaskit/editor-common/core-utils';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { render, screen } from '@atlassian/testing-library';

import ExcludeFromHydration from '../../../ui/ExcludeFromHydration';

const mockIsSSR = isSSR as jest.MockedFunction<typeof isSSR>;
const mockExpValEquals = expValEquals as jest.MockedFunction<typeof expValEquals>;

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('ExcludeFromHydration', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockIsSSR.mockReturnValue(false);
		mockExpValEquals.mockReturnValue(false);
	});

	it('should render children after hydration when feature flag is disabled and not SSR', () => {
		mockExpValEquals.mockReturnValue(false);
		mockIsSSR.mockReturnValue(false);

		render(
			<ExcludeFromHydration>
				<div data-testid="child-content">Test Content</div>
			</ExcludeFromHydration>,
		);

		// useLayoutEffect runs synchronously in tests, so children are rendered
		expect(screen.getByTestId('child-content')).toBeInTheDocument();
	});

	it('should render children after hydration when feature flag is disabled', () => {
		mockExpValEquals.mockReturnValue(false);
		mockIsSSR.mockReturnValue(false);

		const { rerender } = render(
			<ExcludeFromHydration>
				<div data-testid="child-content">Test Content</div>
			</ExcludeFromHydration>,
		);

		// After useLayoutEffect runs, it should render
		rerender(
			<ExcludeFromHydration>
				<div data-testid="child-content">Test Content</div>
			</ExcludeFromHydration>,
		);

		// The component should eventually render children
		expect(screen.getByTestId('child-content')).toBeInTheDocument();
	});

	it('should render children immediately when feature flag is enabled', () => {
		mockExpValEquals.mockReturnValue(true);
		mockIsSSR.mockReturnValue(false);

		render(
			<ExcludeFromHydration>
				<div data-testid="child-content">Test Content</div>
			</ExcludeFromHydration>,
		);

		expect(screen.getByTestId('child-content')).toBeInTheDocument();
	});

	it('should not trigger state update during SSR', () => {
		mockIsSSR.mockReturnValue(true);
		mockExpValEquals.mockReturnValue(false);

		render(
			<ExcludeFromHydration>
				<div data-testid="child-content">Test Content</div>
			</ExcludeFromHydration>,
		);

		// During SSR, children should now be rendered
		expect(screen.getByTestId('child-content')).toBeInTheDocument();
		expect(mockIsSSR).toHaveBeenCalled();
	});

	it('should call expValEquals with correct parameters', () => {
		mockExpValEquals.mockReturnValue(false);
		mockIsSSR.mockReturnValue(false);

		render(
			<ExcludeFromHydration>
				<div>Test</div>
			</ExcludeFromHydration>,
		);

		expect(mockExpValEquals).toHaveBeenCalledWith(
			'platform_editor_hydratable_ui',
			'isEnabled',
			true,
		);
	});

	it('should render multiple children correctly', () => {
		mockExpValEquals.mockReturnValue(true);
		mockIsSSR.mockReturnValue(false);

		render(
			<ExcludeFromHydration>
				<div data-testid="child-1">Child 1</div>
				<div data-testid="child-2">Child 2</div>
			</ExcludeFromHydration>,
		);

		expect(screen.getByTestId('child-1')).toBeInTheDocument();
		expect(screen.getByTestId('child-2')).toBeInTheDocument();
	});

	it('should handle null children gracefully', () => {
		mockExpValEquals.mockReturnValue(true);
		mockIsSSR.mockReturnValue(false);

		const { container } = render(<ExcludeFromHydration>{null}</ExcludeFromHydration>);

		expect(container).toBeInTheDocument();
	});

	describe('fallback prop', () => {
		it('should render fallback when feature flag is enabled and not yet hydrated', () => {
			mockExpValEquals.mockReturnValue(true);
			mockIsSSR.mockReturnValue(true); // Simulate SSR where useEffect hasn't run

			const { container } = render(
				<ExcludeFromHydration fallback={<div data-testid="fallback">Placeholder</div>}>
					<div data-testid="child-content">Test Content</div>
				</ExcludeFromHydration>,
			);

			// During SSR with feature flag enabled, fallback should be rendered
			expect(screen.queryByTestId('fallback')).toBeInTheDocument();
			expect(screen.queryByTestId('child-content')).not.toBeInTheDocument();
			expect(container).toBeInTheDocument();
		});

		it('should render children instead of fallback after hydration', () => {
			mockExpValEquals.mockReturnValue(true);
			mockIsSSR.mockReturnValue(false);

			render(
				<ExcludeFromHydration fallback={<div data-testid="fallback">Placeholder</div>}>
					<div data-testid="child-content">Test Content</div>
				</ExcludeFromHydration>,
			);

			// After hydration (useEffect runs), children should be rendered
			expect(screen.getByTestId('child-content')).toBeInTheDocument();
			expect(screen.queryByTestId('fallback')).not.toBeInTheDocument();
		});

		it('should render children when feature flag is disabled regardless of fallback', () => {
			mockExpValEquals.mockReturnValue(false);
			mockIsSSR.mockReturnValue(false);

			render(
				<ExcludeFromHydration fallback={<div data-testid="fallback">Placeholder</div>}>
					<div data-testid="child-content">Test Content</div>
				</ExcludeFromHydration>,
			);

			expect(screen.getByTestId('child-content')).toBeInTheDocument();
			expect(screen.queryByTestId('fallback')).not.toBeInTheDocument();
		});

		it('should render null when no fallback provided and feature flag enabled during SSR', () => {
			mockExpValEquals.mockReturnValue(true);
			mockIsSSR.mockReturnValue(true);

			const { container } = render(
				<ExcludeFromHydration>
					<div data-testid="child-content">Test Content</div>
				</ExcludeFromHydration>,
			);

			expect(screen.queryByTestId('child-content')).not.toBeInTheDocument();
			expect(container.firstChild).toBeNull();
		});
	});
});
