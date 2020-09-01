import { useContext } from 'react';
import { ProvidersContext } from '../context';

export const useInlineCommentSubscriberContext = () => {
  const providers = useContext(ProvidersContext);

  if (!providers) {
    return null;
  }

  const {
    inlineComment: { updateSubscriber },
  } = providers;

  return updateSubscriber || null;
};
