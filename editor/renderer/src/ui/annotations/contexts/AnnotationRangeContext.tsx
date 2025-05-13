import type { ReactNode } from 'react';
import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import type { Position } from '../types';

export type RangeType = 'selection' | 'hover' | null;

interface AnnotationRangeStateContext {
	/**
	 * This range represents the selection that the user has made before they intend to save an annotation
	 */
	range: Range | null;

	/**
	 * This represents the type of range that is currently set on the range property, ie, whether the range is a hover or selection.
	 */
	type: RangeType;

	/**
	 * This range represents the "pre-committed" placeholder range that the user will eventually save as an annotation
	 * If the user does not set allowDraftMode, this will be ignored as it only is set when we call applyAnnotationDraftAt()
	 */
	selectionDraftRange: Range | null;
	hoverDraftRange: Range | null;

	/**
	 * When a selection or hover is promoted to a draft, we need to store the document position of the selection or hover.
	 * This is only set once on promotion, the position should not change while the draft is open.
	 */
	selectionDraftDocumentPosition: Position | null;
	hoverDraftDocumentPosition: Position | null;
}
interface AnnotationRangeDispatchContext {
	/**
	 * @private
	 * @deprecated This prop is deprecated as of platform_renderer_annotation_draft_position_fix and will be removed in the future.
	 * Please use clearSelectionRange or clearHoverRange instead.
	 */
	clearRange: () => void;
	clearSelectionRange: () => void;

	/**
	 * @private
	 * @deprecated This prop is deprecated as of platform_renderer_annotation_draft_position_fix and will be removed in the future.
	 * Please use clearSelectionDraft or clearHoverDraft instead.
	 */
	clearDraftRange: (type: RangeType) => void;
	clearHoverRange: () => void;
	setSelectionRange: (range: Range) => void;

	/**
	 * @private
	 * @deprecated This prop is deprecated as of platform_renderer_annotation_draft_position_fix and will be removed in the future.
	 * Please use promoteSelectionToDraft or promoteHoverToDraft instead.
	 */
	setDraftRange: (draftRange: Range | null, type: RangeType) => void;
	setHoverTarget?: (target: HTMLElement) => void;

	promoteSelectionToDraft: (position: Position | null) => void;
	promoteHoverToDraft: (position: Position | null) => void;
	clearSelectionDraft: () => void;
	clearHoverDraft: () => void;
}

type State = {
	type: RangeType;
	// if platform_renderer_annotation_draft_position_fix is off; then
	range: Range | null;
	draftRange: Range | null;
	// else-if platform_renderer_annotation_draft_position_fix is on; then
	selectionRange: Range | null;
	hoverRange: Range | null;
	selectionDraftRange: Range | null;
	hoverDraftRange: Range | null;
	selectionDraftDocumentPosition: Position | null;
	hoverDraftDocumentPosition: Position | null;
	// end-if
};

const initialState: State = {
	range: null,
	draftRange: null,
	type: null,
	selectionRange: null,
	hoverRange: null,
	selectionDraftRange: null,
	hoverDraftRange: null,
	selectionDraftDocumentPosition: null,
	hoverDraftDocumentPosition: null,
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
	| { type: 'clearDraftHover' }
	| { type: 'promoteSelectionToDraft'; position: Position | null }
	| { type: 'promoteHoverToDraft'; position: Position | null }
	| { type: 'clearSelectionDraft' }
	| { type: 'clearHoverDraft' };

function reducerOld(state: State, action: Action): State {
	switch (action.type) {
		case 'clear':
			return initialState;
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
				return { ...state, range: null, draftRange: null, type: null };
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
				return { ...state, range: null, draftRange: action.draftRange, type: null };
			}
			return state;
		case 'setDraftHover':
			if (state.draftRange !== action.draftRange || state.type !== 'hover') {
				return { ...state, draftRange: action.draftRange };
			}
			return state;
	}
	return state;
}

