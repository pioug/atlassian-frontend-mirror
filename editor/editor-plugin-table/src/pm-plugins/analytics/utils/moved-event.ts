import type { ActionType, RowOrColumnMovedState } from '../types';
import { defaultState } from '../types';

const getNextActionType = (
	nextState: Omit<RowOrColumnMovedState, 'currentActions'>,
	nextAction: ActionType,
	prevState?: RowOrColumnMovedState,
) => {
	if (nextAction === 'pasted') {
		if (
			prevState &&
			prevState.currentActions.includes('copyOrCut') &&
			prevState.currentActions.includes('addRowOrColumn') &&
			prevState.numberOfCells === nextState.numberOfCells &&
			prevState.type === nextState.type
		) {
			return 'pasted';
		}
		return 'none';
	}
	return nextAction;
};

export const getMovedPayload = (
	nextState: Omit<RowOrColumnMovedState, 'currentActions'>,
	nextAction: ActionType,
	prevState: RowOrColumnMovedState,
) => {
	const nextActionType = getNextActionType(nextState, nextAction, prevState);

	if (nextActionType === 'none') {
		return defaultState.rowOrColumnMoved;
	}

	// a new workflow has started in the opposite axis (e.g. inserted a row, but copied a column) remove old state
	if (prevState.type !== nextState.type) {
		return {
			currentActions: [nextActionType],
			numberOfCells: nextState?.numberOfCells,
			type: nextState.type,
		};
	}

	return {
		currentActions: prevState.currentActions.includes(nextActionType)
			? prevState.currentActions
			: [...prevState.currentActions, nextActionType],
		numberOfCells: nextState?.numberOfCells || prevState.numberOfCells,
		type: nextState?.type,
	};
};
