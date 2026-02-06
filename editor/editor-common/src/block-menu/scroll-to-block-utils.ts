/**
 * Shared utilities for scrolling to block elements with expand node support.
 * Used by both Confluence's useScrollOnUrlChange and platform renderer's useScrollToBlock.
 */

import type { DocNode } from '@atlaskit/adf-schema';
import type { ADFEntity } from '@atlaskit/adf-utils/types';

/**
 * Timing constants for expand animation and DOM update delays.
 * These values are tuned for the expand component's behavior and React's update cycle.
 */
export const SCROLL_TO_BLOCK_TIMING = {
	/** Minimal delay for DOM/React updates after expanding (no animation in expand component). */
	DOM_UPDATE_DELAY: 50,
	/** Delay when expand operation fails and needs retry. */
	RETRY_DELAY: 100,
	/** Maximum number of retry attempts before giving up and scrolling anyway. */
	MAX_ATTEMPTS: 5,
	/** Maximum depth of nested expands to search (prevents infinite loops). */
	MAX_EXPAND_DEPTH: 2,
} as const;

export type NodeWithExpandParents = {
	/** Array of expand parent localIds (empty if no expand parents, ordered from outermost to innermost). */
	expandParentLocalIds: string[];
};

/**
 * Find a node by its localId in an ADF document and determine if it has expand or nestedExpand parents.
 * This is used to identify nodes that may be hidden inside collapsed expands.
 *
 * @param adfDoc - The ADF document to search
 * @param targetLocalId - The localId to search for
 * @returns NodeWithExpandParents if found, undefined otherwise
 */
export function findNodeWithExpandParents(
	adfDoc: DocNode,
	targetLocalId: string,
): NodeWithExpandParents | undefined {
	let result: NodeWithExpandParents | undefined;

	/**
	 * Recursive helper to traverse the ADF document and track expand ancestors.
	 * We use recursion to properly maintain the expand ancestor stack.
	 */
	const traverse = (node: ADFEntity, expandAncestors: string[]): boolean => {
		// If we already found the target, stop traversing
		if (result) {
			return false;
		}

		// Check if this is the target node by localId
		if (node?.attrs?.localId === targetLocalId) {
			result = {
				expandParentLocalIds: [...expandAncestors], // Copy the array
			};
			return false; // Stop traversing
		}

		// Check if this node is an expand or nestedExpand
		const isExpand = node?.type === 'expand' || node?.type === 'nestedExpand';
		const newExpandAncestors =
			isExpand && node?.attrs?.localId ? [...expandAncestors, node.attrs.localId] : expandAncestors;

		// Traverse children if they exist
		if (node?.content && Array.isArray(node.content)) {
			for (const child of node.content) {
				if (result || !child) {
					break;
				}
				traverse(child, newExpandAncestors);
			}
		}

		return !result; // Continue if we haven't found it yet
	};

	// Start traversal from the root
	traverse(adfDoc, []);

	return result;
}

/**
 * Find all parent expand elements that contain the target element.
 * Searches up the DOM tree to find expand or nestedExpand containers.
 *
 * This function limits the search depth to prevent infinite loops and performance issues.
 * The default maxDepth of 2 is chosen because:
 * - Most use cases have 0-2 levels of nesting
 * - Searching deeper can impact performance
 * - Users rarely nest expands more than 2 levels deep
 *
 * @param element - The target element to find parents for.
 * @param maxDepth - Maximum depth to search (default: 2). This is the maximum number of
 *                   expand ancestors to find, starting from the target element.
 * @returns Array of expand containers ordered from outermost to innermost.
 *          For example, if element is inside expand B which is inside expand A,
 *          this returns [expandA, expandB].
 */
export const findParentExpands = (
	element: HTMLElement,
	maxDepth: number = SCROLL_TO_BLOCK_TIMING.MAX_EXPAND_DEPTH,
): HTMLElement[] => {
	const expands: HTMLElement[] = [];
	let currentElement: HTMLElement | null = element;
	let depth = 0;

	while (currentElement && depth < maxDepth) {
		// Look for expand container - handles both "expand" and "nestedExpand" types
		const expandContainer: HTMLElement | null = currentElement.closest<HTMLElement>(
			'[data-node-type="expand"], [data-node-type="nestedExpand"]',
		);

		if (!expandContainer || expands.includes(expandContainer)) {
			break;
		}

		expands.push(expandContainer);
		currentElement = expandContainer.parentElement;
		depth++;
	}

	// Return in reverse order so we expand from outermost to innermost
	return expands.reverse();
};

/**
 * Check if an expand node is currently collapsed.
 *
 * Uses two methods to determine collapse state:
 * 1. First checks aria-expanded attribute on the toggle button (most reliable).
 * 2. Falls back to checking content div visibility via computed styles.
 *
 * @param expandContainer - The expand container element.
 * @returns True if the expand is collapsed, false if expanded or state cannot be determined.
 */
export const isExpandCollapsed = (expandContainer: HTMLElement): boolean => {
	// Check for aria-expanded attribute on the toggle button
	const toggleButton = expandContainer.querySelector('[aria-expanded]');
	if (toggleButton && toggleButton instanceof HTMLElement) {
		return toggleButton.getAttribute('aria-expanded') === 'false';
	}

	// Fallback: check if content div is hidden using the actual class name
	const contentDiv = expandContainer.querySelector('.ak-editor-expand__content');
	if (contentDiv && contentDiv instanceof HTMLElement) {
		const computedStyle = window.getComputedStyle(contentDiv);
		return (
			computedStyle.display === 'none' || computedStyle.visibility === 'hidden' || contentDiv.hidden
		);
	}

	return false;
};

