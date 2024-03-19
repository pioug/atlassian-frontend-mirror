import React, { useCallback, useContext } from 'react';
import type { AnnotationsDraftContextWrapperChildrenProps } from './context';
import { AnnotationsDraftContextWrapper, ProvidersContext } from './context';
import { HoverRangeValidator } from './hover';
import { SelectionRangeValidator } from './selection';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';

type Props = {
  rendererRef: React.RefObject<HTMLDivElement>;
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
};

export const AnnotationsContextWrapper = (
  props: React.PropsWithChildren<Props>,
): JSX.Element => {
  const providers = useContext(ProvidersContext);
  const { rendererRef, createAnalyticsEvent, children } = props;
  const inlineCommentProvider = providers && providers.inlineComment;
  const selectionComponent =
    inlineCommentProvider && inlineCommentProvider.selectionComponent;
  const hoverComponent =
    inlineCommentProvider && inlineCommentProvider.hoverComponent;

  const render = useCallback(
    ({
      applyAnnotationDraftAt,
      clearAnnotationDraft,
    }: AnnotationsDraftContextWrapperChildrenProps) => {
      return (
        <>
          {children}
          {!!hoverComponent && (
            <HoverRangeValidator
              createAnalyticsEvent={createAnalyticsEvent}
              rendererRef={rendererRef}
              component={hoverComponent!}
              applyAnnotationDraftAt={applyAnnotationDraftAt}
              clearAnnotationDraft={clearAnnotationDraft}
            />
          )}
          {!!selectionComponent && (
            <SelectionRangeValidator
              createAnalyticsEvent={createAnalyticsEvent}
              rendererRef={rendererRef}
              selectionComponent={selectionComponent!}
              applyAnnotationDraftAt={applyAnnotationDraftAt}
              clearAnnotationDraft={clearAnnotationDraft}
            />
          )}
        </>
      );
    },
    [
      hoverComponent,
      selectionComponent,
      children,
      rendererRef,
      createAnalyticsEvent,
    ],
  );

  if (!selectionComponent && !hoverComponent) {
    return <>{children}</>;
  }

  return (
    <AnnotationsDraftContextWrapper>{render}</AnnotationsDraftContextWrapper>
  );
};
