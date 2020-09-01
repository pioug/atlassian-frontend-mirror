import React, { useContext } from 'react';
import { ProvidersContext } from '../context';
import { useAnnotationClickEvent } from '../hooks';

const AnnotationView: React.FC = () => {
  const providers = useContext(ProvidersContext);
  const inlineCommentProvider = providers && providers.inlineComment;

  const updateSubscriberInlineComment =
    (inlineCommentProvider && inlineCommentProvider.updateSubscriber) || null;
  const annotationsByType = useAnnotationClickEvent({
    updateSubscriber: updateSubscriberInlineComment,
  });
  const ViewComponent =
    inlineCommentProvider && inlineCommentProvider.viewComponent;

  if (ViewComponent && annotationsByType) {
    return <ViewComponent annotations={annotationsByType} />;
  }

  return null;
};

export { AnnotationView };
