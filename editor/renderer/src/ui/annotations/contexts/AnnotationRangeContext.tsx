import type { ReactNode } from 'react';
import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react';

type RangeType = 'selection' | 'hover' | null;

interface AnnotationRangeStateContext {
	/*
	 * This range represents the selection that the user has made before they intend to save an annotation
	 */
	range: Range | null;
	/*
	 * This range represents the "pre-committed" placeholder range that the user will eventually save as an annotation
	 * If the user does not set allowDraftMode, this will be ignored as it only is set when we call applyAnnotationDraftAt()
	 */
	draftRange: Range | null;
	type: RangeType;
}
interface AnnotationRangeDispatchContext {
	clearRange: () => void;
	clearSelectionRange: () => void;
	clearDraftRange: (type: RangeType) => void;
	clearHoverRange: () => void;
	setRange: (range: Range) => void;
	setDraftRange: (draftRange: Range | null, type: RangeType) => void;
	setHoverTarget?: (target: HTMLElement) => void;
}

type State = {
	range: Range | null;
	draftRange: Range | null;
	type: RangeType;
};

type Action =
	| { type: 'clear' }
	| { type: 'clearSelection' }
	| { type: 'clearDraftSelection' }
	| { type: 'clearHover' }
	| { type: 'setSelection'; range: Range }
	| { type: 'setDraftSelection'; draftRange: Range | null }
	| { type: 'setHover'; range: Range }
	| { type: 'setDraftHover'; draftRange: Range | null }
	| { type: 'clearDraftHover' };

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case 'clear':
			if (!!state.range || !!state.type) {
				return { range: null, draftRange: null, type: null };
			}
			return state;
		case 'clearSelection':
			if (state.type === 'selection') {
				return { ...state, range: null, type: null };
			}
			return state;
		case 'clearDraftSelection':
			if (state.type === 'selection') {
				return { ...state, draftRange: null };
			}
			return state;
		case 'clearDraftHover':
			if (state.type === 'hover') {
				return { ...state, draftRange: null };
			}
			return state;
		case 'clearHover':
			if (state.type === 'hover') {
				return { range: null, draftRange: null, type: null };
			}
			return state;
		case 'setSelection':
			if (state.range !== action.range || state.type !== 'selection') {
				return { ...state, range: action.range, type: 'selection' };
			}
			return state;
		case 'setHover':
			if (state.range !== action.range || state.type !== 'hover') {
				return { ...state, range: action.range, type: 'hover' };
			}
			return state;
		case 'setDraftSelection':
			if (state.draftRange !== action.draftRange || state.type !== 'selection') {
				return { range: null, draftRange: action.draftRange, type: null };
			}
			return state;
		case 'setDraftHover':
			if (state.draftRange !== action.draftRange || state.type !== 'hover') {
				return { ...state, draftRange: action.draftRange };
			}
			return state;
	}
}

export const AnnotationRangeStateContext = createContext<AnnotationRangeStateContext>({
	range: null,
	draftRange: null,
	type: null,
});

export const AnnotationRangeDispatchContext = createContext<AnnotationRangeDispatchContext>({
	clearRange: () => {},
	clearSelectionRange: () => {},
	clearDraftRange: () => {},
	clearHoverRange: () => {},
	setRange: () => {},
	setDraftRange: () => {},
});

export const AnnotationRangeProvider = ({
	children,
	allowCommentsOnMedia,
}: {
	children?: ReactNode;
	allowCommentsOnMedia?: boolean;
}) => {
	const [{ range, draftRange, type }, dispatch] = useReducer(reducer, {
		range: null,
		draftRange: null,
		type: null,
	});

	const clearRange = useCallback(() => dispatch({ type: 'clear' }), []);
	const clearSelectionRange = useCallback(() => dispatch({ type: 'clearSelection' }), []);
	const clearDraftRange = useCallback((type: RangeType) => {
		if (type === 'hover') {
			dispatch({ type: 'clearDraftHover' });
			return;
		}
		dispatch({ type: 'clearDraftSelection' });
	}, []);
	const clearHoverRange = useCallback(() => dispatch({ type: 'clearHover' }), []);

	const setRange = useCallback((range: Range) => dispatch({ type: 'setSelection', range }), []);

	const setDraftRange = useCallback((range: Range | null, type: RangeType) => {
		if (type === 'hover') {
			dispatch({ type: 'setDraftHover', draftRange: range });
			return;
		}
		dispatch({ type: 'setDraftSelection', draftRange: range });
	}, []);

	const setHoverTarget = useCallback((target: HTMLElement) => {
		// the HoverComponent expects an element deeply nested inside media, these classes work with the current implementation
		const mediaNode = target.querySelector(
			'.media-card-inline-player, .media-file-card-view',
		) as HTMLElement;
		const range = document.createRange();
		range.setStartBefore(mediaNode);
		range.setEndAfter(mediaNode);
		dispatch({ type: 'setHover', range });
	}, []);

	const stateData = useMemo(
		() => ({
			range,
			draftRange,
			type,
		}),
		[range, draftRange, type],
	);

	const dispatchData = useMemo(
		() => ({
			clearRange,
			clearSelectionRange,
			clearDraftRange,
			clearHoverRange,
			setRange,
			setDraftRange,
			setHoverTarget: !!allowCommentsOnMedia ? setHoverTarget : undefined,
		}),
		[
			allowCommentsOnMedia,
			clearRange,
			clearSelectionRange,
			clearDraftRange,
			clearHoverRange,
			setRange,
			setDraftRange,
			setHoverTarget,
		],
	);

	return (
		<AnnotationRangeStateContext.Provider value={stateData}>
			<AnnotationRangeDispatchContext.Provider value={dispatchData}>
				{children}
			</AnnotationRangeDispatchContext.Provider>
		</AnnotationRangeStateContext.Provider>
	);
};

export const useAnnotationRangeState = () => {
	return useContext(AnnotationRangeStateContext);
};

export const useAnnotationRangeDispatch = () => {
	return useContext(AnnotationRangeDispatchContext);
};
