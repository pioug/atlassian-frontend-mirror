import React from 'react';
import { SelectionInlineCommentMounter } from './mounter';
import { RendererContext } from '../../RendererActionsContext';
import { useUserSelectionRange } from '../hooks/user-selection';
import { Position } from '../types';
import { InlineCommentSelectionComponentProps } from '@atlaskit/editor-common';

type Props = {
  selectionComponent: React.ComponentType<InlineCommentSelectionComponentProps>;
  rendererRef: React.RefObject<HTMLDivElement>;
  applyAnnotationDraftAt: (position: Position) => void;
  clearAnnotationDraft: () => void;
};

export const AnnotationSelection: React.FC<Props> = props => {
  const {
    selectionComponent,
    rendererRef,
    applyAnnotationDraftAt,
    clearAnnotationDraft,
  } = props;
  const [range, clearRange] = useUserSelectionRange({
    rendererRef,
  });

  if (!range) {
    return null;
  }

  return (
    <RendererContext.Consumer>
      {actions => {
        const documentPosition = actions.getPositionFromRange(range);
        const isAnnotationAllowed =
          documentPosition &&
          actions.isValidAnnotationPosition(documentPosition);

        return (
          <SelectionInlineCommentMounter
            range={range}
            wrapperDOM={rendererRef}
            component={selectionComponent}
            onClose={clearRange}
            documentPosition={documentPosition}
            isAnnotationAllowed={isAnnotationAllowed}
            applyAnnotation={actions.applyAnnotation.bind(actions)}
            applyAnnotationDraftAt={applyAnnotationDraftAt}
            clearAnnotationDraft={clearAnnotationDraft}
          />
        );
      }}
    </RendererContext.Consumer>
  );
};
