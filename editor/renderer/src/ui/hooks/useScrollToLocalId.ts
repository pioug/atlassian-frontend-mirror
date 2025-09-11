import { useEffect } from 'react';

// Find editor node dom with localId - similar to confluence useScrollOnUrlChange.ts
const getLocalIdSelector = (localId: string, container: HTMLElement) => {
	// Check if the element with data-local-id exists
	let element = container.querySelector(`[data-local-id="${localId}"]`);
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

		// Parse URL parameters for block ID
		const urlParams = new URLSearchParams(window.location.search);
		const blockId = urlParams.get('block');

		if (blockId) {
			// Search within the renderer container using the selector function
			const element = getLocalIdSelector(blockId, containerRef.current);
			if (element) {
				element.scrollIntoView({ behavior: 'smooth' });
			}
		}
	}, [containerRef, shouldScrollToLocalId]);
};
