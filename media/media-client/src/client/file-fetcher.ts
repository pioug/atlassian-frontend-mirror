import { Subscription } from 'rxjs/Subscription';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import uuid from 'uuid/v4';
import Dataloader from 'dataloader';
import { AuthProvider, authToOwner } from '@atlaskit/media-core';
import { downloadUrl } from '@atlaskit/media-common/downloadUrl';
import {
  MediaStore,
  UploadableFile,
  UploadController,
  uploadFile,
  MediaCollectionItemFullDetails,
  ResponseFileItem,
  MediaFileArtifacts,
  TouchFileDescriptor,
  TouchedFiles,
  UploadableFileUpfrontIds,
  FilePreview,
  FileState,
  ProcessingFileState,
  isProcessingFileState,
  ErrorFileState,
  isErrorFileState,
  isFinalFileState,
  GetFileOptions,
  mapMediaItemToFileState,
  getFileStreamsCache,
  MediaFile,
  MediaStoreCopyFileWithTokenBody,
  MediaStoreCopyFileWithTokenParams,
  mapMediaFileToFileState,
  globalMediaEventEmitter,
  RECENTS_COLLECTION,
} from '..';
import isValidId from 'uuid-validate';
import { getMediaTypeFromUploadableFile } from '../utils/getMediaTypeFromUploadableFile';
import { overrideMediaTypeIfUnknown } from '../utils/overrideMediaTypeIfUnknown';
import { convertBase64ToBlob } from '../utils/convertBase64ToBlob';
import { observableToPromise } from '../utils/observableToPromise';
import {
  getDimensionsFromBlob,
  Dimensions,
} from '../utils/getDimensionsFromBlob';
import { getMediaTypeFromMimeType } from '../utils/getMediaTypeFromMimeType';
import { createFileStateSubject } from '../utils/createFileStateSubject';
import { isMimeTypeSupportedByBrowser } from '../utils/isMimeTypeSupportedByBrowser';
import { shouldFetchRemoteFileStates } from '../utils/shouldFetchRemoteFileStates';
import { PollingFunction } from '../utils/polling';
import {
  PollingOptions,
  getMediaFeatureFlag,
} from '@atlaskit/media-common/mediaFeatureFlags';

const maxNumberOfItemsPerCall = 100;
const makeCacheKey = (id: string, collection?: string) =>
  collection ? `${id}-${collection}` : id;
const isDataloaderErrorResult = (
  result: any,
): result is DataloaderErrorResult => {
  return result.error instanceof Error;
};

export type DataloaderMap = { [id: string]: DataloaderResult };
export const getItemsFromKeys = (
  dataloaderKeys: DataloaderKey[],
  fileItems: Array<ResponseFileItem | DataloaderErrorResult>,
): DataloaderResult[] => {
  const itemsByKey: DataloaderMap = fileItems.reduce(
    (prev: DataloaderMap, nextFileItem) => {
      const { id, collection } = nextFileItem;
      const key = makeCacheKey(id, collection);

      prev[key] = isDataloaderErrorResult(nextFileItem)
        ? nextFileItem
        : nextFileItem.details;

      return prev;
    },
    {},
  );

  return dataloaderKeys.map(dataloaderKey => {
    const { id, collection } = dataloaderKey;
    const key = makeCacheKey(id, collection);

    return itemsByKey[key];
  });
};

interface DataloaderKey {
  id: string;
  collection?: string;
}

export interface CopySourceFile {
  id: string;
  collection?: string;
  authProvider: AuthProvider;
}

export interface CopyDestination extends MediaStoreCopyFileWithTokenParams {
  authProvider: AuthProvider;
  mediaStore?: MediaStore;
}

export interface CopyFileOptions {
  preview?: FilePreview | Promise<FilePreview>;
  mimeType?: string;
}

interface DataloaderErrorResult {
  id: string;
  error: Error;
  collection?: string;
}

