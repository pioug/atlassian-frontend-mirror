import { ReplaySubject } from 'rxjs/ReplaySubject';
import uuid from 'uuid/v4';
import Dataloader from 'dataloader';
import { ProcessingFileState } from '../models/file-state';
import { AuthProvider, authToOwner } from '@atlaskit/media-core';
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
import { convertBase64ToBlob } from '../utils/convertBase64ToBlob';
import { observableToPromise } from '../utils/observableToPromise';
import {
  getDimensionsFromBlob,
  Dimensions,
} from '../utils/getDimensionsFromBlob';
import { getMediaTypeFromMimeType } from '../utils/getMediaTypeFromMimeType';
import { createFileStateSubject } from '../utils/createFileStateSubject';

const POLLING_INTERVAL = 1000;
const maxNumberOfItemsPerCall = 100;
const makeCacheKey = (id: string, collection?: string) =>
  collection ? `${id}-${collection}` : id;

export type DataloaderMap = { [id: string]: DataloaderResult };
export const getItemsFromKeys = (
  dataloaderKeys: DataloaderKey[],
  fileItems: ResponseFileItem[],
): DataloaderResult[] => {
  const itemsByKey: DataloaderMap = fileItems.reduce(
    (prev: DataloaderMap, nextFileItem) => {
      const { id, collection } = nextFileItem;
      const key = makeCacheKey(id, collection);

      prev[key] = nextFileItem.details;

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

export interface SourceFile {
  id: string;
  collection?: string;
  authProvider: AuthProvider;
}

export interface CopyDestination extends MediaStoreCopyFileWithTokenParams {
  authProvider: AuthProvider;
}

type DataloaderResult = MediaCollectionItemFullDetails | undefined;

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
    source: SourceFile,
    destination: CopyDestination,
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
    const items: ResponseFileItem[] = [];

    await Promise.all(
      Object.keys(fileIdsByCollection).map(async collectionNameKey => {
        const fileIds = fileIdsByCollection[collectionNameKey];
        const collectionName =
          collectionNameKey === nonCollectionName
            ? undefined
            : collectionNameKey;
        const response = await this.mediaStore.getItems(
          fileIds,
          collectionName,
        );

        items.push(...response.data.items);
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
    let timeoutId: number;

    const fetchFile = async () => {
      try {
        const response = await this.dataloader.load({ id, collection });

        if (!response) {
          return;
        }

        const fileState = mapMediaItemToFileState(id, response);
        subject.next(fileState);

        if (fileState.status === 'processing') {
          timeoutId = window.setTimeout(fetchFile, POLLING_INTERVAL);
        } else {
          subject.complete();
        }
      } catch (e) {
        window.clearTimeout(timeoutId);
        subject.error(e);
      }
    };

    fetchFile();

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
    const subject = new ReplaySubject<FileState>(1);

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
    const subject = new ReplaySubject<FileState>(1);

    if (content instanceof Blob) {
      size = content.size;
      mimeType = content.type;
      preview = {
        value: content,
        origin: 'local',
      };
    }

    const stateBase = {
      name,
      size,
      mediaType,
      mimeType,
      id,
      occurrenceKey,
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

      subject.next({
        status: 'processing',
        representations: {},
        ...stateBase,
      });
      subject.complete();
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
      controller.setAbort(cancel);
    }

    return subject;
  }

  public async downloadBinary(
    id: string,
    name: string = 'download',
    collectionName?: string,
  ) {
    const isIE11 =
      !!(window as any).MSInputMethodContext &&
      !!(document as any).documentMode;
    const isSafari = /^((?!chrome|android).)*safari/i.test(
      (navigator as Navigator).userAgent,
    );

    const iframeName = 'media-download-iframe';
    const link = document.createElement('a');
    let iframe = document.getElementById(iframeName) as HTMLIFrameElement;
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.id = iframeName;
      iframe.name = iframeName;
      document.body.appendChild(iframe);
    }
    link.href = await this.mediaStore.getFileBinaryURL(id, collectionName);
    link.download = name;
    link.target = isIE11 || isSafari ? '_blank' : iframeName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    globalMediaEventEmitter.emit('media-viewed', {
      fileId: id,
      isUserCollection: collectionName === RECENTS_COLLECTION,
      viewingLevel: 'download',
    });
  }

  public async copyFile(
    source: SourceFile,
    destination: CopyDestination,
  ): Promise<MediaFile> {
    const { authProvider, collection: sourceCollection, id } = source;
    const {
      authProvider: destinationAuthProvider,
      collection: destinationCollectionName,
      replaceFileId,
      occurrenceKey,
    } = destination;
    const mediaStore = new MediaStore({
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

    const copiedFile = (await mediaStore.copyFileWithToken(body, params)).data;
    const copiedFileObservable = new ReplaySubject<FileState>(1);
    const copiedFileState: FileState = mapMediaFileToFileState({
      data: copiedFile,
    });

    copiedFileObservable.next(copiedFileState);
    getFileStreamsCache().set(copiedFile.id, copiedFileObservable);

    return copiedFile;
  }
}
