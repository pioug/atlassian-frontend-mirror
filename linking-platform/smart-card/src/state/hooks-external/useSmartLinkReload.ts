import { useMemo } from 'react';
import uuid from 'uuid';

import type { AnalyticsHandler } from '../../utils/types';

import { useSmartCardActions as useLinkActions } from '../actions';
import { useSmartLinkAnalytics as useLinkAnalytics } from '../analytics';

export interface UseSmartLinkReloadOpts {
  /**
   * Smart Link URL for which the reload will be invoked.
   * @example https://start.atlassian.com
   */
  url: string;
  /**
   * Callback for sending analytics events.
   * @description Accepts an analytics payload and fires it to a system.
   */
  analyticsHandler: AnalyticsHandler;
}

/**
 * Exposes a programmatic way to reload the data being used to render a Smart Link.
 * @param
 * @returns
 */
export function useSmartLinkReload({
  url,
  analyticsHandler,
}: UseSmartLinkReloadOpts) {
  const id = useMemo(() => uuid(), []);

  const linkAnalytics = useLinkAnalytics(url, analyticsHandler, id);
  const linkActions = useLinkActions(id, url, linkAnalytics);

  return linkActions.reload;
}