type DataloaderResult =
  | MediaCollectionItemFullDetails
  | DataloaderErrorResult
  | undefined;

export type ExternalUploadPayload = {
  uploadableFileUpfrontIds: UploadableFileUpfrontIds;
  dimensions: Dimensions;
};

export interface FileFetcher {
  getFileState(id: string, options?: GetFileOptions): ReplaySubject<FileState>;
  getArtifactURL(
    artifacts: MediaFileArtifacts,
    artifactName: keyof MediaFileArtifacts,
    collectionName?: string,
  ): Promise<string>;
  touchFiles(
    descriptors: TouchFileDescriptor[],
    collection?: string,
  ): Promise<TouchedFiles>;
  upload(
    file: UploadableFile,
    controller?: UploadController,
    uploadableFileUpfrontIds?: UploadableFileUpfrontIds,
  ): ReplaySubject<FileState>;
  uploadExternal(
    url: string,
    collection?: string,
  ): Promise<ExternalUploadPayload>;
  downloadBinary(
    id: string,
    name?: string,
    collectionName?: string,
  ): Promise<void>;
  getCurrentState(id: string, options?: GetFileOptions): Promise<FileState>;
  copyFile(
    source: CopySourceFile,
    destination: CopyDestination,
    options?: CopyFileOptions,
  ): Promise<MediaFile>;
  getFileBinaryURL(id: string, collectionName?: string): Promise<string>;
}

export class FileFetcherImpl implements FileFetcher {
  private readonly dataloader: Dataloader<DataloaderKey, DataloaderResult>;

  constructor(private readonly mediaStore: MediaStore) {
    this.dataloader = new Dataloader<DataloaderKey, DataloaderResult>(
      this.batchLoadingFunc,
      {
        maxBatchSize: maxNumberOfItemsPerCall,
      },
    );
  }

  // Returns an array of the same length as the keys filled with file items
  private batchLoadingFunc = async (keys: DataloaderKey[]) => {
    const nonCollectionName = '__media-single-file-collection__';
    const fileIdsByCollection = keys.reduce((prev, next) => {
      const collectionName = next.collection || nonCollectionName;
      const fileIds = prev[collectionName] || [];

      fileIds.push(next.id);
      prev[collectionName] = fileIds;

      return prev;
    }, {} as { [collectionName: string]: string[] });
    const items: Array<ResponseFileItem | DataloaderErrorResult> = [];

    await Promise.all(
      Object.keys(fileIdsByCollection).map(async collectionNameKey => {
        const fileIds = fileIdsByCollection[collectionNameKey];
        const collectionName =
          collectionNameKey === nonCollectionName
            ? undefined
            : collectionNameKey;
        try {
          const response = await this.mediaStore.getItems(
            fileIds,
            collectionName,
          );

          items.push(...response.data.items);
        } catch (error) {
          fileIds.forEach(fileId => {
            items.push({
              id: fileId,
              error: error || new Error('Failed to fetch'),
              collection: collectionName,
            });
          });
        }
      }),
    );

    return getItemsFromKeys(keys, items);
  };

  public getFileState(
    id: string,
    options?: GetFileOptions,
  ): ReplaySubject<FileState> {
    if (!isValidId(id)) {
      const subject = createFileStateSubject();
      subject.error('invalid id was passed to getFileState');

      return subject;
    }

    return getFileStreamsCache().getOrInsert(id, () => {
      const collection = options && options.collectionName;
      return this.createDownloadFileStream(id, collection);
    });
  }

  getCurrentState(id: string, options?: GetFileOptions): Promise<FileState> {
    return observableToPromise(this.getFileState(id, options));
  }

  public getArtifactURL(
    artifacts: MediaFileArtifacts,
    artifactName: keyof MediaFileArtifacts,
    collectionName?: string,
  ): Promise<string> {
    return this.mediaStore.getArtifactURL(
      artifacts,
      artifactName,
      collectionName,
    );
  }

