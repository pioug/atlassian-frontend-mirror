import { useMemo, useCallback } from 'react';
import { auth, AuthError } from '@atlaskit/outbound-auth-flow-client';
import { JsonLd } from 'json-ld-types';
import { useSmartLinkContext } from '@atlaskit/link-provider';
import {
  ACTION_RESOLVED,
  ACTION_ERROR,
  ACTION_ERROR_FALLBACK,
  ACTION_RELOADING,
  ACTION_UPDATE_METADATA_STATUS,
  cardAction,
  MetadataStatus,
  APIError,
  CardState,
  ACTION_RESOLVING,
} from '@atlaskit/linking-common';
import {
  getDefinitionId,
  getByDefinitionId,
  getServices,
  getStatus,
  getExtensionKey,
} from '../helpers';
import {
  ERROR_MESSAGE_OAUTH,
  ERROR_MESSAGE_FATAL,
  ERROR_MESSAGE_METADATA,
} from './constants';

import { InvokeServerOpts, InvokeClientOpts } from '../../model/invoke-opts';
import * as measure from '../../utils/performance';
import { AnalyticsFacade } from '../analytics';
import { getUnauthorizedJsonLd } from '../../utils/jsonld';
import { addMetadataToExperience } from '../analytics';
import { CardInnerAppearance } from '../../view/Card/types';
import { SmartLinkStatus } from '../../constants';
import { extractLozengeText } from '../../extractors/common/lozenge/extractLozengeText';

