import {
  CardProvider,
  ORSProvidersResponse,
  ORSCheckResponse,
  CardAdf,
} from './types';
import { Transformer } from './transformer';

import { CardAppearance } from '../../view/Card';
import { getResolverUrl, getBaseUrl } from '../../client/utils/environments';
import { EnvironmentsKeys } from '../../client/types';

export class EditorCardProvider implements CardProvider {
  private baseUrl: string;
  private resolverUrl: string;
  private patterns?: string[];
  private requestOpts: RequestInit;
  private transformer: Transformer;

  constructor(envKey?: EnvironmentsKeys) {
    this.baseUrl = getBaseUrl(envKey);
    this.resolverUrl = getResolverUrl(envKey);
    this.transformer = new Transformer();
    this.requestOpts = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Origin: this.baseUrl,
      },
    };
  }

  private async check(resourceUrl: string): Promise<boolean | undefined> {
    try {
      const endpoint = `${this.resolverUrl}/check`;
      const response = await fetch(endpoint, {
        ...this.requestOpts,
        body: JSON.stringify({ resourceUrl }),
      });
      const responseAsJson: ORSCheckResponse = await response.json();
      return responseAsJson.isSupported;
    } catch (err) {
      // eslint-disable-next-line
      console.error(err);
      return undefined;
    }
  }

  private async fetchPatterns(): Promise<string[] | undefined> {
    try {
      const endpoint = `${this.resolverUrl}/providers`;
      const response = await fetch(endpoint, this.requestOpts);
      const responseAsJson: ORSProvidersResponse = await response.json();
      return responseAsJson.providers.reduce(
        (allSources: string[], provider) => {
          const providerSources = provider.patterns.map(
            pattern => pattern.source,
          );
          return allSources.concat(providerSources);
        },
        [],
      );
    } catch (err) {
      // eslint-disable-next-line
      console.error(err);
      return undefined;
    }
  }

  async findPattern(url: string): Promise<boolean> {
    const patterns = this.patterns || (await this.fetchPatterns());
    if (patterns) {
      this.patterns = patterns;
      return patterns.some(pattern => url.match(pattern));
    }

    return false;
  }

  async resolve(url: string, appearance: CardAppearance): Promise<CardAdf> {
    try {
      let isSupported =
        (await this.findPattern(url)) || (await this.check(url));
      if (isSupported) {
        return this.transformer.toAdf(url, appearance);
      }
    } catch (e) {
      // eslint-disable-next-line
      console.warn(
        `Error when trying to check Smart Card url "${url} - ${e.prototype.name} ${e.message}`,
        e,
      );
    }

    return Promise.reject(undefined);
  }
}

export const editorCardProvider = new EditorCardProvider();
export type {
  CardProvider,
  ORSCheckResponse,
  CardAdf,
  InlineCardAdf,
  BlockCardAdf,
  EmbedCardAdf,
} from './types';
