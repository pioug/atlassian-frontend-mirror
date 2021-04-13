import { RequestMetadata, RequestOptions } from './types';

export type {
  RequestErrorReason,
  RequestErrorMetadata,
  RequestErrorAttributes,
} from './types';

export { RequestError, isRequestError } from './errors';
export { isRateLimitedError } from './helpers';

import {
  createUrl,
  fetchRetry,
  createProcessFetchResponse,
  withAuth,
} from './helpers';

export async function request(
  url: string,
  options: RequestOptions = {},
  controller?: AbortController,
): Promise<Response> {
  const {
    method = 'GET',
    endpoint,
    auth,
    params,
    headers,
    body,
    clientOptions = {},
  } = options;
  const { retryOptions } = clientOptions;
  const metadata: RequestMetadata = { method, endpoint };

  // TODO BMPT-918: add client timeout feature behing a FF (using clientOptions.clientTimeout + Promise.race)
  const doFetch = (): Promise<Response> =>
    fetch(createUrl(url, { params }), {
      method,
      body,
      headers: withAuth(auth)(headers),
      signal: controller && controller.signal,
    }).then(createProcessFetchResponse(metadata));

  return fetchRetry(doFetch, metadata, retryOptions);
}
