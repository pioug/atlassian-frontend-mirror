import React, { useContext } from 'react';
import { Position } from '../types';
import { useUserSelectionRange } from '../hooks/user-selection';
import { SelectionInlineCommentMounter } from './mounter';
import { InlineCommentSelectionComponentProps } from '@atlaskit/editor-common';
import { RendererContext as ActionsContext } from '../../RendererActionsContext';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';

type Props = {
  selectionComponent: React.ComponentType<InlineCommentSelectionComponentProps>;
  rendererRef: React.RefObject<HTMLDivElement>;
  applyAnnotationDraftAt: (position: Position) => void;
  clearAnnotationDraft: () => void;
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
};

export const SelectionRangeValidator: React.FC<Props> = (props) => {
  const {
    selectionComponent,
    rendererRef,
    applyAnnotationDraftAt,
    clearAnnotationDraft,
    createAnalyticsEvent,
  } = props;
  const actions = useContext(ActionsContext);
  const [range, clearRange] = useUserSelectionRange({
    rendererRef,
  });

  if (!range) {
    return null;
  }
  const documentPosition = actions.getPositionFromRange(range);
  const isAnnotationAllowed =
    documentPosition && actions.isValidAnnotationPosition(documentPosition);

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
      generateIndexMatch={actions.generateAnnotationIndexMatch.bind(actions)}
      clearAnnotationDraft={clearAnnotationDraft}
      createAnalyticsEvent={createAnalyticsEvent}
    />
  );
};
