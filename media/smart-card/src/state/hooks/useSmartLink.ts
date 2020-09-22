import { useEffect, useState } from 'react';
import { useSmartCardState as useSmartLinkState } from '../store';
import { useSmartCardActions as useSmartLinkActions } from '../actions';
import { useSmartLinkConfig } from '../config';
import { useSmartLinkAnalytics } from '../analytics';
import { AnalyticsHandler } from '../../utils/types';

export function useSmartLink(
  id: string,
  url: string,
  dispatchAnalytics: AnalyticsHandler,
) {
  const state = useSmartLinkState(url);
  const analytics = useSmartLinkAnalytics(dispatchAnalytics);
  const actions = useSmartLinkActions(id, url, analytics);
  const config = useSmartLinkConfig();

  // NB: used to propagate errors from hooks to error boundaries.
  const [, setState] = useState();

  // Register the current card.
  const register = () => {
    actions.register().catch(err =>
      setState(() => {
        throw err;
      }),
    );
  };
  useEffect(register, [url]);

  // Provide the state and card actions to consumers.
  return { state, actions, config, analytics };
}
