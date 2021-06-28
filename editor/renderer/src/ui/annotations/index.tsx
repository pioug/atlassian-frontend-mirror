import React from 'react';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import { JSONDocNode } from '@atlaskit/editor-json-transformer';
import { AnnotationView } from './view';
import { SelectionComponentWrapper } from './selection';
import { AnnotationsWrapperProps } from './types';
import { ProvidersContext, InlineCommentsStateContext } from './context';
import { useLoadAnnotations } from './hooks/use-load-annotations';
import { useAnnotationStateByTypeEvent } from './hooks/use-events';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';

const LoadAnnotations: React.FC<Record<
  'adfDocument',
  JSONDocNode
>> = React.memo(({ adfDocument }) => {
  useLoadAnnotations({ adfDocument });

  return null;
});

export const AnnotationsWrapper: React.FC<AnnotationsWrapperProps> = (
  props,
) => {
  const { children, annotationProvider, rendererRef, adfDocument } = props;
  const updateSubscriber =
    annotationProvider &&
    annotationProvider.inlineComment &&
    annotationProvider.inlineComment.updateSubscriber;
  const inlineCommentAnnotationsState = useAnnotationStateByTypeEvent({
    type: AnnotationTypes.INLINE_COMMENT,
    updateSubscriber: updateSubscriber || null,
  });
  const { createAnalyticsEvent } = useAnalyticsEvents();

  return (
    <ProvidersContext.Provider value={annotationProvider}>
      <InlineCommentsStateContext.Provider
        value={inlineCommentAnnotationsState}
      >
        <SelectionComponentWrapper
          createAnalyticsEvent={createAnalyticsEvent}
          rendererRef={rendererRef}
        >
          <LoadAnnotations adfDocument={adfDocument} />
          <AnnotationView createAnalyticsEvent={createAnalyticsEvent} />
          {children}
        </SelectionComponentWrapper>
      </InlineCommentsStateContext.Provider>
    </ProvidersContext.Provider>
  );
};

export { TextWithAnnotationDraft } from './draft';
export { MarkElement as AnnotationMark } from './element';
