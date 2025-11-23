import React from 'react';

import { render, screen } from '@testing-library/react';

// Mock the interaction-metrics module
jest.mock('../../interaction-metrics', () => ({
	getActiveInteraction: jest.fn(),
}));

import { SsrRenderProfilerInner } from '../ssr-render-profiler';

const mockGetActiveInteraction = require('../../interaction-metrics').getActiveInteraction;

describe('SsrRenderProfilerInner', () => {
	let mockOnRender: jest.Mock;

	beforeEach(() => {
		jest.clearAllMocks();
		mockOnRender = jest.fn();
		mockGetActiveInteraction.mockReturnValue(undefined);
	});

	describe('rendering children', () => {
		it('should render children correctly', () => {
			const labelStack = [{ name: 'test-segment', segmentId: 'seg-1' }];

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<div data-testid="test-child">Test Content</div>
				</SsrRenderProfilerInner>,
			);

			expect(screen.getByTestId('test-child')).toBeInTheDocument();
			expect(screen.getByText('Test Content')).toBeInTheDocument();
		});

		it('should render multiple children', () => {
			const labelStack = [{ name: 'test-segment', segmentId: 'seg-1' }];

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<div data-testid="child-1">Child 1</div>
					<div data-testid="child-2">Child 2</div>
					<div data-testid="child-3">Child 3</div>
				</SsrRenderProfilerInner>,
			);

			expect(screen.getByTestId('child-1')).toBeInTheDocument();
			expect(screen.getByTestId('child-2')).toBeInTheDocument();
			expect(screen.getByTestId('child-3')).toBeInTheDocument();
		});

		it('should handle fragment children', () => {
			const labelStack = [{ name: 'fragment', segmentId: 'seg-1' }];

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<>
						<div>Item 1</div>
						<div>Item 2</div>
					</>
				</SsrRenderProfilerInner>,
			);

			expect(screen.getByText('Item 1')).toBeInTheDocument();
			expect(screen.getByText('Item 2')).toBeInTheDocument();
		});

		it('should handle text nodes as children', () => {
			const labelStack = [{ name: 'text-content', segmentId: 'seg-1' }];

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					Just plain text
				</SsrRenderProfilerInner>,
			);

			expect(screen.getByText('Just plain text')).toBeInTheDocument();
		});

		it('should handle mixed content types', () => {
			const labelStack = [{ name: 'mixed', segmentId: 'seg-1' }];

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<div>Div content</div>
					Text node
					<span>Span content</span>
				</SsrRenderProfilerInner>,
			);

			expect(screen.getByText('Div content')).toBeInTheDocument();
			expect(screen.getByText('Text node')).toBeInTheDocument();
			expect(screen.getByText('Span content')).toBeInTheDocument();
		});

		it('should handle null children without throwing', () => {
			const labelStack = [{ name: 'test', segmentId: 'seg-1' }];

			expect(() => {
				render(
					<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
						{null}
					</SsrRenderProfilerInner>,
				);
			}).not.toThrow();
		});

		it('should handle boolean children without throwing', () => {
			const labelStack = [{ name: 'test', segmentId: 'seg-1' }];

			expect(() => {
				render(
					<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
						{false}
					</SsrRenderProfilerInner>,
				);
			}).not.toThrow();
		});
	});

	describe('labelStack handling', () => {
		it('should handle simple labelStack', () => {
			const labelStack = [{ name: 'segment1', segmentId: 'id1' }];

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<div>Test</div>
				</SsrRenderProfilerInner>,
			);

			expect(screen.getByText('Test')).toBeInTheDocument();
		});

		it('should handle nested labelStack', () => {
			const labelStack = [
				{ name: 'parent', segmentId: 'id1' },
				{ name: 'child', segmentId: 'id2' },
				{ name: 'grandchild', segmentId: 'id3' },
			];

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<div>Nested Content</div>
				</SsrRenderProfilerInner>,
			);

			expect(screen.getByText('Nested Content')).toBeInTheDocument();
		});

		it('should handle labelStack with segment types', () => {
			const labelStack = [
				{ name: 'segment1', segmentId: 'id1', type: 'third-party' as const },
				{ name: 'segment2', segmentId: 'id2' },
			];

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<div>Test</div>
				</SsrRenderProfilerInner>,
			);

			expect(screen.getByText('Test')).toBeInTheDocument();
		});

		it('should handle empty labelStack name', () => {
			const labelStack = [{ name: '', segmentId: 'seg-1' }];

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<div>Test</div>
				</SsrRenderProfilerInner>,
			);

			expect(screen.getByText('Test')).toBeInTheDocument();
		});

		it('should handle special characters in labelStack names', () => {
			const labelStack = [
				{ name: 'test-segment/with/slashes', segmentId: 'seg-1' },
				{ name: 'test_segment_with_underscores', segmentId: 'seg-2' },
				{ name: 'test.segment.with.dots', segmentId: 'seg-3' },
			];

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<div>Test</div>
				</SsrRenderProfilerInner>,
			);

			expect(screen.getByText('Test')).toBeInTheDocument();
		});

		it('should handle unicode characters in names', () => {
			const labelStack = [
				{ name: '段落', segmentId: 'seg-1' },
				{ name: 'セクション', segmentId: 'seg-2' },
				{ name: '컴포넌트', segmentId: 'seg-3' },
			];

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<div>Test</div>
				</SsrRenderProfilerInner>,
			);

			expect(screen.getByText('Test')).toBeInTheDocument();
		});

		it('should handle very large labelStack', () => {
			const labelStack = Array.from({ length: 50 }, (_, i) => ({
				name: `segment-${i}`,
				segmentId: `id-${i}`,
			}));

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<div>Test</div>
				</SsrRenderProfilerInner>,
			);

			expect(screen.getByText('Test')).toBeInTheDocument();
		});
	});

	describe('component structure', () => {
		it('should accept labelStack and onRender props', () => {
			const labelStack = [{ name: 'test', segmentId: 'seg-1' }];

			expect(() => {
				render(
					<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
						<div>Test</div>
					</SsrRenderProfilerInner>,
				);
			}).not.toThrow();
		});

		it('should accept optional children', () => {
			const labelStack = [{ name: 'test', segmentId: 'seg-1' }];

			expect(() => {
				render(<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender} />);
			}).not.toThrow();
		});
	});

	describe('useMemo for labelStack', () => {
		it('should compute labelStack memoization correctly', () => {
			const labelStack = [
				{ name: 'page', segmentId: 'id1' },
				{ name: 'section', segmentId: 'id2' },
			];

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<div>Test</div>
				</SsrRenderProfilerInner>,
			);

			expect(screen.getByText('Test')).toBeInTheDocument();
		});
	});

	describe('deeply nested components', () => {
		it('should handle deeply nested components', () => {
			const labelStack = [
				{ name: 'page', segmentId: 'id1' },
				{ name: 'section', segmentId: 'id2' },
				{ name: 'subsection', segmentId: 'id3' },
				{ name: 'component', segmentId: 'id4' },
			];

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<div>
						<div>
							<div>
								<span>Deeply nested content</span>
							</div>
						</div>
					</div>
				</SsrRenderProfilerInner>,
			);

			expect(screen.getByText('Deeply nested content')).toBeInTheDocument();
		});
	});

	describe('large content', () => {
		it('should handle large content', () => {
			const labelStack = [{ name: 'large-segment', segmentId: 'seg-1' }];
			const items = Array.from({ length: 100 }, (_, i) => <div key={i}>{`Item ${i}`}</div>);

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					{items}
				</SsrRenderProfilerInner>,
			);

			expect(screen.getByText('Item 0')).toBeInTheDocument();
			expect(screen.getByText('Item 99')).toBeInTheDocument();
		});
	});

	describe('conditional content', () => {
		it('should handle conditional content', () => {
			const labelStack = [{ name: 'conditional', segmentId: 'seg-1' }];
			const showContent = true;

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					{showContent && <div>Conditional Content</div>}
				</SsrRenderProfilerInner>,
			);

			expect(screen.getByText('Conditional Content')).toBeInTheDocument();
		});
	});

	describe('active interaction tracking', () => {
		it('should track active interaction', () => {
			const interactionId = 'interaction-123';
			mockGetActiveInteraction.mockReturnValue({ id: interactionId });

			const labelStack = [{ name: 'test', segmentId: 'seg-1' }];

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<div>Test</div>
				</SsrRenderProfilerInner>,
			);

			expect(mockGetActiveInteraction).toHaveBeenCalled();
		});

		it('should handle no active interaction', () => {
			mockGetActiveInteraction.mockReturnValue(undefined);

			const labelStack = [{ name: 'test', segmentId: 'seg-1' }];

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<div>Test</div>
				</SsrRenderProfilerInner>,
			);

			expect(mockGetActiveInteraction).toHaveBeenCalled();
		});

		it('should handle when getActiveInteraction returns object with id', () => {
			mockGetActiveInteraction.mockReturnValue({ id: 'test-id' });

			const labelStack = [{ name: 'test', segmentId: 'seg-1' }];

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<div>Test</div>
				</SsrRenderProfilerInner>,
			);

			expect(mockGetActiveInteraction).toHaveBeenCalled();
		});

		it('should handle when getActiveInteraction returns null', () => {
			mockGetActiveInteraction.mockReturnValue(null);

			const labelStack = [{ name: 'test', segmentId: 'seg-1' }];

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<div>Test</div>
				</SsrRenderProfilerInner>,
			);

			expect(mockGetActiveInteraction).toHaveBeenCalled();
		});
	});

	describe('rerendering', () => {
		it('should handle rerendering with same labelStack', () => {
			const labelStack = [{ name: 'test', segmentId: 'seg-1' }];

			const { rerender } = render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<div>Test 1</div>
				</SsrRenderProfilerInner>,
			);

			rerender(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<div>Test 2</div>
				</SsrRenderProfilerInner>,
			);

			expect(screen.getByText('Test 2')).toBeInTheDocument();
		});

		it('should handle changing labelStack', () => {
			const labelStack1 = [{ name: 'segment1', segmentId: 'id1' }];
			const labelStack2 = [{ name: 'segment2', segmentId: 'id2' }];

			const { rerender } = render(
				<SsrRenderProfilerInner labelStack={labelStack1} onRender={mockOnRender}>
					<div>First</div>
				</SsrRenderProfilerInner>,
			);

			rerender(
				<SsrRenderProfilerInner labelStack={labelStack2} onRender={mockOnRender}>
					<div>Second</div>
				</SsrRenderProfilerInner>,
			);

			expect(screen.getByText('Second')).toBeInTheDocument();
		});
	});

	describe('performance', () => {
		it('should complete rendering in reasonable time', () => {
			const labelStack = [{ name: 'perf-test', segmentId: 'seg-1' }];
			const startTime = performance.now();

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<div>Performance test content</div>
				</SsrRenderProfilerInner>,
			);

			const endTime = performance.now();
			const duration = endTime - startTime;

			expect(duration).toBeLessThan(1000);
		});
	});

	describe('Fragment and JSX', () => {
		it('should handle React.Fragment children', () => {
			const labelStack = [{ name: 'test', segmentId: 'seg-1' }];

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<React.Fragment>
						<div>Fragment 1</div>
						<div>Fragment 2</div>
					</React.Fragment>
				</SsrRenderProfilerInner>,
			);

			expect(screen.getByText('Fragment 1')).toBeInTheDocument();
			expect(screen.getByText('Fragment 2')).toBeInTheDocument();
		});
	});

	describe('component composition', () => {
		const ChildComponent = ({ content }: { content: string }) => <div>{content}</div>;

		it('should render component children correctly', () => {
			const labelStack = [{ name: 'test', segmentId: 'seg-1' }];

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<ChildComponent content="Component content" />
				</SsrRenderProfilerInner>,
			);

			expect(screen.getByText('Component content')).toBeInTheDocument();
		});

		it('should render multiple component children', () => {
			const labelStack = [{ name: 'test', segmentId: 'seg-1' }];

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<ChildComponent content="First" />
					<ChildComponent content="Second" />
					<ChildComponent content="Third" />
				</SsrRenderProfilerInner>,
			);

			expect(screen.getByText('First')).toBeInTheDocument();
			expect(screen.getByText('Second')).toBeInTheDocument();
			expect(screen.getByText('Third')).toBeInTheDocument();
		});
	});
});
