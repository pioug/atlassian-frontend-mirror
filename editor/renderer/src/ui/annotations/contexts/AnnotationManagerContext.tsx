import React, {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useReducer,
	useRef,
} from 'react';

import { type AnnotationId, AnnotationMarkStates, AnnotationTypes } from '@atlaskit/adf-schema';
import type {
	AnnotationManager,
	GetDraftResult,
	ActionResult,
	ClearAnnotationResult,
	HoverAnnotationResult,
	SelectAnnotationResult,
} from '@atlaskit/editor-common/annotation';
import {
	AnnotationUpdateEvent,
	type AnnotationUpdateEventPayloads,
	type AnnotationUpdateEmitter,
	type OnAnnotationClickPayload,
} from '@atlaskit/editor-common/types';

import { RendererContext } from '../../../ui/RendererActionsContext';

interface AnnotationState {
	id: AnnotationId;
	markState: AnnotationMarkStates;
}

type AnnotationsStateRecord = Record<AnnotationId, AnnotationState>;

interface AnnotationManagerStateContext {
	annotations: AnnotationsStateRecord;
	currentHoveredAnnotationId: AnnotationId | undefined;
	currentSelectedAnnotationId: AnnotationId | undefined;
	currentSelectedMarkRef: HTMLElement | undefined;

	draftActionResult: ActionResult | undefined;
	draftId: string | undefined;
	draftMarkRef: HTMLElement | undefined;
	isDrafting: boolean;
}

interface AnnotationManagerDispatchContext {
	annotationManager: AnnotationManager | undefined;
	dispatch: React.Dispatch<AnnotationManagerAction>;
}

const initState: AnnotationManagerStateContext = {
	isDrafting: false,
	draftId: undefined,
	draftMarkRef: undefined,
	draftActionResult: undefined,

	annotations: {},
	currentSelectedAnnotationId: undefined,
	currentSelectedMarkRef: undefined,
	currentHoveredAnnotationId: undefined,
};

const AnnotationManagerStateContext = createContext<AnnotationManagerStateContext>(initState);

const AnnotationManagerDispatchContext = createContext<AnnotationManagerDispatchContext>({
	annotationManager: undefined,
	dispatch: () => {},
});

type AnnotationManagerAction =
	| { type: 'reset' }
	| {
			data: {
				id: AnnotationId;
				markState?: AnnotationMarkStates;
			}[];
			type: 'loadAnnotation';
	  }
	| {
			data: {
				hovered?: boolean;
				id: AnnotationId;
				markState?: AnnotationMarkStates;
				selected?: boolean;
			};
			type: 'updateAnnotation';
	  }
	| {
			type: 'resetSelectedAnnotation';
	  }
	| {
			type: 'resetHoveredAnnotation';
	  }
	| {
			data: {
				draftActionResult: ActionResult | undefined;
				draftId: string | undefined;
				isDrafting: boolean;
			};
			type: 'setDrafting';
	  }
	| {
			data: {
				draftMarkRef: HTMLElement | undefined;
			};
			type: 'setDraftMarkRef';
	  }
	| {
			data: {
				markRef: HTMLElement | undefined;
			};
			type: 'setSelectedMarkRef';
	  };

