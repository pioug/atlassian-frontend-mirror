import React, { useCallback, useState, useContext } from 'react';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import {
  AnnotationByMatches,
  InlineCommentSelectionComponentProps,
} from '@atlaskit/editor-common';
import { ApplyAnnotation } from '../../../actions/index';
import { updateWindowSelectionAroundDraft } from '../draft';
import { Position } from '../types';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { FabricChannel } from '@atlaskit/analytics-listeners';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
} from '../../../analytics/enums';
import { RendererContext as ActionsContext } from '../../RendererActionsContext';

type Props = {
  range: Range;
  component: React.ComponentType<InlineCommentSelectionComponentProps>;
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

export const SelectionInlineCommentMounter: React.FC<Props> = React.memo(
  (props) => {
    const {
      component: Component,
      range,
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
    const [
      draftDocumentPosition,
      setDraftDocumentPosition,
    ] = useState<Position | null>();

    const actions = useContext(ActionsContext);

    const onCreateCallback = useCallback(
      (annotationId: string) => {
        if (!isAnnotationAllowed || !documentPosition || !applyAnnotation) {
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

        return applyAnnotation(
          draftDocumentPosition || documentPosition,
          annotation,
        );
      },
      [
        isAnnotationAllowed,
        documentPosition,
        applyAnnotation,
        draftDocumentPosition,
        createAnalyticsEvent,
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
      (keepNativeSelection: boolean = true) => {
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
          return;
        }

        setDraftDocumentPosition(documentPosition);
        applyAnnotationDraftAt(documentPosition);

        if (createAnalyticsEvent) {
          const uniqueAnnotationsInRange = actions.getAnnotationsByPosition(
            range,
          );
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
          if (keepNativeSelection) {
            updateWindowSelectionAroundDraft(documentPosition);
          } else {
            const sel = window.getSelection();
            if (sel) {
              sel.removeAllRanges();
            }
          }
        });
      },
      [
        documentPosition,
        isAnnotationAllowed,
        applyAnnotationDraftAt,
        createAnalyticsEvent,
        actions,
        range,
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
          attributes: {},
        }).fire(FabricChannel.editor);
      }
      removeDraftModeCallback();
      onCloseProps();
    }, [onCloseProps, removeDraftModeCallback, createAnalyticsEvent]);

    return (
      <Component
        range={range}
        wrapperDOM={wrapperDOM.current as HTMLElement}
        isAnnotationAllowed={isAnnotationAllowed}
        onClose={onCloseCallback}
        onCreate={onCreateCallback}
        getAnnotationIndexMatch={createIndexCallback}
        applyDraftMode={applyDraftModeCallback}
        removeDraftMode={removeDraftModeCallback}
      />
    );
  },
);
