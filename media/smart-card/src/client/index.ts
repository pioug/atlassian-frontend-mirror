import DataLoader from 'dataloader';
import { JsonLd } from 'json-ld-types';

import * as api from './api';
import { APIError } from './errors';
import { CardClient as CardClientInterface, EnvironmentsKeys } from './types';

import { getResolverUrl } from './utils/environments';
import { Queue } from './utils/queue';

import { InvokePayload } from '../model/invoke-opts';
import {
  BatchResponse,
  SuccessResponse,
  ErrorResponse,
} from './types/responses';
import { InvokeRequest } from './types/requests';

const MAX_BATCH_SIZE = 50;
const MIN_TIME_BETWEEN_BATCHES = 250;

export default class CardClient implements CardClientInterface {
  private resolverUrl: string;
  private loadersByDomain: Record<
    string,
    DataLoader<string, SuccessResponse | ErrorResponse>
  >;

  constructor(envKey?: EnvironmentsKeys) {
    this.resolverUrl = getResolverUrl(envKey);
    this.loadersByDomain = {};
  }

  private async batchResolve(urls: string[]): Promise<BatchResponse> {
    // De-duplicate requested URLs (see `this.createLoader` for more detail).
    const deDuplicatedUrls = [...new Set(urls)];

    // Ask the backend to resolve the URLs for us.
    const resolvedUrls = await api.request<BatchResponse>(
      'post',
      `${this.resolverUrl}/resolve/batch`,
      deDuplicatedUrls.map(resourceUrl => ({ resourceUrl })),
    );

    // Reduce into a map to make accessing faster and easier.
    const map: Record<string, SuccessResponse | ErrorResponse> = {};
    // NOTE: the batch endpoint returns the URLs in the same order they were given.
    for (let i = 0; i < deDuplicatedUrls.length; ++i) {
      const url = deDuplicatedUrls[i];
      const data = resolvedUrls[i];
      map[url] = data;
    }

    // Reconvert list back into the original order in which it was given to us.
    return urls.map(originalUrl => map[originalUrl]);
  }

  private createLoader() {
    const queue = new Queue<BatchResponse>({
      delay: MIN_TIME_BETWEEN_BATCHES,
    });

    return new DataLoader(
      // We place all calls to `batchResolve` in a queue so we don't send off several simultaneous batch requests.
      // This is for two reasons:
      //  1: we want to avoid getting rate limited upstream (eg: forge and other APIs)
      //  2: we want to avoid sending out heaps of requests from the client at once
      (urls: string[]) => queue.enqueue(() => this.batchResolve(urls)),
      {
        maxBatchSize: MAX_BATCH_SIZE,
        // NOTE: we turn off DataLoader's cache because it doesn't work for our use-case. Consider the following:
        // - a smartlink to a restricted item is resolved to "forbidden" with a "request access button"
        // - the user clicks "request access", and then following the auth prompts and gets access
        // - the frontend now re-renders the smartlink, but due to DataLoader's caching, the previous "forbidden" state is
        //   because the smartlink's URL (which is the cache key) is exactly the same
        //
        // For this reason, we disable DataLoader's cache.
        // This means that URLs will not be de-duplicated by DataLoader, so we perform the de-duplication logic
        // ourselves in `this.batchResolve`.
        cache: false,
      },
    );
  }

  private getLoader(hostname: string) {
    if (!this.loadersByDomain[hostname]) {
      this.loadersByDomain[hostname] = this.createLoader();
    }

    return this.loadersByDomain[hostname];
  }

  public async fetchData(url: string): Promise<JsonLd.Response> {
    const hostname = new URL(url).hostname;
    const loader = this.getLoader(hostname);
    const response = await loader.load(url);
    const responseSuccess = response as SuccessResponse;

    if (!responseSuccess.body) {
      const responseErr = response as ErrorResponse;
      // Catch non-200 server responses to fallback or return useful information.
      if (responseErr.error) {
        const errorType = responseErr.error.type;
        const errorMessage = responseErr.error.message;
        switch (errorType) {
          // BadRequestError - indicative of an API error, render
          // a blue link to mitigate customer impact.
          case 'ResolveBadRequestError':
            throw new APIError('fallback', hostname, errorMessage, errorType);
          // AuthError - if the user logs in, we may be able
          // to recover. Render an unauthorized card.
          case 'ResolveAuthError':
            throw new APIError('auth', hostname, errorMessage, errorType);
          // UnsupportedError - we do not know how to render this URL.
          // Bail out and ask the Editor to render as a blue link.
          case 'ResolveUnsupportedError': // URL isn't supported
            throw new APIError('fatal', hostname, errorMessage, errorType);
          // ResolveFailedError - link resolver may have failed.
          // We could recover on re-resolve; render with fallback state.
          case 'ResolveFailedError': // Timeouts
            throw new APIError('error', hostname, errorMessage, errorType);
          // TimeoutError - link resolver may be taking a long time.
          // We could recover on re-resolve; render with fallback state.
          case 'ResolveTimeoutError': // Timeouts
            throw new APIError('error', hostname, errorMessage, errorType);
          // InternalServerError - API call failed.
          // We may recover later; render with fallback state.
          case 'InternalServerError': // ORS failures
            throw new APIError('error', hostname, errorMessage, errorType);
        }
      }
      // Catch all: we don't know this error, bail out.
      throw new APIError(
        'fatal',
        hostname,
        responseErr.toString(),
        'UnexpectedError',
      );
    } else {
      return responseSuccess.body;
    }
  }

  public async postData(
    data: InvokePayload<InvokeRequest>,
  ): Promise<JsonLd.Response> {
    const request = {
      key: data.key,
      action: data.action,
      context: data.context,
    };
    return await api.request('post', `${this.resolverUrl}/invoke`, request);
  }
}
