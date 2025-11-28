import { useEffect } from 'react';
import { getDocument } from '@atlaskit/browser-apis';
import { DEFAULT_BLOCK_LINK_HASH_PREFIX } from '@atlaskit/editor-common/block-menu';

// Find editor node dom with localId - similar to confluence useScrollOnUrlChange.ts
const getLocalIdSelector = (localId: string, container: HTMLElement) => {
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

export const useScrollToLocalId = (
	containerRef?: React.RefObject<HTMLDivElement>,
	shouldScrollToLocalId?: boolean,
) => {
	useEffect(() => {
		// Only run in browser environment
		if (typeof window === 'undefined' || !containerRef?.current || !shouldScrollToLocalId) {
			return;
		}

		// Parse hash fragment for block ID (format: #block-{localId})
		const hash = window.location.hash;
		const defaultPrefixWithHash = `#${DEFAULT_BLOCK_LINK_HASH_PREFIX}`;
		const blockId = hash.startsWith(defaultPrefixWithHash)
			? hash.slice(defaultPrefixWithHash.length)
			: null;

		if (!blockId) {
			return;
		}

		let retryCount = 0;
		// 5 second timeout based on dashboard showing ~4.96s TTI load time
		const maxRetries = 20; // Maximum 20 retries (5 seconds at 250ms intervals)
		const retryInterval = 250; // Check every 250ms
		let intervalId: NodeJS.Timeout | null = null;

		const scrollToElement = () => {
			if (containerRef?.current) {
				const element = getLocalIdSelector(blockId, containerRef.current);
				if (element) {
					element.scrollIntoView({ behavior: 'smooth' });
					return true;
				}
			}
			return false;
		};

		const attemptScroll = () => {
			retryCount++;

			// Try to scroll to element
			if (scrollToElement()) {
				if (intervalId) {
					clearInterval(intervalId);
					intervalId = null;
				}
				return true;
			}

			// Stop retrying if we've exceeded max retries
			if (retryCount >= maxRetries) {
				if (intervalId) {
					clearInterval(intervalId);
					intervalId = null;
				}
				return false;
			}

			return false;
		};

		// Try to scroll immediately
		if (attemptScroll()) {
			return;
		}

		if (getDocument()?.readyState === 'complete') {
			// Document is already ready, try a few more times with delays
			// This handles cases where elements are added after document ready
			intervalId = setInterval(() => {
				attemptScroll();
			}, retryInterval);
		} else {
			// Document not ready yet, wait for it and then retry
			intervalId = setInterval(() => {
				if (getDocument()?.readyState === 'complete') {
					attemptScroll();
				} else if (retryCount >= maxRetries) {
					// Stop retrying even if document isn't ready
					if (intervalId) {
						clearInterval(intervalId);
						intervalId = null;
					}
				} else {
					retryCount++;
				}
			}, retryInterval);
		}

		// Cleanup function
		return () => {
			if (intervalId) {
				clearInterval(intervalId);
				intervalId = null;
			}
		};
	}, [containerRef, shouldScrollToLocalId]);
};
