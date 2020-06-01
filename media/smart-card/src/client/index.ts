import DataLoader from 'dataloader';
import { JsonLd } from 'json-ld-types';

import * as api from './api';
import { APIError } from './errors';
import { CardClient as CardClientInterface, EnvironmentsKeys } from './types';

import { getResolverUrl } from './utils/environments';

import { InvokePayload } from '../model/invoke-opts';
import {
  BatchResponse,
  SuccessResponse,
  ErrorResponse,
} from './types/responses';
import { InvokeRequest } from './types/requests';

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

  private async batchResolve(resourceUrls: string[]): Promise<BatchResponse> {
    const urls = resourceUrls.map(resourceUrl => ({ resourceUrl }));
    return await api.request<BatchResponse>(
      'post',
      `${this.resolverUrl}/resolve/batch`,
      urls,
    );
  }

  private createLoader() {
    return new DataLoader((urls: string[]) => this.batchResolve(urls), {
      maxBatchSize: 50,
      cache: false,
    });
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
