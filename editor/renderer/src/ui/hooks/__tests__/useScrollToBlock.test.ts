import { renderHook, act } from '@atlassian/testing-library';
import type { DocNode } from '@atlaskit/adf-schema';
import { useScrollToBlock } from '../useScrollToBlock';
import * as blockMenuUtils from '@atlaskit/editor-common/block-menu';

// Mock the block menu utilities
jest.mock('@atlaskit/editor-common/block-menu', () => ({
	...jest.requireActual('@atlaskit/editor-common/block-menu'),
	expandAllParentsThenScroll: jest.fn(),
	expandElement: jest.fn(),
	isExpandCollapsed: jest.fn(),
	findNodeWithExpandParents: jest.fn(),
	getLocalIdSelector: jest.fn(),
}));

// Mock useStableScroll
const mockWaitForStability = jest.fn();
const mockCleanupStability = jest.fn();
jest.mock('../useStableScroll', () => ({
	useStableScroll: jest.fn(() => ({
		waitForStability: mockWaitForStability,
		cleanup: mockCleanupStability,
	})),
}));

describe('useScrollToBlock', () => {
	const mockFindNodeWithExpandParents = blockMenuUtils.findNodeWithExpandParents as jest.Mock;
	const mockGetLocalIdSelector = blockMenuUtils.getLocalIdSelector as jest.Mock;
	const mockIsExpandCollapsed = blockMenuUtils.isExpandCollapsed as jest.Mock;
	const mockExpandElement = blockMenuUtils.expandElement as jest.Mock;
	const mockExpandAllParentsThenScroll = blockMenuUtils.expandAllParentsThenScroll as jest.Mock;

	let originalHash: string;
	let originalReadyState: DocumentReadyState;

	beforeEach(() => {
		jest.clearAllMocks();
		jest.useFakeTimers();
		document.body.innerHTML = '';

		// Store original values
		originalHash = window.location.hash;
		originalReadyState = document.readyState;

		// Set default hash
		Object.defineProperty(window, 'location', {
			value: {
				hash: '#block-test-local-id',
			},
			writable: true,
			configurable: true,
		});

		// Mock document readyState
		Object.defineProperty(document, 'readyState', {
			writable: true,
			configurable: true,
			value: 'complete',
		});

		// Default mock implementations
		mockWaitForStability.mockImplementation((_container, _callback) => {
			// Don't call callback immediately by default - let tests control when stability is achieved
		});
	});

	afterEach(() => {
		jest.useRealTimers();

		// Restore original values
		Object.defineProperty(window, 'location', {
			value: {
				hash: originalHash,
			},
			writable: true,
			configurable: true,
		});

		Object.defineProperty(document, 'readyState', {
			writable: true,
			configurable: true,
			value: originalReadyState,
		});
	});

	describe('basic functionality', () => {
		it('should not run when containerRef is null', () => {
			expect.assertions(1);
			const containerRef = { current: null };
			const adfDoc: DocNode = { type: 'doc', version: 1, content: [] };

			renderHook(() => useScrollToBlock(containerRef, adfDoc));

			expect(mockFindNodeWithExpandParents).not.toHaveBeenCalled();
		});

		it('should not run when no block parameter is present in hash', () => {
			expect.assertions(1);
			Object.defineProperty(window, 'location', {
				value: { hash: '' },
				writable: true,
				configurable: true,
			});

			const containerDiv = document.createElement('div');
			const containerRef = { current: containerDiv };
			const adfDoc: DocNode = { type: 'doc', version: 1, content: [] };

			renderHook(() => useScrollToBlock(containerRef, adfDoc));

			expect(mockFindNodeWithExpandParents).not.toHaveBeenCalled();
		});

		it('should not scroll when node is not found in ADF', () => {
			expect.assertions(1);
			const containerDiv = document.createElement('div');
			const containerRef = { current: containerDiv };
			const adfDoc: DocNode = { type: 'doc', version: 1, content: [] };

			mockFindNodeWithExpandParents.mockReturnValue(undefined);

			renderHook(() => useScrollToBlock(containerRef, adfDoc));

			// Wait for immediate attempt
			act(() => {
				jest.runOnlyPendingTimers();
			});

			expect(mockExpandAllParentsThenScroll).not.toHaveBeenCalled();
		});
	});

	describe('scrolling without expand parents', () => {
		it('should scroll to element when node has no expand parents', () => {
			expect.assertions(2);
			const containerDiv = document.createElement('div');
			const targetElement = document.createElement('div');
			targetElement.setAttribute('data-local-id', 'test-local-id');
			containerDiv.appendChild(targetElement);
			document.body.appendChild(containerDiv);

			const containerRef = { current: containerDiv };
			const adfDoc: DocNode = {
				type: 'doc',
				version: 1,
				content: [
					{
						type: 'paragraph',
						attrs: { localId: 'test-local-id' },
						content: [],
					},
				],
			};

			mockFindNodeWithExpandParents.mockReturnValue({
				expandParentLocalIds: [],
			});
			mockGetLocalIdSelector.mockReturnValue(targetElement);

			// Capture the stability callback
			let stabilityCallback: (() => void) | null = null;
			mockWaitForStability.mockImplementation((container, callback) => {
				stabilityCallback = callback;
			});

			renderHook(() => useScrollToBlock(containerRef, adfDoc));

			// Wait for immediate attempt and stability check
			act(() => {
				jest.runOnlyPendingTimers();
			});

			expect(mockWaitForStability).toHaveBeenCalledWith(containerDiv, expect.any(Function));

			// Trigger stability callback
			act(() => {
				stabilityCallback?.();
			});

			expect(mockExpandAllParentsThenScroll).toHaveBeenCalledWith(targetElement);
		});

		it('should retry finding element if not immediately available', () => {
			expect.assertions(2);
			const containerDiv = document.createElement('div');
			const containerRef = { current: containerDiv };
			const adfDoc: DocNode = {
				type: 'doc',
				version: 1,
				content: [
					{
						type: 'paragraph',
						attrs: { localId: 'test-local-id' },
						content: [],
					},
				],
			};

			mockFindNodeWithExpandParents.mockReturnValue({
				expandParentLocalIds: [],
			});

			// Element not found initially
			mockGetLocalIdSelector.mockReturnValue(null);

			// Capture the stability callback
			let stabilityCallback: (() => void) | null = null;
			mockWaitForStability.mockImplementation((container, callback) => {
				stabilityCallback = callback;
			});

			renderHook(() => useScrollToBlock(containerRef, adfDoc));

			// Initial attempt
			act(() => {
				jest.runOnlyPendingTimers();
			});

			expect(mockExpandAllParentsThenScroll).not.toHaveBeenCalled();

			// Add element to DOM and update mock to return it
			const targetElement = document.createElement('div');
			targetElement.setAttribute('data-local-id', 'test-local-id');
			containerDiv.appendChild(targetElement);
			mockGetLocalIdSelector.mockReturnValue(targetElement);

			// Reset mockWaitForStability to capture new callback
			mockWaitForStability.mockClear();
			mockWaitForStability.mockImplementation((container, callback) => {
				stabilityCallback = callback;
			});

			// Retry
			act(() => {
				jest.advanceTimersByTime(250);
			});

			// Trigger stability callback
			act(() => {
				stabilityCallback?.();
			});

			expect(mockExpandAllParentsThenScroll).toHaveBeenCalledWith(targetElement);
		});
	});

	describe('scrolling with expand parents', () => {
		it('should expand collapsed parent expand before scrolling', () => {
			expect.assertions(4);
			const containerDiv = document.createElement('div');
			const expandContainer = document.createElement('div');
			expandContainer.setAttribute('data-local-id', 'expand-1');
			expandContainer.setAttribute('data-node-type', 'expand');

			const targetElement = document.createElement('div');
			targetElement.setAttribute('data-local-id', 'test-local-id');
			expandContainer.appendChild(targetElement);
			containerDiv.appendChild(expandContainer);
			document.body.appendChild(containerDiv);

			const containerRef = { current: containerDiv };
			const adfDoc: DocNode = {
				type: 'doc',
				version: 1,
				content: [
					{
						type: 'expand',
						attrs: { localId: 'expand-1' },
						content: [
							{
								type: 'paragraph',
								attrs: { localId: 'test-local-id' },
								content: [],
							},
						],
					},
				],
			};

			mockFindNodeWithExpandParents.mockReturnValue({
				expandParentLocalIds: ['expand-1'],
			});
			mockIsExpandCollapsed.mockReturnValue(true);
			mockExpandElement.mockReturnValue(true);
			mockGetLocalIdSelector.mockReturnValue(null); // Not visible until expanded

			renderHook(() => useScrollToBlock(containerRef, adfDoc));

			// Initial attempt
			act(() => {
				jest.runOnlyPendingTimers();
			});

			expect(mockExpandElement).toHaveBeenCalledWith(expandContainer);
			expect(mockExpandAllParentsThenScroll).not.toHaveBeenCalled();

			// After expansion, element becomes visible
			mockIsExpandCollapsed.mockReturnValue(false);
			mockGetLocalIdSelector.mockReturnValue(targetElement);

			// Capture the stability callback
			let stabilityCallback: (() => void) | null = null;
			mockWaitForStability.mockImplementation((container, callback) => {
				stabilityCallback = callback;
			});

			// Retry after interval
			act(() => {
				jest.advanceTimersByTime(250);
			});

			expect(mockWaitForStability).toHaveBeenCalledWith(containerDiv, expect.any(Function));

			// Trigger stability callback
			act(() => {
				stabilityCallback?.();
			});

			expect(mockExpandAllParentsThenScroll).toHaveBeenCalledWith(targetElement);
		});

		it('should handle multiple nested expand parents', () => {
			expect.assertions(4);
			const containerDiv = document.createElement('div');

			const outerExpand = document.createElement('div');
			outerExpand.setAttribute('data-local-id', 'expand-1');
			outerExpand.setAttribute('data-node-type', 'expand');

			const innerExpand = document.createElement('div');
			innerExpand.setAttribute('data-local-id', 'expand-2');
			innerExpand.setAttribute('data-node-type', 'nestedExpand');

			const targetElement = document.createElement('div');
			targetElement.setAttribute('data-local-id', 'test-local-id');

			innerExpand.appendChild(targetElement);
			outerExpand.appendChild(innerExpand);
			containerDiv.appendChild(outerExpand);
			document.body.appendChild(containerDiv);

			const containerRef = { current: containerDiv };
			const adfDoc: DocNode = {
				type: 'doc',
				version: 1,
				content: [
					{
						type: 'expand',
						attrs: { localId: 'expand-1' },
						content: [
							{
								type: 'nestedExpand',
								attrs: { localId: 'expand-2' },
								content: [
									{
										type: 'paragraph',
										attrs: { localId: 'test-local-id' },
										content: [],
									},
								],
							},
						],
					},
				],
			};

			mockFindNodeWithExpandParents.mockReturnValue({
				expandParentLocalIds: ['expand-1', 'expand-2'],
			});

			// First attempt: outer expand is collapsed
			mockIsExpandCollapsed.mockImplementation((el) => el === outerExpand);
			mockExpandElement.mockReturnValue(true);
			mockGetLocalIdSelector.mockReturnValue(null);

			renderHook(() => useScrollToBlock(containerRef, adfDoc));

			// Initial attempt
			act(() => {
				jest.runOnlyPendingTimers();
			});

			expect(mockExpandElement).toHaveBeenCalledWith(outerExpand);

			// Second attempt: outer is expanded, inner is collapsed
			mockIsExpandCollapsed.mockImplementation((el) => el === innerExpand);

			act(() => {
				jest.advanceTimersByTime(250);
			});

			expect(mockExpandElement).toHaveBeenCalledWith(innerExpand);

			// Third attempt: both expanded
			mockIsExpandCollapsed.mockReturnValue(false);
			mockGetLocalIdSelector.mockReturnValue(targetElement);

			// Capture the stability callback
			let stabilityCallback: (() => void) | null = null;
			mockWaitForStability.mockImplementation((container, callback) => {
				stabilityCallback = callback;
			});

			act(() => {
				jest.advanceTimersByTime(250);
			});

			expect(mockWaitForStability).toHaveBeenCalledWith(containerDiv, expect.any(Function));

			// Trigger stability callback
			act(() => {
				stabilityCallback?.();
			});

			expect(mockExpandAllParentsThenScroll).toHaveBeenCalledWith(targetElement);
		});

		it('should not attempt to expand already expanded parents', () => {
			expect.assertions(3);
			const containerDiv = document.createElement('div');
			const expandContainer = document.createElement('div');
			expandContainer.setAttribute('data-local-id', 'expand-1');
			expandContainer.setAttribute('data-node-type', 'expand');

			const targetElement = document.createElement('div');
			targetElement.setAttribute('data-local-id', 'test-local-id');
			expandContainer.appendChild(targetElement);
			containerDiv.appendChild(expandContainer);
			document.body.appendChild(containerDiv);

			const containerRef = { current: containerDiv };
			const adfDoc: DocNode = {
				type: 'doc',
				version: 1,
				content: [
					{
						type: 'expand',
						attrs: { localId: 'expand-1' },
						content: [
							{
								type: 'paragraph',
								attrs: { localId: 'test-local-id' },
								content: [],
							},
						],
					},
				],
			};

			mockFindNodeWithExpandParents.mockReturnValue({
				expandParentLocalIds: ['expand-1'],
			});
			mockIsExpandCollapsed.mockReturnValue(false); // Already expanded
			mockGetLocalIdSelector.mockReturnValue(targetElement);

			// Capture the stability callback
			let stabilityCallback: (() => void) | null = null;
			mockWaitForStability.mockImplementation((container, callback) => {
				stabilityCallback = callback;
			});

			renderHook(() => useScrollToBlock(containerRef, adfDoc));

			// Initial attempt
			act(() => {
				jest.runOnlyPendingTimers();
			});

			expect(mockExpandElement).not.toHaveBeenCalled();
			expect(mockWaitForStability).toHaveBeenCalledWith(containerDiv, expect.any(Function));

			// Trigger stability callback
			act(() => {
				stabilityCallback?.();
			});

			expect(mockExpandAllParentsThenScroll).toHaveBeenCalledWith(targetElement);
		});
	});

	describe('stability waiting integration', () => {
		it('should wait for stability before scrolling', () => {
			expect.assertions(3);
			const containerDiv = document.createElement('div');
			const targetElement = document.createElement('div');
			targetElement.setAttribute('data-local-id', 'test-local-id');
			containerDiv.appendChild(targetElement);
			document.body.appendChild(containerDiv);

			const containerRef = { current: containerDiv };
			const adfDoc: DocNode = {
				type: 'doc',
				version: 1,
				content: [
					{
						type: 'paragraph',
						attrs: { localId: 'test-local-id' },
						content: [],
					},
				],
			};

			mockFindNodeWithExpandParents.mockReturnValue({
				expandParentLocalIds: [],
			});
			mockGetLocalIdSelector.mockReturnValue(targetElement);

			// Mock waitForStability to not call callback immediately
			let stabilityCallback: (() => void) | null = null;
			mockWaitForStability.mockImplementation((container, callback) => {
				stabilityCallback = callback;
			});

			renderHook(() => useScrollToBlock(containerRef, adfDoc));

			// Initial attempt
			act(() => {
				jest.runOnlyPendingTimers();
			});

			// Should have called waitForStability
			expect(mockWaitForStability).toHaveBeenCalledWith(containerDiv, expect.any(Function));
			expect(mockExpandAllParentsThenScroll).not.toHaveBeenCalled();

			// Trigger stability callback
			act(() => {
				stabilityCallback?.();
			});

			expect(mockExpandAllParentsThenScroll).toHaveBeenCalledWith(targetElement);
		});

		it('should only scroll once even if stability callback is called multiple times', () => {
			expect.assertions(1);
			const containerDiv = document.createElement('div');
			const targetElement = document.createElement('div');
			targetElement.setAttribute('data-local-id', 'test-local-id');
			containerDiv.appendChild(targetElement);
			document.body.appendChild(containerDiv);

			const containerRef = { current: containerDiv };
			const adfDoc: DocNode = {
				type: 'doc',
				version: 1,
				content: [
					{
						type: 'paragraph',
						attrs: { localId: 'test-local-id' },
						content: [],
					},
				],
			};

			mockFindNodeWithExpandParents.mockReturnValue({
				expandParentLocalIds: [],
			});
			mockGetLocalIdSelector.mockReturnValue(targetElement);

			let stabilityCallback: (() => void) | null = null;
			mockWaitForStability.mockImplementation((container, callback) => {
				stabilityCallback = callback;
			});

			renderHook(() => useScrollToBlock(containerRef, adfDoc));

			act(() => {
				jest.runOnlyPendingTimers();
			});

			// Call stability callback multiple times
			act(() => {
				stabilityCallback?.();
				stabilityCallback?.();
				stabilityCallback?.();
			});

			expect(mockExpandAllParentsThenScroll).toHaveBeenCalledTimes(1);
		});
	});

	describe('retry behavior', () => {
		it('should stop retrying after max retries', () => {
			expect.assertions(2);
			const containerDiv = document.createElement('div');
			const containerRef = { current: containerDiv };
			const adfDoc: DocNode = {
				type: 'doc',
				version: 1,
				content: [
					{
						type: 'paragraph',
						attrs: { localId: 'test-local-id' },
						content: [],
					},
				],
			};

			mockFindNodeWithExpandParents.mockReturnValue({
				expandParentLocalIds: [],
			});
			mockGetLocalIdSelector.mockReturnValue(null); // Never found

			renderHook(() => useScrollToBlock(containerRef, adfDoc));

			// Initial attempt
			act(() => {
				jest.runOnlyPendingTimers();
			});

			// Run through all retries (40 retries at 250ms intervals)
			for (let i = 0; i < 40; i++) {
				act(() => {
					jest.advanceTimersByTime(250);
				});
			}

			// Should have called getLocalIdSelector 40 times (initial + 39 retries, then stops at max)
			expect(mockGetLocalIdSelector).toHaveBeenCalledTimes(40);

			// Additional time should not trigger more retries
			act(() => {
				jest.advanceTimersByTime(1000);
			});

			expect(mockGetLocalIdSelector).toHaveBeenCalledTimes(40);
		});

		it('should wait for document ready state before retrying', () => {
			expect.assertions(2);
			Object.defineProperty(document, 'readyState', {
				writable: true,
				value: 'loading',
			});

			const containerDiv = document.createElement('div');
			const containerRef = { current: containerDiv };
			const adfDoc: DocNode = {
				type: 'doc',
				version: 1,
				content: [
					{
						type: 'paragraph',
						attrs: { localId: 'test-local-id' },
						content: [],
					},
				],
			};

			mockFindNodeWithExpandParents.mockReturnValue({
				expandParentLocalIds: [],
			});
			mockGetLocalIdSelector.mockReturnValue(null);

			renderHook(() => useScrollToBlock(containerRef, adfDoc));

			// Initial attempt
			act(() => {
				jest.runOnlyPendingTimers();
			});

			// Advance timer, but document is still loading
			act(() => {
				jest.advanceTimersByTime(250);
			});

			// Should have only called once (initial attempt)
			expect(mockGetLocalIdSelector).toHaveBeenCalledTimes(1);

			// Document becomes ready
			Object.defineProperty(document, 'readyState', {
				writable: true,
				value: 'complete',
			});

			act(() => {
				jest.advanceTimersByTime(250);
			});

			// Now it should retry
			expect(mockGetLocalIdSelector).toHaveBeenCalledTimes(2);
		});
	});

	describe('cleanup', () => {
		it('should cleanup timers on unmount', () => {
			expect.assertions(1);
			const containerDiv = document.createElement('div');
			const containerRef = { current: containerDiv };
			const adfDoc: DocNode = {
				type: 'doc',
				version: 1,
				content: [
					{
						type: 'paragraph',
						attrs: { localId: 'test-local-id' },
						content: [],
					},
				],
			};

			mockFindNodeWithExpandParents.mockReturnValue({
				expandParentLocalIds: [],
			});
			mockGetLocalIdSelector.mockReturnValue(null);

			const { unmount } = renderHook(() => useScrollToBlock(containerRef, adfDoc));

			// Initial attempt
			act(() => {
				jest.runOnlyPendingTimers();
			});

			// Unmount
			unmount();

			// Advance timers - no more calls should happen
			const callCountBeforeUnmount = mockGetLocalIdSelector.mock.calls.length;
			act(() => {
				jest.advanceTimersByTime(1000);
			});

			expect(mockGetLocalIdSelector).toHaveBeenCalledTimes(callCountBeforeUnmount);
		});

		it('should cleanup stability observer on unmount', () => {
			expect.assertions(1);
			const containerDiv = document.createElement('div');
			const targetElement = document.createElement('div');
			targetElement.setAttribute('data-local-id', 'test-local-id');
			containerDiv.appendChild(targetElement);

			const containerRef = { current: containerDiv };
			const adfDoc: DocNode = {
				type: 'doc',
				version: 1,
				content: [
					{
						type: 'paragraph',
						attrs: { localId: 'test-local-id' },
						content: [],
					},
				],
			};

			mockFindNodeWithExpandParents.mockReturnValue({
				expandParentLocalIds: [],
			});
			mockGetLocalIdSelector.mockReturnValue(targetElement);

			const { unmount } = renderHook(() => useScrollToBlock(containerRef, adfDoc));

			// Initial attempt
			act(() => {
				jest.runOnlyPendingTimers();
			});

			// Unmount should cleanup
			unmount();

			expect(mockCleanupStability).toHaveBeenCalled();
		});

		it('should cleanup on successful scroll', () => {
			expect.assertions(2);
			const containerDiv = document.createElement('div');
			const targetElement = document.createElement('div');
			targetElement.setAttribute('data-local-id', 'test-local-id');
			containerDiv.appendChild(targetElement);

			const containerRef = { current: containerDiv };
			const adfDoc: DocNode = {
				type: 'doc',
				version: 1,
				content: [
					{
						type: 'paragraph',
						attrs: { localId: 'test-local-id' },
						content: [],
					},
				],
			};

			mockFindNodeWithExpandParents.mockReturnValue({
				expandParentLocalIds: [],
			});
			mockGetLocalIdSelector.mockReturnValue(targetElement);

			// Capture the stability callback
			let stabilityCallback: (() => void) | null = null;
			mockWaitForStability.mockImplementation((container, callback) => {
				stabilityCallback = callback;
			});

			renderHook(() => useScrollToBlock(containerRef, adfDoc));

			// Initial attempt
			act(() => {
				jest.runOnlyPendingTimers();
			});

			// Trigger stability callback
			act(() => {
				stabilityCallback?.();
			});

			expect(mockExpandAllParentsThenScroll).toHaveBeenCalled();

			// Advance timer - no more attempts should happen
			const callCountAfterScroll = mockGetLocalIdSelector.mock.calls.length;
			act(() => {
				jest.advanceTimersByTime(1000);
			});

			expect(mockGetLocalIdSelector).toHaveBeenCalledTimes(callCountAfterScroll);
		});
	});

	describe('edge cases', () => {
		it('should handle missing ADF document', () => {
			expect.assertions(1);
			const containerDiv = document.createElement('div');
			const containerRef = { current: containerDiv };

			renderHook(() => useScrollToBlock(containerRef, undefined));

			act(() => {
				jest.runOnlyPendingTimers();
			});

			expect(mockFindNodeWithExpandParents).not.toHaveBeenCalled();
		});

		it('should handle expand container not found in DOM', () => {
			expect.assertions(2);
			const containerDiv = document.createElement('div');
			const containerRef = { current: containerDiv };
			const adfDoc: DocNode = {
				type: 'doc',
				version: 1,
				content: [
					{
						type: 'expand',
						attrs: { localId: 'expand-1' },
						content: [
							{
								type: 'paragraph',
								attrs: { localId: 'test-local-id' },
								content: [],
							},
						],
					},
				],
			};

			mockFindNodeWithExpandParents.mockReturnValue({
				expandParentLocalIds: ['expand-1'],
			});
			mockGetLocalIdSelector.mockReturnValue(null);

			renderHook(() => useScrollToBlock(containerRef, adfDoc));

			act(() => {
				jest.runOnlyPendingTimers();
			});

			// Should not crash, just retry
			expect(mockExpandElement).not.toHaveBeenCalled();

			// findNodeWithExpandParents is called twice during initial attempt
			// Once in attemptScroll and potentially more times during processing
			const initialCallCount = mockFindNodeWithExpandParents.mock.calls.length;

			act(() => {
				jest.advanceTimersByTime(250);
			});

			// Should have retried (called at least once more)
			expect(mockFindNodeWithExpandParents.mock.calls.length).toBeGreaterThan(initialCallCount);
		});

		it('should handle expand element that fails to expand', () => {
			expect.assertions(2);
			const containerDiv = document.createElement('div');
			const expandContainer = document.createElement('div');
			expandContainer.setAttribute('data-local-id', 'expand-1');
			expandContainer.setAttribute('data-node-type', 'expand');
			containerDiv.appendChild(expandContainer);

			const containerRef = { current: containerDiv };
			const adfDoc: DocNode = {
				type: 'doc',
				version: 1,
				content: [
					{
						type: 'expand',
						attrs: { localId: 'expand-1' },
						content: [
							{
								type: 'paragraph',
								attrs: { localId: 'test-local-id' },
								content: [],
							},
						],
					},
				],
			};

			mockFindNodeWithExpandParents.mockReturnValue({
				expandParentLocalIds: ['expand-1'],
			});
			mockIsExpandCollapsed.mockReturnValue(true);
			mockExpandElement.mockReturnValue(false); // Expand fails
			mockGetLocalIdSelector.mockReturnValue(null);

			renderHook(() => useScrollToBlock(containerRef, adfDoc));

			act(() => {
				jest.runOnlyPendingTimers();
			});

			const initialCallCount = mockExpandElement.mock.calls.length;
			expect(initialCallCount).toBeGreaterThan(0);

			// Should retry
			act(() => {
				jest.advanceTimersByTime(250);
			});

			expect(mockExpandElement.mock.calls.length).toBeGreaterThan(initialCallCount);
		});

		it('should handle invalid hash formats', () => {
			expect.assertions(1);
			Object.defineProperty(window, 'location', {
				value: { hash: '#not-a-block-link' },
				writable: true,
			});

			const containerDiv = document.createElement('div');
			const containerRef = { current: containerDiv };
			const adfDoc: DocNode = { type: 'doc', version: 1, content: [] };

			renderHook(() => useScrollToBlock(containerRef, adfDoc));

			act(() => {
				jest.runOnlyPendingTimers();
			});

			expect(mockFindNodeWithExpandParents).not.toHaveBeenCalled();
		});
	});
});
