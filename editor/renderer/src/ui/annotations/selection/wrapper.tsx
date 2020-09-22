import React, { useCallback, useContext } from 'react';
import { AnnotationsDraftContextWrapper, ProvidersContext } from '../context';
import { SelectionRangeValidator } from './range-validator';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';

type Props = {
  rendererRef: React.RefObject<HTMLDivElement>;
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
};

export const Wrapper = (props: React.PropsWithChildren<Props>): JSX.Element => {
  const providers = useContext(ProvidersContext);
  const { rendererRef, createAnalyticsEvent, children } = props;
  const inlineCommentProvider = providers && providers.inlineComment;
  const selectionComponent =
    inlineCommentProvider && inlineCommentProvider.selectionComponent;

  const render = useCallback(
    ({ applyAnnotationDraftAt, clearAnnotationDraft }) => {
      return (
        <>
          {children}
          <SelectionRangeValidator
            createAnalyticsEvent={createAnalyticsEvent}
            rendererRef={rendererRef}
            selectionComponent={selectionComponent!}
            applyAnnotationDraftAt={applyAnnotationDraftAt}
            clearAnnotationDraft={clearAnnotationDraft}
          />
        </>
      );
    },
    [selectionComponent, children, rendererRef, createAnalyticsEvent],
  );

  if (!selectionComponent) {
    return <>{children}</>;
  }

  return (
    <AnnotationsDraftContextWrapper>{render}</AnnotationsDraftContextWrapper>
  );
};
