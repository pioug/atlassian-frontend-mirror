import { Subscription } from 'rxjs/Subscription';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';
import { concatMap } from 'rxjs/operators/concatMap';
import uuid from 'uuid/v4';
// import setimmediate to temporary fix dataloader 2.0.0 bug
// @see https://github.com/graphql/dataloader/issues/249
import 'setimmediate';
import Dataloader from 'dataloader';
import { AuthProvider, authToOwner } from '@atlaskit/media-core';
import { downloadUrl } from '@atlaskit/media-common/downloadUrl';
import {
  MediaStore,
  MediaStoreCopyFileWithTokenBody,
  MediaStoreCopyFileWithTokenParams,
  TouchedFiles,
  TouchFileDescriptor,
} from '../media-store';
import {
  FilePreview,
  FileState,
  GetFileOptions,
  isErrorFileState,
  isFinalFileState,
  isProcessingFileState,
  mapMediaFileToFileState,
  mapMediaItemToFileState,
  ProcessingFileState,
} from '../../models/file-state';
import { MediaFile } from '../../models/media';
import { FileFetcherError } from './error';
import {
  UploadableFile,
  UploadableFileUpfrontIds,
  uploadFile,
} from '../../uploader';
import { MediaFileArtifacts } from '../../models/artifacts';
import { UploadController } from '../../upload-controller';
import { getFileStreamsCache } from '../../file-streams-cache';
import { globalMediaEventEmitter } from '../../globalMediaEventEmitter';
import { RECENTS_COLLECTION } from '../../constants';
import isValidId from 'uuid-validate';
import {
  createFileDataloader,
  DataloaderKey,
  DataloaderResult,
} from '../../utils/createFileDataLoader';
import { getMediaTypeFromUploadableFile } from '../../utils/getMediaTypeFromUploadableFile';
import { overrideMediaTypeIfUnknown } from '../../utils/overrideMediaTypeIfUnknown';
import { convertBase64ToBlob } from '../../utils/convertBase64ToBlob';
import { observableToPromise } from '../../utils/observableToPromise';
import {
  getDimensionsFromBlob,
  Dimensions,
} from '../../utils/getDimensionsFromBlob';
import { createFileStateSubject } from '../../utils/createFileStateSubject';
import {
  isMimeTypeSupportedByBrowser,
  getMediaTypeFromMimeType,
} from '@atlaskit/media-common/mediaTypeUtils';
import {
  shouldFetchRemoteFileStates,
  shouldFetchRemoteFileStatesObservable,
} from '../../utils/shouldFetchRemoteFileStates';
import { getPollingOptions, PollingFunction } from '../../utils/polling';
import { isEmptyFile } from '../../utils/detectEmptyFile';

export type {
  FileFetcherErrorAttributes,
  FileFetcherErrorReason,
} from './error';
export { isFileFetcherError, FileFetcherError } from './error';

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
    this.dataloader = createFileDataloader(mediaStore);
  }

  public getFileState(
    id: string,
    options: GetFileOptions = {},
  ): ReplaySubject<FileState> {
    const { collectionName, occurrenceKey } = options;

    if (!isValidId(id)) {
      const subject = createFileStateSubject();
      subject.error(
        new FileFetcherError('invalidFileId', id, {
          collectionName,
          occurrenceKey,
        }),
      );

      return subject;
    }

    return getFileStreamsCache().getOrInsert(id, () =>
      this.createDownloadFileStream(id, collectionName),
    );
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
    collectionName?: string,
    occurrenceKey?: string,
  ): ReplaySubject<FileState> => {
    const subject = createFileStateSubject();
    const poll = new PollingFunction(
      getPollingOptions(this.mediaStore.featureFlags),
    );

    // ensure subject errors if polling exceeds max iterations or uncaught exception in executor
    poll.onError = (error: Error) => subject.error(error);

    poll.execute(async () => {
      const response = await this.dataloader.load({
        id,
        collectionName,
      });

      if (!response) {
        throw new FileFetcherError('emptyItems', id, {
          collectionName,
          occurrenceKey,
        });
      }

      if (isEmptyFile(response)) {
        throw new FileFetcherError('zeroVersionFile', id, {
          collectionName,
          occurrenceKey,
        });
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
    ).then((touchedFiles) => touchedFiles.created[0].uploadId);

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
      .then((response) => response.blob())
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
      const dimensions = await getDimensionsFromBlob(mediaType, blob);
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
    const processingSubscription = new Subscription();

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
        return subject.error(error);
      }

      processingSubscription.add(
        shouldFetchRemoteFileStatesObservable(mediaType, mimeType, preview)
          .pipe(
            concatMap((shouldFetchRemoteFileStates) => {
              if (shouldFetchRemoteFileStates) {
                return this.createDownloadFileStream(
                  id,
                  collection,
                  occurrenceKey,
                ).pipe(
                  map((remoteFileState) => ({
                    // merges base state with remote state
                    ...stateBase,
                    ...remoteFileState,
                    ...overrideMediaTypeIfUnknown(remoteFileState, mediaType),
                  })),
                );
              }

              return of({
                status: 'processing',
                representations: {},
                ...stateBase,
              } as FileState);
            }),
          )
          .subscribe(subject),
      );
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
        processingSubscription.unsubscribe();
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
        (await shouldFetchRemoteFileStates(mediaType, copiedMimeType, preview))
      ) {
        subject.next({
          ...copiedFileState,
          ...overrideMediaTypeIfUnknown(copiedFileState, mediaType),
          ...previewOverride,
        });

        processingSubscription = this.createDownloadFileStream(
          copiedId,
          destinationCollectionName,
          occurrenceKey,
        ).subscribe({
          next: (remoteFileState) =>
            subject.next({
              ...remoteFileState,
              ...overrideMediaTypeIfUnknown(remoteFileState, mediaType),
              ...(!isErrorFileState(remoteFileState) && previewOverride),
            }),
          error: (err) => subject.error(err),
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
        const fileCache = cache.get(replaceFileId);

        if (fileCache) {
          fileCache.error(error);
        } else {
          // Create a new subject with the error state for new subscriptions
          cache.set(id, createFileStateSubject(error));
        }
      }

      throw error;
    }
  }
}
