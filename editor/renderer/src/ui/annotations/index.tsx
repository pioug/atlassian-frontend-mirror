import React, { useCallback } from 'react';
import { AnnotationSelection } from './selection';
import { AnnotationsWrapperProps } from './types';
import { RendererActionsContext } from '../RendererActionsContext';
import { AnnotationsDraftContextWrapper } from './context';

export const AnnotationsWrapper: React.FC<AnnotationsWrapperProps> = props => {
  const { annotationProvider, rendererRef, children } = props;
  const selectionComponent =
    annotationProvider &&
    annotationProvider.inlineComment &&
    annotationProvider.inlineComment.selectionComponent;

  const render = useCallback(
    ({ applyAnnotationDraftAt, clearAnnotationDraft }) => {
      return (
        <RendererActionsContext>
          <>
            {children}
            <AnnotationSelection
              rendererRef={rendererRef}
              selectionComponent={selectionComponent!}
              applyAnnotationDraftAt={applyAnnotationDraftAt}
              clearAnnotationDraft={clearAnnotationDraft}
            />
          </>
        </RendererActionsContext>
      );
    },
    [selectionComponent, children, rendererRef],
  );

  if (!selectionComponent) {
    return <>{children}</>;
  }

  return (
    <AnnotationsDraftContextWrapper>{render}</AnnotationsDraftContextWrapper>
  );
};

export { TextWithAnnotationDraft } from './draft';
