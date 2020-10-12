import {
  ServiceConfig,
  utils as serviceUtils,
} from '@atlaskit/util-service-support';
import { getMediaClient } from '@atlaskit/media-client';
import {
  EmojiDescription,
  EmojiId,
  EmojiServiceDescription,
  EmojiUpload,
  ImageRepresentation,
  MediaApiToken,
  OptionalEmojiDescription,
} from '../../types';

import {
  buildEmojiDescriptionWithAltRepresentation,
  isMediaRepresentation,
  isMediaEmoji,
  convertImageToMediaRepresentation,
  isLoadedMediaEmoji,
} from '../../util/type-helpers';
import MediaEmojiCache from './MediaEmojiCache';
import {
  denormaliseEmojiServiceResponse,
  emojiRequest,
  getAltRepresentation,
} from '../EmojiUtils';
import TokenManager from './TokenManager';

import debug from '../../util/logger';

export interface EmojiUploadResponse {
  emojis: EmojiServiceDescription[];
}

export interface EmojiProgress {
  readonly percent: number;
}

export interface EmojiProgessCallback {
  (progress: EmojiProgress): void;
}

// Assume media is 95% of total upload time.
export const mediaProportionOfProgress = 95 / 100;

export default class SiteEmojiResource {
  private siteServiceConfig: ServiceConfig;
  // @ts-ignore: I am not being read from, should I be deleted???
  private mediaApiToken: MediaApiToken;
  private mediaEmojiCache: MediaEmojiCache;
  protected tokenManager: TokenManager;

  constructor(siteServiceConfig: ServiceConfig, mediaApiToken: MediaApiToken) {
    this.siteServiceConfig = siteServiceConfig;
    this.mediaApiToken = mediaApiToken;
    this.tokenManager = new TokenManager(siteServiceConfig);
    this.tokenManager.addToken('read', mediaApiToken);
    this.mediaEmojiCache = new MediaEmojiCache(this.tokenManager);
  }

  /**
   * Will load media emoji, returning a new EmojiDescription if, for example,
   * the URL has changed.
   */
  loadMediaEmoji(
    emoji: EmojiDescription,
    useAlt?: boolean,
  ): OptionalEmojiDescription | Promise<OptionalEmojiDescription> {
    if (!isMediaEmoji(emoji)) {
      throw new Error('Only supported for media emoji');
    }
    return this.mediaEmojiCache.loadEmoji(emoji, useAlt);
  }

  optimisticRendering(
    emoji: EmojiDescription,
    useAlt?: boolean,
  ): boolean | Promise<boolean> {
    const representation = useAlt
      ? emoji.altRepresentation
      : emoji.representation;
    if (!isMediaRepresentation(representation)) {
      throw new Error('Only supported for media emoji');
    }
    const { mediaPath } = representation;
    return this.mediaEmojiCache.optimisticRendering(mediaPath);
  }

  uploadEmoji(
    upload: EmojiUpload,
    progressCallback?: EmojiProgessCallback,
  ): Promise<EmojiDescription> {
    const startTime = Date.now();
    return this.tokenManager.getToken('upload').then(uploadToken => {
      const tokenLoadTime = Date.now() - startTime;
      debug('upload token load time', tokenLoadTime);
      return new Promise<EmojiDescription>((resolve, reject) => {
        const { url, clientId, collectionName } = uploadToken;
        const mediaClient = getMediaClient({
          authProvider: () =>
            Promise.resolve({
              clientId,
              token: uploadToken.jwt,
              baseUrl: url,
            }),
        });

        const subscription = mediaClient.file
          .upload({
            content: upload.dataURL,
            name: upload.filename,
            collection: collectionName,
          })
          .subscribe({
            next: state => {
              if (state.status === 'uploading' && progressCallback) {
                progressCallback({
                  percent: state.progress * mediaProportionOfProgress,
                });
              } else if (state.status === 'processing') {
                subscription.unsubscribe();
                const totalUploadTime = Date.now() - startTime;
                const mediaUploadTime = totalUploadTime - tokenLoadTime;
                debug(
                  'total upload / media upload times',
                  totalUploadTime,
                  mediaUploadTime,
                );
                this.postToEmojiService(upload, state.id)
                  .then(emoji => {
                    resolve(emoji);
                  })
                  .catch(httpError => {
                    reject(httpError.reason || httpError);
                  });
              }
            },
            error(error) {
              reject(error);
            },
          });
      });
    });
  }

  /**
   * Check if the MediaEmojiResource has been able to initialise an uploadToken. Retrieving an upload token
   * is asynchronous so the Promise will need to resolve before the state is known. If the token retrieval
   * completes with failure then the Promise will resolve to false.
   */
  hasUploadToken(): Promise<boolean> {
    const tokenPromise: Promise<MediaApiToken> = this.tokenManager.getToken(
      'upload',
    );
    return tokenPromise.then(
      token => {
        return token !== undefined;
      },
      () => {
        return false;
      },
    );
  }

  prepareForUpload() {
    // make sure a token is loaded from the emoji service if we don't have one
    // as future request to uploadEmoji will use this, this to preload it, as it
    // usually takes 1-2 seconds to generate
    this.tokenManager.getToken('upload');
  }

  findEmoji(emojiId: EmojiId): Promise<OptionalEmojiDescription> {
    const path = `../${emojiId.id}`;
    return emojiRequest(this.siteServiceConfig, { path })
      .then(serviceResponse => {
        const response = denormaliseEmojiServiceResponse(serviceResponse);
        return response.emojis[0];
      })
      .catch(error => {
        debug('failed to load emoji', emojiId, error);
        return undefined;
      });
  }

  /**
   * Calls to site-scoped EmojiResource to delete emoji
   * @param emoji media emoji to delete
   * @returns Promise.resolve() if success and Promise.reject() for failure
   */
  deleteEmoji(emoji: EmojiDescription): Promise<boolean> {
    if (!isMediaEmoji(emoji) && !isLoadedMediaEmoji(emoji)) {
      return Promise.reject(false);
    }
    const path = `${emoji.id}`;
    const requestInit = {
      method: 'DELETE',
    };
    return (
      serviceUtils
        .requestService(this.siteServiceConfig, { path, requestInit })
        // Successful delete on Promise.resolve
        .then(() => true)
        // Unsuccessful delete on Promise.reject
        .catch(() => false)
    );
  }

  private postToEmojiService = (
    upload: EmojiUpload,
    fileId: string,
  ): Promise<EmojiDescription> => {
    const { shortName, name } = upload;
    const { width, height } = upload;
    const requestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shortName,
        name,
        width,
        height,
        fileId,
      }),
    };

    return serviceUtils
      .requestService<EmojiUploadResponse>(this.siteServiceConfig, {
        requestInit,
      })
      .then(
        (response): EmojiDescription => {
          const { emojis } = response;
          if (emojis.length) {
            const { altRepresentations, ...emoji } = emojis[0];

            const response = {
              ...emoji,
              representation: convertImageToMediaRepresentation(
                emoji.representation as ImageRepresentation,
              ),
            };
            const altRepresentation = getAltRepresentation(
              altRepresentations || {},
            );
            const imgAltRepresentation = altRepresentation
              ? convertImageToMediaRepresentation(
                  altRepresentation as ImageRepresentation,
                )
              : undefined;

            return buildEmojiDescriptionWithAltRepresentation(
              response,
              imgAltRepresentation,
            );
          }
          throw new Error('No emoji returns from upload. Upload failed.');
        },
      );
  };
}
