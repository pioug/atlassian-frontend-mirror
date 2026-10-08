import type { ReactNode } from 'react';
import React, { createContext, useCallback, useContext, useMemo, useReducer, useRef } from 'react';

import { fg } from '@atlaskit/platform-feature-flags/fg';

import type { Position } from '../types';

export type RangeType = 'selection' | 'hover' | null;

// oxlint-disable-next-line eslint/no-redeclare
interface AnnotationRangeStateContext {
	hoverDraftDocumentPosition: Position | null;

	hoverDraftRange: Range | null;

	/**
	 * This range represents the selection that the user has made before they intend to save an annotation
	 */
	range: Range | null;
	/**
	 * When a selection or hover is promoted to a draft, we need to store the document position of the selection or hover.
	 * This is only set once on promotion, the position should not change while the draft is open.
	 */
	selectionDraftDocumentPosition: Position | null;

	/**
	 * This range represents the "pre-committed" placeholder range that the user will eventually save as an annotation
	 * If the user does not set allowDraftMode, this will be ignored as it only is set when we call applyAnnotationDraftAt()
	 */
	selectionDraftRange: Range | null;
	/**
	 * This represents the type of range that is currently set on the range property, ie, whether the range is a hover or selection.
	 */
	type: RangeType;
}
// oxlint-disable-next-line eslint/no-redeclare
interface AnnotationRangeDispatchContext {
	clearHoverDraft: () => void;
	clearHoverRange: () => void;
	clearSelectionDraft: () => void;
	clearSelectionRange: () => void;
	promoteHoverToDraft: (position: Position | null) => void;
	promoteSelectionToDraft: (position: Position | null) => void;
	setHoverTarget?: (target: HTMLElement) => void;
	setSelectionRange: (range: Range) => void;
}

type State = {
	hoverDraftDocumentPosition: Position | null;
	hoverDraftRange: Range | null;
	hoverRange: Range | null;
	selectionDraftDocumentPosition: Position | null;
	selectionDraftRange: Range | null;
	selectionRange: Range | null;
	type: RangeType;
};

const initialState: State = {
	type: null,
	selectionRange: null,
	hoverRange: null,
	selectionDraftRange: null,
	hoverDraftRange: null,
	selectionDraftDocumentPosition: null,
	hoverDraftDocumentPosition: null,
};

type Action =
	| { type: 'clearSelection' }
	| { type: 'clearHover' }
	| { range: Range; type: 'setSelection' }
	| { range: Range; type: 'setHover' }
	| { position: Position | null; type: 'promoteSelectionToDraft' }
	| { position: Position | null; type: 'promoteHoverToDraft' }
	| { type: 'clearSelectionDraft' }
	| { type: 'clearHoverDraft' };

