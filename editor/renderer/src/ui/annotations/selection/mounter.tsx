import React, { useCallback } from 'react';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import { InlineCommentSelectionComponentProps } from '@atlaskit/editor-common';
import { ApplyAnnotation } from '../../../actions/index';
import { updateWindowSelectionAroundDraft } from '../draft';
import { Position } from '../types';

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
};

export const SelectionInlineCommentMounter: React.FC<Props> = React.memo(
  props => {
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
    } = props;

    const onCreateCallback = useCallback(
      (annotationId: string) => {
        if (!isAnnotationAllowed || !documentPosition || !applyAnnotation) {
          return false;
        }
        const annotation = {
          annotationId,
          annotationType: AnnotationTypes.INLINE_COMMENT,
        };
        return applyAnnotation(documentPosition, annotation);
      },
      [isAnnotationAllowed, documentPosition, applyAnnotation],
    );

    const applyDraftModeCallback = useCallback(() => {
      if (!documentPosition) {
        return;
      }

      applyAnnotationDraftAt(documentPosition);
      window.requestAnimationFrame(() => {
        updateWindowSelectionAroundDraft(documentPosition);
      });
    }, [documentPosition, applyAnnotationDraftAt]);

    const removeDraftModeCallback = useCallback(() => {
      clearAnnotationDraft();

      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
      }
    }, [clearAnnotationDraft]);

    const onCloseCallback = useCallback(() => {
      removeDraftModeCallback();
      onCloseProps();
    }, [onCloseProps, removeDraftModeCallback]);

    return (
      <Component
        range={range}
        wrapperDOM={wrapperDOM.current as HTMLElement}
        isAnnotationAllowed={isAnnotationAllowed}
        onClose={onCloseCallback}
        onCreate={onCreateCallback}
        applyDraftMode={applyDraftModeCallback}
        removeDraftMode={removeDraftModeCallback}
      />
    );
  },
);
