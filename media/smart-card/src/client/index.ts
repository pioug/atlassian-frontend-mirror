import * as api from './api';
import { getResolverUrl } from '../utils/environments';
import { getError } from '../state/actions/helpers';
import {
  JsonLd,
  CardClient as CardClientInterface,
  EnvironmentsKeys,
  JsonLdBatch,
  JsonLdResponse,
} from './types';
import DataLoader from 'dataloader';
import { FetchError } from './errors';

export default class CardClient implements CardClientInterface {
  private resolverUrl: string;
  private loadersByDomain: Record<string, DataLoader<string, JsonLdResponse>>;

  constructor(envKey?: EnvironmentsKeys) {
    this.resolverUrl = getResolverUrl(envKey);
    this.loadersByDomain = {};
  }

  private async batchResolve(resourceUrls: string[]): Promise<JsonLdBatch> {
    const urls = resourceUrls.map(resourceUrl => ({ resourceUrl }));
    return await api.request<JsonLdBatch>(
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

  public async fetchData(url: string): Promise<JsonLd> {
    const loader = this.getLoader(new URL(url).hostname);
    const response = await loader.load(url);
    const { body, status } = response;

    // Catch non-200 server responses to fallback or return useful information.
    const errorType = getError(body);
    switch (errorType) {
      case 'ResolveAuthError':
        throw new FetchError(
          'auth',
          `authentication required for URL ${url}, error: ${errorType}`,
        );
      case 'ResolveBadRequestError':
        throw new FetchError(
          'fatal',
          `Bad Request for ${url}, error: ${errorType}`,
        );
      case 'InternalServerError': // Timeouts and ORS failures
        throw new FetchError(
          'fatal',
          `Internal Server Error for ${url}, error: ${errorType}`,
        );
      case 'ResolveUnsupportedError': // URL isn't supported
        throw new FetchError(
          'fatal',
          `the URL ${url} is unsupported, received server error: ${errorType}`,
        );
      default:
        if (status === 404) {
          return {
            meta: {
              visibility: 'not_found',
              access: 'forbidden',
              auth: [],
              definitionId: 'provider-not-found',
            },
            data: {
              url,
            },
          };
        }

        return response.body;
    }
  }
}
