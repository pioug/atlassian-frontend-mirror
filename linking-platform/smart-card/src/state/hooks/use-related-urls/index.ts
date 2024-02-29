import { useCallback } from 'react';
import { useSmartLinkClientExtension } from '@atlaskit/link-client-extension';
import { useSmartLinkContext } from '@atlaskit/link-provider';
import { JsonLd } from 'json-ld-types';

export type RelatedUrlsResponse = {
  resolvedResults?: JsonLd.Response[];
};

const useRelatedUrls = () => {
  const { connections } = useSmartLinkContext();
  const clientExt = useSmartLinkClientExtension(connections.client);

  return useCallback(
    async (url: string) => {
      return await clientExt.relatedUrls<RelatedUrlsResponse>(url);
    },
    [clientExt],
  );
};

export default useRelatedUrls;
