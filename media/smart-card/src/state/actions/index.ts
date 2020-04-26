import { auth } from '@atlaskit/outbound-auth-flow-client';

import { AnalyticsHandler } from '../../utils/types';
import {
  cardAction,
  getDefinitionId,
  getByDefinitionId,
  getServices,
  getStatus,
} from './helpers';
import {
  ACTION_PENDING,
  ACTION_RESOLVING,
  ACTION_RESOLVED,
  ACTION_ERROR,
  ERROR_MESSAGE_OAUTH,
  ERROR_MESSAGE_FATAL,
  ANALYTICS_RESOLVING,
  ANALYTICS_ERROR,
  ANALYTICS_FALLBACK,
} from './constants';
import { CardAppearance } from '../../view/Card';
import {
  invokeSucceededEvent,
  invokeFailedEvent,
  uiActionClickedEvent,
  resolvedEvent,
  unresolvedEvent,
  uiAuthEvent,
  uiAuthAlternateAccountEvent,
  trackAppAccountConnected,
  connectSucceededEvent,
  connectFailedEvent,
  uiClosedAuthEvent,
  screenAuthPopupEvent,
  MESSAGE_WINDOW_CLOSED,
  KEY_WINDOW_CLOSED,
  KEY_SENSITIVE_DATA,
} from '../../utils/analytics';
import { useSmartLinkContext } from '../context';
import {
  JsonLdCustom,
  InvokeServerOpts,
  InvokeClientOpts,
} from '../../client/types';
import { FetchError } from '../../client/errors';
import { JsonLd } from 'json-ld-types';

