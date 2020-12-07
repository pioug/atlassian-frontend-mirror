import { RequestOptions } from './types';

import {
  createUrl,
  fetchRetry,
  processFetchResponse,
  withAuth,
} from './helpers';

export async function request(
  url: string,
  options: RequestOptions = {},
  controller?: AbortController,
): Promise<Response> {
  const {
    method = 'GET',
    auth,
    params,
    headers,
    body,
    clientOptions = {},
  } = options;
  const { retryOptions } = clientOptions;

  // TODO BMPT-918: add client timeout feature behing a FF (using clientOptions.clientTimeout + Promise.race)
  const doFetch = (): Promise<Response> =>
    fetch(createUrl(url, { params }), {
      method,
      body,
      headers: withAuth(auth)(headers),
      signal: controller && controller.signal,
    }).then(processFetchResponse);

  return fetchRetry(doFetch, retryOptions);
}
