import { MediaApiToken } from '../../types';
import TokenManager from './TokenManager';
import { imageAcceptHeader } from '../../util/image';

const defaultConcurrentDownloadLimit = 16;
const backoffMaxDelayInMillis = 600;
const defaultMaxRetriesOnNotFound = 2;

export type DataURL = string;

export interface MediaImageLoaderOptions {
  concurrentDownloadLimit: number;
}

interface LoadResolver {
  (dataURL: DataURL): any;
}

interface MediaQueueItem {
  url: string;
  resolve: LoadResolver;
  reject: Function;
}

export default class MediaImageLoader {
  private tokenManager: TokenManager;
  private mediaImageQueue: MediaQueueItem[] = [];
  private activeProcessing = 0;
  private concurrentDownloadLimit: number;
  private pendingRequests: Map<string, Promise<DataURL>> = new Map();

  constructor(tokenManager: TokenManager, options?: MediaImageLoaderOptions) {
    this.concurrentDownloadLimit =
      (options && options.concurrentDownloadLimit) ||
      defaultConcurrentDownloadLimit;
    this.tokenManager = tokenManager;
  }

  loadMediaImage(url: string): Promise<DataURL> {
    const maybePending = this.pendingRequests.get(url);
    if (maybePending !== undefined) {
      return maybePending;
    }

    const pending = new Promise<string>((resolve, reject) => {
      this.mediaImageQueue.push({
        url,
        resolve,
        reject,
      });
      this.processFromQueue();
    })
      .then((result) => {
        this.pendingRequests.delete(url);
        return result;
      })
      .catch((error) => {
        this.pendingRequests.delete(url);
        throw error;
      });

    this.pendingRequests.set(url, pending);

    return pending;
  }

  getQueueSize() {
    return this.mediaImageQueue.length;
  }

  getActiveDownloads() {
    return this.activeProcessing;
  }

  private processFromQueue() {
    while (
      this.activeProcessing < this.concurrentDownloadLimit &&
      this.mediaImageQueue.length > 0
    ) {
      this.activeProcessing++;
      const item = this.mediaImageQueue.shift()!;
      const { url, resolve, reject } = item;
      this.tokenManager
        .getToken('read', false)
        .then((token) => {
          this.requestMediaEmoji(url, token, true)
            .then((dataURL) => {
              resolve(dataURL);
              this.completedItem();
            })
            .catch((error) => {
              reject(error);
              this.completedItem();
            });
        })
        .catch((error) => {
          // Failed to load, just resolve to original emoji
          reject(error);
          this.completedItem();
        });
    }
  }

  private completedItem() {
    this.activeProcessing--;
    this.processFromQueue();
  }

  private delay(durationInMillis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, durationInMillis));
  }

  private requestMediaEmoji(
    url: string,
    token: MediaApiToken,
    retryOnAuthError: boolean,
    retriesOnNotFound: number = defaultMaxRetriesOnNotFound,
  ): Promise<DataURL> {
    return imageAcceptHeader().then((acceptHeader) => {
      // Media REST API: https://media-api-internal.atlassian.io/api.html#file__fileId__image_get
      const options = {
        headers: {
          Authorization: `Bearer ${token.jwt}`,
          'X-Client-Id': token.clientId,
          Accept: acceptHeader,
        },
      };
      return fetch(url, options).then((response) => {
        // retry if 404
        if (response.status === 404 && retriesOnNotFound > 0) {
          return this.delay(backoffMaxDelayInMillis / retriesOnNotFound) // backoff strategy
            .then(() =>
              this.requestMediaEmoji(url, token, false, retriesOnNotFound - 1),
            );
        } else if (response.status === 403 && retryOnAuthError) {
          // retry once if 403
          return this.tokenManager
            .getToken('read', true)
            .then((newToken) => this.requestMediaEmoji(url, newToken, false));
        } else if (response.ok) {
          return response.blob().then((blob) => this.readBlob(blob));
        }
        throw new Error(
          `Unable to load media image. Status=${response.status} ${response.statusText}`,
        );
      });
    });
  }

  private readBlob(blob: Blob): Promise<DataURL> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      // TODO: [ts30] Add proper handling for null and ArrayBuffer
      reader.addEventListener('load', () => resolve(reader.result as string));
      reader.addEventListener('error', () => reject(reader.error));

      reader.readAsDataURL(blob);
    });
  }
}