export function useSmartCardActions(
  url: string,
  dispatchAnalytics: AnalyticsHandler,
) {
  const { store, connections, config } = useSmartLinkContext();
  const { getState, dispatch } = store;
  const { details, lastUpdatedAt, status } = getState()[url] || {
    status: 'pending',
    lastUpdatedAt: Date.now(),
    details: undefined,
  };

  async function register() {
    if (!details) {
      dispatch(cardAction(ACTION_PENDING, { url }));
    }
    await resolve();
  }

  async function resolve(
    resourceUrl = url,
    isReloading = false,
    showLoadingSpinner = true,
  ) {
    // Trigger asynchronous call to ORS API, race between this and
    // setting the card to a loading state.
    const definitionId = getDefinitionId(details);
    const hasAuthorized = status !== 'unauthorized';
    const hasData = !!(details && details.data);
    const hasExpired = Date.now() - lastUpdatedAt >= config.maxAge;
    // 1. Wait 1.2 seconds - if the card still has not been resolved,
    // emit the loading action to provide UI feedback. Note: only show
    // UI feedback if the URL does not already have data.
    let isCompleted = false;
    if (showLoadingSpinner && (!hasAuthorized || !hasData)) {
      setTimeout(() => {
        if (!isCompleted) {
          dispatch(cardAction(ACTION_RESOLVING, { url: resourceUrl }));
          dispatchAnalytics(unresolvedEvent(ANALYTICS_RESOLVING, definitionId));
        }
      }, config.maxLoadingDelay);
    }
    // 2. Request JSON-LD data for the card from ORS, iff it has extended
    // its cache lifespan OR there is no data for it currently. Once the data
    // has come back asynchronously, dispatch the resolved action for the card.
    if (isReloading || hasExpired || !hasData) {
      try {
        /**
         * There was a bizarre error in Android where the Webview would crash when
         * we were using the syntax:
         *    const response = await connections.client.fetchData(resourceUrl)
         * Please DO NOT change this from a promise
         * https://product-fabric.atlassian.net/browse/FM-2240
         */
        return connections.client.fetchData(resourceUrl).then(
          response => {
            isCompleted = true;
            handleResolvedLinkResponse(resourceUrl, response);
          },
          error => {
            isCompleted = true;
            handleResolvedLinkError(resourceUrl, error);
          },
        );
      } catch (error) {
        isCompleted = true;
        handleResolvedLinkError(resourceUrl, error);
      }
    } else {
      dispatchAnalytics(resolvedEvent(definitionId, true));
      isCompleted = true;
    }
  }

  function handleResolvedLinkResponse(
    resourceUrl: string,
    response: JsonLdCustom,
  ) {
    const nextDefinitionId = response && getDefinitionId(response);
    const nextStatus = response ? getStatus(response) : 'fatal';

    // If we require authorization & do not have an authFlow available,
    // throw an error and render as a normal blue link.
    if (nextStatus === 'unauthorized' && config.authFlow !== 'oauth2') {
      handleResolvedLinkError(
        resourceUrl,
        new FetchError('fallback', ERROR_MESSAGE_OAUTH),
      );
      return;
    }
    // Handle any other errors
    if (nextStatus === 'fatal') {
      handleResolvedLinkError(
        resourceUrl,
        new FetchError('fallback', ERROR_MESSAGE_FATAL),
      );
      return;
    }

    // Dispatch Analytics and resolved card action - including unauthorized states.
    dispatch(cardAction(ACTION_RESOLVED, { url: resourceUrl }, response));
    if (nextStatus === 'resolved') {
      dispatchAnalytics(resolvedEvent(nextDefinitionId));
    } else {
      dispatchAnalytics(unresolvedEvent(nextStatus, nextDefinitionId));
    }
  }

  function handleResolvedLinkError(resourceUrl: string, error: any) {
    const errorKind: string = error && error.kind;
    const nextDefinitionId = details && getDefinitionId(details);
    // Handle FatalErrors (completely failed to resolve data).
    if (errorKind === 'fatal') {
      // If there's no previous data in the store for this URL, then bail
      // out and let the editor handle fallbacks (returns to a blue link).
      if (!details || status !== 'resolved') {
        throw error;
      }

      // If we already have resolved data for this URL in the store, then
      // simply fallback to the previous data.
      if (status === 'resolved') {
        dispatch(cardAction(ACTION_RESOLVED, { url: resourceUrl }, details));
        dispatchAnalytics(resolvedEvent(nextDefinitionId, true));
      }
      // Handle AuthErrors (user did not have access to resource) -
      // Missing AAID in ASAP claims, or missing UserContext, or 403 from downstream
    } else if (errorKind === 'auth') {
      dispatch(
        cardAction(
          ACTION_RESOLVED,
          { url: resourceUrl },
          {
            meta: {
              visibility: 'restricted',
              access: 'unauthorized',
              auth: [],
              definitionId: 'provider-not-found',
            },
            data: {},
          },
        ),
      );
      dispatchAnalytics(unresolvedEvent(ANALYTICS_ERROR, nextDefinitionId));
    } else {
      // Fallback to blue link with smart link formatting for any other errors
      const errMessage = error && error.message;
      dispatch(cardAction(ACTION_ERROR, { url: resourceUrl }, errMessage));
      if (errorKind === 'fallback') {
        dispatchAnalytics(
          unresolvedEvent(ANALYTICS_FALLBACK, nextDefinitionId),
        );
      } else {
        dispatchAnalytics(unresolvedEvent(ANALYTICS_ERROR, nextDefinitionId));
      }
    }
  }

  function reload(showLoadingSpinner = false) {
    const definitionId = getDefinitionId(details);
    if (definitionId) {
      getByDefinitionId(definitionId, getState()).map(url =>
        resolve(url, true, showLoadingSpinner),
      );
    } else {
      resolve(url, true, showLoadingSpinner);
    }
  }

  function authorize(appearance: CardAppearance) {
    const definitionId = getDefinitionId(details);
    const services = getServices(details);
    // When authentication is triggered, let GAS know!
    if (status === 'unauthorized') {
      dispatchAnalytics(uiAuthEvent(appearance, definitionId));
    }
    if (status === 'forbidden') {
      dispatchAnalytics(uiAuthAlternateAccountEvent(appearance, definitionId));
    }
    if (services.length > 0) {
      dispatchAnalytics(screenAuthPopupEvent(definitionId));
      auth(services[0].url).then(
        () => {
          dispatchAnalytics(trackAppAccountConnected(definitionId));
          dispatchAnalytics(connectSucceededEvent(definitionId));
          reload();
        },
        (err: Error) => {
          if (err.message === MESSAGE_WINDOW_CLOSED) {
            dispatchAnalytics(
              connectFailedEvent(definitionId, KEY_WINDOW_CLOSED),
            );
            dispatchAnalytics(uiClosedAuthEvent(appearance, definitionId));
          } else {
            dispatchAnalytics(
              connectFailedEvent(definitionId, KEY_SENSITIVE_DATA),
            );
          }
          reload();
        },
      );
    }
  }

  async function invoke(
    opts: InvokeClientOpts | InvokeServerOpts,
    appearance: CardAppearance,
  ): Promise<JsonLd.Response | void> {
    const { key, action } = opts;
    const source = opts.source || appearance;
    try {
      dispatchAnalytics(uiActionClickedEvent(key, action.type, source));
      let response: JsonLd.Response | void;
      if (opts.type === 'client') {
        response = await opts.action.promise();
      } else {
        response = await connections.client.postData(opts);
      }
      dispatchAnalytics(invokeSucceededEvent(key, action.type, source));
      return response;
    } catch (err) {
      dispatchAnalytics(
        invokeFailedEvent(key, action.type, source, err.message),
      );
      throw err;
    }
  }

  return { register, reload, authorize, invoke };
}