function reducerNew(state: State, action: Action): State {
	switch (action.type) {
		case 'clear':
			return initialState;
		case 'clearSelection':
			if (state.selectionRange !== null) {
				return {
					...state,
					selectionRange: null,
					type: state.type === 'selection' ? null : state.type,
				};
			}
			return state;
		case 'clearHover': {
			if (state.hoverRange !== null) {
				return {
					...state,
					hoverRange: null,
					type: state.type === 'hover' ? null : state.type,
				};
			}

			return state;
		}
		case 'setSelection':
			if (state.selectionRange !== action.range) {
				return { ...state, selectionRange: action.range, type: 'selection' };
			}
			return state;
		case 'setHover':
			if (state.hoverRange !== action.range) {
				return { ...state, hoverRange: action.range, type: 'hover' };
			}
			return state;

		case 'promoteSelectionToDraft':
			// we should only promote the range to a draft if the current range type is a selection
			// we should also store the promotion type, so that a clear will not accidently clear the draft of a
			// different type
			if (state.selectionDraftRange !== state.selectionRange) {
				return {
					...state,
					selectionRange: null,
					type: state.type === 'selection' ? null : state.type,
					selectionDraftRange: state.selectionRange,
					selectionDraftDocumentPosition: action.position,
				};
			}
			return state;
		case 'promoteHoverToDraft':
			if (state.hoverDraftRange !== state.hoverRange) {
				return {
					...state,
					hoverRange: null,
					type: state.type === 'hover' ? null : state.type,
					hoverDraftRange: state.hoverRange,
					hoverDraftDocumentPosition: action.position,
				};
			}
			return state;
		case 'clearSelectionDraft':
			if (state.selectionDraftRange !== null) {
				return { ...state, selectionDraftRange: null, selectionDraftDocumentPosition: null };
			}
			return state;
		case 'clearHoverDraft':
			if (state.hoverDraftRange !== null) {
				return { ...state, hoverDraftRange: null, hoverDraftDocumentPosition: null };
			}
			return state;
	}
	return state;
}

const AnnotationRangeStateContext = createContext<AnnotationRangeStateContext>({
	range: null,
	type: null,
	selectionDraftRange: null,
	hoverDraftRange: null,
	selectionDraftDocumentPosition: null,
	hoverDraftDocumentPosition: null,
});

const AnnotationRangeDispatchContext = createContext<AnnotationRangeDispatchContext>({
	clearRange: () => {},
	clearSelectionRange: () => {},
	clearHoverRange: () => {},
	setSelectionRange: () => {},

	// if platform_renderer_annotation_draft_position_fix is off; then
	setDraftRange: () => {},
	clearDraftRange: () => {},
	// end-if

	// if platform_renderer_annotation_draft_position_fix is on; then
	promoteSelectionToDraft: () => {},
	promoteHoverToDraft: () => {},
	clearSelectionDraft: () => {},
	clearHoverDraft: () => {},
	// end-if
});