  getFileBinaryURL(id: string, collectionName?: string): Promise<string> {
    return this.mediaStore.getFileBinaryURL(id, collectionName);
  }

  private createDownloadFileStream = (
    id: string,
    collection?: string,
  ): ReplaySubject<FileState> => {
    const subject = createFileStateSubject();

    const featureFlags = this.mediaStore.featureFlags;

    const pollOptions: PollingOptions = {
      poll_intervalMs: getMediaFeatureFlag<number>(
        'poll_intervalMs',
        featureFlags,
      ),
      poll_maxAttempts: getMediaFeatureFlag<number>(
        'poll_maxAttempts',
        featureFlags,
      ),
      poll_backoffFactor: getMediaFeatureFlag<number>(
        'poll_backoffFactor',
        featureFlags,
      ),
      poll_maxIntervalMs: getMediaFeatureFlag<number>(
        'poll_maxIntervalMs',
        featureFlags,
      ),
      poll_maxGlobalFailures:
        featureFlags && featureFlags.poll_maxGlobalFailures,
    };

    const poll = new PollingFunction(pollOptions);

    // ensure subject errors if polling exceeds max iterations or uncaught exception in executor
    poll.onError = (error: Error) => subject.error(error);

    poll.execute(async () => {
      const response = await this.dataloader.load({ id, collection });

      if (!response) {
        return;
      }

      if (isDataloaderErrorResult(response)) {
        subject.error(response);
        return;
      }

      const fileState = mapMediaItemToFileState(id, response);
      subject.next(fileState);

      switch (fileState.status) {
        case 'processing':
          // the only case for continuing polling, otherwise this function is run once only
          poll.next();
          break;
        case 'processed':
          subject.complete();
          break;
      }
    });

    return subject;
  };

  public touchFiles(
    descriptors: TouchFileDescriptor[],
    collection?: string,
  ): Promise<TouchedFiles> {
    return this.mediaStore
      .touchFiles({ descriptors }, { collection })
      .then(({ data }) => data);
  }

  private generateUploadableFileUpfrontIds(
    collection?: string,
  ): UploadableFileUpfrontIds {
    const id = uuid();
    const occurrenceKey = uuid();
    const touchFileDescriptor: TouchFileDescriptor = {
      fileId: id,
      occurrenceKey,
      collection,
    };

    const deferredUploadId = this.touchFiles(
      [touchFileDescriptor],
      collection,
    ).then(touchedFiles => touchedFiles.created[0].uploadId);

    return {
      id,
      occurrenceKey,
      deferredUploadId,
    };
  }

  async uploadExternal(
    url: string,
    collection?: string,
  ): Promise<ExternalUploadPayload> {
    const uploadableFileUpfrontIds = this.generateUploadableFileUpfrontIds(
      collection,
    );
    const { id, occurrenceKey } = uploadableFileUpfrontIds;
    const subject = createFileStateSubject();

    const deferredBlob = fetch(url)
      .then(response => response.blob())
      .catch(() => undefined);
    const preview = new Promise<FilePreview>(async (resolve, reject) => {
      const blob = await deferredBlob;
      if (!blob) {
        reject('Could not fetch the blob');
      }

      resolve({ value: blob as Blob, origin: 'remote' });
    });
    const name = url.split('/').pop() || '';
    // we create a initial fileState with the minimum info that we have at this point
    const fileState: ProcessingFileState = {
      status: 'processing',
      name,
      size: 0,
      mediaType: 'unknown',
      mimeType: '',
      id,
      occurrenceKey,
      preview,
    };
    subject.next(fileState);
    // we save it into the cache as soon as possible, in case someone subscribes
    getFileStreamsCache().set(id, subject);

    return new Promise<ExternalUploadPayload>(async (resolve, reject) => {
      const blob = await deferredBlob;
      if (!blob) {
        return reject('Could not download remote file');
      }

      const { type, size } = blob;
      const file: UploadableFile = {
        content: blob,
        mimeType: type,
        collection,
        name,
      };
      const mediaType = getMediaTypeFromMimeType(type);

      // we emit a richer state after the blob is fetched
      subject.next({
        status: 'processing',
        name,
        size,
        mediaType,
        mimeType: type,
        id,
        occurrenceKey,
        preview,
      });
      // we don't want to wait for the file to be upload
      this.upload(file, undefined, uploadableFileUpfrontIds);
      const dimensions = await getDimensionsFromBlob(blob);
      resolve({
        dimensions,
        uploadableFileUpfrontIds,
      });
    });
  }

