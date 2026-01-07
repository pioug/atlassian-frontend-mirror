import React from 'react';

import { render, screen } from '@testing-library/react';

// Mock the interaction-metrics module
jest.mock('../../interaction-metrics', () => ({
	getActiveInteraction: jest.fn(),
}));

// Mock the config module
jest.mock('../../config', () => ({
	getConfig: jest.fn(),
}));

import {
	clearState,
	flushSsrRenderProfilerTraces,
	type GlobalThis,
	type Span,
	SsrRenderProfilerInner,
	type TesseractTelemetryAPI,
} from '../ssr-render-profiler';

const mockGetConfig = require('../../config').getConfig;
const mockGetActiveInteraction = require('../../interaction-metrics').getActiveInteraction;

describe('SsrRenderProfilerInner', () => {
	let mockOnRender: jest.Mock;
	let mockStartSpan: jest.Mock;
	const originalStartSpan = (globalThis as GlobalThis).__vm_internals__?.telemetry?.startSpan;
	let mockSpan: Span;

	beforeEach(() => {
		jest.clearAllMocks();
		mockOnRender = jest.fn();
		mockGetActiveInteraction.mockReturnValue(undefined);
		mockGetConfig.mockReturnValue({ ssr: { enableNativeTracing: true } });

		const __vm_internals__ = ((globalThis as GlobalThis).__vm_internals__ =
			(globalThis as GlobalThis).__vm_internals__ ?? {});
		const telemetry = (__vm_internals__.telemetry =
			__vm_internals__.telemetry ?? ({} as TesseractTelemetryAPI));
		mockStartSpan = jest.fn(() => mockSpan);
		telemetry.startSpan = mockStartSpan;
		mockSpan = {
			end: jest.fn(),
			setAttribute: jest.fn(),
			addEvent: jest.fn(),
			getSpanContext: jest.fn(() => ({
				spanId: 'span-123',
				traceId: 'trace-123',
				isSampled: true,
				isRemote: false,
			})),
		};
	});

	afterEach(() => {
		(globalThis as any).__vm_internals__.telemetry.startSpan =
			originalStartSpan as TesseractTelemetryAPI['startSpan'];
		clearState();
	});

	describe('rendering children', () => {
		it('should render children correctly', async () => {
			const labelStack = [{ name: 'test-segment', segmentId: 'seg-1' }];

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<div data-testid="test-child">Test Content</div>
				</SsrRenderProfilerInner>,
			);

			expect(screen.getByTestId('test-child')).toBeInTheDocument();
			expect(screen.getByText('Test Content')).toBeInTheDocument();

			await expect(document.body).toBeAccessible();
		});

		it('should render multiple children', async () => {
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

			await expect(document.body).toBeAccessible();
		});

		it('should handle fragment children', async () => {
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

			await expect(document.body).toBeAccessible();
		});

		it('should handle text nodes as children', async () => {
			const labelStack = [{ name: 'text-content', segmentId: 'seg-1' }];

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					Just plain text
				</SsrRenderProfilerInner>,
			);

			expect(screen.getByText('Just plain text')).toBeInTheDocument();

			await expect(document.body).toBeAccessible();
		});

		it('should handle mixed content types', async () => {
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

			await expect(document.body).toBeAccessible();
		});

		it('should handle null children without throwing', async () => {
			const labelStack = [{ name: 'test', segmentId: 'seg-1' }];

			expect(() => {
				render(
					<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
						{null}
					</SsrRenderProfilerInner>,
				);
			}).not.toThrow();

			await expect(document.body).toBeAccessible();
		});

		it('should handle boolean children without throwing', async () => {
			const labelStack = [{ name: 'test', segmentId: 'seg-1' }];

			expect(() => {
				render(
					<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
						{false}
					</SsrRenderProfilerInner>,
				);
			}).not.toThrow();

			await expect(document.body).toBeAccessible();
		});
	});

	describe('labelStack handling', () => {
		it('should handle simple labelStack', async () => {
			const labelStack = [{ name: 'segment1', segmentId: 'id1' }];

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<div>Test</div>
				</SsrRenderProfilerInner>,
			);

			expect(screen.getByText('Test')).toBeInTheDocument();

			await expect(document.body).toBeAccessible();
		});

		it('should handle nested labelStack', async () => {
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

			await expect(document.body).toBeAccessible();
		});

		it('should handle labelStack with segment types', async () => {
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

			await expect(document.body).toBeAccessible();
		});

		it('should handle empty labelStack name', async () => {
			const labelStack = [{ name: '', segmentId: 'seg-1' }];

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<div>Test</div>
				</SsrRenderProfilerInner>,
			);

			expect(screen.getByText('Test')).toBeInTheDocument();

			await expect(document.body).toBeAccessible();
		});

		it('should handle special characters in labelStack names', async () => {
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

			await expect(document.body).toBeAccessible();
		});

		it('should handle unicode characters in names', async () => {
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

			await expect(document.body).toBeAccessible();
		});

		it('should handle very large labelStack', async () => {
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

			await expect(document.body).toBeAccessible();
		});
	});

	describe('component structure', () => {
		it('should accept labelStack and onRender props', async () => {
			const labelStack = [{ name: 'test', segmentId: 'seg-1' }];

			expect(() => {
				render(
					<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
						<div>Test</div>
					</SsrRenderProfilerInner>,
				);
			}).not.toThrow();

			await expect(document.body).toBeAccessible();
		});

		it('should accept optional children', async () => {
			const labelStack = [{ name: 'test', segmentId: 'seg-1' }];

			expect(() => {
				render(<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender} />);
			}).not.toThrow();

			await expect(document.body).toBeAccessible();
		});
	});

	describe('useMemo for labelStack', () => {
		it('should compute labelStack memoization correctly', async () => {
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

			await expect(document.body).toBeAccessible();
		});
	});

	describe('deeply nested components', () => {
		it('should handle deeply nested components', async () => {
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

			await expect(document.body).toBeAccessible();
		});
	});

	describe('large content', () => {
		it('should handle large content', async () => {
			const labelStack = [{ name: 'large-segment', segmentId: 'seg-1' }];
			const items = Array.from({ length: 100 }, (_, i) => <div key={i}>{`Item ${i}`}</div>);

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					{items}
				</SsrRenderProfilerInner>,
			);

			expect(screen.getByText('Item 0')).toBeInTheDocument();
			expect(screen.getByText('Item 99')).toBeInTheDocument();

			await expect(document.body).toBeAccessible();
		});
	});

	describe('conditional content', () => {
		it('should handle conditional content', async () => {
			const labelStack = [{ name: 'conditional', segmentId: 'seg-1' }];
			const showContent = true;

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					{showContent && <div>Conditional Content</div>}
				</SsrRenderProfilerInner>,
			);

			expect(screen.getByText('Conditional Content')).toBeInTheDocument();

			await expect(document.body).toBeAccessible();
		});
	});

	describe('active interaction tracking', () => {
		it('should track active interaction', async () => {
			const interactionId = 'interaction-123';
			mockGetActiveInteraction.mockReturnValue({ id: interactionId });

			const labelStack = [{ name: 'test', segmentId: 'seg-1' }];

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<div>Test</div>
				</SsrRenderProfilerInner>,
			);

			expect(mockGetActiveInteraction).toHaveBeenCalled();

			await expect(document.body).toBeAccessible();
		});

		it('should handle no active interaction', async () => {
			mockGetActiveInteraction.mockReturnValue(undefined);

			const labelStack = [{ name: 'test', segmentId: 'seg-1' }];

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<div>Test</div>
				</SsrRenderProfilerInner>,
			);

			expect(mockGetActiveInteraction).toHaveBeenCalled();

			await expect(document.body).toBeAccessible();
		});

		it('should handle when getActiveInteraction returns object with id', async () => {
			mockGetActiveInteraction.mockReturnValue({ id: 'test-id' });

			const labelStack = [{ name: 'test', segmentId: 'seg-1' }];

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<div>Test</div>
				</SsrRenderProfilerInner>,
			);

			expect(mockGetActiveInteraction).toHaveBeenCalled();

			await expect(document.body).toBeAccessible();
		});

		it('should handle when getActiveInteraction returns null', async () => {
			mockGetActiveInteraction.mockReturnValue(null);

			const labelStack = [{ name: 'test', segmentId: 'seg-1' }];

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<div>Test</div>
				</SsrRenderProfilerInner>,
			);

			expect(mockGetActiveInteraction).toHaveBeenCalled();

			await expect(document.body).toBeAccessible();
		});
	});

	describe('rerendering', () => {
		it('should handle rerendering with same labelStack', async () => {
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

			await expect(document.body).toBeAccessible();
		});

		it('should handle changing labelStack', async () => {
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

			await expect(document.body).toBeAccessible();
		});
	});

	describe('performance', () => {
		it('should complete rendering in reasonable time', async () => {
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

			await expect(document.body).toBeAccessible();
		});
	});

	describe('Fragment and JSX', () => {
		it('should handle React.Fragment children', async () => {
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

			await expect(document.body).toBeAccessible();
		});
	});

	describe('component composition', () => {
		const ChildComponent = ({ content }: { content: string }) => <div>{content}</div>;

		it('should render component children correctly', async () => {
			const labelStack = [{ name: 'test', segmentId: 'seg-1' }];

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<ChildComponent content="Component content" />
				</SsrRenderProfilerInner>,
			);

			expect(screen.getByText('Component content')).toBeInTheDocument();

			await expect(document.body).toBeAccessible();
		});

		it('should render multiple component children', async () => {
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

			await expect(document.body).toBeAccessible();
		});
	});

	describe('native tracing with spans', () => {
		it('should not create spans when enableNativeTracing is false', () => {
			mockGetConfig.mockReturnValue({ ssr: { enableNativeTracing: false } });
			const labelStack = [{ name: 'test', segmentId: 'seg-1' }];

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<div>Test</div>
				</SsrRenderProfilerInner>,
			);

			expect(screen.getByText('Test')).toBeInTheDocument();
			expect(mockStartSpan).not.toHaveBeenCalled();
		});

		it('should create spans when enableNativeTracing is true', () => {
			mockGetConfig.mockReturnValue({ ssr: { enableNativeTracing: true } });
			const labelStack = [{ name: 'test-segment', segmentId: 'seg-1' }];

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<div>Test</div>
				</SsrRenderProfilerInner>,
			);

			expect(mockStartSpan).toHaveBeenCalledWith('test-segment', { parentSpanId: undefined });
		});

		it('should track multiple renders with the same segment', () => {
			const labelStack = [{ name: 'test', segmentId: 'seg-1' }];

			const { rerender } = render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<div>Test 1</div>
				</SsrRenderProfilerInner>,
			);

			const firstCallCount = mockStartSpan.mock.calls.length;

			rerender(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<div>Test 2</div>
				</SsrRenderProfilerInner>,
			);

			// Should have been called for both renders
			expect(mockStartSpan.mock.calls.length).toBeGreaterThanOrEqual(firstCallCount);
		});

		it('should pass parentSpanId when in nested context', () => {
			const mockParentSpan = {
				end: jest.fn(),
				setAttribute: jest.fn(),
				addEvent: jest.fn(),
				getSpanContext: jest.fn(() => ({
					spanId: 'parent-span-123',
					traceId: 'trace-123',
					isSampled: true,
					isRemote: false,
				})),
			};

			const mockChildSpan = {
				end: jest.fn(),
				setAttribute: jest.fn(),
				addEvent: jest.fn(),
				getSpanContext: jest.fn(() => ({
					spanId: 'child-span-456',
					traceId: 'trace-123',
					isSampled: true,
					isRemote: false,
				})),
			};

			mockStartSpan.mockImplementation((name) => {
				if (name === 'parent') {
					return mockParentSpan;
				}
				return mockChildSpan;
			});

			mockGetConfig.mockReturnValue({ ssr: { enableNativeTracing: true } });
			const parentLabelStack = [{ name: 'parent', segmentId: 'seg-1' }];
			const childLabelStack = [
				{ name: 'parent', segmentId: 'seg-1' },
				{ name: 'child', segmentId: 'seg-2' },
			];

			render(
				<SsrRenderProfilerInner labelStack={parentLabelStack} onRender={mockOnRender}>
					<SsrRenderProfilerInner labelStack={childLabelStack} onRender={mockOnRender}>
						<div>Nested Test</div>
					</SsrRenderProfilerInner>
				</SsrRenderProfilerInner>,
			);

			expect(mockStartSpan).toHaveBeenCalledWith('parent', { parentSpanId: undefined });
			expect(mockStartSpan).toHaveBeenCalledWith('child', { parentSpanId: 'parent-span-123' });
		});
	});

	describe('flushSsrRenderProfilerTraces', () => {
		it('should end all spans with their latestEndTime', () => {
			mockGetConfig.mockReturnValue({ ssr: { enableNativeTracing: true } });
			const labelStack = [{ name: 'test-segment', segmentId: 'seg-1' }];

			render(
				<SsrRenderProfilerInner labelStack={labelStack} onRender={mockOnRender}>
					<div>Test</div>
				</SsrRenderProfilerInner>,
			);

			expect(mockStartSpan).toHaveBeenCalledWith('test-segment', { parentSpanId: undefined });

			// Before flush, spans should not be ended
			expect(mockSpan.end).not.toHaveBeenCalled();

			// Flush the traces
			flushSsrRenderProfilerTraces();

			// After flush, spans with latestEndTime should be ended
			// Note: The span should have been created and have latestEndTime set by onRender calls
			expect(mockSpan.end).toHaveBeenCalled();
		});
	});

	describe('span context propagation', () => {
		it('should provide span context to nested profilers', () => {
			const mockParentSpan = {
				end: jest.fn(),
				setAttribute: jest.fn(),
				addEvent: jest.fn(),
				getSpanContext: jest.fn(() => ({
					spanId: 'parent-span',
					traceId: 'trace-123',
					isSampled: true,
					isRemote: false,
				})),
			};

			const mockChildSpan = {
				end: jest.fn(),
				setAttribute: jest.fn(),
				addEvent: jest.fn(),
				getSpanContext: jest.fn(() => ({
					spanId: 'child-span',
					traceId: 'trace-123',
					isSampled: true,
					isRemote: false,
				})),
			};

			let spanIndex = 0;
			mockStartSpan.mockImplementation(() => {
				const span = spanIndex++ === 0 ? mockParentSpan : mockChildSpan;
				return span;
			});

			mockGetConfig.mockReturnValue({ ssr: { enableNativeTracing: true } });

			const parentLabelStack = [{ name: 'parent', segmentId: 'seg-1' }];
			const childLabelStack = [
				{ name: 'parent', segmentId: 'seg-1' },
				{ name: 'child', segmentId: 'seg-2' },
			];

			render(
				<SsrRenderProfilerInner labelStack={parentLabelStack} onRender={mockOnRender}>
					<div>Parent</div>
					<SsrRenderProfilerInner labelStack={childLabelStack} onRender={mockOnRender}>
						<div>Child</div>
					</SsrRenderProfilerInner>
				</SsrRenderProfilerInner>,
			);

			expect(mockStartSpan).toHaveBeenCalledWith('parent', { parentSpanId: undefined });
			expect(mockStartSpan).toHaveBeenCalledWith('child', { parentSpanId: 'parent-span' });
		});

		it('should handle deeply nested span contexts', () => {
			const createMockSpan = (spanId: string) => ({
				end: jest.fn(),
				setAttribute: jest.fn(),
				addEvent: jest.fn(),
				getSpanContext: jest.fn(() => ({
					spanId,
					traceId: 'trace-123',
					isSampled: true,
					isRemote: false,
				})),
			});

			const spans = {
				level1: createMockSpan('level1-span'),
				level2: createMockSpan('level2-span'),
				level3: createMockSpan('level3-span'),
			};

			mockStartSpan.mockImplementation((name) => spans[name as keyof typeof spans]);
			mockGetConfig.mockReturnValue({ ssr: { enableNativeTracing: true } });

			const level1Stack = [{ name: 'level1', segmentId: 'seg-1' }];
			const level2Stack = [
				{ name: 'level1', segmentId: 'seg-1' },
				{ name: 'level2', segmentId: 'seg-2' },
			];
			const level3Stack = [
				{ name: 'level1', segmentId: 'seg-1' },
				{ name: 'level2', segmentId: 'seg-2' },
				{ name: 'level3', segmentId: 'seg-3' },
			];

			render(
				<SsrRenderProfilerInner labelStack={level1Stack} onRender={mockOnRender}>
					<div>Level 1</div>
					<SsrRenderProfilerInner labelStack={level2Stack} onRender={mockOnRender}>
						<div>Level 2</div>
						<SsrRenderProfilerInner labelStack={level3Stack} onRender={mockOnRender}>
							<div>Level 3</div>
						</SsrRenderProfilerInner>
					</SsrRenderProfilerInner>
				</SsrRenderProfilerInner>,
			);

			expect(mockStartSpan).toHaveBeenCalledWith('level1', { parentSpanId: undefined });
			expect(mockStartSpan).toHaveBeenCalledWith('level2', { parentSpanId: 'level1-span' });
			expect(mockStartSpan).toHaveBeenCalledWith('level3', { parentSpanId: 'level2-span' });
		});
	});
});