export const AnnotationRangeProviderInner = ({
	children,
	allowCommentsOnMedia,
}: {
	children?: ReactNode;
	allowCommentsOnMedia?: boolean;
}) => {
	const [
		{
			range,
			draftRange,
			selectionRange,
			hoverRange,
			type,
			selectionDraftRange,
			selectionDraftDocumentPosition,
			hoverDraftRange,
			hoverDraftDocumentPosition,
		},
		dispatch,
	] = useReducer(
		fg('platform_renderer_annotation_draft_position_fix') ? reducerNew : reducerOld,
		initialState,
	);

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

	const setSelectionRange = useCallback(
		(range: Range) => dispatch({ type: 'setSelection', range }),
		[],
	);

	const setDraftRange = useCallback((range: Range | null, type: RangeType) => {
		if (type === 'hover') {
			dispatch({ type: 'setDraftHover', draftRange: range });
			return;
		}
		dispatch({ type: 'setDraftSelection', draftRange: range });
	}, []);

	const setHoverTarget = useCallback((target: HTMLElement) => {
		// the HoverComponent expects an element deeply nested inside media, these classes work with the current implementation
		const mediaNode = target.querySelector('.media-card-inline-player, .media-file-card-view');
		if (!mediaNode) {
			return;
		}
		const range = document.createRange();
		range.setStartBefore(mediaNode);
		range.setEndAfter(mediaNode);
		dispatch({ type: 'setHover', range });
	}, []);

	const promoteSelectionToDraft = useCallback((position: Position | null) => {
		dispatch({ type: 'promoteSelectionToDraft', position });
	}, []);

	const clearSelectionDraft = useCallback(() => {
		dispatch({ type: 'clearSelectionDraft' });
	}, []);

	const promoteHoverToDraft = useCallback((position: Position | null) => {
		dispatch({ type: 'promoteHoverToDraft', position });
	}, []);

	const clearHoverDraft = useCallback(() => {
		dispatch({ type: 'clearHoverDraft' });
	}, []);

	const stateData = useMemo(() => {
		if (fg('platform_renderer_annotation_draft_position_fix')) {
			return {
				// We techinically have two ranges, however we only want to expose one of them at a time, because only one draft
				// can be active at a time. The type of range is used to determine which range is active.
				range: type === 'selection' ? selectionRange : hoverRange,
				type,
				selectionDraftRange,
				hoverDraftRange,
				selectionDraftDocumentPosition,
				hoverDraftDocumentPosition,
			};
		} else {
			return {
				range,
				draftRange,
				type,
				// I've updated some refs to use the new selectionDraftRange, this is being add here to be fowards compatible
				// with the new changes coming in platform_renderer_annotation_draft_position_fix.
				selectionDraftRange: draftRange,
				hoverDraftRange: draftRange,
				selectionDraftDocumentPosition: null,
				hoverDraftDocumentPosition: null,
			};
		}
	}, [
		range,
		draftRange,
		selectionRange,
		hoverRange,
		type,
		selectionDraftRange,
		selectionDraftDocumentPosition,
		hoverDraftRange,
		hoverDraftDocumentPosition,
	]);

	const dispatchData = useMemo(
		() => ({
			clearRange,
			clearSelectionRange,
			clearDraftRange,
			clearHoverRange,
			setSelectionRange,
			setDraftRange,
			setHoverTarget: !!allowCommentsOnMedia ? setHoverTarget : undefined,
			promoteSelectionToDraft,
			promoteHoverToDraft,
			clearSelectionDraft,
			clearHoverDraft,
		}),
		[
			allowCommentsOnMedia,
			clearRange,
			clearSelectionRange,
			clearDraftRange,
			clearHoverRange,
			setSelectionRange,
			setDraftRange,
			setHoverTarget,
			promoteSelectionToDraft,
			promoteHoverToDraft,
			clearSelectionDraft,
			clearHoverDraft,
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

export const AnnotationRangeProvider = ({
	children,
	allowCommentsOnMedia,
	isNestedRender,
}: {
	children?: ReactNode;
	allowCommentsOnMedia?: boolean;
	isNestedRender?: boolean;
}) => {
	if (fg('platform_renderer_annotation_draft_position_fix')) {
		/*
		 * If this is a nested render, we do not provide the context
		 * because it has already been provided higher up the component tree
		 * and we need the original context to create annotations on extensions.
		 */
		return isNestedRender ? (
			<>{children}</>
		) : (
			<AnnotationRangeProviderInner allowCommentsOnMedia={allowCommentsOnMedia}>
				{children}
			</AnnotationRangeProviderInner>
		);
	} else {
		return (
			<AnnotationRangeProviderInner allowCommentsOnMedia={allowCommentsOnMedia}>
				{children}
			</AnnotationRangeProviderInner>
		);
	}
};

export const useAnnotationRangeState = () => {
	return useContext(AnnotationRangeStateContext);
};

export const useAnnotationRangeDispatch = () => {
	return useContext(AnnotationRangeDispatchContext);
};
