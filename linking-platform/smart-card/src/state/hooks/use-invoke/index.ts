import { useCallback } from 'react';
import { useSmartLinkClientExtension } from '@atlaskit/link-client-extension';
import { useSmartLinkContext } from '@atlaskit/link-provider';
import type { InvokeRequest } from '@atlaskit/linking-types/smart-link-actions';

const useInvoke = () => {
  const { connections } = useSmartLinkContext();
  const clientExt = useSmartLinkClientExtension(connections.client);

  return useCallback(
    async (req: InvokeRequest, cb?: Function) => {
      // TODO: EDM-6140: Check cache from store

      const response = await clientExt.invoke(req);

      // TODO: EDM-6140: Cache response in store

      return cb ? cb(response) : response;
    },
    [clientExt],
  );
};

export default useInvoke;
