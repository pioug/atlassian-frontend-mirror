/* eslint-disable @atlaskit/design-system/no-html-button */
import React from 'react';

import {
	type AnnotationActionResult,
	type AnnotationProviders,
	AnnotationUpdateEvent,
} from '@atlaskit/editor-common/types';
import { HighlightBar } from './HighlightBar';
import { AttachedComment } from './AttachedComment';
import { AnnotationUpdateEmitter } from '@atlaskit/editor-common/annotation';
import uuid from 'uuid/v4';

import { popupPortalContainerId } from './shared';

import { AnnotationMarkStates, AnnotationTypes, type DocNode } from '@atlaskit/adf-schema';
import { ExampleHighlightMenu } from './mock-ui';

type AnnotationEventEmitterFn = () => any;

let rendererEmitter: AnnotationUpdateEmitter | undefined;
export const getRendererAnnotationEventEmitter: AnnotationEventEmitterFn = () => {
	if (!rendererEmitter) {
		rendererEmitter = new AnnotationUpdateEmitter();
	}

	return rendererEmitter;
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
			isCommentsOnMediaBugFixEnabled: true,
		},
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
	const [draft, setDraft] = React.useState<{
		annotationActionResult: NonNullable<Exclude<AnnotationActionResult, false>>;
		id: string;
	}>();
	const eventEmitter = getRendererAnnotationEventEmitter();

	let [commentState, setCommentState] = React.useState<
		'none' | 'draft' | 'selection' | 'something-else'
	>('none');

	React.useEffect(() => {
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
						removeDraftMode();
						if (draft) {
							annotationProductDispatch({
								type: 'comment.add',
								id: draft.id,
								initialComment: 'fake added comment',
							});
							annotationProductDispatch({
								type: 'document.update',
								document: draft.annotationActionResult.doc as any,
							});

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
					}}
				>
					save comment
				</button>
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
								const annotationId = uuid();
								const annotationActionResult = applyDraftMode({
									annotationId,
									keepNativeSelection: false,
								});
								if (annotationActionResult) {
									setCommentState('draft');
									setDraft({ annotationActionResult, id: annotationId });
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
		state: AnnotationMarkStates;
		comments: string[];
	};
};

type ProductState = {
	document: DocNode;
	annotationState: MockAnnotationState;
	drafts: { [rangeKey: string]: string };
	activeComment?: { type: 'annotation' | 'draft'; id: string };
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
	initialAnnotationState: MockAnnotationState;
	initialDoc: DocNode;
	children: React.ReactNode;
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
	| { type: 'annotation.resolved'; id: string }
	| { type: 'annotation.unresolved'; id: string }
	| { type: 'annotation.create'; id: string; initialComment: string }
	| { type: 'draft.create'; rangeKey: string; content: string }
	| { type: 'comment.add'; id: string; initialComment: string }
	| { type: 'document.update'; document: DocNode };

type ProductInternalState = {
	drafts: { [rangeKey: string]: string };
	annotationState: MockAnnotationState;
	document: DocNode;
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
