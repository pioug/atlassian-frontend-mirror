import React, { useCallback, useContext } from 'react';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import type {
	AnnotationByMatches,
	InlineCommentHoverComponentProps,
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
import { RendererContext as ActionsContext } from '../../RendererActionsContext';
import {
	useAnnotationRangeDispatch,
	useAnnotationRangeState,
} from '../contexts/AnnotationRangeContext';
import { fg } from '@atlaskit/platform-feature-flags';

type Props = {
	applyAnnotation: ApplyAnnotation;
	component: React.ComponentType<InlineCommentHoverComponentProps>;
	createAnalyticsEvent?: CreateUIAnalyticsEvent;
	documentPosition: Position | false;
	generateIndexMatch?: (pos: Position) => false | AnnotationByMatches;
	isAnnotationAllowed: boolean;
	isWithinRange: boolean;
	onClose: () => void;
	range: Range;
	wrapperDOM: React.RefObject<HTMLDivElement>;
};

export const Mounter = React.memo((props: Props) => {
	const {
		component: Component,
		range,
		isWithinRange,
		isAnnotationAllowed,
		wrapperDOM,
		onClose: onCloseProps,
		documentPosition,
		applyAnnotation,
		createAnalyticsEvent,
		generateIndexMatch,
	} = props;

	const { promoteHoverToDraft, clearHoverDraft } = useAnnotationRangeDispatch();
	const { hoverDraftDocumentPosition } = useAnnotationRangeState();

	const actions = useContext(ActionsContext);

	const onCreateCallback = useCallback(
		(annotationId: string) => {
			const positionToAnnotate = hoverDraftDocumentPosition || documentPosition;

			if (!isAnnotationAllowed || !positionToAnnotate || !applyAnnotation) {
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
					attributes: {},
					eventType: EVENT_TYPE.TRACK,
				}).fire(FabricChannel.editor);
			}

			return applyAnnotation(positionToAnnotate, annotation);
		},
		[
			isAnnotationAllowed,
			documentPosition,
			applyAnnotation,
			createAnalyticsEvent,
			hoverDraftDocumentPosition,
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
							documentPosition,
							isAnnotationAllowed: isAnnotationAllowed,
						},
						eventType: EVENT_TYPE.TRACK,
					}).fire(FabricChannel.editor);
				}

				return false;
			}

			promoteHoverToDraft(documentPosition);

			if (createAnalyticsEvent) {
				const uniqueAnnotationsInRange = actions.getAnnotationsByPosition(range);
				createAnalyticsEvent({
					action: ACTION.OPENED,
					actionSubject: ACTION_SUBJECT.ANNOTATION,
					actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
					eventType: EVENT_TYPE.TRACK,
					attributes: {
						overlap: uniqueAnnotationsInRange.length,
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

			const positionToAnnotate = hoverDraftDocumentPosition || documentPosition;

			if (!positionToAnnotate || !applyAnnotation || !options.annotationId) {
				if (fg('cc_comments_improve_apply_draft_errors')) {
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
			promoteHoverToDraft,
			hoverDraftDocumentPosition,
		],
	);

	const removeDraftModeCallback = useCallback(() => {
		clearHoverDraft();

		const sel = window.getSelection();
		if (sel) {
			sel.removeAllRanges();
		}
	}, [clearHoverDraft]);

	const onCloseCallback = useCallback(() => {
		if (createAnalyticsEvent) {
			createAnalyticsEvent({
				action: ACTION.CLOSED,
				actionSubject: ACTION_SUBJECT.ANNOTATION,
				actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
				eventType: EVENT_TYPE.TRACK,
				attributes: {},
			}).fire(FabricChannel.editor);
		}
		removeDraftModeCallback();
		onCloseProps();
	}, [onCloseProps, removeDraftModeCallback, createAnalyticsEvent]);

	return (
		<Component
			range={range}
			isWithinRange={isWithinRange}
			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			wrapperDOM={wrapperDOM.current as HTMLElement}
			isAnnotationAllowed={isAnnotationAllowed}
			onClose={onCloseCallback}
			onCreate={onCreateCallback}
			getAnnotationIndexMatch={createIndexCallback}
			applyDraftMode={applyDraftModeCallback}
			removeDraftMode={removeDraftModeCallback}
		/>
	);
});
