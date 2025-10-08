import React, { useCallback, useContext, useMemo, useEffect } from 'react';

import uuid from 'uuid/v4';

import { type AnnotationId, AnnotationTypes, AnnotationMarkStates } from '@atlaskit/adf-schema';
import type {
	ApplyDraftResult,
	ClearDraftResult,
	StartDraftResult,
} from '@atlaskit/editor-common/annotation';
import { fg } from '@atlaskit/platform-feature-flags';
import type {
	AnnotationByMatches,
	InlineCommentSelectionComponentProps,
} from '@atlaskit/editor-common/types';
import type { ApplyAnnotation } from '../../../actions/index';
import { updateWindowSelectionAroundDraft } from '../draft/dom';
import type { Position } from '../types';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { FabricChannel } from '@atlaskit/analytics-listeners/types';
import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	ACTION_SUBJECT_ID,
} from '@atlaskit/editor-common/analytics';
import { getRendererRangeInlineNodeNames } from '../../../actions/get-renderer-range-inline-node-names';
import { RendererContext as ActionsContext } from '../../RendererActionsContext';
import {
	useAnnotationManagerDispatch,
	useAnnotationManagerState,
} from '../contexts/AnnotationManagerContext';
import {
	useAnnotationRangeDispatch,
	useAnnotationRangeState,
} from '../contexts/AnnotationRangeContext';

type Props = {
	applyAnnotation: ApplyAnnotation;
	component: React.ComponentType<React.PropsWithChildren<InlineCommentSelectionComponentProps>>;
	createAnalyticsEvent?: CreateUIAnalyticsEvent;
	documentPosition: Position | false;
	draftRange: Range | null;
	generateIndexMatch?: (pos: Position) => false | AnnotationByMatches;
	isAnnotationAllowed: boolean;
	onClose: () => void;
	range: Range | null;
	wrapperDOM: React.RefObject<HTMLDivElement>;
};

