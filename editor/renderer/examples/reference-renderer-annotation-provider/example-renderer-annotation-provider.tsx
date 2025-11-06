/* eslint-disable @atlaskit/design-system/no-html-button */
import React, { useEffect, useState } from 'react';

// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import uuid from 'uuid/v4';

import { AnnotationMarkStates, AnnotationTypes, type DocNode } from '@atlaskit/adf-schema';
import {
	type AnnotationManager,
	AnnotationUpdateEmitter,
	createAnnotationManager,
} from '@atlaskit/editor-common/annotation';
import {
	// type AnnotationActionResult,
	type AnnotationProviders,
	AnnotationUpdateEvent,
} from '@atlaskit/editor-common/types';
import type { AddMarkStep } from '@atlaskit/editor-prosemirror/transform';
import { fg } from '@atlaskit/platform-feature-flags';

import { HighlightBar } from './HighlightBar';
import { AttachedComment } from './AttachedComment';
import { popupPortalContainerId } from './shared';
import { ExampleHighlightMenu } from './mock-ui';

type AnnotationEventEmitterFn = () => any;

let rendererEmitter: AnnotationUpdateEmitter | undefined;
export const getRendererAnnotationEventEmitter: AnnotationEventEmitterFn = () => {
	if (!rendererEmitter) {
		rendererEmitter = new AnnotationUpdateEmitter();
	}

	return rendererEmitter;
};

let annotationManager: AnnotationManager | undefined;
export const getRendererAnnotationManager: () => AnnotationManager | undefined = () => {
	if (!annotationManager && fg('platform_editor_comments_api_manager')) {
		annotationManager = createAnnotationManager();
	}
	return annotationManager;
};

