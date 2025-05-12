import React, { useCallback, useState, useContext, useMemo, useEffect } from 'react';

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

type Props = {
	range: Range | null;
	draftRange: Range | null;
	component: React.ComponentType<React.PropsWithChildren<InlineCommentSelectionComponentProps>>;
	wrapperDOM: React.RefObject<HTMLDivElement>;
	documentPosition: Position | false;
	isAnnotationAllowed: boolean;
	onClose: () => void;
	applyAnnotation: ApplyAnnotation;
	applyAnnotationDraftAt: (position: Position) => void;
	clearAnnotationDraft: () => void;
	createAnalyticsEvent?: CreateUIAnalyticsEvent;
	generateIndexMatch?: (pos: Position) => false | AnnotationByMatches;
};

export const SelectionInlineCommentMounter = React.memo((props: React.PropsWithChildren<Props>) => {
	const {
		component: Component,
		range,
		draftRange,
		isAnnotationAllowed,
		wrapperDOM,
		onClose: onCloseProps,
		clearAnnotationDraft,
		applyAnnotationDraftAt,
		documentPosition,
		applyAnnotation,
		createAnalyticsEvent,
		generateIndexMatch,
	} = props;
	const [draftDocumentPosition, setDraftDocumentPosition] = useState<Position | null>();

	const actions = useContext(ActionsContext);
	const { isDrafting, draftId } = useAnnotationManagerState();
	const { annotationManager, dispatch } = useAnnotationManagerDispatch();

	const inlineNodeTypes = useMemo(() => {
		if (fg('annotations_defensive_node_name_calculations')) {
			if (!actions.isRangeAnnotatable(range)) {
				return undefined;
			}

			return getRendererRangeInlineNodeNames({
				pos: documentPosition,
				actions,
			});
		} else {
			if (!fg('editor_inline_comments_on_inline_nodes')) {
				return undefined;
			}

			if (actions.isValidAnnotationRange(range)) {
				return getRendererRangeInlineNodeNames({
					pos: documentPosition,
					actions,
				});
			} else {
				return undefined;
			}
		}
	}, [documentPosition, actions, range]);

	const onCreateCallback = useCallback(
		(annotationId: string) => {
			// We want to support creation on a documentPosition if the user is only using ranges
			// but we want to prioritize draft positions if they are being used by consumers
			const positionToAnnotate = draftDocumentPosition || documentPosition;

			if (!positionToAnnotate || !applyAnnotation) {
				// TODO: EDITOR-595 - This analytic event is temporary and should be removed once the following issue
				// has been identified and fixed: https://atlassian.slack.com/archives/C08JK0WSCH5/p1745902609966999
				if (createAnalyticsEvent && fg('platform_renderer_annotations_create_debug_logging')) {
					createAnalyticsEvent({
						action: 'failed',
						actionSubject: 'applyAnnotation',
						actionSubjectId: 'inlineCommentFailureReason',
						attributes: {
							reason: 'Annotation Position invalid',
							draftDocumentPosition,
							documentPosition,
							applyAnnotation: !!applyAnnotation,
						},
						eventType: EVENT_TYPE.OPERATIONAL,
					}).fire(FabricChannel.editor);
				}
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
			draftDocumentPosition,
			createAnalyticsEvent,
			inlineNodeTypes,
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
						},
						eventType: EVENT_TYPE.TRACK,
					}).fire(FabricChannel.editor);
				}
				return false;
			}

			setDraftDocumentPosition(documentPosition);
			applyAnnotationDraftAt(documentPosition);

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

			const positionToAnnotate = draftDocumentPosition || documentPosition;

			if (!positionToAnnotate || !applyAnnotation || !options.annotationId) {
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
			applyAnnotationDraftAt,
			createAnalyticsEvent,
			applyAnnotation,
			draftDocumentPosition,
			actions,
			range,
			inlineNodeTypes,
		],
	);

	const removeDraftModeCallback = useCallback(() => {
		clearAnnotationDraft();

		setDraftDocumentPosition(null);
		const sel = window.getSelection();
		if (sel) {
			sel.removeAllRanges();
		}
	}, [clearAnnotationDraft]);

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
		if (fg('platform_editor_comments_api_manager')) {
			const allowAnnotation = (): boolean => {
				if (isDrafting) {
					return false;
				}
				return isAnnotationAllowed;
			};

			annotationManager?.hook('allowAnnotation', allowAnnotation);
			return () => {
				annotationManager?.unhook('allowAnnotation', allowAnnotation);
			};
		}
	}, [annotationManager, isAnnotationAllowed, isDrafting]);

	useEffect(() => {
		if (fg('platform_editor_comments_api_manager')) {
			const startDraft = (): StartDraftResult => {
				if (isDrafting) {
					return {
						success: false,
						reason: 'draft-in-progress',
					};
				}

				if (!actions.isValidAnnotationRange(range)) {
					return {
						success: false,
						reason: 'invalid-range',
					};
				}

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

			annotationManager?.hook('startDraft', startDraft);

			return () => {
				annotationManager?.unhook('startDraft', startDraft);
			};
		}
	}, [annotationManager, isDrafting, applyDraftModeCallback, actions, range, dispatch]);

	useEffect(() => {
		if (fg('platform_editor_comments_api_manager')) {
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

			annotationManager?.hook('clearDraft', clearDraft);

			return () => {
				annotationManager?.unhook('clearDraft', clearDraft);
			};
		}
	}, [annotationManager, onCloseCallback, isDrafting, dispatch]);

	useEffect(() => {
		if (fg('platform_editor_comments_api_manager')) {
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

			annotationManager?.hook('applyDraft', applyDraft);

			return () => {
				annotationManager?.unhook('applyDraft', applyDraft);
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
			onClose={fg('platform_editor_comments_api_manager') ? nop : onCloseCallback}
			onCreate={fg('platform_editor_comments_api_manager') ? nop : onCreateCallback}
			getAnnotationIndexMatch={createIndexCallback}
			applyDraftMode={fg('platform_editor_comments_api_manager') ? nop : applyDraftModeCallback}
			removeDraftMode={fg('platform_editor_comments_api_manager') ? nop : removeDraftModeCallback}
			inlineNodeTypes={inlineNodeTypes}
		/>
	);
});
