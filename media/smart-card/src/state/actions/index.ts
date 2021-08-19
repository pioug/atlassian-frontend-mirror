import { useMemo, useCallback } from 'react';
import { auth, AuthError } from '@atlaskit/outbound-auth-flow-client';
import { JsonLd } from 'json-ld-types';

import { cardAction } from './helpers';
import {
  getDefinitionId,
  getByDefinitionId,
  getServices,
  getStatus,
  getExtensionKey,
} from '../helpers';
import {
  ACTION_PENDING,
  ACTION_RESOLVED,
  ACTION_ERROR,
  ERROR_MESSAGE_OAUTH,
  ERROR_MESSAGE_FATAL,
  ACTION_ERROR_FALLBACK,
} from './constants';
import { CardAppearance } from '../../view/Card';
import { useSmartLinkContext } from '../context';
import { InvokeServerOpts, InvokeClientOpts } from '../../model/invoke-opts';
import * as measure from '../../utils/performance';
import { AnalyticsFacade } from '../analytics';
import { APIError } from '../../client/errors';
import { getUnauthorizedJsonLd } from '../../utils/jsonld';

export const useSmartCardActions = (
  id: string,
  url: string,
  analytics: AnalyticsFacade,
) => {
  const { store, connections, config } = useSmartLinkContext();
  const { getState, dispatch } = store;
  const { details, status } = getState()[url] || {
    status: 'pending',
    details: undefined,
  };

  const hasAuthFlowSupported = config.authFlow !== 'disabled';
  const hasData = !!(details && details.data);

  const handleResolvedLinkError = useCallback(
    (url: string, error: APIError) => {
      if (error.kind === 'fatal') {
        // If there's no previous data in the store for this URL, then bail
        // out and let the editor handle fallbacks (returns to a blue link).
        if (!hasData && status !== 'resolved') {
          dispatch(cardAction(ACTION_ERROR, { url }, details, error));
          throw error;
        }
        // If we already have resolved data for this URL in the store, then
        // simply fallback to the previous data.
        if (hasData) {
          dispatch(cardAction(ACTION_RESOLVED, { url }, details));
        }
        // Handle AuthErrors (user did not have access to resource) -
        // Missing AAID in ASAP claims, or missing UserContext, or 403 from downstream
      } else if (error.kind === 'auth') {
        dispatch(cardAction(ACTION_RESOLVED, { url }, getUnauthorizedJsonLd()));
      } else {
        if (error.kind === 'fallback') {
          // Fallback to blue link with smart link formatting. Not part of reliability.
          dispatch(
            cardAction(ACTION_ERROR_FALLBACK, { url }, undefined, error),
          );
        } else {
          // Fallback to blue link with smart link formatting. Part of reliability.
          dispatch(cardAction(ACTION_ERROR, { url }, undefined, error));
        }
      }
    },
    [hasData, status, dispatch, details],
  );

  const handleResolvedLinkResponse = useCallback(
    (resourceUrl: string, response: JsonLd.Response) => {
      const hostname = new URL(resourceUrl).hostname;
      const nextStatus = response ? getStatus(response) : 'fatal';

      // If we require authorization & do not have an authFlow available,
      // throw an error and render as a normal blue link.
      if (nextStatus === 'unauthorized' && !hasAuthFlowSupported) {
        handleResolvedLinkError(
          resourceUrl,
          new APIError('fallback', hostname, ERROR_MESSAGE_OAUTH),
        );
        return;
      }

      // Handle any other errors
      if (nextStatus === 'fatal') {
        handleResolvedLinkError(
          resourceUrl,
          new APIError('fatal', hostname, ERROR_MESSAGE_FATAL),
        );
        return;
      }

      // Dispatch Analytics and resolved card action - including unauthorized states.
      dispatch(cardAction(ACTION_RESOLVED, { url: resourceUrl }, response));
    },
    [dispatch, handleResolvedLinkError, hasAuthFlowSupported],
  );

  const resolve = useCallback(
    async (resourceUrl = url, isReloading = false) => {
      // Request JSON-LD data for the card from ORS, iff it has extended
      // its cache lifespan OR there is no data for it currently. Once the data
      // has come back asynchronously, dispatch the resolved action for the card.
      if (isReloading || !hasData) {
        return connections.client
          .fetchData(resourceUrl)
          .then((response) => handleResolvedLinkResponse(resourceUrl, response))
          .catch((error) => handleResolvedLinkError(resourceUrl, error));
      }
    },
    [
      url,
      hasData,
      connections.client,
      handleResolvedLinkResponse,
      handleResolvedLinkError,
    ],
  );

  const register = useCallback(() => {
    if (!details) {
      dispatch(cardAction(ACTION_PENDING, { url }));
    }
    return resolve();
  }, [url, resolve, details, dispatch]);

  const reload = useCallback(() => {
    const definitionId = getDefinitionId(details);
    if (definitionId) {
      getByDefinitionId(definitionId, getState()).map((url) =>
        resolve(url, true),
      );
    } else {
      resolve(url, true);
    }
  }, [url, details, getState, resolve]);

  const authorize = useCallback(
    (appearance: CardAppearance) => {
      const definitionId = getDefinitionId(details);
      const extensionKey = getExtensionKey(details);
      const services = getServices(details);
      // When authentication is triggered, let GAS know!
      if (status === 'unauthorized') {
        analytics.ui.authEvent(appearance, definitionId, extensionKey);
      }
      if (status === 'forbidden') {
        analytics.ui.authAlternateAccountEvent(
          appearance,
          definitionId,
          extensionKey,
        );
      }
      if (services.length > 0) {
        analytics.screen.authPopupEvent(definitionId, extensionKey);
        auth(services[0].url).then(
          () => {
            analytics.track.appAccountConnected(definitionId, extensionKey);
            analytics.operational.connectSucceededEvent(
              definitionId,
              extensionKey,
            );
            reload();
          },
          (err: AuthError) => {
            analytics.operational.connectFailedEvent(
              definitionId,
              extensionKey,
              err.type,
            );
            if (err.type === 'auth_window_closed') {
              analytics.ui.closedAuthEvent(
                appearance,
                definitionId,
                extensionKey,
              );
            }
            reload();
          },
        );
      }
    },
    [
      analytics.ui,
      analytics.screen,
      analytics.track,
      analytics.operational,
      reload,
      details,
      status,
    ],
  );

  const invoke = useCallback(
    async (
      opts: InvokeClientOpts | InvokeServerOpts,
      appearance: CardAppearance,
    ): Promise<JsonLd.Response | void> => {
      const { key, action } = opts;
      const source = opts.source || appearance;
      const markName = `${id}-${action.type}`;
      // Begin performance instrumentation.
      measure.mark(markName, 'pending');
      try {
        // Begin analytics instrumentation.
        analytics.ui.actionClickedEvent(key, action.type, source);
        // Invoke action - either client-side or server-side.
        let response: JsonLd.Response | void;
        if (opts.type === 'client') {
          response = await opts.action.promise();
        } else {
          response = await connections.client.postData(opts);
        }
        measure.mark(markName, 'resolved');
        analytics.operational.invokeSucceededEvent(
          id,
          key,
          action.type,
          source,
        );
        return response;
      } catch (err) {
        measure.mark(markName, 'errored');
        analytics.operational.invokeFailedEvent(
          id,
          key,
          action.type,
          source,
          err.message,
        );
        throw err;
      }
    },
    [id, analytics.ui, analytics.operational, connections.client],
  );

  return useMemo(() => ({ register, reload, authorize, invoke }), [
    register,
    reload,
    authorize,
    invoke,
  ]);
};