export const useExampleRendererAnnotationProvider = () => {
	const highlightsMountPoint = (
		<div
			id={popupPortalContainerId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={{ position: 'relative', zIndex: 1 }}
		></div>
	);

	const annotationProductState = React.useContext(ExampleAnnotationProductStateContext);

	const rendererAnnotationProvider: AnnotationProviders = {
		inlineComment: {
			getState: (annotationIds: string[], isNestedRender: boolean) => {
				const statedAnnotations = Object.entries(annotationProductState.annotationState).map(
					([id, state]) => {
						return {
							id,
							state: state.state,
							annotationType: AnnotationTypes.INLINE_COMMENT,
						};
					},
				);
				return Promise.resolve(statedAnnotations);
			},
			allowDraftMode: true,
			allowCommentsOnMedia: true,
			selectionComponent(props) {
				return <SelectionComponent {...props} />;
			},
			// hoverComponent: ({ children }) => <span data-testid="rap-hover-component">{children}</span>,
			viewComponent: () => <div data-testid="rap-view-component">view component</div>,
			updateSubscriber: getRendererAnnotationEventEmitter(),
		},
		annotationManager: getRendererAnnotationManager(),
	};

	return {
		rendererAnnotationProvider,
		highlightsMountPoint,
	};
};

function SelectionComponent({
	wrapperDOM,
	// Range of current selection
	range,
	// Range of selection when a draft comment is created/applied
	draftRange,
	applyDraftMode,
	removeDraftMode,
	onClose,
	isAnnotationAllowed,
}: React.ComponentProps<NonNullable<AnnotationProviders['inlineComment']['selectionComponent']>>) {
	const mountPoint = document.querySelector(`#${popupPortalContainerId}`)!;
	const annotationProductDispatch = React.useContext(ExampleAnnotationProductDispatch);
	const [draft, setDraft] = useState<{
		draftDoc?: DocNode;
		id: string;
	}>();
	const eventEmitter = getRendererAnnotationEventEmitter();
	const annotationManager = getRendererAnnotationManager();

	const [commentState, setCommentState] = React.useState<
		'none' | 'draft' | 'selection' | 'something-else'
	>('none');

	useEffect(() => {
		if (commentState === 'none' && range) {
			setCommentState('selection');
		}
		if (commentState === 'selection' && !range) {
			setCommentState('none');
		}
	}, [range, commentState]);

	if (commentState === 'draft' && draftRange) {
		// If there is a draft range -- the user is in the process of creating a new annotation
		return (
			<AttachedComment
				activeComment="unimplemented -- still using draft range"
				range={draftRange!}
				portalContainer={mountPoint}
				stickyHeaderHeight={0}
			>
				Comment UI
				<button
					onClick={() => {
						if (annotationManager) {
							if (draft) {
								// This is setting a new uuid for the annotation because this is currently how annotations
								// behave in CCFE.
								// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
								const annotationId = uuid();
								const draftRes = annotationManager.applyDraft(annotationId);

								if (draftRes.success) {
									console.log(
										'%c%s',
										'color:rgb(0, 35, 0); background: #CCFFCC;',
										'[AnnotationManager] applyDraft success:',
										draftRes,
									);

									setDraft({
										id: annotationId,
										draftDoc: draftRes.actionResult?.doc as DocNode,
									});

									annotationProductDispatch({
										type: 'comment.add',
										id: annotationId,
										initialComment: 'fake added comment',
									});
									if (draft.draftDoc) {
										annotationProductDispatch({
											type: 'document.update',
											document: draftRes.actionResult?.doc as DocNode, //draft.draftDoc as any,
										});
									}
								} else {
									console.warn('[AnnotationManager] applyDraft failed', draftRes.reason);
								}
							}
						} else {
							removeDraftMode();
							if (draft) {
								annotationProductDispatch({
									type: 'comment.add',
									id: draft.id,
									initialComment: 'fake added comment',
								});

								if (draft.draftDoc) {
									annotationProductDispatch({
										type: 'document.update',
										document: draft.draftDoc as any,
									});
								}

								new Promise((res) => {
									setTimeout(res, 250);
								}).then(() => {
									// Tell the renderer to set the new comment to active
									if (
										eventEmitter.emit(AnnotationUpdateEvent.ON_ANNOTATION_CLICK, {
											annotationIds: [draft.id],
											// eventTarget: wrapperDOM,
											eventTarget: document.getElementById(draft.id),
										})
									) {
										eventEmitter.emit(AnnotationUpdateEvent.SET_ANNOTATION_FOCUS, {
											annotationId: draft.id,
										});
									}
									// eventEmitter.emit(AnnotationUpdateEvent.REMOVE_ANNOTATION_FOCUS);
									// eventEmitter.emit(AnnotationUpdateEvent.DESELECT_ANNOTATIONS);
									// setCommentState('none');

									onClose();
									removeDraftMode();
									onClose();
								});
							}
						}
					}}
				>
					save comment
				</button>
				{annotationManager && (
					<button
						onClick={() => {
							if (draft) {
								const draftRes = annotationManager.clearDraft();

								if (draftRes.success) {
									setCommentState('none');
								} else {
									console.warn('[AnnotationManager] clearDraft failed', draftRes.reason);
								}
							}
						}}
					>
						cancel
					</button>
				)}
			</AttachedComment>
		);
	}
	if (commentState === 'selection' && range) {
		// If there is a range -- there is a selection that can be annotated
		return (
			<HighlightBar range={range} portalContainer={mountPoint} stickyHeaderHeight={0}>
				<ExampleHighlightMenu>
					<ExampleHighlightMenu.Item>
						<button
							onClick={() => {
								// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
								const annotationId = uuid() as string;
								if (annotationManager) {
									annotationManager
										.checkPreemptiveGate()
										.then((canStartDraft) => {
											if (canStartDraft) {
												const startResult = annotationManager.startDraft();
												if (startResult.success) {
													console.log(
														'%c%s',
														'color:rgb(0, 35, 0); background: #CCFFCC;',
														'[AnnotationManager] startDraft success:',
														startResult,
													);
													setCommentState('draft');
													// WHY?? are we pulling the id from the step.
													// See: https://hello.jira.atlassian.cloud/browse/EDITOR-626
													setDraft({
														id:
															(startResult.actionResult?.step as AddMarkStep)?.mark?.attrs?.id ??
															annotationId,
														draftDoc: startResult.actionResult?.doc as DocNode,
													});
												} else {
													console.log(
														'%c%s',
														'color:rgb(37, 29, 0); background:rgb(255, 210, 131);',
														'[AnnotationManager] startDraft failed:',
														startResult.reason,
													);
												}
											} else {
												console.log(
													'%c%s',
													'color:rgb(45, 9, 0); background:rgb(255, 149, 131);',
													'[AnnotationManager] startDraft checkPreemptiveGate failed',
												);
											}
										})
										.catch((err) => {
											console.log(
												'%c%s',
												'color:rgb(45, 9, 0); background:rgb(255, 149, 131);',
												'[AnnotationManager] checkPreemptiveGate Error:',
												err,
											);
										});
								} else {
									const annotationActionResult = applyDraftMode({
										annotationId,
										keepNativeSelection: false,
									});
									if (annotationActionResult) {
										setCommentState('draft');
										setDraft({ id: annotationId, draftDoc: annotationActionResult.doc as DocNode });
									}
								}
							}}
							disabled={!isAnnotationAllowed}
						>
							comment ({!isAnnotationAllowed ? 'disabled' : 'enabled'})
						</button>
					</ExampleHighlightMenu.Item>
					<ExampleHighlightMenu.Item>
						{range.toString().length}&nbsp;selected
					</ExampleHighlightMenu.Item>
				</ExampleHighlightMenu>
			</HighlightBar>
		);
	}

	return null;
}

type MockAnnotationState = {
	[annotationId: string]: {
		comments: string[];
		state: AnnotationMarkStates;
	};
};

type ProductState = {
	activeComment?: { id: string; type: 'annotation' | 'draft' };
	annotationState: MockAnnotationState;
	document: DocNode;
	drafts: { [rangeKey: string]: string };
};

export const ExampleAnnotationProductStateContext = React.createContext({} as ProductState);
export const ExampleAnnotationProductDispatch = React.createContext(
	{} as React.Dispatch<ProductStateReducerAction>,
);

export const ExampleAnnotationProductState = ({
	initialAnnotationState,
	initialDoc,
	children,
}: {
	children: React.ReactNode;
	initialAnnotationState: MockAnnotationState;
	initialDoc: DocNode;
}) => {
	const [state, dispatch] = React.useReducer(productStateReducer, {
		drafts: {},
		annotationState: initialAnnotationState,
		document: initialDoc,
	});

	return (
		<ExampleAnnotationProductStateContext.Provider value={state}>
			<ExampleAnnotationProductDispatch.Provider value={dispatch}>
				{children}
			</ExampleAnnotationProductDispatch.Provider>
		</ExampleAnnotationProductStateContext.Provider>
	);
};

type ProductStateReducerAction =
	| { id: string; type: 'annotation.resolved' }
	| { id: string; type: 'annotation.unresolved' }
	| { id: string; initialComment: string; type: 'annotation.create' }
	| { content: string; rangeKey: string; type: 'draft.create' }
	| { id: string; initialComment: string; type: 'comment.add' }
	| { document: DocNode; type: 'document.update' };

type ProductInternalState = {
	annotationState: MockAnnotationState;
	document: DocNode;
	drafts: { [rangeKey: string]: string };
};

function productStateReducer(
	productState: ProductInternalState,
	action: ProductStateReducerAction,
) {
	switch (action.type) {
		case 'annotation.resolved':
			return {
				...productState,
				annotationState: {
					...productState.annotationState,
					[action.id]: {
						state: AnnotationMarkStates.RESOLVED,
						comments: [],
					},
				},
			};
		case 'annotation.unresolved':
			return {
				...productState,
				annotationState: {
					...productState.annotationState,
					[action.id]: {
						state: AnnotationMarkStates.ACTIVE,
						comments: [],
					},
				},
			};
		case 'annotation.create':
			return {
				...productState,
				annotationState: {
					...productState.annotationState,
					[action.id]: {
						state: AnnotationMarkStates.ACTIVE,
						comments: [action.initialComment],
					},
				},
			};
		case 'draft.create': {
			return {
				...productState,
				activeComment: { type: 'draft' as const, id: action.rangeKey },
				drafts: {
					...productState.drafts,
					[action.rangeKey]: action.content,
				},
			};
		}
		case 'document.update':
			return {
				...productState,
				document: action.document,
			};
		case 'comment.add':
			return {
				...productState,
				annotationState: {
					...productState.annotationState,
					[action.id]: {
						state: AnnotationMarkStates.ACTIVE,
						comments: [action.initialComment],
					},
				},
			};
		default:
			return productState;
	}
}
