import { useMemo, useCallback } from 'react';
import { auth } from '@atlaskit/outbound-auth-flow-client';
import { JsonLd } from 'json-ld-types';

import { cardAction } from './helpers';
import {
  getDefinitionId,
  getByDefinitionId,
  getServices,
  getStatus,
} from '../helpers';
import {
  ACTION_PENDING,
  ACTION_RESOLVING,
  ACTION_RESOLVED,
  ACTION_ERROR,
  ERROR_MESSAGE_OAUTH,
  ERROR_MESSAGE_FATAL,
  ACTION_ERROR_FALLBACK,
} from './constants';
import { CardAppearance } from '../../view/Card';
import {
  MESSAGE_WINDOW_CLOSED,
  KEY_WINDOW_CLOSED,
  KEY_SENSITIVE_DATA,
} from '../../utils/analytics';

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
  const { details, lastUpdatedAt, status } = getState()[url] || {
    status: 'pending',
    lastUpdatedAt: Date.now(),
    details: undefined,
  };

  const hasAuthFlowSupported = config.authFlow !== 'disabled';
  const hasAuthorized = status !== 'unauthorized';
  const hasData = !!(details && details.data);
  const hasExpired = Date.now() - lastUpdatedAt >= config.maxAge;

  const handleResolvedLinkError = useCallback(
    (url: string, error: APIError) => {
      if (error.kind === 'fatal') {
        // If there's no previous data in the store for this URL, then bail
        // out and let the editor handle fallbacks (returns to a blue link).
        if (!hasData && status !== 'resolved') {
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
      dispatch(
        cardAction(
          ACTION_RESOLVED,
          { url: resourceUrl, hasExpired: hasExpired && !hasData },
          response,
        ),
      );
    },
    [
      dispatch,
      handleResolvedLinkError,
      hasData,
      hasExpired,
      hasAuthFlowSupported,
    ],
  );

  const resolve = useCallback(
    async (
      resourceUrl = url,
      isReloading = false,
      showLoadingSpinner = true,
    ) => {
      // Trigger asynchronous call to ORS API, race between this and
      // setting the card to a loading state.
      // --------------------------------------------
      // 1. Wait 1.2 seconds - if the card still has not been resolved,
      // emit the loading action to provide UI feedback. Note: only show
      // UI feedback if the URL does not already have data.
      let isCompleted = false;
      if (showLoadingSpinner && (!hasAuthorized || !hasData)) {
        setTimeout(() => {
          if (!isCompleted) {
            dispatch(cardAction(ACTION_RESOLVING, { url: resourceUrl }));
          }
        }, config.maxLoadingDelay);
      }
      // 2. Request JSON-LD data for the card from ORS, iff it has extended
      // its cache lifespan OR there is no data for it currently. Once the data
      // has come back asynchronously, dispatch the resolved action for the card.
      if (isReloading || hasExpired || !hasData) {
        return connections.client
          .fetchData(resourceUrl)
          .then(response => {
            isCompleted = true;
            handleResolvedLinkResponse(resourceUrl, response);
          })
          .catch(error => {
            isCompleted = true;
            handleResolvedLinkError(resourceUrl, error);
          });
      } else {
        isCompleted = true;
      }
    },
    [
      url,
      dispatch,
      hasAuthorized,
      hasData,
      hasExpired,
      connections.client,
      config.maxLoadingDelay,
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

  const reload = useCallback(
    (showLoadingSpinner = false) => {
      const definitionId = getDefinitionId(details);
      if (definitionId) {
        getByDefinitionId(definitionId, getState()).map(url =>
          resolve(url, true, showLoadingSpinner),
        );
      } else {
        resolve(url, true, showLoadingSpinner);
      }
    },
    [url, details, getState, resolve],
  );

  const authorize = useCallback(
    (appearance: CardAppearance) => {
      const definitionId = getDefinitionId(details);
      const services = getServices(details);
      // When authentication is triggered, let GAS know!
      if (status === 'unauthorized') {
        analytics.ui.authEvent(appearance, definitionId);
      }
      if (status === 'forbidden') {
        analytics.ui.authAlternateAccountEvent(appearance, definitionId);
      }
      if (services.length > 0) {
        analytics.screen.authPopupEvent(definitionId);
        auth(services[0].url).then(
          () => {
            analytics.track.appAccountConnected(definitionId);
            analytics.operational.connectSucceededEvent(definitionId);
            reload();
          },
          (err: Error) => {
            if (err.message === MESSAGE_WINDOW_CLOSED) {
              analytics.ui.closedAuthEvent(appearance, definitionId);
              analytics.operational.connectFailedEvent(
                definitionId,
                KEY_WINDOW_CLOSED,
              );
            } else {
              analytics.operational.connectFailedEvent(
                definitionId,
                KEY_SENSITIVE_DATA,
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