export const useSmartCardActions = (
  id: string,
  url: string,
  analytics: AnalyticsFacade,
) => {
  const { store, connections, config } = useSmartLinkContext();
  const { getState, dispatch } = store;
  const { details, status, metadataStatus } =
    getState()[url] ||
    ({
      status: SmartLinkStatus.Pending,
      details: undefined,
    } as CardState);

  const hasAuthFlowSupported = config.authFlow !== 'disabled';
  const hasData = !!(details && details.data);

  const setMetadataStatus = useCallback(
    (metadataStatus: MetadataStatus) => {
      dispatch(
        cardAction(
          ACTION_UPDATE_METADATA_STATUS,
          { url },
          undefined,
          undefined,
          metadataStatus,
        ),
      );
    },
    [dispatch, url],
  );

  const handleResolvedLinkError = useCallback(
    (
      url: string,
      error: APIError,
      response?: JsonLd.Response,
      isMetadataRequest?: boolean,
    ) => {
      // If metadata request then set metadata status, return and do not alter link status
      if (isMetadataRequest) {
        setMetadataStatus('errored');
        return;
      }
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
          dispatch(cardAction(ACTION_ERROR_FALLBACK, { url }, response, error));
        } else {
          // Fallback to blue link with smart link formatting. Part of reliability.
          dispatch(cardAction(ACTION_ERROR, { url }, undefined, error));
        }
      }
    },
    [setMetadataStatus, hasData, status, dispatch, details],
  );

  const handleResolvedLinkResponse = useCallback(
    (
      resourceUrl: string,
      response: JsonLd.Response,
      isReloading = false,
      isMetadataRequest?: boolean,
    ) => {
      const hostname = new URL(resourceUrl).hostname;
      const nextStatus = response ? getStatus(response) : 'fatal';

      // If we require authorization & do not have an authFlow available,
      // throw an error and render as a normal blue link.
      if (
        (nextStatus === 'unauthorized' || nextStatus === 'forbidden') &&
        !hasAuthFlowSupported
      ) {
        handleResolvedLinkError(
          resourceUrl,
          new APIError('fallback', hostname, ERROR_MESSAGE_OAUTH),
          response,
          isMetadataRequest,
        );
        return;
      }

      // Handle any other errors
      if (nextStatus === 'fatal') {
        handleResolvedLinkError(
          resourceUrl,
          new APIError('fatal', hostname, ERROR_MESSAGE_FATAL),
          undefined,
          isMetadataRequest,
        );
        return;
      }

      // Handle errors of any other kind in the metadata request response
      if (isMetadataRequest && nextStatus !== 'resolved') {
        handleResolvedLinkError(
          resourceUrl,
          new APIError('error', hostname, ERROR_MESSAGE_METADATA),
          response,
          isMetadataRequest,
        );
        return;
      }

      //if a link resolves normally, metadata will also always be resolved
      setMetadataStatus('resolved');
      // Dispatch Analytics and resolved card action - including unauthorized states.
      if (isReloading) {
        dispatch(cardAction(ACTION_RELOADING, { url: resourceUrl }, response));
      } else {
        dispatch(
          cardAction(
            ACTION_RESOLVED,
            { url: resourceUrl },
            response,
            undefined,
            undefined,
            isMetadataRequest,
          ),
        );
      }
    },
    [
      dispatch,
      handleResolvedLinkError,
      hasAuthFlowSupported,
      setMetadataStatus,
    ],
  );

  const resolve = useCallback(
    async (
      resourceUrl = url,
      isReloading = false,
      isMetadataRequest = false,
    ) => {
      // Request JSON-LD data for the card from ORS, if it has extended
      // its cache lifespan OR there is no data for it currently. Once the data
      // has come back asynchronously, dispatch the resolved action for the card.
      if (isReloading || !hasData || isMetadataRequest) {
        return connections.client
          .fetchData(resourceUrl, isReloading)
          .then((response) =>
            handleResolvedLinkResponse(
              resourceUrl,
              response,
              isReloading,
              isMetadataRequest,
            ),
          )
          .catch((error) =>
            handleResolvedLinkError(
              resourceUrl,
              error,
              undefined,
              isMetadataRequest,
            ),
          );
      } else {
        addMetadataToExperience('smart-link-rendered', id, { cached: true });
      }
    },
    [
      url,
      hasData,
      connections.client,
      handleResolvedLinkResponse,
      handleResolvedLinkError,
      id,
    ],
  );

  const register = useCallback(() => {
    if (!details) {
      dispatch(cardAction(ACTION_RESOLVING, { url }));
      setMetadataStatus('pending');
    }
    return resolve();
  }, [details, resolve, dispatch, url, setMetadataStatus]);

  const reload = useCallback(() => {
    const definitionId = getDefinitionId(details);

    // Start: Smart link Actions experiment
    if (
      definitionId === 'jira-object-provider' &&
      details?.data?.['@type']?.includes('atlassian:Task')
    ) {
      // EDM-5149: This is part of actionable element experiment where we
      // reload jira issue link after embed view modal is closed.
      // In our component, `reload` is only used in auth flow which
      // jira link, being Atlassian product, would not fall into this category
      // and would not be reloaded in normal smart link context.
      // The code from resolve is duplicated here to avoid changing the response
      // shape of resolve.
      const previousJiraStatus = extractLozengeText(details);
      connections.client
        .fetchData(url, true)
        .then((response) => {
          handleResolvedLinkResponse(url, response, true, false);

          const jiraStatus = extractLozengeText(response);
          analytics.track.linkUpdated({
            actionSubjectId: 'jiraIssueStatus',
            previousJiraStatus,
            jiraStatus,
          });
        })
        .catch((error) =>
          handleResolvedLinkError(url, error, undefined, false),
        );
    }
    // End: Smart ink Actions experiment
    else if (definitionId) {
      getByDefinitionId(definitionId, getState()).map((url) =>
        resolve(url, true),
      );
    } else {
      resolve(url, true);
    }
  }, [
    details,
    connections.client,
    url,
    handleResolvedLinkResponse,
    analytics.track,
    handleResolvedLinkError,
    getState,
    resolve,
  ]);

  const loadMetadata = useCallback(() => {
    //metadataStatus will be undefined for SSR links only
    if (metadataStatus === undefined) {
      setMetadataStatus('pending');
      return resolve(url, false, true);
    }
  }, [metadataStatus, resolve, setMetadataStatus, url]);

  const authorize = useCallback(
    (appearance: CardInnerAppearance) => {
      const definitionId = getDefinitionId(details);
      const extensionKey = getExtensionKey(details);
      const services = getServices(details);
      // When authentication is triggered, let GAS know!
      if (status === 'unauthorized') {
        analytics.ui.authEvent({
          display: appearance,
          definitionId,
          extensionKey,
        });
      }
      if (status === 'forbidden') {
        analytics.ui.authAlternateAccountEvent({
          display: appearance,
          definitionId,
          extensionKey,
        });
      }
      if (services.length > 0) {
        analytics.screen.authPopupEvent({ definitionId, extensionKey });
        auth(services[0].url).then(
          () => {
            analytics.track.appAccountConnected({ definitionId, extensionKey });
            analytics.operational.connectSucceededEvent({
              id,
              definitionId,
              extensionKey,
            });
            reload();
          },
          (err: AuthError) => {
            analytics.operational.connectFailedEvent({
              id,
              definitionId,
              extensionKey,
              reason: err.type,
            });
            if (err.type === 'auth_window_closed') {
              analytics.ui.closedAuthEvent({
                display: appearance,
                definitionId,
                extensionKey,
              });
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
      id,
      reload,
      details,
      status,
    ],
  );

  const invoke = useCallback(
    async (
      opts: InvokeClientOpts | InvokeServerOpts,
      appearance: CardInnerAppearance,
    ): Promise<JsonLd.Response | void> => {
      const { key, action } = opts;
      const source = opts.source || appearance;
      const markName = `${id}-${action.type}`;
      // Begin performance instrumentation.
      measure.mark(markName, 'pending');
      try {
        // Begin analytics instrumentation.
        analytics.ui.actionClickedEvent({
          id,
          extensionKey: key,
          actionType: action.type,
          display: source,
          invokeType: opts.type,
        });
        // Invoke action - either client-side or server-side.
        let response: JsonLd.Response | void;
        if (opts.type === 'client') {
          response = await opts.action.promise();
        } else {
          response = await connections.client.postData(opts);
        }
        measure.mark(markName, 'resolved');
        analytics.operational.invokeSucceededEvent({
          id,
          extensionKey: key,
          actionType: action.type,
          display: source,
        });
        return response;
      } catch (err) {
        measure.mark(markName, 'errored');
        analytics.operational.invokeFailedEvent({
          id,
          extensionKey: key,
          actionType: action.type,
          display: source,
          reason: (err as any).message,
        });
        throw err;
      }
    },
    [id, analytics.ui, analytics.operational, connections.client],
  );

  return useMemo(
    () => ({
      register,
      reload,
      authorize,
      invoke,
      loadMetadata,
    }),
    [register, reload, authorize, invoke, loadMetadata],
  );
};
