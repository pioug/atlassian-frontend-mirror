import { useCallback, useMemo } from 'react';

import type { CardClient } from '@atlaskit/link-provider';
import { request } from '@atlaskit/linking-common';
import {
  InvokeError,
  InvokeRequest,
  InvokeResponse,
} from '@atlaskit/linking-types/smart-link-actions';

import { useResolverUrl } from '../use-resolver-url';

/**
 * useSmartLinkClientExtension
 *
 * This hook extends the usage of @atlaskit/link-provider CardClient
 * for smart links.
 *
 * @param cardClient
 */
export const useSmartLinkClientExtension = (cardClient: CardClient) => {
  const resolvedUrl = useResolverUrl(cardClient);

  const invoke = useCallback(
    async (data: InvokeRequest) => {
      try {
        return await request<InvokeResponse>(
          'post',
          `${resolvedUrl}/invoke`,
          data,
          undefined,
          [200, 201, 202, 203, 204],
        );
      } catch (err: any) {
        // checking if the error is a Response type
        // since we already had a few HOTs caused by comparing with instanceOf',
        // we're verifying the type by the contents
        if (err && err.json && typeof err.json === 'function') {
          const errorBody = await err.json();

          if (errorBody) {
            throw new InvokeError(
              errorBody?.error.message,
              errorBody?.error.status,
            );
          }
        }

        throw err;
      }
    },
    [resolvedUrl],
  );

  return useMemo(() => ({ invoke }), [invoke]);
};
