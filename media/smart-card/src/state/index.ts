import { AnalyticsHandler } from '../utils/types';
import { useSmartCardState as useSmartLinkState } from './store';
import { useSmartCardActions as useSmartLinkActions } from './actions';
import { useEffect } from 'react';

export function useSmartLink(url: string, dispatchAnalytics: AnalyticsHandler) {
  const state = useSmartLinkState(url);
  const actions = useSmartLinkActions(url, dispatchAnalytics);

  // Register the current card.
  const register = () => {
    actions.register();
  };
  useEffect(register, [url]);

  // Provide the state and card actions to consumers.
  return { state, actions };
}

export {
  CardContext,
  ProviderProps,
  SmartCardContext,
  SmartCardProvider,
  useSmartLinkContext,
} from './context';
