import { useCallback } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { JsonLd } from 'json-ld-types';
import { addMetadataToExperience } from '../../analytics';
import { getStatus } from '../../helpers';
import {
  ACTION_ERROR,
  ACTION_ERROR_FALLBACK,
  ACTION_RELOADING,
  ACTION_RESOLVED,
  ACTION_UPDATE_METADATA_STATUS,
  APIError,
  cardAction,
  CardState,
  MetadataStatus,
} from '@atlaskit/linking-common';
import {
  ERROR_MESSAGE_FATAL,
  ERROR_MESSAGE_METADATA,
  ERROR_MESSAGE_OAUTH,
} from '../../actions/constants';
import { getUnauthorizedJsonLd } from '../../../utils/jsonld';
import { SmartLinkStatus } from '../../../constants';
import { useSmartLinkContext } from '@atlaskit/link-provider';

const useResolve = () => {
  // Request JSON-LD data for the card from ORS, if it has extended
  // its cache lifespan OR there is no data for it currently. Once the data
  // has come back asynchronously, dispatch the resolved action for the card.
  const { store, connections, config } = useSmartLinkContext();
  const { getState, dispatch } = store;

  const hasAuthFlowSupported = config.authFlow !== 'disabled';

  const setMetadataStatus = useCallback(
    (url: string, metadataStatus: MetadataStatus) => {
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
    [dispatch],
  );

  const handleResolvedLinkError = useCallback(
    (
      url: string,
      error: APIError,
      response?: JsonLd.Response,
      isMetadataRequest?: boolean,
    ) => {
      const { details } =
        getState()[url] ||
        ({
          status: SmartLinkStatus.Pending,
          details: undefined,
        } as CardState);
      const hasData = !!(details && details.data);

      // If metadata request then set metadata status, return and do not alter link status
      if (isMetadataRequest) {
        setMetadataStatus(url, 'errored');
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
    [getState, setMetadataStatus, dispatch],
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

      /**
       * Using unstable_batchedUpdates because this store update happens async and trigers a rerender
       * more info:
       * https://github.com/facebook/react/blob/v18.2.0/packages/use-sync-external-store/src/useSyncExternalStoreShimClient.js#L113
       * https://react-redux.js.org/api/batch
       */
      unstable_batchedUpdates(() => {
        //if a link resolves normally, metadata will also always be resolved
        setMetadataStatus(resourceUrl, 'resolved');
        // Dispatch Analytics and resolved card action - including unauthorized states.
        if (isReloading) {
          dispatch(
            cardAction(ACTION_RELOADING, { url: resourceUrl }, response),
          );
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
      });
    },
    [
      dispatch,
      handleResolvedLinkError,
      hasAuthFlowSupported,
      setMetadataStatus,
    ],
  );

  return useCallback(
    async (
      url: string,
      isReloading = false,
      isMetadataRequest = false,
      id = '',
    ) => {
      const { details } =
        getState()[url] ||
        ({
          status: SmartLinkStatus.Pending,
          details: undefined,
        } as CardState);
      const hasData = !!(details && details.data);

      if (isReloading || !hasData || isMetadataRequest) {
        return connections.client
          .fetchData(url, isReloading)
          .then((response) =>
            handleResolvedLinkResponse(
              url,
              response,
              isReloading,
              isMetadataRequest,
            ),
          )
          .catch((error) =>
            handleResolvedLinkError(url, error, undefined, isMetadataRequest),
          );
      } else {
        addMetadataToExperience('smart-link-rendered', id, { cached: true });
      }
    },
    [
      connections.client,
      getState,
      handleResolvedLinkError,
      handleResolvedLinkResponse,
    ],
  );
};

export default useResolve;
