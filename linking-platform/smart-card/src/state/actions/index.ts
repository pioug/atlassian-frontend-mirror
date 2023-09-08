import { useMemo, useCallback } from 'react';
import { auth, AuthError } from '@atlaskit/outbound-auth-flow-client';
import { JsonLd } from 'json-ld-types';
import { useSmartLinkContext } from '@atlaskit/link-provider';
import {
  ACTION_UPDATE_METADATA_STATUS,
  cardAction,
  MetadataStatus,
  ACTION_RESOLVING,
} from '@atlaskit/linking-common';
import {
  getDefinitionId,
  getByDefinitionId,
  getServices,
  getExtensionKey,
} from '../helpers';

import { InvokeServerOpts, InvokeClientOpts } from '../../model/invoke-opts';
import { AnalyticsFacade } from '../analytics';
import { CardInnerAppearance } from '../../view/Card/types';
import { SmartLinkStatus } from '../../constants';
import useResolve from '../hooks/use-resolve';
import useInvokeClientAction from '../hooks/use-invoke-client-action';

export const useSmartCardActions = (
  id: string,
  url: string,
  analytics: AnalyticsFacade,
) => {
  const resolveUrl = useResolve();
  const invokeClientAction = useInvokeClientAction({ analytics });

  const { store } = useSmartLinkContext();
  const { getState, dispatch } = store;

  const getSmartLinkState = useCallback(() => {
    const { details, status, metadataStatus } = getState()[url] ?? {
      status: SmartLinkStatus.Pending,
    };
    return { details, status, metadataStatus };
  }, [getState, url]);

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

  const resolve = useCallback(
    async (resourceUrl = url, isReloading = false, isMetadataRequest = false) =>
      resolveUrl(resourceUrl, isReloading, isMetadataRequest, id),
    [id, resolveUrl, url],
  );

  const register = useCallback(() => {
    const { details } = getSmartLinkState();
    if (!details) {
      dispatch(cardAction(ACTION_RESOLVING, { url }));
      setMetadataStatus('pending');
    }
    return resolve();
  }, [getSmartLinkState, resolve, dispatch, url, setMetadataStatus]);

  const reload = useCallback(() => {
    const { details } = getSmartLinkState();
    const definitionId = getDefinitionId(details);
    if (definitionId) {
      getByDefinitionId(definitionId, getState()).map((url) =>
        resolve(url, true),
      );
    } else {
      resolve(url, true);
    }
  }, [getSmartLinkState, url, getState, resolve]);

  const loadMetadata = useCallback(() => {
    const { metadataStatus } = getSmartLinkState();
    //metadataStatus will be undefined for SSR links only
    if (metadataStatus === undefined) {
      setMetadataStatus('pending');
      return resolve(url, false, true);
    }
  }, [getSmartLinkState, resolve, setMetadataStatus, url]);

  const authorize = useCallback(
    (appearance: CardInnerAppearance) => {
      const { details, status } = getSmartLinkState();
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
      getSmartLinkState,
      analytics.ui,
      analytics.screen,
      analytics.track,
      analytics.operational,
      id,
      reload,
    ],
  );

  const invoke = useCallback(
    async (
      opts: InvokeClientOpts | InvokeServerOpts,
      appearance: CardInnerAppearance,
    ): Promise<JsonLd.Response | void> => {
      const { key, action } = opts;
      const source = opts.source || appearance;
      if (opts.type === 'client') {
        return await invokeClientAction({
          actionFn: opts.action.promise,
          actionType: action.type,
          display: source,
          extensionKey: key,
        });
      }
    },
    [invokeClientAction],
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