  public upload(
    file: UploadableFile,
    controller?: UploadController,
    uploadableFileUpfrontIds?: UploadableFileUpfrontIds,
  ): ReplaySubject<FileState> {
    if (typeof file.content === 'string') {
      file.content = convertBase64ToBlob(file.content);
    }

    const {
      content,
      name = '', // name property is not available in base64 image
      collection,
    } = file;

    if (!uploadableFileUpfrontIds) {
      uploadableFileUpfrontIds = this.generateUploadableFileUpfrontIds(
        collection,
      );
    }

    const id = uploadableFileUpfrontIds.id;
    const occurrenceKey = uploadableFileUpfrontIds.occurrenceKey;

    let mimeType = '';
    let size = 0;
    let preview: FilePreview | undefined;
    // TODO [MSW-796]: get file size for base64
    const mediaType = getMediaTypeFromUploadableFile(file);
    const subject = createFileStateSubject();
    let processingSubscription: Subscription | undefined;

    if (content instanceof Blob) {
      size = content.size;
      mimeType = content.type;

      if (isMimeTypeSupportedByBrowser(content.type)) {
        preview = {
          value: content,
          origin: 'local',
        };
      }
    }

    const stateBase = {
      id,
      occurrenceKey,
      name,
      size,
      mediaType,
      mimeType,
      preview,
    };

    const onProgress = (progress: number) => {
      subject.next({
        status: 'uploading',
        ...stateBase,
        progress,
      });
    };

    const onUploadFinish = (error?: any) => {
      if (error) {
        if (error !== 'canceled') {
          // Specific error coming from chunkinator via rejected fileId promise.
          // We do not want to trigger error in this case.
          const message = error instanceof Error ? error.message : error;
          subject.next({
            id,
            status: 'error',
            message,
          });
        }
        return subject.error(error);
      }

      if (shouldFetchRemoteFileStates(mediaType, mimeType, preview)) {
        processingSubscription = this.createDownloadFileStream(
          id,
          collection,
        ).subscribe({
          next: remoteFileState =>
            subject.next({
              // merges base state with remote state
              ...stateBase,
              ...remoteFileState,
              ...overrideMediaTypeIfUnknown(remoteFileState, mediaType),
            }),
          error: err => subject.error(err),
          complete: () => subject.complete(),
        });
      } else {
        subject.next({
          status: 'processing',
          representations: {},
          ...stateBase,
        });
        subject.complete();
      }
    };

    const { cancel } = uploadFile(
      file,
      this.mediaStore,
      uploadableFileUpfrontIds,
      {
        onUploadFinish,
        onProgress,
      },
    );

    getFileStreamsCache().set(id, subject);

    // We should report progress asynchronously, since this is what consumer expects
    // (otherwise in newUploadService file-converting event will be emitted before files-added)
    setTimeout(() => {
      onProgress(0);
    }, 0);

    if (controller) {
      controller.setAbort(() => {
        cancel();
        if (processingSubscription) {
          processingSubscription.unsubscribe();
        }
      });
    }

    return subject;
  }

  public async downloadBinary(
    id: string,
    name: string = 'download',
    collectionName?: string,
  ) {
    const url = await this.mediaStore.getFileBinaryURL(id, collectionName);
    downloadUrl(url, { name });

    globalMediaEventEmitter.emit('media-viewed', {
      fileId: id,
      isUserCollection: collectionName === RECENTS_COLLECTION,
      viewingLevel: 'download',
    });
  }

