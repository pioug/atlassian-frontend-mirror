import {
  RequestServiceOptions,
  ServiceConfig,
  utils,
} from '@atlaskit/util-service-support';
import { Reactions } from '../types/Reactions';
import { ReactionSummary } from '../types/ReactionSummary';
import { ReactionClient } from './ReactionClient';

type ReactionsResponse = { ari: string; reactions: ReactionSummary[] };

export class ReactionServiceClient implements ReactionClient {
  private sessionToken?: string;
  private serviceConfig: ServiceConfig;
  constructor(baseUrl: string, sessionToken?: string) {
    this.serviceConfig = { url: baseUrl };
    this.sessionToken = sessionToken;
  }

  private getHeaders(hasBody: boolean = true) {
    const headers: { [key: string]: string } = {};
    headers['Accept'] = 'application/json';
    if (hasBody) {
      headers['Content-Type'] = 'application/json';
    }
    if (this.sessionToken) {
      headers['Authorization'] = this.sessionToken;
    }
    return headers;
  }

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
    const headers = this.getHeaders(false);
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
  ): Promise<ReactionSummary[]> {
    return this.requestService<ReactionsResponse>('reactions', {
      requestInit: {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ emojiId, ari, containerAri }),
        credentials: 'include',
      },
    }).then(({ reactions }) => reactions);
  }

  deleteReaction(
    containerAri: string,
    ari: string,
    emojiId: string,
  ): Promise<ReactionSummary[]> {
    return this.requestService<ReactionsResponse>('reactions', {
      queryParams: {
        ari,
        emojiId,
        containerAri,
      },
      requestInit: {
        method: 'DELETE',
        headers: this.getHeaders(),
        credentials: 'include',
      },
    }).then(({ reactions }) => reactions);
  }
}
