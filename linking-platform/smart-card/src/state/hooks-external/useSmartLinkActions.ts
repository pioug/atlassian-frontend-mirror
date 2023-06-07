import { JsonLd } from 'json-ld-types';
import { useEffect, useMemo, useState } from 'react';
import uuid from 'uuid';
import type { AnalyticsHandler, AnalyticsOrigin } from '../../utils/types';
import type { CardInnerAppearance } from '../../view/Card/types';
import { extractBlockProps as extractCardProps } from '../../extractors/block';

import { useSmartCardActions as useLinkActions } from '../actions';
import { useSmartLinkAnalytics as useLinkAnalytics } from '../analytics';
import { useSmartCardState as useLinkState } from '../store';
import { getExtensionKey } from '../helpers';

export interface LinkAction {
  /**
   * Unique ID for the action.
   * @example `delete-action`
   */
  id: string;
  /**
   * Text to render for the action.
   * @description Use this in tooltips and UI.
   * @example `Delete`.
   */
  text: React.ReactNode;
  /**
   * Promise to invoke on triggering this action.
   * @example Clicking on `Delete` leading to deletion of content.
   */
  invoke: () => Promise<any>;
}

export interface UseSmartLinkActionsOpts {
  /**
   * Smart Link URL for which actions will be invoked.
   * @example https://start.atlassian.com
   */
  url: string;
  /**
   * Appearance under which these actions will be invoked.
   * @example `block` for card views.
   */
  appearance: CardInnerAppearance;
  /**
   * Callback for sending analytics events.
   * @description Accepts an analytics payload and fires it to a system.
   *
   * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-2681 Internal documentation for deprecation (no external access)}
   * Overriding the analytics dispatch method is deprecated. Please omit this property.
   */
  analyticsHandler?: AnalyticsHandler;
  /**
   * Platform on which actions are being invoked.
   * @default 'web'
   */
  platform?: JsonLd.Primitives.Platforms;
  /**
   * Smart link origin that the action being invoked from.
   */
  origin?: AnalyticsOrigin;
}

export function useSmartLinkActions({
  url,
  appearance,
  analyticsHandler,
  platform = 'web',
  origin,
}: UseSmartLinkActionsOpts) {
  const id = useMemo(() => uuid(), []);
  const [actions, setActions] = useState<LinkAction[]>([]);

  const linkState = useLinkState(url);
  const linkAnalytics = useLinkAnalytics(url, analyticsHandler, id);
  const linkActions = useLinkActions(id, url, linkAnalytics);

  useEffect(() => {
    if (!linkState.details) {
      return;
    }

    const cardProperties = extractCardProps(
      linkState.details.data as JsonLd.Data.BaseData,
      linkState.details.meta as JsonLd.Meta.BaseMeta,
      {
        handleInvoke: (opts) => linkActions.invoke(opts, appearance),
        analytics: linkAnalytics,
        origin,
        extensionKey: getExtensionKey(linkState.details),
        source: appearance,
      },
      undefined,
      platform,
    );

    if (!cardProperties.actions || cardProperties.actions.length === 0) {
      return;
    }
    const cardActions = cardProperties.actions.map((action) => ({
      id: action.id,
      text: action.text,
      invoke: action.promise,
    }));

    setActions(cardActions);
  }, [linkState, linkActions, linkAnalytics, appearance, platform, origin]);

  return actions;
}
