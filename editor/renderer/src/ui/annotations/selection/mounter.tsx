import React, { useCallback, useState } from 'react';
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
    const [
      draftDocumentPosition,
      setDraftDocumentPosition,
    ] = useState<Position | null>();

    const onCreateCallback = useCallback(
      (annotationId: string) => {
        if (!isAnnotationAllowed || !documentPosition || !applyAnnotation) {
          return false;
        }
        const annotation = {
          annotationId,
          annotationType: AnnotationTypes.INLINE_COMMENT,
        };
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
      ],
    );

    const applyDraftModeCallback = useCallback(
      (keepNativeSelection: boolean = true) => {
        if (!documentPosition) {
          return;
        }

        setDraftDocumentPosition(documentPosition);
        applyAnnotationDraftAt(documentPosition);

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
      [documentPosition, applyAnnotationDraftAt],
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
