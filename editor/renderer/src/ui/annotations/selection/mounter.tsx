import React, { useCallback, useState, useContext } from 'react';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import type {
  AnnotationByMatches,
  InlineCommentSelectionComponentProps,
} from '@atlaskit/editor-common/types';
import type { ApplyAnnotation } from '../../../actions/index';
import { updateWindowSelectionAroundDraft } from '../draft';
import type { Position } from '../types';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { FabricChannel } from '@atlaskit/analytics-listeners';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
} from '@atlaskit/editor-common/analytics';
import { RendererContext as ActionsContext } from '../../RendererActionsContext';

type Props = {
  range: Range | null;
  draftRange: Range | null;
  component: React.ComponentType<
    React.PropsWithChildren<InlineCommentSelectionComponentProps>
  >;
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

export const SelectionInlineCommentMounter = React.memo(
  (props: React.PropsWithChildren<Props>) => {
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
    const [draftDocumentPosition, setDraftDocumentPosition] =
      useState<Position | null>();

    const actions = useContext(ActionsContext);

    const onCreateCallback = useCallback(
      (annotationId: string) => {
        // We want to support creation on a documentPosition if the user is only using ranges
        // but we want to prioritize draft positions if they are being used by consumers
        const positionToAnnotate = draftDocumentPosition || documentPosition;

        if (!positionToAnnotate || !applyAnnotation) {
          return false;
        }

        // Evaluate position validity when the user commits the position to be annotated
        const isCreateAllowedOnPosition =
          actions.isValidAnnotationPosition(positionToAnnotate);

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
            attributes: {},
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
          const uniqueAnnotationsInRange = range
            ? actions.getAnnotationsByPosition(range)
            : [];

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
        draftRange={draftRange}
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