function reducer(
	state: AnnotationManagerStateContext,
	action: AnnotationManagerAction,
): AnnotationManagerStateContext {
	switch (action.type) {
		case 'reset': {
			return {
				...state,
				...initState,
			};
		}

		case 'loadAnnotation': {
			const currentIds = Object.keys(state.annotations);
			const uids = Array.from(new Set(currentIds.concat(action.data.map((a) => a.id))));

			const updates = [];
			for (const id of uids) {
				const loadedAnnotation = action.data.find((a) => a.id === id);

				if (!loadedAnnotation && state.annotations[id]?.markState === AnnotationMarkStates.ACTIVE) {
					// If the annotation is not in the loaded data, we need to remove it from the state. However,
					// rather then removing it, we will set the mark state to resolved. This is to align it better with
					// how the editor works.
					updates.push({
						id,
						markState: AnnotationMarkStates.RESOLVED,
					});
					continue;
				}

				if (
					!!loadedAnnotation?.markState &&
					state.annotations[id]?.markState !== loadedAnnotation.markState
				) {
					updates.push({
						id,
						markState: loadedAnnotation.markState,
					});
					continue;
				}
			}

			if (updates.length > 0) {
				return {
					...state,
					annotations: updates.reduce((nextAnnotations, update) => {
						return {
							...nextAnnotations,
							[update.id]: {
								...nextAnnotations[update.id],
								...update,
							},
						};
					}, state.annotations),
				};
			}
			return state;
		}
		case 'updateAnnotation': {
			const current = state.annotations[action.data.id];
			const { id, selected, hovered, markState = current?.markState } = action.data;

			const updates = [];

			// If the annotation is not currently in the state, we need to add it to the state.
			if (!current) {
				updates.push({
					id,
					markState: markState ?? AnnotationMarkStates.ACTIVE,
				});
			}

			// The goal of the following is to enforce a single selection and a single hover state across all annotations.
			let nextSelectedId = state.currentSelectedAnnotationId;

			if (selected && nextSelectedId !== id) {
				nextSelectedId = id;
			}
			// If the annotation is currently selected and it's being unselected, we need to remove it from the
			// current selected annotation id.
			if (selected === false && nextSelectedId === id) {
				nextSelectedId = undefined;
			}

			let nextHoveredId = state.currentHoveredAnnotationId;

			if (hovered && nextHoveredId !== id) {
				nextHoveredId = id;
			}
			// If the annotation is currently hovered and it's being unhovered, we need to remove it from the
			// current hovered annotation id.
			if (hovered === false && nextHoveredId === id) {
				nextHoveredId = undefined;
			}

			// If the annotations mark state is not the same as the current mark state, we need to update it.
			if (current?.markState !== markState) {
				updates.push({
					id,
					markState: markState ?? AnnotationMarkStates.ACTIVE,
				});

				// If the annotation is currently selected and it's being resolved, then we need to remove it from the
				// current selected annotation id also.
				if (markState === AnnotationMarkStates.RESOLVED && nextSelectedId === id) {
					nextSelectedId = undefined;
				}
			}

			if (
				updates.length > 0 ||
				nextSelectedId !== state.currentSelectedAnnotationId ||
				nextHoveredId !== state.currentHoveredAnnotationId
			) {
				return {
					...state,
					currentSelectedAnnotationId: nextSelectedId,
					currentHoveredAnnotationId: nextHoveredId,
					annotations: updates.reduce((nextAnnotations, update) => {
						return {
							...nextAnnotations,
							[update.id]: {
								...nextAnnotations[update.id],
								...update,
							},
						};
					}, state.annotations),
				};
			}
			return state;
		}
		case 'resetSelectedAnnotation': {
			if (state.currentSelectedAnnotationId !== undefined) {
				return {
					...state,
					currentSelectedAnnotationId: undefined,
					currentSelectedMarkRef: undefined,
				};
			}

			return state;
		}
		case 'resetHoveredAnnotation': {
			if (state.currentHoveredAnnotationId !== undefined) {
				return {
					...state,
					currentHoveredAnnotationId: undefined,
				};
			}

			return state;
		}

		case 'setDrafting': {
			if (
				state.isDrafting !== action.data.isDrafting ||
				state.draftId !== action.data.draftId ||
				state.draftActionResult !== action.data.draftActionResult
			) {
				// XXX: When a draft is open the current selected annotation should no longer be selected. We need
				// to decide what is better UX,
				// 1 - do we want to deselct the selected annotation on draft open, if so then when draft is closed the s
				// selected annotation will not come back
				// 2 - do we want to still allow the selected annotation to be selected when draft is open, however the underlying
				// mark style just shows the annotation as not selected when a draft is active. Then when a draft closes
				// we can reopen the previous selected annotation.
				return {
					...state,
					isDrafting: action.data.isDrafting,
					draftId: action.data.draftId,
					draftActionResult: action.data.draftActionResult,
				};
			}
			return state;
		}

		case 'setDraftMarkRef': {
			if (state.draftMarkRef !== action.data.draftMarkRef) {
				return {
					...state,
					draftMarkRef: action.data.draftMarkRef,
				};
			}
			return state;
		}

		case 'setSelectedMarkRef': {
			if (state.currentSelectedMarkRef !== action.data.markRef) {
				return {
					...state,
					currentSelectedMarkRef: action.data.markRef,
				};
			}
			return state;
		}
	}
}

