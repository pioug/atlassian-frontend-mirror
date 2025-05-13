import React, { useCallback, useState, useContext } from 'react';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import type {
	AnnotationByMatches,
	InlineCommentHoverComponentProps,
} from '@atlaskit/editor-common/types';
import { fg } from '@atlaskit/platform-feature-flags';
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

type Props = {
	range: Range;
	isWithinRange: boolean;
	component: React.ComponentType<InlineCommentHoverComponentProps>;
	wrapperDOM: React.RefObject<HTMLDivElement>;
	documentPosition: Position | false;
	isAnnotationAllowed: boolean;
	onClose: () => void;
	applyAnnotation: ApplyAnnotation;
	/**
	 * @private
	 * @deprecated This prop is deprecated as of platform_renderer_annotation_draft_position_fix and will be removed in the future.
	 */
	applyAnnotationDraftAt?: (position: Position) => void;
	/**
	 * @private
	 * @deprecated This prop is deprecated as of platform_renderer_annotation_draft_position_fix and will be removed in the future.
	 */
	clearAnnotationDraft?: () => void;
	createAnalyticsEvent?: CreateUIAnalyticsEvent;
	generateIndexMatch?: (pos: Position) => false | AnnotationByMatches;
};

export const Mounter = React.memo((props: Props) => {
	const {
		component: Component,
		range,
		isWithinRange,
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

	// if platform_renderer_annotation_draft_position_fix is enabled; then
	const { promoteHoverToDraft, clearHoverDraft } = useAnnotationRangeDispatch();
	const { hoverDraftDocumentPosition } = useAnnotationRangeState();
	// else;
	const [draftDocumentPosition, setDraftDocumentPosition] = useState<Position | null>();
	// end-if

	const actions = useContext(ActionsContext);

	const onCreateCallback = useCallback(
		(annotationId: string) => {
			const positionToAnnotate = fg('platform_renderer_annotation_draft_position_fix')
				? hoverDraftDocumentPosition || documentPosition
				: draftDocumentPosition || documentPosition;

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
			draftDocumentPosition,
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
						attributes: {},
						eventType: EVENT_TYPE.TRACK,
					}).fire(FabricChannel.editor);
				}

				return false;
			}

			if (fg('platform_renderer_annotation_draft_position_fix')) {
				promoteHoverToDraft(documentPosition);
			} else {
				setDraftDocumentPosition(documentPosition);
				applyAnnotationDraftAt && applyAnnotationDraftAt(documentPosition);
			}

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

			const positionToAnnotate = fg('platform_renderer_annotation_draft_position_fix')
				? hoverDraftDocumentPosition || documentPosition
				: draftDocumentPosition || documentPosition;

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
			promoteHoverToDraft,
			hoverDraftDocumentPosition,
		],
	);

	const removeDraftModeCallback = useCallback(() => {
		if (fg('platform_renderer_annotation_draft_position_fix')) {
			clearHoverDraft();
		} else {
			clearAnnotationDraft && clearAnnotationDraft();
			setDraftDocumentPosition(null);
		}

		const sel = window.getSelection();
		if (sel) {
			sel.removeAllRanges();
		}
	}, [clearAnnotationDraft, clearHoverDraft]);

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