  public async copyFile(
    source: CopySourceFile,
    destination: CopyDestination,
    options: CopyFileOptions = {},
  ): Promise<MediaFile> {
    const { authProvider, collection: sourceCollection, id } = source;
    const {
      authProvider: destinationAuthProvider,
      collection: destinationCollectionName,
      replaceFileId,
      occurrenceKey,
    } = destination;
    const { preview, mimeType } = options;
    const mediaStore =
      destination.mediaStore ||
      new MediaStore({
        authProvider: destinationAuthProvider,
      });
    const owner = authToOwner(
      await authProvider({ collectionName: sourceCollection }),
    );

    const body: MediaStoreCopyFileWithTokenBody = {
      sourceFile: {
        id,
        collection: sourceCollection,
        owner,
      },
    };

    const params: MediaStoreCopyFileWithTokenParams = {
      collection: destinationCollectionName,
      replaceFileId,
      occurrenceKey,
    };

    const cache = getFileStreamsCache();
    let processingSubscription: Subscription | undefined;

    try {
      const { data: copiedFile } = await mediaStore.copyFileWithToken(
        body,
        params,
      );

      // if we were passed a "mimeType", we propagate it into copiedFileWithMimeType
      const copiedFileWithMimeType: MediaFile = {
        ...copiedFile,
        ...(mimeType ? { mimeType } : undefined),
      };

      const { id: copiedId, mimeType: copiedMimeType } = copiedFileWithMimeType;

      // backend may return an "unknown" mediaType just after the copy
      // it's better to deduce it from "copiedMimeType" using getMediaTypeFromMimeType()
      const mediaType = copiedMimeType
        ? getMediaTypeFromMimeType(copiedMimeType)
        : 'unknown';

      const copiedFileState = mapMediaFileToFileState({
        data: copiedFileWithMimeType,
      });

      const fileCache = cache.get(copiedId);
      const subject = fileCache || createFileStateSubject();

      // if we were passed a "preview", we propagate it into the copiedFileState
      const previewOverride =
        !isErrorFileState(copiedFileState) && !!preview ? { preview } : {};

      if (
        !isFinalFileState(copiedFileState) &&
        // mimeType should always be returned by "copyFileWithToken"
        // but in case it's not, we don't want to penalize "copyFile"
        copiedMimeType &&
        shouldFetchRemoteFileStates(mediaType, copiedMimeType, preview)
      ) {
        subject.next({
          ...copiedFileState,
          ...overrideMediaTypeIfUnknown(copiedFileState, mediaType),
          ...previewOverride,
        });

        processingSubscription = this.createDownloadFileStream(
          copiedId,
          destinationCollectionName,
        ).subscribe({
          next: remoteFileState =>
            subject.next({
              ...remoteFileState,
              ...overrideMediaTypeIfUnknown(remoteFileState, mediaType),
              ...(!isErrorFileState(remoteFileState) && previewOverride),
            }),
          error: err => subject.error(err),
          complete: () => subject.complete(),
        });
      } else if (!isProcessingFileState(copiedFileState)) {
        subject.next({
          ...copiedFileState,
          ...(!isErrorFileState(copiedFileState) && previewOverride),
        });
      }

      if (!cache.has(copiedId)) {
        getFileStreamsCache().set(copiedId, subject);
      }

      return copiedFile;
    } catch (error) {
      if (processingSubscription) {
        processingSubscription.unsubscribe();
      }

      if (replaceFileId) {
        const errorState: ErrorFileState = {
          id,
          status: 'error',
          message: `error copying file to ${destinationCollectionName}`,
        };

        const fileCache = cache.get(replaceFileId);

        if (fileCache) {
          // This will cause media card to rerender with an error state on existent subscriptions
          fileCache.next(errorState);
        } else {
          // Create a new subject with the error state for new subscriptions
          cache.set(id, createFileStateSubject(errorState));
        }
      }

      throw error;
    }
  }
}