export const AnnotationManagerProvider = ({
	children,
	annotationManager,
	updateSubscriber,
}: {
	annotationManager?: AnnotationManager;
	children?: ReactNode;
	updateSubscriber?: AnnotationUpdateEmitter;
}) => {
	const [state, dispatch] = useReducer(reducer, initState);
	const actionContext = useContext(RendererContext);

	useEffect(() => {
		const getDraft = (): GetDraftResult => {
			if (!state.isDrafting || !state.draftActionResult || !state.draftMarkRef || !state.draftId) {
				return {
					success: false,
					reason: 'draft-not-started',
				};
			}

			return {
				success: true,
				inlineNodeTypes: state.draftActionResult.inlineNodeTypes ?? [],
				targetElement: state.draftMarkRef,
				actionResult: {
					step: state.draftActionResult.step,
					doc: state.draftActionResult.doc,
					inlineNodeTypes: state.draftActionResult.inlineNodeTypes,
					targetNodeType: state.draftActionResult.targetNodeType,
					originalSelection: state.draftActionResult.originalSelection,
					numMatches: state.draftActionResult.numMatches,
					matchIndex: state.draftActionResult.matchIndex,
					pos: state.draftActionResult.pos,
				},
			};
		};

		annotationManager?.hook('getDraft', getDraft);
		return () => {
			annotationManager?.unhook('getDraft', getDraft);
		};
	}, [
		annotationManager,
		state.draftId,
		state.isDrafting,
		state.draftMarkRef,
		state.draftActionResult,
	]);

	// We need to watch for the draft mark element to exist, so we can inform any listeners that the draft has been started
	// and give them a reference to the element
	useEffect(() => {
		if (state.isDrafting && state.draftId && state.draftMarkRef && state.draftActionResult) {
			annotationManager?.emit({
				name: 'draftAnnotationStarted',
				data: {
					inlineNodeTypes: state.draftActionResult.inlineNodeTypes ?? [],
					targetElement: state.draftMarkRef,
					actionResult: {
						step: state.draftActionResult.step,
						doc: state.draftActionResult.doc,
						inlineNodeTypes: state.draftActionResult.inlineNodeTypes,
						targetNodeType: state.draftActionResult.targetNodeType,
						originalSelection: state.draftActionResult.originalSelection,
						numMatches: state.draftActionResult.numMatches,
						matchIndex: state.draftActionResult.matchIndex,
						pos: state.draftActionResult.pos,
					},
				},
			});
		}
	}, [
		annotationManager,
		state.draftId,
		state.isDrafting,
		state.draftMarkRef,
		state.draftActionResult,
	]);

	useEffect(() => {
		const setIsAnnotationSelected = (
			id: AnnotationId,
			isSelected: boolean,
		): SelectAnnotationResult => {
			if (state.isDrafting) {
				return {
					success: false,
					reason: 'draft-in-progress',
				};
			}

			if (!state.annotations?.[id]) {
				return {
					success: false,
					reason: 'id-not-valid',
				};
			}

			// the annotation is currently not selected and is being selected
			if (id !== state.currentSelectedAnnotationId && isSelected) {
				dispatch({
					type: 'updateAnnotation',
					data: {
						id,
						selected: true,
					},
				});

				dispatch({
					type: 'setSelectedMarkRef',
					data: {
						markRef: document.getElementById(id) || undefined,
					},
				});
			}
			// the annotation is currently selected and is being unselected
			else if (id === state.currentSelectedAnnotationId && !isSelected) {
				dispatch({
					type: 'resetSelectedAnnotation',
				});
			}

			return {
				success: true,
				isSelected,
			};
		};

		annotationManager?.hook('setIsAnnotationSelected', setIsAnnotationSelected);
		return () => {
			annotationManager?.unhook('setIsAnnotationSelected', setIsAnnotationSelected);
		};
	}, [
		annotationManager,
		state.isDrafting,
		state.annotations,
		state.currentSelectedAnnotationId,
		state.currentSelectedMarkRef,
	]);

	const prevSelectedAnnotationId = useRef<AnnotationId | undefined>(undefined);
	useEffect(() => {
		if (prevSelectedAnnotationId.current) {
			annotationManager?.emit({
				name: 'annotationSelectionChanged',
				data: {
					annotationId: prevSelectedAnnotationId.current,
					isSelected: false,
					inlineNodeTypes: [],
				},
			});
		}

		prevSelectedAnnotationId.current = state.currentSelectedAnnotationId;
	}, [state.currentSelectedAnnotationId, annotationManager]);

	useEffect(() => {
		if (
			state.currentSelectedAnnotationId &&
			state.currentSelectedMarkRef &&
			state.currentSelectedMarkRef.id === state.currentSelectedAnnotationId
		) {
			annotationManager?.emit({
				name: 'annotationSelectionChanged',
				data: {
					annotationId: state.currentSelectedAnnotationId,
					isSelected: true,
					inlineNodeTypes: [],
				},
			});
		}
	}, [annotationManager, state.currentSelectedAnnotationId, state.currentSelectedMarkRef]);

	useEffect(() => {
		const setIsAnnotationHovered = (
			id: AnnotationId,
			isHovered: boolean,
		): HoverAnnotationResult => {
			if (!state.annotations?.[id]) {
				return {
					success: false,
					reason: 'id-not-valid',
				};
			}

			dispatch({
				type: 'updateAnnotation',
				data: {
					id,
					hovered: isHovered,
				},
			});

			return {
				success: true,
				isHovered,
			};
		};

		annotationManager?.hook('setIsAnnotationHovered', setIsAnnotationHovered);
		return () => {
			annotationManager?.unhook('setIsAnnotationHovered', setIsAnnotationHovered);
		};
	}, [annotationManager, state.annotations]);

	useEffect(() => {
		const clearAnnotation = (id: AnnotationId): ClearAnnotationResult => {
			if (!state.annotations?.[id]) {
				return {
					success: false,
					reason: 'id-not-valid',
				};
			}

			const result = actionContext.deleteAnnotation(id, AnnotationTypes.INLINE_COMMENT);
			if (!result) {
				return {
					success: false,
					reason: 'clear-failed',
				};
			}

			const { step, doc } = result;
			return {
				success: true,
				actionResult: {
					step,
					doc,
				},
			};
		};

		annotationManager?.hook('clearAnnotation', clearAnnotation);
		return () => {
			annotationManager?.unhook('clearAnnotation', clearAnnotation);
		};
	}, [annotationManager, state.annotations, actionContext]);

	/**
	 * This is a temporary solution to ensure that the annotation manager state is in sync with the
	 * old updateSubscriber. The updateSubscriber will eventually be deprecated and the state will be managed
	 * by the annotation manager itself.
	 */
	useEffect(() => {
		const onSetAnnotationState = (
			payload?: AnnotationUpdateEventPayloads[AnnotationUpdateEvent.SET_ANNOTATION_STATE],
		) => {
			if (!payload) {
				return;
			}
			Object.values(payload).forEach((annotation) => {
				if (annotation.id && annotation.annotationType === AnnotationTypes.INLINE_COMMENT) {
					dispatch({
						type: 'updateAnnotation',
						data: {
							id: annotation.id,
							markState: annotation.state ?? undefined,
						},
					});
				}
			});
		};

		const onAnnotationSelected = (
			payload: AnnotationUpdateEventPayloads[AnnotationUpdateEvent.SET_ANNOTATION_FOCUS],
		) => {
			dispatch({
				type: 'updateAnnotation',
				data: {
					id: payload.annotationId,
					selected: true,
				},
			});
		};

		const onAnnotationHovered = (
			payload: AnnotationUpdateEventPayloads[AnnotationUpdateEvent.SET_ANNOTATION_HOVERED],
		) => {
			dispatch({
				type: 'updateAnnotation',
				data: {
					id: payload.annotationId,
					hovered: true,
				},
			});
		};

		const onAnnotationSelectedRemoved = () => {
			dispatch({
				type: 'resetSelectedAnnotation',
			});
		};

		const onAnnotationHoveredRemoved = () => {
			dispatch({
				type: 'resetHoveredAnnotation',
			});
		};

		const onAnnotationClick = ({
			annotationIds,
			eventTarget,
			eventTargetType,
			viewMethod,
		}: OnAnnotationClickPayload) => {
			dispatch({
				type: 'updateAnnotation',
				data: {
					id: annotationIds[0],
					selected: true,
				},
			});

			dispatch({
				type: 'setSelectedMarkRef',
				data: {
					markRef: eventTarget,
				},
			});
		};

		const onAnnotationDeselect = () => {
			dispatch({
				type: 'resetSelectedAnnotation',
			});
		};

		updateSubscriber?.on(AnnotationUpdateEvent.SET_ANNOTATION_STATE, onSetAnnotationState);
		updateSubscriber?.on(AnnotationUpdateEvent.SET_ANNOTATION_FOCUS, onAnnotationSelected);
		updateSubscriber?.on(AnnotationUpdateEvent.SET_ANNOTATION_HOVERED, onAnnotationHovered);
		updateSubscriber?.on(
			AnnotationUpdateEvent.REMOVE_ANNOTATION_FOCUS,
			onAnnotationSelectedRemoved,
		);
		updateSubscriber?.on(
			AnnotationUpdateEvent.REMOVE_ANNOTATION_HOVERED,
			onAnnotationHoveredRemoved,
		);
		updateSubscriber?.on(AnnotationUpdateEvent.ON_ANNOTATION_CLICK, onAnnotationClick);
		updateSubscriber?.on(AnnotationUpdateEvent.DESELECT_ANNOTATIONS, onAnnotationDeselect);

		return () => {
			updateSubscriber?.off(AnnotationUpdateEvent.SET_ANNOTATION_STATE, onSetAnnotationState);
			updateSubscriber?.off(AnnotationUpdateEvent.SET_ANNOTATION_FOCUS, onAnnotationSelected);
			updateSubscriber?.off(AnnotationUpdateEvent.SET_ANNOTATION_HOVERED, onAnnotationHovered);
			updateSubscriber?.off(
				AnnotationUpdateEvent.REMOVE_ANNOTATION_FOCUS,
				onAnnotationSelectedRemoved,
			);
			updateSubscriber?.off(
				AnnotationUpdateEvent.REMOVE_ANNOTATION_HOVERED,
				onAnnotationHoveredRemoved,
			);
			updateSubscriber?.off(AnnotationUpdateEvent.ON_ANNOTATION_CLICK, onAnnotationClick);
			updateSubscriber?.off(AnnotationUpdateEvent.DESELECT_ANNOTATIONS, onAnnotationDeselect);
		};
	}, [updateSubscriber]);

	const dispatchData = useMemo(
		() => ({
			annotationManager,
			dispatch,
		}),
		[annotationManager, dispatch],
	);

	return (
		<AnnotationManagerStateContext.Provider value={state}>
			<AnnotationManagerDispatchContext.Provider value={dispatchData}>
				{children}
			</AnnotationManagerDispatchContext.Provider>
		</AnnotationManagerStateContext.Provider>
	);
};

export const useAnnotationManagerState = () => {
	return useContext(AnnotationManagerStateContext);
};

export const useAnnotationManagerDispatch = () => {
	return useContext(AnnotationManagerDispatchContext);
};