function reducer(state: State, action: Action): State {
	switch (action.type) {
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
}

export const AnnotationRangeStateContext: React.Context<AnnotationRangeStateContext> =
	createContext<AnnotationRangeStateContext>({
		range: null,
		type: null,
		selectionDraftRange: null,
		hoverDraftRange: null,
		selectionDraftDocumentPosition: null,
		hoverDraftDocumentPosition: null,
	});

export const AnnotationRangeDispatchContext: React.Context<AnnotationRangeDispatchContext> =
	createContext<AnnotationRangeDispatchContext>({
		clearSelectionRange: () => {},
		clearHoverRange: () => {},
		setSelectionRange: () => {},
		promoteSelectionToDraft: () => {},
		promoteHoverToDraft: () => {},
		clearSelectionDraft: () => {},
		clearHoverDraft: () => {},
	});

export const AnnotationRangeProviderInner = ({
	children,
	allowCommentsOnMedia,
	hasBlockNodeSupport,
}: {
	allowCommentsOnMedia?: boolean;
	children?: ReactNode;
	hasBlockNodeSupport?: boolean;
}): React.JSX.Element => {
	const extensionCommentsEnabled = !!hasBlockNodeSupport && fg('cc_maui_annotations_on_extensions');
	const [
		{
			selectionRange,
			hoverRange,
			type,
			selectionDraftRange,
			selectionDraftDocumentPosition,
			hoverDraftRange,
			hoverDraftDocumentPosition,
		},
		dispatch,
	] = useReducer(reducer, initialState);

	const clearSelectionRange = useCallback(() => dispatch({ type: 'clearSelection' }), []);
	const clearHoverRange = useCallback(() => dispatch({ type: 'clearHover' }), []);

	const setSelectionRange = useCallback(
		(range: Range) => dispatch({ type: 'setSelection', range }),
		[],
	);

	const hoverDraftRangeRef = useRef(hoverDraftRange);
	hoverDraftRangeRef.current = hoverDraftRange;

	const setHoverTarget = useCallback(
		(target: HTMLElement) => {
			const draftRange = hoverDraftRangeRef.current;
			const draftTarget = draftRange?.startContainer.childNodes[draftRange.startOffset];
			if (
				extensionCommentsEnabled &&
				draftTarget instanceof HTMLElement &&
				draftTarget.matches('.ak-renderer-extension[data-inline-comments-target="true"]')
			) {
				// Keep the composer callbacks bound to the chart chosen when its draft opened.
				return;
			}
			// The HoverComponent expects an element deeply nested inside media or the eligible
			// block node's wrapper. Each selector is only included when its comment type is
			// supported, so hover targeting never activates on an ineligible block node.
			const selectors = [
				allowCommentsOnMedia && '.media-card-inline-player, .media-file-card-view',
				extensionCommentsEnabled && '.ak-renderer-extension[data-inline-comments-target="true"]',
			]
				.filter((selector): selector is string => Boolean(selector))
				.join(', ');

			const hoverableNode =
				extensionCommentsEnabled &&
				target.matches('.ak-renderer-extension[data-inline-comments-target="true"]')
					? target
					: selectors
						? target.querySelector(selectors)
						: null;
			if (!hoverableNode) {
				return;
			}
			// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage -- range for media/extension hover highlight
			const range = document.createRange();
			range.setStartBefore(hoverableNode);
			range.setEndAfter(hoverableNode);
			dispatch({ type: 'setHover', range });
		},
		[allowCommentsOnMedia, extensionCommentsEnabled],
	);

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
	}, [
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
			clearSelectionRange,
			clearHoverRange,
			setSelectionRange,
			setHoverTarget: allowCommentsOnMedia || extensionCommentsEnabled ? setHoverTarget : undefined,
			promoteSelectionToDraft,
			promoteHoverToDraft,
			clearSelectionDraft,
			clearHoverDraft,
		}),
		[
			allowCommentsOnMedia,
			extensionCommentsEnabled,
			clearSelectionRange,
			clearHoverRange,
			setSelectionRange,
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
	hasBlockNodeSupport,
	isNestedRender,
}: {
	allowCommentsOnMedia?: boolean;
	children?: ReactNode;
	hasBlockNodeSupport?: boolean;
	isNestedRender?: boolean;
}): React.JSX.Element => {
	/*
	 * If this is a nested render, we do not provide the context
	 * because it has already been provided higher up the component tree
	 * and we need the original context to create annotations on extensions.
	 */
	return isNestedRender ? (
		<>{children}</>
	) : (
		<AnnotationRangeProviderInner
			allowCommentsOnMedia={allowCommentsOnMedia}
			hasBlockNodeSupport={hasBlockNodeSupport}
		>
			{children}
		</AnnotationRangeProviderInner>
	);
};

export const useAnnotationRangeState = (): AnnotationRangeStateContext => {
	return useContext(AnnotationRangeStateContext);
};

export const useAnnotationRangeDispatch = (): AnnotationRangeDispatchContext => {
	return useContext(AnnotationRangeDispatchContext);
};
