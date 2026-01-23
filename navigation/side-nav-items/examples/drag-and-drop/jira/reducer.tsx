import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';

import type { TAction, TData, TFilter } from './data';
import { find, tree } from './filters/filter-tree-utils';

function filterReduce(
	filters: TFilter[],
	action: Extract<TAction, { type: 'filter-move' }>,
): TFilter[] {
	const { operation, draggingId, targetId } = action;

	const dragging = find(filters, draggingId);

	if (!dragging) {
		return filters;
	}

	if (operation === 'reorder-before') {
		return tree(filters).remove(draggingId).insertBefore({ insert: dragging, targetId }).build();
	}

	if (operation === 'reorder-after') {
		return tree(filters).remove(draggingId).insertAfter({ insert: dragging, targetId }).build();
	}

	if (operation === 'combine') {
		return tree(filters).remove(draggingId).insertChild({ insert: dragging, targetId }).build();
	}

	return filters;
}

export function reduce(current: TData, action: TAction): TData {
	// Note: currently not sanity checking the actions that are passed
	// to this reducer for simplicity.

	if (action.type === 'top-level-menu-reorder') {
		const topLevelItems = reorder({
			list: current.topLevelItems,
			startIndex: action.startIndex,
			finishIndex: action.finishIndex,
		});
		const value: TData = {
			...current,
			topLevelItems,
			lastAction: action,
		};
		return value;
	}

	if (action.type === 'reorder-project') {
		const updated = reorder({
			list: current.projects[action.groupName],
			startIndex: action.startIndex,
			finishIndex: action.finishIndex,
		});

		return {
			...current,
			projects: {
				...current.projects,
				[action.groupName]: updated,
			},
			lastAction: action,
		};
	}

	if (action.type === 'filter-move') {
		const updated = filterReduce(current.filters, action);
		return {
			...current,
			filters: updated,
			lastAction: action,
		};
	}

	return current;
}
