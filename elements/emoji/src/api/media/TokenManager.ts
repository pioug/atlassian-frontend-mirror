import { MediaApiToken } from '../../types';
import {
  ServiceConfig,
  utils as serviceUtils,
} from '@atlaskit/util-service-support';

// expire 30 seconds early to factor in latency, slow services, etc
export const expireAdjustment = 30;

interface TokenDetail {
  mediaApiToken?: MediaApiToken;
  activeTokenRefresh?: Promise<MediaApiToken>;
}

export type TokenType = 'read' | 'upload';

export default class TokenManager {
  private siteServiceConfig: ServiceConfig;
  private tokens: Map<TokenType, TokenDetail>;

  constructor(siteServiceConfig: ServiceConfig) {
    this.siteServiceConfig = siteServiceConfig;
    this.tokens = new Map<TokenType, TokenDetail>();
  }

  addToken(type: TokenType, mediaApiToken: MediaApiToken): void {
    this.tokens.set(type, {
      mediaApiToken,
    });
  }

  getToken(type: TokenType, forceRefresh?: boolean): Promise<MediaApiToken> {
    let tokenDetail: TokenDetail = this.tokens.get(type) as TokenDetail;
    if (!tokenDetail) {
      tokenDetail = {};
      this.tokens.set(type, tokenDetail);
    }
    const { mediaApiToken, activeTokenRefresh } = tokenDetail;
    if (mediaApiToken) {
      const nowInSeconds = Date.now() / 1000;
      const expiresAt = mediaApiToken.expiresAt - expireAdjustment;
      if (nowInSeconds < expiresAt && !forceRefresh) {
        // still valid
        return Promise.resolve(mediaApiToken);
      }
      if (activeTokenRefresh) {
        // refresh already active, return that
        return activeTokenRefresh;
      }
      // clear expired token
      tokenDetail.mediaApiToken = undefined;
    }

    const path = `token/${type}`;

    // request a new token and track the promise for future requests until completed
    tokenDetail.activeTokenRefresh = serviceUtils
      .requestService<MediaApiToken>(this.siteServiceConfig, { path })
      .then((mediaApiToken) => {
        tokenDetail.activeTokenRefresh = undefined;
        tokenDetail.mediaApiToken = mediaApiToken;
        return mediaApiToken;
      });

    return tokenDetail.activeTokenRefresh;
  }
}