/**
 * Expand a collapsed expand node by clicking its toggle button.
 *
 * This function finds the toggle button with aria-expanded="false" and programmatically
 * clicks it to expand the node. It does not wait for the expansion to complete.
 *
 * @param expandContainer - The expand container element.
 * @returns True if the toggle button was found and clicked, false otherwise.
 */
export const expandElement = (expandContainer: HTMLElement): boolean => {
	// Find and click the toggle button
	const toggleButton = expandContainer.querySelector('[aria-expanded="false"]');

	if (toggleButton && toggleButton instanceof HTMLElement) {
		toggleButton.click();
		return true;
	}

	return false;
};

/**
 * Expand all parent expands then scroll to the element.
 *
 * This is the main entry point for scrolling to elements that may be hidden inside collapsed expands.
 * It handles nested expands by expanding them one at a time from outermost to innermost,
 * waiting for DOM updates between each expansion.
 *
 * The function uses a recursive approach with retry logic to handle:
 * - Nested expands that need sequential expansion
 * - DOM updates that may take time to reflect
 * - Failed expand operations (e.g., if toggle button is temporarily unavailable)
 * - Disconnected elements (removed from DOM)
 *
 * After all parent expands are open (or max attempts reached), scrolls the element into view
 * with smooth behavior and centered in the viewport.
 *
 * @param element - The target element to scroll to.
 * @param attempt - Current attempt number (used internally for retry logic, starts at 0).
 * @returns A cleanup function that cancels any pending timeouts. Call this when the operation
 *          should be aborted (e.g., component unmount, navigation, or new scroll request).
 */
export const expandAllParentsThenScroll = (
	element: HTMLElement,
	attempt: number = 0,
): (() => void) => {
	const { MAX_EXPAND_DEPTH, MAX_ATTEMPTS, DOM_UPDATE_DELAY, RETRY_DELAY } = SCROLL_TO_BLOCK_TIMING;

	// Store timeout ID and nested cleanup function so they can be cancelled.
	let timeoutId: ReturnType<typeof setTimeout> | null = null;
	let nestedCleanup: (() => void) | null = null;

	// Cleanup function that cancels pending timeout and any nested operations.
	const cleanup = () => {
		if (timeoutId !== null) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
		if (nestedCleanup) {
			nestedCleanup();
			nestedCleanup = null;
		}
	};

	// Guard against element being disconnected from DOM or exceeding max attempts.
	if (attempt >= MAX_ATTEMPTS || !element.isConnected) {
		// Max attempts reached or element disconnected, scroll anyway.
		if (element.isConnected) {
			element.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
		return cleanup;
	}

	try {
		// Step 1: Find all parent expands (outermost to innermost).
		const parentExpands = findParentExpands(element, MAX_EXPAND_DEPTH);

		// Step 2: Find any collapsed expands (filter out disconnected elements).
		const collapsedExpands = parentExpands.filter(
			(expandContainer) => expandContainer.isConnected && isExpandCollapsed(expandContainer),
		);

		if (collapsedExpands.length === 0) {
			// All expands are open (or there are no expands), scroll to element.
			element.scrollIntoView({ behavior: 'smooth', block: 'center' });
			return cleanup;
		}

		// Step 3: Expand ONLY the outermost collapsed expand first.
		// This is critical for nested expands - we must expand parent before child.
		const outermostCollapsed = collapsedExpands[0];

		try {
			const expanded = expandElement(outermostCollapsed);
			if (expanded) {
				// Successfully expanded, wait briefly for DOM update then recurse to handle any nested expands.
				// Note: There's no animation, but we need a minimal delay for DOM/React updates.
				timeoutId = setTimeout(() => {
					try {
						// Verify element is still connected before proceeding.
						if (!element.isConnected) {
							return;
						}

						// Recurse to handle any nested collapsed expands or retry if still collapsed.
						nestedCleanup = expandAllParentsThenScroll(element, attempt + 1);
					} catch {
						// Fallback to simple scroll on error.
						if (element.isConnected) {
							element.scrollIntoView({ behavior: 'smooth', block: 'center' });
						}
					}
				}, DOM_UPDATE_DELAY);
			} else {
				// Failed to expand, retry with longer delay.
				timeoutId = setTimeout(() => {
					if (element.isConnected) {
						nestedCleanup = expandAllParentsThenScroll(element, attempt + 1);
					}
				}, RETRY_DELAY);
			}
		} catch {
			// Retry on error.
			timeoutId = setTimeout(() => {
				if (element.isConnected) {
					nestedCleanup = expandAllParentsThenScroll(element, attempt + 1);
				}
			}, RETRY_DELAY);
		}
	} catch {
		// Fallback to simple scroll on error.
		if (element.isConnected) {
			element.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}

	return cleanup;
};

export const getLocalIdSelector = (localId: string, container: HTMLElement) => {
	// Check if the element with data-local-id exists
	let element = container.querySelector(`[data-local-id="${localId}"]`) as HTMLElement | null;

	if (element) {
		return element;
	}

	// Special case for decision lists and task lists which already have localId
	element = container.querySelector(`[data-decision-list-local-id="${localId}"]`);
	if (element) {
		return element;
	}

	element = container.querySelector(`[data-task-list-local-id="${localId}"]`);
	if (element) {
		return element;
	}

	// Special case for tables which use data-table-local-id
	element = container.querySelector(`[data-table-local-id="${localId}"]`);
	if (element) {
		return element;
	}

	// Special case for extension, smart cards and media which use lowercase localid
	element = container.querySelector(`[localid="${localId}"]`);
	if (element) {
		return element;
	}

	return null;
};
