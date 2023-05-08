import { useCallback } from 'react';
import { useSmartLinkClientExtension } from '@atlaskit/link-client-extension';
import { useSmartLinkContext } from '@atlaskit/link-provider';
import type { InvokeRequest } from '@atlaskit/linking-types/smart-link-actions';
import { AnalyticsFacade } from '../../../state/analytics';

type InvokeRequestTracker = {
  started?: AnalyticsFacade['track']['smartLinkQuickActionStarted'];
  success?: AnalyticsFacade['track']['smartLinkQuickActionSuccess'];
  failed?: AnalyticsFacade['track']['smartLinkQuickActionFailed'];
};
const useInvoke = ({ failed, started, success }: InvokeRequestTracker = {}) => {
  const { connections } = useSmartLinkContext();
  const clientExt = useSmartLinkClientExtension(connections.client);

  return useCallback(
    async (req: InvokeRequest, cb?: Function) => {
      const smartLinkActionType = req?.action?.actionType;
      try {
        started && started({ smartLinkActionType });
        const response = await clientExt.invoke(req);
        success && success({ smartLinkActionType });

        return cb ? cb(response) : response;
      } catch (err) {
        failed && failed({ smartLinkActionType });
        throw err;
      }
    },
    [clientExt, failed, started, success],
  );
};

export default useInvoke;
