import React from 'react';

jest.mock('@atlaskit/editor-common/is-ssr', () => ({
	...jest.requireActual('@atlaskit/editor-common/is-ssr'),
	isSSR: jest.fn(),
}));

import { isSSR } from '@atlaskit/editor-common/is-ssr';
import { render, screen } from '@atlassian/testing-library';

import ExcludeFromHydration from '../../../ui/ExcludeFromHydration';

const mockIsSSR = isSSR as jest.MockedFunction<typeof isSSR>;

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('ExcludeFromHydration', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockIsSSR.mockReturnValue(false);
	});

	it('should render children after hydration when not SSR', () => {
		mockIsSSR.mockReturnValue(false);

		render(
			<ExcludeFromHydration>
				<div data-testid="child-content">Test Content</div>
			</ExcludeFromHydration>,
		);

		// useLayoutEffect runs synchronously in tests, so children are rendered
		expect(screen.getByTestId('child-content')).toBeInTheDocument();
	});

	it('should render children after rerender', () => {
		mockIsSSR.mockReturnValue(false);

		const { rerender } = render(
			<ExcludeFromHydration>
				<div data-testid="child-content">Test Content</div>
			</ExcludeFromHydration>,
		);

		rerender(
			<ExcludeFromHydration>
				<div data-testid="child-content">Test Content</div>
			</ExcludeFromHydration>,
		);

		// The component should render children
		expect(screen.getByTestId('child-content')).toBeInTheDocument();
	});

	it('should not render children during SSR (isSSR returns true)', () => {
		mockIsSSR.mockReturnValue(true);

		render(
			<ExcludeFromHydration>
				<div data-testid="child-content">Test Content</div>
			</ExcludeFromHydration>,
		);

		// During SSR, shouldRender stays false so children are not rendered
		expect(screen.queryByTestId('child-content')).not.toBeInTheDocument();
		expect(mockIsSSR).toHaveBeenCalled();
	});

	it('should render multiple children correctly', () => {
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
		mockIsSSR.mockReturnValue(false);

		const { container } = render(<ExcludeFromHydration>{null}</ExcludeFromHydration>);

		expect(container).toBeInTheDocument();
	});

	describe('fallback prop', () => {
		it('should render fallback when not yet hydrated (SSR)', () => {
			mockIsSSR.mockReturnValue(true); // Simulate SSR where useEffect hasn't run

			const { container } = render(
				<ExcludeFromHydration fallback={<div data-testid="fallback">Placeholder</div>}>
					<div data-testid="child-content">Test Content</div>
				</ExcludeFromHydration>,
			);

			// During SSR, fallback should be rendered
			expect(screen.queryByTestId('fallback')).toBeInTheDocument();
			expect(screen.queryByTestId('child-content')).not.toBeInTheDocument();
			expect(container).toBeInTheDocument();
		});

		it('should render children instead of fallback after hydration', () => {
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

		it('should render null when no fallback provided during SSR', () => {
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
