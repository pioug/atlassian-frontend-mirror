import React, { useCallback, useContext } from 'react';
import { AnnotationsDraftContextWrapper, ProvidersContext } from '../context';
import { SelectionRangeValidator } from './range-validator';

type Props = {
  rendererRef: React.RefObject<HTMLDivElement>;
};

export const Wrapper = (props: React.PropsWithChildren<Props>): JSX.Element => {
  const providers = useContext(ProvidersContext);
  const { rendererRef, children } = props;
  const inlineCommentProvider = providers && providers.inlineComment;
  const selectionComponent =
    inlineCommentProvider && inlineCommentProvider.selectionComponent;

  const render = useCallback(
    ({ applyAnnotationDraftAt, clearAnnotationDraft }) => {
      return (
        <>
          {children}
          <SelectionRangeValidator
            rendererRef={rendererRef}
            selectionComponent={selectionComponent!}
            applyAnnotationDraftAt={applyAnnotationDraftAt}
            clearAnnotationDraft={clearAnnotationDraft}
          />
        </>
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