export const SelectionInlineCommentMounter = React.memo((props: React.PropsWithChildren<Props>) => {
	const {
		component: Component,
		range,
		draftRange,
		isAnnotationAllowed,
		wrapperDOM,
		onClose: onCloseProps,
		documentPosition,
		applyAnnotation,
		createAnalyticsEvent,
		generateIndexMatch,
	} = props;

	const { promoteSelectionToDraft, clearSelectionDraft } = useAnnotationRangeDispatch();
	const { selectionDraftDocumentPosition } = useAnnotationRangeState();

	const actions = useContext(ActionsContext);
	const { isDrafting, draftId } = useAnnotationManagerState();
	const { annotationManager, dispatch } = useAnnotationManagerDispatch();

	const inlineNodeTypes = useMemo(() => {
		if (!actions.isRangeAnnotatable(range)) {
			return undefined;
		}

		return getRendererRangeInlineNodeNames({
			pos: documentPosition,
			actions,
		});
	}, [documentPosition, actions, range]);

	const onCreateCallback = useCallback(
		(annotationId: string) => {
			// We want to support creation on a documentPosition if the user is only using ranges
			// but we want to prioritize draft positions if they are being used by consumers
			// !!! at this point, the documentPosition can be the wrong position if the user select something else
			const positionToAnnotate = selectionDraftDocumentPosition || documentPosition;

			if (!positionToAnnotate || !applyAnnotation) {
				return false;
			}

			// Evaluate position validity when the user commits the position to be annotated
			const isCreateAllowedOnPosition = actions.isValidAnnotationPosition(positionToAnnotate);

			if (!isCreateAllowedOnPosition) {
				return false;
			}

			const annotation = {
				annotationId,
				annotationType: AnnotationTypes.INLINE_COMMENT,
			};

			if (createAnalyticsEvent) {
				createAnalyticsEvent({
					action: ACTION.INSERTED,
					actionSubject: ACTION_SUBJECT.ANNOTATION,
					actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
					attributes: {
						inlineNodeNames: inlineNodeTypes,
					},
					eventType: EVENT_TYPE.TRACK,
				}).fire(FabricChannel.editor);
			}

			return applyAnnotation(positionToAnnotate, annotation);
		},
		[
			actions,
			documentPosition,
			applyAnnotation,
			createAnalyticsEvent,
			inlineNodeTypes,
			selectionDraftDocumentPosition,
		],
	);

	const createIndexCallback = useCallback((): AnnotationByMatches | false => {
		if (!documentPosition || !generateIndexMatch) {
			return false;
		}
		const result = generateIndexMatch(documentPosition);
		if (!result) {
			return false;
		}

		return result;
	}, [documentPosition, generateIndexMatch]);

	const applyDraftModeCallback = useCallback(
		(options: { annotationId?: string; keepNativeSelection?: boolean }) => {
			if (!documentPosition || !isAnnotationAllowed) {
				if (createAnalyticsEvent) {
					createAnalyticsEvent({
						action: ACTION.CREATE_NOT_ALLOWED,
						actionSubject: ACTION_SUBJECT.ANNOTATION,
						actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
						attributes: {
							inlineNodeNames: inlineNodeTypes,
							documentPosition,
							isAnnotationAllowed,
						},
						eventType: EVENT_TYPE.TRACK,
					}).fire(FabricChannel.editor);
				}
				return false;
			}

			promoteSelectionToDraft(documentPosition);

			if (createAnalyticsEvent) {
				const uniqueAnnotationsInRange = range ? actions.getAnnotationsByPosition(range) : [];

				createAnalyticsEvent({
					action: ACTION.OPENED,
					actionSubject: ACTION_SUBJECT.ANNOTATION,
					actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
					eventType: EVENT_TYPE.TRACK,
					attributes: {
						overlap: uniqueAnnotationsInRange.length,
						inlineNodeNames: inlineNodeTypes,
					},
				}).fire(FabricChannel.editor);
			}

			window.requestAnimationFrame(() => {
				if (options.keepNativeSelection) {
					updateWindowSelectionAroundDraft(documentPosition);
				} else {
					const sel = window.getSelection();
					if (sel) {
						sel.removeAllRanges();
					}
				}
			});

			// at this point, the documentPosition is the position that the user has selected,
			// not the selectionDraftDocumentPosition
			// because the documentPosition is not promoted to selectionDraftDocumentPosition yet
			// use platform_editor_comments_api_manager here so we can clear the code path when the flag is removed
			const positionToAnnotate = fg('platform_editor_comments_api_manager')
				? documentPosition
				: selectionDraftDocumentPosition || documentPosition;

			if (!positionToAnnotate || !applyAnnotation || !options.annotationId) {
				if (createAnalyticsEvent) {
					createAnalyticsEvent({
						action: ACTION.CREATE_NOT_ALLOWED,
						actionSubject: ACTION_SUBJECT.ANNOTATION,
						actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
						attributes: {
							positionToAnnotate,
							applyAnnotationMissing: !applyAnnotation,
							annotationId: options.annotationId,
						},
						eventType: EVENT_TYPE.TRACK,
					}).fire(FabricChannel.editor);
				}
				return false;
			}

			const annotation = {
				annotationId: options.annotationId,
				annotationType: AnnotationTypes.INLINE_COMMENT,
			};

			return applyAnnotation(positionToAnnotate, annotation);
		},
		[
			documentPosition,
			isAnnotationAllowed,
			createAnalyticsEvent,
			applyAnnotation,
			actions,
			range,
			inlineNodeTypes,
			promoteSelectionToDraft,
			selectionDraftDocumentPosition,
		],
	);

	const removeDraftModeCallback = useCallback(() => {
		clearSelectionDraft();

		const sel = window.getSelection();
		if (sel) {
			sel.removeAllRanges();
		}
	}, [clearSelectionDraft]);

	const onCloseCallback = useCallback(() => {
		if (createAnalyticsEvent) {
			createAnalyticsEvent({
				action: ACTION.CLOSED,
				actionSubject: ACTION_SUBJECT.ANNOTATION,
				actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
				eventType: EVENT_TYPE.TRACK,
				attributes: {
					inlineNodeNames: inlineNodeTypes,
				},
			}).fire(FabricChannel.editor);
		}
		removeDraftModeCallback();
		onCloseProps();
	}, [onCloseProps, removeDraftModeCallback, createAnalyticsEvent, inlineNodeTypes]);

	useEffect(() => {
		if (annotationManager) {
			const allowAnnotation = (): boolean => {
				if (isDrafting) {
					return false;
				}
				return isAnnotationAllowed;
			};

			annotationManager.hook('allowAnnotation', allowAnnotation);
			return () => {
				annotationManager.unhook('allowAnnotation', allowAnnotation);
			};
		}
	}, [annotationManager, isAnnotationAllowed, isDrafting]);

	useEffect(() => {
		if (annotationManager) {
			const startDraft = (): StartDraftResult => {
				// if there is a draft in progress, we ignore it and start a new draft
				// this is because clearing the draft will remove the mark node from the DOM, which will cause the selection range to be invalid

				const id = uuid();
				const result = applyDraftModeCallback({
					annotationId: id,
					keepNativeSelection: false,
				});

				if (!result) {
					return {
						success: false,
						reason: 'invalid-range',
					};
				}

				dispatch({
					type: 'setDrafting',
					data: {
						isDrafting: true,
						draftId: id,
						draftActionResult: result,
					},
				});

				dispatch({
					type: 'resetSelectedAnnotation',
				});

				return {
					success: true,
					// We cannot get a ref to the target element here
					// because the draft is not yet applied to the DOM
					targetElement: undefined,
					inlineNodeTypes: result.inlineNodeTypes ?? [],
					actionResult: {
						step: result.step,
						doc: result.doc,
						inlineNodeTypes: result.inlineNodeTypes,
						targetNodeType: result.targetNodeType,
						originalSelection: result.originalSelection,
						numMatches: result.numMatches,
						matchIndex: result.matchIndex,
						pos: result.pos,
					},
				};
			};

			annotationManager.hook('startDraft', startDraft);

			return () => {
				annotationManager.unhook('startDraft', startDraft);
			};
		}
	}, [annotationManager, isDrafting, applyDraftModeCallback, actions, range, dispatch]);

	useEffect(() => {
		if (annotationManager) {
			const clearDraft = (): ClearDraftResult => {
				if (!isDrafting) {
					return {
						success: false,
						reason: 'draft-not-started',
					};
				}

				dispatch({
					type: 'setDrafting',
					data: {
						isDrafting: false,
						draftId: undefined,
						draftActionResult: undefined,
					},
				});

				onCloseCallback();

				return {
					success: true,
				};
			};

			annotationManager.hook('clearDraft', clearDraft);

			return () => {
				annotationManager.unhook('clearDraft', clearDraft);
			};
		}
	}, [annotationManager, onCloseCallback, isDrafting, dispatch]);

	useEffect(() => {
		if (annotationManager) {
			const applyDraft = (id: AnnotationId): ApplyDraftResult => {
				if (!isDrafting || !draftId) {
					return {
						success: false,
						reason: 'draft-not-started',
					};
				}

				const result = onCreateCallback(id);
				if (!result) {
					return {
						success: false,
						reason: 'range-no-longer-exists',
					};
				}

				onCloseCallback();

				dispatch({
					type: 'setDrafting',
					data: {
						isDrafting: false,
						draftId: undefined,
						draftActionResult: undefined,
					},
				});

				dispatch({
					type: 'updateAnnotation',
					data: {
						id,
						selected: true,
						markState: AnnotationMarkStates.ACTIVE,
					},
				});

				return {
					success: true,
					targetElement: undefined,
					actionResult:
						id !== draftId
							? {
									step: result.step,
									doc: result.doc,
									inlineNodeTypes: result.inlineNodeTypes,
									targetNodeType: result.targetNodeType,
									originalSelection: result.originalSelection,
									numMatches: result.numMatches,
									matchIndex: result.matchIndex,
									pos: result.pos,
								}
							: undefined,
				};
			};

			annotationManager.hook('applyDraft', applyDraft);

			return () => {
				annotationManager.unhook('applyDraft', applyDraft);
			};
		}
	}, [annotationManager, onCreateCallback, onCloseCallback, isDrafting, draftId, dispatch]);

	// Please remove this NOP function when the flag platform_editor_comments_api_manager is removed.
	const nop = useMemo(() => () => false, []);

	return (
		<Component
			range={range}
			draftRange={draftRange}
			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			wrapperDOM={wrapperDOM.current as HTMLElement}
			isAnnotationAllowed={isAnnotationAllowed}
			onClose={annotationManager ? nop : onCloseCallback}
			onCreate={annotationManager ? nop : onCreateCallback}
			getAnnotationIndexMatch={createIndexCallback}
			applyDraftMode={annotationManager ? nop : applyDraftModeCallback}
			removeDraftMode={annotationManager ? nop : removeDraftModeCallback}
			inlineNodeTypes={inlineNodeTypes}
		/>
	);
});
