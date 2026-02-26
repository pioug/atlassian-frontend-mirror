import type { DocNode } from '@atlaskit/adf-schema';
import { useEffect } from 'react';
import { getDocument } from '@atlaskit/browser-apis';
import {
	DEFAULT_BLOCK_LINK_HASH_PREFIX,
	expandAllParentsThenScroll,
	expandElement,
	isExpandCollapsed,
	findNodeWithExpandParents,
	getLocalIdSelector,
} from '@atlaskit/editor-common/block-menu';
import { useStableScroll } from './useStableScroll';

/**
 * useScrollToBlock - Handler for block link scrolling in the renderer with expand support
 *
 * This hook enables scroll-to-block functionality when blocks may be hidden inside collapsed expands.
 * It searches the ADF document for the target block, identifies any parent expand nodes,
 * expands them if needed, and waits for layout stability before scrolling to the block.
 *
 * This implementation waits for the container to stabilize (no layout shifts) before scrolling,
 * which prevents issues with images loading, dynamic content, or other async operations that
 * cause layout changes.
 *
 * @param containerRef - Optional ref to the renderer container (RendererStyleContainer)
 * @param adfDoc - The ADF document to search for nodes and expand parents
 */
export const useScrollToBlock = (
	containerRef?: React.RefObject<HTMLDivElement>,
	adfDoc?: DocNode,
): void => {
	const { waitForStability, cleanup: cleanupStability } = useStableScroll({
		stabilityWaitTime: 750,
		maxStabilityWaitTime: 10_000,
	});

	useEffect(() => {
		// Only run in browser environment.
		if (typeof window === 'undefined' || !containerRef?.current) {
			return;
		}

		// Parse hash fragment for block ID (format: #block-{localId}).
		const hash = window.location.hash;
		const defaultPrefixWithHash = `#${DEFAULT_BLOCK_LINK_HASH_PREFIX}`;
		const blockId =
			hash && hash.startsWith(defaultPrefixWithHash)
				? hash.slice(defaultPrefixWithHash.length)
				: null;

		if (!blockId) {
			return;
		}

		let retryCount = 0;
		const maxRetries = 40;
		const retryInterval = 250;
		let intervalId: NodeJS.Timeout | null = null;
		let hasScrolled = false;
		let cancelExpandAndScroll: (() => void) | null = null;

		const scrollToElement = () => {
			// Step 1: Search the ADF document for the node with the given blockId.
			// This works even if the node is hidden inside a collapsed expand.
			if (!adfDoc || !containerRef?.current) {
				return false;
			}

			const nodeWithExpandParents = findNodeWithExpandParents(adfDoc, blockId);

			if (!nodeWithExpandParents) {
				// Node not found in ADF document.
				return false;
			}

			const { expandParentLocalIds } = nodeWithExpandParents;

			// Step 2: If the node has expand parents, we need to expand them first.
			if (expandParentLocalIds.length > 0) {
				// Find the expand elements in the DOM using their localIds.
				// Note: We need to expand from outermost to innermost.
				let allExpandsFound = true;
				let anyExpandsCollapsed = false;

				for (const expandLocalId of expandParentLocalIds) {
					const expandContainer = containerRef.current.querySelector<HTMLElement>(
						`[data-local-id="${expandLocalId}"]`,
					);

					if (!expandContainer) {
						// Expand not found in DOM yet (shouldn't happen but handle it).
						allExpandsFound = false;
						break;
					}

					// Check if this expand is collapsed.
					if (isExpandCollapsed(expandContainer)) {
						anyExpandsCollapsed = true;
						// Expand it.
						expandElement(expandContainer);
						// After expanding, we need to retry to handle nested expands.
						// The DOM needs time to update.
						return false; // Will retry after interval.
					}
				}

				if (!allExpandsFound) {
					// Retry later when expands are in DOM.
					return false;
				}

				// All parent expands are now open (or we just expanded one and need to wait).
				if (anyExpandsCollapsed) {
					// Just expanded something, wait for DOM update.
					return false;
				}
			}

			// Step 3: Now the target element should be visible in the DOM, find it and scroll.
			const element = getLocalIdSelector(blockId, containerRef.current);

			if (!element) {
				// Element still not in DOM, retry.
				return false;
			}

			// Element found and all parent expands are open! Use the utility to scroll.
			// (This will handle any final edge cases and do the actual scrolling).
			// Capture cleanup function to cancel pending timeouts.
			cancelExpandAndScroll = expandAllParentsThenScroll(element);

			return true;
		};

		const performScroll = () => {
			if (hasScrolled) {
				return;
			}

			// Try to scroll to element.
			if (scrollToElement()) {
				hasScrolled = true;
				cleanup();
			}
		};

		const attemptScroll = () => {
			retryCount++;

			// Try to find the element first.
			if (!adfDoc || !containerRef?.current) {
				return false;
			}

			const nodeWithExpandParents = findNodeWithExpandParents(adfDoc, blockId);
			if (!nodeWithExpandParents) {
				return false;
			}

			const { expandParentLocalIds } = nodeWithExpandParents;

			// Check if all expands are expanded and element exists.
			let allReady = true;

			if (expandParentLocalIds.length > 0) {
				for (const expandLocalId of expandParentLocalIds) {
					const expandContainer = containerRef.current.querySelector<HTMLElement>(
						`[data-local-id="${expandLocalId}"]`,
					);

					if (!expandContainer) {
						allReady = false;
						break;
					}

					if (isExpandCollapsed(expandContainer)) {
						expandElement(expandContainer);
						allReady = false;
						break;
					}
				}
			}

			const element = getLocalIdSelector(blockId, containerRef.current);
			if (!element) {
				allReady = false;
			}

			// If everything is ready, start monitoring for stability.
			if (allReady) {
				if (intervalId) {
					clearInterval(intervalId);
					intervalId = null;
				}
				waitForStability(containerRef.current, performScroll);
				return true;
			}

			// Stop retrying if we've exceeded max retries.
			if (retryCount >= maxRetries) {
				cleanup();
				return false;
			}

			return false;
		};

		const cleanup = () => {
			if (intervalId) {
				clearInterval(intervalId);
				intervalId = null;
			}
			cleanupStability();
			// Cancel any pending expand and scroll operations.
			if (cancelExpandAndScroll) {
				cancelExpandAndScroll();
				cancelExpandAndScroll = null;
			}
		};

		// Try to scroll immediately.
		if (attemptScroll()) {
			return cleanup;
		}

		if (getDocument()?.readyState === 'complete') {
			// Document is already ready, try a few more times with delays.
			// This handles cases where elements are added after document ready.
			intervalId = setInterval(() => {
				attemptScroll();
			}, retryInterval);
		} else {
			// Document not ready yet, wait for it and then retry.
			intervalId = setInterval(() => {
				if (getDocument()?.readyState === 'complete') {
					attemptScroll();
				} else if (retryCount >= maxRetries) {
					cleanup();
				} else {
					retryCount++;
				}
			}, retryInterval);
		}

		// Cleanup function.
		return cleanup;
		// Intentionally not including adfDoc in the dependency array to avoid unnecessary re-renders.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [containerRef, waitForStability, cleanupStability]);
};
