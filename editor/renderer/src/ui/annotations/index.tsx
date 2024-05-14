import React from 'react';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import { type JSONDocNode } from '@atlaskit/editor-json-transformer';
import { AnnotationView } from './view';
import { AnnotationsContextWrapper } from './wrapper';
import { type AnnotationsWrapperProps } from './types';
import { ProvidersContext, InlineCommentsStateContext } from './context';
import { useLoadAnnotations } from './hooks/use-load-annotations';
import { useAnnotationStateByTypeEvent } from './hooks/use-events';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { AnnotationRangeProvider } from './contexts/AnnotationRangeContext';
import { AnnotationHoverContext } from './contexts/AnnotationHoverContext';

type LoadAnnotationsProps = {
  adfDocument: JSONDocNode;
  isNestedRender: boolean;
};

const LoadAnnotations = React.memo<LoadAnnotationsProps>(
  ({ adfDocument, isNestedRender }) => {
    useLoadAnnotations({ adfDocument, isNestedRender });
    return null;
  },
);

export const AnnotationsWrapper = (props: AnnotationsWrapperProps) => {
  const {
    children,
    annotationProvider,
    rendererRef,
    adfDocument,
    isNestedRender,
  } = props;
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
        <AnnotationRangeProvider
          allowCommentsOnMedia={
            annotationProvider?.inlineComment?.allowCommentsOnMedia ?? false
          }
        >
          <AnnotationHoverContext>
            <AnnotationsContextWrapper
              createAnalyticsEvent={createAnalyticsEvent}
              rendererRef={rendererRef}
            >
              <LoadAnnotations
                adfDocument={adfDocument}
                isNestedRender={isNestedRender}
              />
              <AnnotationView createAnalyticsEvent={createAnalyticsEvent} />
              {children}
            </AnnotationsContextWrapper>
          </AnnotationHoverContext>
        </AnnotationRangeProvider>
      </InlineCommentsStateContext.Provider>
    </ProvidersContext.Provider>
  );
};

export { TextWithAnnotationDraft } from './draft';
export { MarkElement as AnnotationMark } from './element';
