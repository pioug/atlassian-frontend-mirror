import {
  type RequestServiceOptions,
  type ServiceConfig,
  utils,
} from '@atlaskit/util-service-support';
import { type Reactions, type ReactionSummary, type Client } from '../types';

type ReactionsResponse = { ari: string; reactions: ReactionSummary[] };

/**
 * Utility class to retrieve/modify all actions on reactions collection
 */
export class ReactionServiceClient implements Client {
  /**
   * oAuth token
   */
  private sessionToken?: string;
  /**
   * API config
   */
  private serviceConfig: ServiceConfig;

  /**
   *
   * @param baseUrl base domain url
   * @param sessionToken oAuth token for reactions emoji services
   */
  constructor(baseUrl: string, sessionToken?: string) {
    this.serviceConfig = { url: baseUrl };
    this.sessionToken = sessionToken;
  }

  /**
   * Get http headers for the "fetch" request
   * @param hasBody
   */
  private getHeaders() {
    const headers: Record<string, string> = {};
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json';
    if (this.sessionToken) {
      headers['Authorization'] = this.sessionToken;
    }
    return headers;
  }

  /**
   * Send a request to remote service
   * @param path endpoint api url
   * @param options Optional custom params
   */
  private requestService = <T>(path: string, options?: RequestServiceOptions) =>
    utils.requestService<T>(this.serviceConfig, { ...options, path });

  getReactions(containerAri: string, aris: string[]): Promise<Reactions> {
    if (aris.length === 0) {
      return Promise.resolve({});
    }
    return this.requestService('reactions/view', {
      requestInit: {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ containerAri, aris }),
      },
    });
  }

  getDetailedReaction(
    containerAri: string,
    ari: string,
    emojiId: string,
  ): Promise<ReactionSummary> {
    const reactionId = `${containerAri}|${ari}|${emojiId}`;
    const headers = this.getHeaders();
    return this.requestService('reactions', {
      queryParams: { reactionId: reactionId },
      requestInit: {
        headers,
        method: 'GET',
        credentials: 'include',
      },
    });
  }

  addReaction(
    containerAri: string,
    ari: string,
    emojiId: string,
    metadata?: Record<string, any>,
  ): Promise<ReactionSummary[]> {
    return this.requestService<ReactionsResponse>('reactions', {
      requestInit: {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          emojiId,
          ari,
          containerAri,
          ...(metadata ? { metadata: JSON.stringify(metadata) } : {}),
        }),
        credentials: 'include',
      },
    }).then(({ reactions }) => reactions);
  }

  deleteReaction(
    containerAri: string,
    ari: string,
    emojiId: string,
    metadata?: Record<string, any>,
  ): Promise<ReactionSummary[]> {
    return this.requestService<ReactionsResponse>('reactions', {
      queryParams: {
        ari,
        emojiId,
        containerAri,
        ...(metadata ? { metadata: JSON.stringify(metadata) } : {}),
      },
      requestInit: {
        method: 'DELETE',
        headers: this.getHeaders(),
        credentials: 'include',
      },
    }).then(({ reactions }) => reactions);
  }
}
